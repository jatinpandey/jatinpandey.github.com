// Coach: a chat front end for the life-coach skill in ./skill.
// Three ways to talk to it:
//   free       signed in with Google, no key: coach-api proxies to OpenAI on the site owner's key (limited prompts)
//   anthropic  the visitor's own Anthropic key, straight from the browser
//   openai     the visitor's own OpenAI key, straight from the browser
import { ANTHROPIC_MODEL, API_BASE, GOOGLE_CLIENT_ID, OPENAI_MODEL } from './config.js';

const SKILL_FILES = ['skill/web-context.md', 'skill/SKILL.md', 'skill/references/guide.md', 'skill/references/advisors.md'];
const ANTHROPIC_SDK = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.126.0/+esm';
const FREE_PROMPT_CHARS = 4000; // matches coach-api MAX_PROMPT_CHARS
const OPENAI_SDK = 'https://cdn.jsdelivr.net/npm/openai@7.15.0/+esm';
const STORE = {
  key: 'coach.apiKey',
  history: 'coach.history',
  session: 'coach.session',
  visitor: 'coach.visitor',
  sent: 'coach.promptsSent',
};

const $ = (id) => document.getElementById(id);
const els = {
  landing: $('landing'),
  chatView: $('chat-view'),
  intro: $('intro'),
  thread: $('thread'),
  form: $('composer'),
  input: $('composer-input'),
  send: $('send'),
  stop: $('stop'),
  creditsNote: $('credits-note'),
  newChat: $('new-chat'),
  ctaNewChat: $('cta-new-chat'),
  landingGoogle: $('landing-google'),
  landingNote: $('landing-note'),
  account: $('account'),
  accountBtn: $('account-btn'),
  accountMenu: $('account-menu'),
  accountAvatar: $('account-avatar'),
  accountInitial: $('account-initial'),
  accountName: $('account-name'),
  accountCredits: $('account-credits'),
  menuKey: $('menu-key'),
  menuSignout: $('menu-signout'),
  dialog: $('access-dialog'),
  accessForm: $('access-form'),
  accessTitle: $('access-title'),
  accessLede: $('access-lede'),
  dialogGoogle: $('dialog-google'),
  googleError: $('google-error'),
  keyInput: $('key-input'),
  keyError: $('key-error'),
  forgetKey: $('forget-key'),
  cancelAccess: $('cancel-access'),
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

let apiKey = load(STORE.key, '');
let history = load(STORE.history, []); // [{ role, content }] — content is a string or Anthropic content blocks
let session = load(STORE.session, null); // { token, exp, name, email, picture }
let credits = null; // { used, limit } for the free tier
let activeRun = null; // AbortController
let pendingText = null; // message waiting for access

const visitor = load(STORE.visitor, null) || (() => {
  const id = crypto.randomUUID();
  save(STORE.visitor, id);
  return id;
})();

/* ---------- analytics ---------- */
// GA4 for exploration, plus a first-party beacon that ad blockers don't eat.
function track(step, params = {}) {
  try {
    window.gtag?.('event', `coach_${step}`, params);
  } catch {}
  try {
    navigator.sendBeacon?.(`${API_BASE}/api/event`, JSON.stringify({ step, visitor, mode: params.mode }));
  } catch {}
}

/* ---------- access ---------- */
function keyProvider(key) {
  if (/^sk-ant-[\w-]{10,}$/.test(key)) return 'anthropic';
  if (/^sk-[\w-]{10,}$/.test(key)) return 'openai';
  return null;
}
function mode() {
  if (apiKey) return keyProvider(apiKey);
  if (session) return 'free';
  return null;
}
const outOfCredits = () => Boolean(credits && credits.used >= credits.limit);
const hasAccess = () => Boolean(mode()) && !(mode() === 'free' && outOfCredits());

/* ---------- system prompt ---------- */
let instructionsPromise = null;
function instructions() {
  instructionsPromise ??= Promise.all(
    SKILL_FILES.map(async (path) => {
      const res = await fetch(new URL(path, import.meta.url));
      if (!res.ok) throw new Error(`Couldn't load ${path} (${res.status})`);
      const text = (await res.text()).trim();
      return path.endsWith('web-context.md') ? text : `<file path="${path.replace(/^skill\//, '')}">\n${text}\n</file>`;
    }),
  ).then((parts) => parts.join('\n\n'));
  instructionsPromise.catch(() => { instructionsPromise = null; });
  return instructionsPromise;
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

function textOf(content) {
  if (typeof content === 'string') return content;
  return content.filter((b) => b.type === 'text').map((b) => b.text).join('');
}
const asText = (messages) => messages.map((m) => ({ role: m.role, content: textOf(m.content) }));

function syncChrome() {
  const busy = Boolean(activeRun);
  els.intro.hidden = els.thread.children.length > 0;
  els.send.hidden = busy;
  els.stop.hidden = !busy;
  els.send.disabled = !els.input.value.trim();
  renderAccount();
}

function renderAccount() {
  const m = mode();
  const left = credits ? Math.max(credits.limit - credits.used, 0) : null;
  const freeLine = left == null ? '' : left ? `${left} of ${credits.limit} free prompts left` : 'You have run out of credits';

  els.account.hidden = !session;
  els.landingGoogle.hidden = Boolean(session) || !GOOGLE_CLIENT_ID;
  if (session) {
    els.accountName.textContent = session.name || session.email || 'Signed in';
    els.accountInitial.textContent = (session.name || session.email || '?').trim().charAt(0).toUpperCase();
    els.accountAvatar.hidden = !session.picture;
    if (session.picture && els.accountAvatar.src !== session.picture) els.accountAvatar.src = session.picture;
    els.accountInitial.hidden = Boolean(session.picture);
  }
  const keyLine = m === 'anthropic' ? 'Using your Anthropic key' : m === 'openai' ? 'Using your OpenAI key' : '';
  els.accountCredits.textContent = keyLine || freeLine;
  els.menuKey.textContent = apiKey ? 'Change or remove your API key' : 'Use your own API key';
  els.creditsNote.textContent = m === 'free' ? freeLine : '';

  if (session) {
    els.landingNote.textContent = `Signed in as ${session.name || session.email}.${keyLine ? ` ${keyLine}.` : freeLine ? ` ${freeLine}.` : ''}`;
  } else if (apiKey) {
    els.landingNote.textContent = keyLine ? `${keyLine}.` : '';
  } else {
    els.landingNote.textContent = GOOGLE_CLIENT_ID
      ? 'Sign in with Google for 10 free prompts, or bring your own Anthropic or OpenAI key.'
      : 'Bring your own Anthropic or OpenAI key to start.';
  }
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

function addError(message, actions = []) {
  const li = document.createElement('li');
  li.className = 'msg msg-error';
  li.setAttribute('role', 'alert');
  li.append(message);
  for (const [label, onClick] of actions) li.append(button(label, onClick));
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

function renderHistory() {
  els.thread.replaceChildren();
  for (const msg of history) {
    if (msg.role === 'user') addUser(textOf(msg.content));
    else addCoach(textOf(msg.content));
  }
  syncChrome();
}

/* ---------- views ---------- */
function route() {
  const chat = location.hash === '#chat' || history.length > 0;
  els.landing.hidden = chat;
  els.chatView.hidden = !chat;
  document.body.classList.toggle('is-landing', !chat);
  if (chat) scrollToEnd(true);
  else window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);

function startNewChat() {
  track('new_chat_click');
  if (history.length && !confirm('Start a new chat? This conversation will be cleared.')) return;
  activeRun?.abort();
  history = [];
  save(STORE.history, null);
  renderHistory();
  if (location.hash !== '#chat') location.hash = 'chat';
  else route();
  if (hasAccess()) els.input.focus();
}
els.newChat.addEventListener('click', startNewChat);
els.ctaNewChat.addEventListener('click', startNewChat);

/* ---------- google sign-in ---------- */
let googleReady = null;
let refreshWaiters = [];

function decodeJwt(token) {
  const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '=')), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function onCredential(response) {
  let payload;
  try {
    payload = decodeJwt(response.credential);
  } catch {
    return;
  }
  const silent = refreshWaiters.length > 0;
  session = {
    token: response.credential,
    exp: payload.exp * 1000,
    name: payload.name || '',
    email: payload.email || '',
    picture: payload.picture || '',
  };
  save(STORE.session, session);
  settleRefresh(session.token);
  if (!silent) track('sign_in');
  els.googleError.hidden = true;
  refreshCredits();
  syncChrome();
  if (els.dialog.open) els.dialog.close('granted');
}

function initGoogle() {
  if (!GOOGLE_CLIENT_ID) {
    els.dialogGoogle.parentElement.hidden = true;
    $('access-or').hidden = true;
    return (googleReady = Promise.resolve(false));
  }
  googleReady = new Promise((resolve) => {
    const started = Date.now();
    (function wait() {
      const id = window.google?.accounts?.id;
      if (id) {
        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: onCredential,
          auto_select: true,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });
        const style = { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', logo_alignment: 'left' };
        id.renderButton(els.landingGoogle, style);
        id.renderButton(els.dialogGoogle, { ...style, width: 280 });
        resolve(true);
      } else if (Date.now() - started > 15000) {
        els.googleError.textContent = 'Google sign-in didn’t load. Check your connection or content blocker.';
        els.googleError.hidden = false;
        resolve(false);
      } else {
        setTimeout(wait, 100);
      }
    })();
  });
  return googleReady;
}

function settleRefresh(token) {
  const waiters = refreshWaiters;
  refreshWaiters = [];
  waiters.forEach((resolve) => resolve(token));
}

// Google ID tokens last an hour; ask One Tap for a fresh one without a click when possible.
async function freshToken() {
  if (session && session.exp - Date.now() > 60_000) return session.token;
  if (!(await googleReady)) return null;
  return new Promise((resolve) => {
    refreshWaiters.push(resolve);
    if (refreshWaiters.length === 1) {
      window.google.accounts.id.prompt();
      setTimeout(() => settleRefresh(null), 8000);
    }
  });
}

async function refreshCredits() {
  const token = session && session.exp - Date.now() > 30_000 ? session.token : null;
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      credits = await res.json();
      syncChrome();
    }
  } catch {}
}

