// Coach: a chat front end for the life-coach skill in ./skill.
// GitHub Pages can't hold a secret, so each visitor brings their own Anthropic
// API key; it lives in localStorage and requests go straight to the API.
import Anthropic from 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.126.0/+esm';

const MODEL = 'claude-opus-5';
const EFFORT = 'high';
const SKILL_FILES = ['skill/SKILL.md', 'skill/references/guide.md', 'skill/references/advisors.md'];
const KEY_STORE = 'coach.apiKey';
const HISTORY_STORE = 'coach.history';

// The skill was written for an agent with file access; this tells the model
// what's different about running here. The skill files stay the source of truth.
const WEB_CONTEXT = `You are "Coach", running as a chat interface on Jatin's personal website (jatinpandey.github.io/coach). The skill definition and reference files below are your instructions; follow them.

What's different about this environment:
- You have no tools and no file, journal, or memory access. The files under "Load first" are already included below. You cannot read Dario journal entries, MEMORY.md, or daily notes, so work only from what is shared in this conversation. When that context is thin, say so rather than inventing a pattern, and ask for the specifics you need.
- You cannot edit the skill files. If asked to change the coach (add an advisor, change tone, new principles), draft the exact wording and note that it belongs in coach/skill/ in the site repository.
- Replies render as Markdown in a narrow chat column. Keep structure light: bold lead-ins or short headers and brief lists. Avoid tables unless comparing options side by side.
- The person chatting is usually Jatin. If they say they are someone else, coach them directly and don't assume Jatin's history applies.`;

const $ = (id) => document.getElementById(id);
const els = {
  intro: $('intro'),
  thread: $('thread'),
  form: $('composer'),
  input: $('composer-input'),
  send: $('send'),
  stop: $('stop'),
  newChat: $('new-chat'),
  openKey: $('open-key'),
  dialog: $('key-dialog'),
  keyForm: $('key-form'),
  keyInput: $('key-input'),
  forgetKey: $('forget-key'),
  cancelKey: $('cancel-key'),
};

/* ---------- storage ---------- */
function load(name, fallback) {
  try {
    const raw = localStorage.getItem(name);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function save(name, value) {
  try {
    if (value == null) localStorage.removeItem(name);
    else localStorage.setItem(name, JSON.stringify(value));
  } catch {}
}

let apiKey = load(KEY_STORE, '');
let history = load(HISTORY_STORE, []); // Anthropic MessageParam[]
let activeStream = null;
let pendingText = null; // message waiting on a key

/* ---------- system prompt ---------- */
let systemPromise = null;
function systemPrompt() {
  systemPromise ??= Promise.all(
    SKILL_FILES.map(async (path) => {
      const res = await fetch(new URL(path, import.meta.url));
      if (!res.ok) throw new Error(`Couldn't load ${path} (${res.status})`);
      return `<file path="${path.replace(/^skill\//, '')}">\n${(await res.text()).trim()}\n</file>`;
    }),
  ).then((files) => `${WEB_CONTEXT}\n\n${files.join('\n\n')}`);
  systemPromise.catch(() => { systemPromise = null; });
  return systemPromise;
}

/* ---------- rendering ---------- */
const purify = window.DOMPurify;
purify?.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});
function markdown(text) {
  if (!window.marked || !purify) {
    const p = document.createElement('p');
    p.textContent = text;
    return p.outerHTML;
  }
  return purify.sanitize(window.marked.parse(text, { gfm: true, breaks: false }));
}

function nearBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;
}
function scrollToEnd(force) {
  if (force || nearBottom()) window.scrollTo({ top: document.documentElement.scrollHeight });
}

function syncChrome() {
  const busy = Boolean(activeStream);
  els.intro.hidden = els.thread.children.length > 0;
  els.send.hidden = busy;
  els.stop.hidden = !busy;
  els.send.disabled = !els.input.value.trim();
  els.openKey.classList.toggle('needs-key', !apiKey);
}

function addUser(text) {
  const li = document.createElement('li');
  li.className = 'msg msg-user';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  li.append(bubble);
  els.thread.append(li);
  return li;
}

function addCoach(text = '') {
  const li = document.createElement('li');
  li.className = 'msg msg-coach';
  const prose = document.createElement('div');
  prose.className = 'prose';
  if (text) prose.innerHTML = markdown(text);
  else prose.innerHTML = '<span class="pending" aria-label="Coach is thinking"><i></i><i></i><i></i></span>';
  li.append(prose);
  els.thread.append(li);
  return li;
}

function addNote(li, text) {
  const meta = document.createElement('p');
  meta.className = 'msg-meta';
  meta.textContent = text;
  li.append(meta);
}

function addError(message, { retry, key } = {}) {
  const li = document.createElement('li');
  li.className = 'msg msg-error';
  li.setAttribute('role', 'alert');
  li.append(message);
  if (key) li.append(button('Update key', openKeyDialog));
  if (retry) li.append(button('Retry', retry));
  els.thread.append(li);
  return li;
}

function button(label, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tool-btn';
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function textOf(content) {
  if (typeof content === 'string') return content;
  return content.filter((b) => b.type === 'text').map((b) => b.text).join('');
}

function renderHistory() {
  els.thread.replaceChildren();
  for (const msg of history) {
    if (msg.role === 'user') addUser(textOf(msg.content));
    else addCoach(textOf(msg.content));
  }
  syncChrome();
  scrollToEnd(true);
}

/* ---------- conversation ---------- */
function describeError(err) {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    return { message: 'That API key was rejected.', key: true };
  }
  if (err instanceof Anthropic.RateLimitError) return { message: 'Rate limited. Give it a moment and retry.' };
  if (err instanceof Anthropic.APIConnectionError) return { message: 'Couldn’t reach the Anthropic API. Check your connection.' };
  if (err instanceof Anthropic.APIError && err.status === 529) return { message: 'Claude is overloaded right now. Try again shortly.' };
  if (err instanceof Anthropic.APIError) return { message: `API error ${err.status ?? ''}: ${err.error?.error?.message ?? err.message}` };
  return { message: err?.message || 'Something went wrong.' };
}