function signOut() {
  window.google?.accounts?.id?.disableAutoSelect();
  session = null;
  credits = null;
  save(STORE.session, null);
  closeMenu();
  syncChrome();
}

/* ---------- account menu ---------- */
function closeMenu() {
  els.accountMenu.hidden = true;
  els.accountBtn.setAttribute('aria-expanded', 'false');
}
els.accountBtn.addEventListener('click', () => {
  const open = els.accountMenu.hidden;
  els.accountMenu.hidden = !open;
  els.accountBtn.setAttribute('aria-expanded', String(open));
  if (open) {
    refreshCredits();
    els.menuKey.focus();
  }
});
document.addEventListener('click', (e) => {
  if (!els.account.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !els.accountMenu.hidden) {
    closeMenu();
    els.accountBtn.focus();
  }
});
els.menuKey.addEventListener('click', () => {
  closeMenu();
  openAccess('key');
});
els.menuSignout.addEventListener('click', signOut);

/* ---------- access dialog ---------- */
const VARIANTS = {
  start: {
    title: 'Start talking to Coach',
    lede: 'Sign in with Google for 10 free prompts, or use your own API key.',
    keyOnly: false,
  },
  expired: {
    title: 'Sign in again',
    lede: 'Your Google sign-in expired. Sign in again to keep going, or use your own API key.',
    keyOnly: false,
  },
  credits: {
    title: 'You have run out of credits',
    lede: 'You’ve used all your free prompts. Add your own Anthropic or OpenAI key to keep going.',
    keyOnly: true,
  },
  key: {
    title: 'Your API key',
    lede: 'Use your own Anthropic or OpenAI key. Prompts on your key aren’t limited.',
    keyOnly: true,
  },
};

function openAccess(variant) {
  if (els.dialog.open) return;
  const v = VARIANTS[variant];
  els.accessTitle.textContent = v.title;
  els.accessLede.textContent = v.lede;
  els.dialog.classList.toggle('key-only', v.keyOnly || !GOOGLE_CLIENT_ID);
  els.keyInput.value = apiKey;
  els.keyError.hidden = true;
  els.forgetKey.hidden = !apiKey;
  els.dialog.returnValue = '';
  if (variant !== 'key') track(variant === 'credits' ? 'out_of_credits' : 'access_prompt');
  els.dialog.showModal();
  if (v.keyOnly || !GOOGLE_CLIENT_ID) els.keyInput.focus();
}

els.accessForm.addEventListener('submit', (e) => {
  const value = els.keyInput.value.trim();
  const provider = keyProvider(value);
  if (!provider) {
    e.preventDefault();
    els.keyError.textContent = value
      ? 'That doesn’t look like an Anthropic (sk-ant-…) or OpenAI (sk-…) key.'
      : 'Paste a key to continue.';
    els.keyError.hidden = false;
    els.keyInput.focus();
    return;
  }
  if (value !== apiKey) track('key_added', { provider });
  apiKey = value;
  save(STORE.key, apiKey);
  els.dialog.returnValue = 'granted';
});
els.keyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    els.accessForm.requestSubmit();
  }
});
els.keyInput.addEventListener('input', () => { els.keyError.hidden = true; });
els.cancelAccess.addEventListener('click', () => els.dialog.close('cancel'));
els.forgetKey.addEventListener('click', () => {
  apiKey = '';
  save(STORE.key, null);
  els.keyInput.value = '';
  els.dialog.close('forgot');
});
els.dialog.addEventListener('close', () => {
  syncChrome();
  const text = pendingText;
  pendingText = null;
  if (!text) {
    if (els.dialog.returnValue === 'granted' && hasAccess() && !els.chatView.hidden) els.input.focus();
    return;
  }
  if (hasAccess()) {
    send(text);
  } else {
    els.input.value = text;
    autosize();
    syncChrome();
  }
});