async function send(text) {
  text = text.trim();
  if (!text || activeStream) return;
  if (!apiKey) {
    pendingText = text;
    openKeyDialog();
    return;
  }

  els.input.value = '';
  autosize();
  const userLi = addUser(text);
  history.push({ role: 'user', content: text });
  const coachLi = addCoach();
  const prose = coachLi.querySelector('.prose');
  syncChrome();
  scrollToEnd(true);

  const convo = history; // "New" swaps this out; a late finish must not write into the fresh one
  let streamed = '';
  let frame = 0;
  const paint = () => {
    frame = 0;
    const follow = nearBottom();
    prose.innerHTML = markdown(streamed);
    if (follow) scrollToEnd(true);
  };

  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT },
      cache_control: { type: 'ephemeral' },
      system: [{ type: 'text', text: await systemPrompt() }],
      messages: history,
    });
    activeStream = stream;
    syncChrome();

    stream.on('text', (delta) => {
      streamed += delta;
      frame ||= requestAnimationFrame(paint);
    });

    const final = await stream.finalMessage();
    if (frame) cancelAnimationFrame(frame);
    if (convo !== history) return;

    // keep text and thinking so the next turn continues cleanly; drop empty text blocks
    const content = final.content.filter(
      (b) => (b.type === 'text' && b.text) || b.type === 'thinking' || b.type === 'redacted_thinking',
    );
    const reply = textOf(content);

    if (final.stop_reason === 'refusal' || !reply) {
      history.pop();
      coachLi.remove();
      addError(final.stop_reason === 'refusal' ? 'Claude declined to answer that one.' : 'No reply came back.', {
        retry: () => retryFrom(userLi, text),
      });
    } else {
      history.push({ role: 'assistant', content });
      prose.innerHTML = markdown(reply);
      if (final.stop_reason === 'max_tokens') addNote(coachLi, 'Reply hit the length limit.');
      save(HISTORY_STORE, history);
    }
  } catch (err) {
    if (frame) cancelAnimationFrame(frame);
    if (convo !== history) return;
    if (err instanceof Anthropic.APIUserAbortError && streamed.trim()) {
      // keep what arrived so the conversation stays coherent
      history.push({ role: 'assistant', content: [{ type: 'text', text: streamed }] });
      prose.innerHTML = markdown(streamed);
      addNote(coachLi, 'Stopped.');
      save(HISTORY_STORE, history);
    } else {
      history.pop();
      coachLi.remove();
      if (err instanceof Anthropic.APIUserAbortError) {
        userLi.remove();
        els.input.value = text;
        autosize();
      } else {
        addError(describeError(err).message, { ...describeError(err), retry: () => retryFrom(userLi, text) });
      }
    }
  } finally {
    activeStream = null;
    syncChrome();
    scrollToEnd();
    els.input.focus({ preventScroll: true });
  }
}

function retryFrom(userLi, text) {
  let node = userLi;
  while (node) {
    const next = node.nextElementSibling;
    node.remove();
    node = next;
  }
  send(text);
}

/* ---------- key dialog ---------- */
function openKeyDialog() {
  els.keyInput.value = apiKey;
  els.dialog.showModal();
  els.keyInput.focus();
}
els.keyForm.addEventListener('submit', (e) => {
  const value = els.keyInput.value.trim();
  if (!value) {
    e.preventDefault();
    els.keyInput.focus();
    return;
  }
  apiKey = value;
  save(KEY_STORE, apiKey);
  syncChrome();
  if (pendingText) {
    const text = pendingText;
    pendingText = null;
    queueMicrotask(() => send(text));
  }
});
els.keyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    els.keyForm.requestSubmit();
  }
});
els.cancelKey.addEventListener('click', () => els.dialog.close());
els.dialog.addEventListener('close', () => {
  if (!apiKey && pendingText) {
    els.input.value = pendingText;
    autosize();
    syncChrome();
  }
  pendingText = null;
});
els.forgetKey.addEventListener('click', () => {
  apiKey = '';
  save(KEY_STORE, null);
  els.keyInput.value = '';
  syncChrome();
  els.dialog.close();
});
els.openKey.addEventListener('click', openKeyDialog);

/* ---------- composer ---------- */
function autosize() {
  els.input.style.height = 'auto';
  els.input.style.height = `${els.input.scrollHeight}px`;
}
els.input.addEventListener('input', () => {
  autosize();
  syncChrome();
});
els.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send(els.input.value);
  }
});
els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  send(els.input.value);
});
els.stop.addEventListener('click', () => activeStream?.abort());

document.querySelectorAll('.starter').forEach((starter) => {
  starter.addEventListener('click', () => {
    const text = starter.dataset.fill ?? starter.textContent;
    if (starter.dataset.fill) {
      els.input.value = text;
      autosize();
      syncChrome();
      els.input.focus();
      els.input.setSelectionRange(text.length, text.length);
    } else {
      send(text);
    }
  });
});

els.newChat.addEventListener('click', () => {
  if (history.length && !confirm('Start a new conversation? This one will be cleared.')) return;
  activeStream?.abort();
  history = [];
  save(HISTORY_STORE, null);
  renderHistory();
  els.input.focus();
});

renderHistory();
systemPrompt().catch(() => {}); // warm the skill files