/* ---------- providers ---------- */
class CoachError extends Error {
  constructor(message, kind = 'generic') {
    super(message);
    this.kind = kind; // generic | key | credits | expired | daily
  }
}

let anthropicModule = null;
async function runAnthropic({ signal, onText }) {
  anthropicModule ??= import(ANTHROPIC_SDK);
  const { default: Anthropic } = await anthropicModule;
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
  try {
    const stream = client.beta.messages.stream(
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 64000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        cache_control: { type: 'ephemeral' },
        system: [{ type: 'text', text: await instructions() }],
        messages: history,
      },
      { signal },
    );
    stream.on('text', onText);
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') throw new CoachError('Claude declined to answer that one.');
    // keep text and thinking so the next turn continues cleanly; drop empty text blocks
    const content = final.content.filter(
      (b) => (b.type === 'text' && b.text) || b.type === 'thinking' || b.type === 'redacted_thinking',
    );
    return { content, note: final.stop_reason === 'max_tokens' ? 'Reply hit the length limit.' : '' };
  } catch (err) {
    if (err instanceof CoachError || signal.aborted) throw err;
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      throw new CoachError('That Anthropic API key was rejected.', 'key');
    }
    if (err instanceof Anthropic.RateLimitError) throw new CoachError('Rate limited. Give it a moment and retry.');
    if (err instanceof Anthropic.APIConnectionError) throw new CoachError('Couldn’t reach the Anthropic API. Check your connection.');
    if (err instanceof Anthropic.APIError && err.status === 529) throw new CoachError('Claude is overloaded right now. Try again shortly.');
    if (err instanceof Anthropic.APIError) throw new CoachError(`Anthropic error ${err.status ?? ''}: ${err.error?.error?.message ?? err.message}`);
    throw err;
  }
}

let openaiModule = null;
async function runOpenAI({ signal, onText }) {
  openaiModule ??= import(OPENAI_SDK);
  const { default: OpenAI } = await openaiModule;
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true, maxRetries: 1 });
  let text = '';
  try {
    const stream = await client.chat.completions.create(
      {
        model: OPENAI_MODEL,
        stream: true,
        messages: [{ role: 'developer', content: await instructions() }, ...asText(history)],
      },
      { signal },
    );
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        text += delta;
        onText(delta);
      }
    }
    return { content: [{ type: 'text', text }] };
  } catch (err) {
    if (signal.aborted) throw err;
    if (err instanceof OpenAI.AuthenticationError || err instanceof OpenAI.PermissionDeniedError) {
      throw new CoachError('That OpenAI API key was rejected.', 'key');
    }
    if (err instanceof OpenAI.RateLimitError) throw new CoachError('OpenAI rate limit or quota reached. Check your OpenAI billing, or retry shortly.');
    if (err instanceof OpenAI.APIConnectionError) throw new CoachError('Couldn’t reach the OpenAI API. Check your connection.');
    if (err instanceof OpenAI.APIError) throw new CoachError(`OpenAI error ${err.status ?? ''}: ${err.message}`);
    throw err;
  }
}

async function runFree({ signal, onText }) {
  const token = await freshToken();
  if (!token) throw new CoachError('Your sign-in expired.', 'expired');

  let res;
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: asText(history) }),
      signal,
    });
  } catch (err) {
    if (signal.aborted) throw err;
    throw new CoachError('Couldn’t reach Coach. Check your connection.');
  }

  if (res.status === 401) throw new CoachError('Your sign-in expired.', 'expired');
  if (res.status === 402) {
    const body = await res.json().catch(() => ({}));
    credits = { used: body.limit ?? credits?.limit ?? 10, limit: body.limit ?? credits?.limit ?? 10 };
    throw new CoachError('You have run out of credits.', 'credits');
  }
  if (res.status === 413) throw new CoachError(`That message is too long for the free tier. Keep it under ${FREE_PROMPT_CHARS.toLocaleString()} characters, or use your own key.`);
  if (res.status === 429) {
    const body = await res.json().catch(() => ({}));
    throw new CoachError(body.error === 'in_progress' ? 'Coach is still answering your last message.' : 'Coach is busy right now. Try again shortly.');
  }
  if (res.status === 503) {
    const body = await res.json().catch(() => ({}));
    if (body.error === 'daily_limit') throw new CoachError('Coach has used up today’s free prompts for everyone. Add your own key, or try again tomorrow.', 'daily');
  }
  if (!res.ok || !res.body) throw new CoachError('Something went wrong on our side. Try again.');

  const used = Number(res.headers.get('X-Credits-Used'));
  const limit = Number(res.headers.get('X-Credits-Limit'));
  if (limit) credits = { used, limit };

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += value;
    onText(value);
  }
  return { content: [{ type: 'text', text }] };
}

const RUNNERS = { free: runFree, anthropic: runAnthropic, openai: runOpenAI };

/* ---------- conversation ---------- */
async function send(text) {
  text = text.trim();
  if (!text || activeRun) return;

  const m = mode();
  if (!m) {
    pendingText = text;
    openAccess('start');
    return;
  }
  if (m === 'free' && outOfCredits()) {
    pendingText = text;
    openAccess('credits');
    return;
  }

  if (m === 'free' && text.length > FREE_PROMPT_CHARS) {
    els.input.value = text;
    autosize();
    syncChrome();
    els.creditsNote.textContent = `Free-tier messages are limited to ${FREE_PROMPT_CHARS.toLocaleString()} characters (this one is ${text.length.toLocaleString()}). Shorten it or use your own key.`;
    return;
  }

  if (location.hash !== '#chat') location.hash = 'chat';
  els.input.value = '';
  autosize();
  const userLi = addUser(text);
  history.push({ role: 'user', content: text });
  const coachLi = addCoach();
  const prose = coachLi.querySelector('.prose');
  const convo = history; // "New chat" swaps this out; a late finish must not write into the fresh one
  const controller = new AbortController();
  activeRun = controller;
  syncChrome();
  scrollToEnd(true);

  let streamed = '';
  let frame = 0;
  const paint = () => {
    frame = 0;
    const follow = nearBottom();
    prose.innerHTML = markdown(streamed);
    if (follow) scrollToEnd(true);
  };
  const counted = () => {
    const n = load(STORE.sent, 0) + 1;
    save(STORE.sent, n);
    track('prompt_sent', { mode: m, prompt_number: n });
  };

  try {
    const result = await RUNNERS[m]({
      signal: controller.signal,
      onText: (delta) => {
        streamed += delta;
        frame ||= requestAnimationFrame(paint);
      },
    });
    if (frame) cancelAnimationFrame(frame);
    if (convo !== history) return;
    const reply = textOf(result.content);
    if (!reply.trim()) throw new CoachError('No reply came back. Try again.');
    history.push({ role: 'assistant', content: result.content });
    save(STORE.history, history);
    prose.innerHTML = markdown(reply);
    if (result.note) addNote(coachLi, result.note);
    counted();
  } catch (err) {
    if (frame) cancelAnimationFrame(frame);
    if (convo !== history) return;
    if (controller.signal.aborted && streamed.trim()) {
      // keep what arrived so the conversation stays coherent
      history.push({ role: 'assistant', content: [{ type: 'text', text: streamed }] });
      save(STORE.history, history);
      prose.innerHTML = markdown(streamed);
      addNote(coachLi, 'Stopped.');
      counted();
    } else {
      history.pop();
      coachLi.remove();
      if (controller.signal.aborted) {
        userLi.remove();
        els.input.value = text;
        autosize();
      } else {
        showFailure(err, userLi, text);
      }
    }
  } finally {
    if (activeRun === controller) activeRun = null;
    syncChrome();
    scrollToEnd();
  }
}

function showFailure(err, userLi, text) {
  const retry = ['Retry', () => retryFrom(userLi, text)];
  const kind = err instanceof CoachError ? err.kind : 'generic';
  if (kind === 'credits') {
    addError('You have run out of credits.', [['Add your own API key', () => openAccess('credits')], retry]);
    track('out_of_credits');
  } else if (kind === 'expired') {
    session = null;
    save(STORE.session, null);
    addError('Your sign-in expired.', [retry]);
    openAccess('expired');
  } else if (kind === 'daily') {
    addError(err.message, [['Add your own API key', () => openAccess('key')], retry]);
    track('daily_limit');
  } else if (kind === 'key') {
    addError(err.message, [['Update key', () => openAccess('key')], retry]);
  } else {
    console.error(err);
    addError(err instanceof CoachError ? err.message : 'Something went wrong. Try again.', [retry]);
  }
}

function retryFrom(userLi, text) {
  let node = userLi;
  while (node) {
    const next = node.nextElementSibling;
    node.remove();
    node = next;
  }
  syncChrome();
  send(text);
}

/* ---------- composer ---------- */
function autosize() {
  els.input.style.height = 'auto';
  els.input.style.height = `${els.input.scrollHeight}px`;
}

// Tapping the box without a way to answer asks for a key or a sign-in first.
function gate(e) {
  if (hasAccess()) return;
  e.preventDefault();
  els.input.blur();
  openAccess(mode() === 'free' ? 'credits' : 'start');
}
els.input.addEventListener('pointerdown', gate);
els.input.addEventListener('focus', gate);

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
els.stop.addEventListener('click', () => activeRun?.abort());

document.querySelectorAll('.starter').forEach((starter) => {
  starter.addEventListener('click', () => {
    if (starter.dataset.fill) {
      if (!hasAccess()) {
        pendingText = null;
        openAccess(mode() === 'free' ? 'credits' : 'start');
        return;
      }
      const text = starter.dataset.fill;
      els.input.value = text;
      autosize();
      syncChrome();
      els.input.focus();
      els.input.setSelectionRange(text.length, text.length);
    } else {
      send(starter.textContent);
    }
  });
});

/* ---------- start ---------- */
if (session && session.exp < Date.now() - 30 * 24 * 3600 * 1000) {
  // stale for a month; don't keep showing an old profile
  session = null;
  save(STORE.session, null);
}
renderHistory();
route();
initGoogle();
refreshCredits();
track('landing_view');
instructions().catch(() => {}); // warm the skill files
