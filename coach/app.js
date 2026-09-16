// Coach: the chat front end. Coach's instructions live only in coach-api; this page never sees them.
// Three ways to talk to it, all through coach-api:
//   free       signed in with Google, no key: runs on the site owner's OpenAI key (limited prompts)
//   anthropic  the visitor's own Anthropic key, passed through for each message and never stored server-side
//   openai     the visitor's own OpenAI key, same
import { API_BASE, GOOGLE_CLIENT_ID } from './config.js';

const FREE_PROMPT_CHARS = 4000; // matches coach-api MAX_PROMPT_CHARS
const STORE = {
  key: 'coach.apiKey',
  history: 'coach.history', // no longer written; cleared on load
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
  homeLink: $('home-link'),
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
  closeAccess: $('close-access'),
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
// Chats are ephemeral: history lives only in memory for this page.
let history = []; // [{ role, content: string }]
save(STORE.history, null); // drop anything an earlier version saved
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
    const status = keyLine || freeLine;
    els.landingNote.textContent = `Signed in as ${session.name || session.email}.${status ? ` ${status}.` : ''} Type a message below to start.`;
  } else {
    els.landingNote.textContent = GOOGLE_CLIENT_ID
      ? 'Type a message below to start. Sign in with Google for 10 free prompts.'
      : 'Type a message below to start.';
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
  const text = document.createElement('p');
  text.textContent = message;
  li.append(text);
  if (actions.length) {
    const row = document.createElement('div');
    row.className = 'error-actions';
    for (const [label, onClick] of actions) row.append(button(label, onClick));
    li.append(row);
  }
  els.thread.append(li);
  return li;
}

function button(label, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn btn-small';
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
  const chat = location.hash === '#chat';
  els.landing.hidden = chat;
  els.chatView.hidden = !chat;
  document.body.classList.toggle('is-landing', !chat);
  if (chat) scrollToEnd(true);
  else window.scrollTo({ top: 0 });
}
window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);

function startNewChat() {
  track('new_chat_click');
  if (history.length && !confirm('Start a new chat? This conversation will be cleared.')) return;
  activeRun?.abort();
  history = [];
  renderHistory();
  if (location.hash !== '#chat') location.hash = 'chat';
  else route();
  if (hasAccess()) els.input.focus();
}
els.newChat.addEventListener('click', startNewChat);
els.homeLink.addEventListener('click', (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  if (location.hash) window.history.pushState(null, '', location.pathname); // Back returns to the chat
  route();
});

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
    lede: 'Sign in with Google for 10 free prompts.',
    keyOnly: false,
  },
  expired: {
    title: 'Sign in again',
    lede: 'Your Google sign-in expired. Sign in again to keep going.',
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
els.closeAccess.addEventListener('click', () => els.dialog.close('cancel'));
// the dialog's own box has no padding, so a click whose target is the dialog landed on the backdrop
els.dialog.addEventListener('click', (e) => {
  if (e.target === els.dialog) els.dialog.close('cancel');
});
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

const PROVIDER_NAMES = { anthropic: 'Anthropic', openai: 'OpenAI' };

// Every mode goes through coach-api, which holds Coach's instructions and talks to the provider.
async function runChat({ signal, onText, mode: m }) {
  const headers = { 'Content-Type': 'application/json' };
  if (m === 'free') {
    const token = await freshToken();
    if (!token) throw new CoachError('Your sign-in expired.', 'expired');
    headers.Authorization = `Bearer ${token}`;
  } else {
    headers['X-Provider-Key'] = apiKey;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages: history.map((msg) => ({ role: msg.role, content: textOf(msg.content) })) }),
      signal,
    });
  } catch (err) {
    if (signal.aborted) throw err;
    throw new CoachError('Couldn’t reach Coach. Check your connection.');
  }

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => ({}));
    throw failure(res.status, body, m);
  }

  if (m === 'free') {
    const used = Number(res.headers.get('X-Credits-Used'));
    const limit = Number(res.headers.get('X-Credits-Limit'));
    if (limit) credits = { used, limit };
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += value;
    onText(value);
  }
  return { content: text };
}

function failure(status, body, m) {
  const provider = PROVIDER_NAMES[m];
  switch (body.error) {
    case 'sign_in_required':
      return new CoachError('Your sign-in expired.', 'expired');
    case 'bad_key':
      return new CoachError(`That ${provider ?? 'API'} key was rejected.`, 'key');
    case 'out_of_credits':
      credits = { used: body.limit ?? 10, limit: body.limit ?? 10 };
      return new CoachError('You have run out of credits.', 'credits');
    case 'too_long':
      return new CoachError(
        m === 'free'
          ? `That message is too long for the free tier. Keep it under ${(body.limit ?? FREE_PROMPT_CHARS).toLocaleString()} characters.`
          : `That message is too long. Keep it under ${(body.limit ?? 32000).toLocaleString()} characters.`,
      );
    case 'too_large':
      return new CoachError('This conversation is too long to send. Start a new chat.');
    case 'in_progress':
      return new CoachError('Coach is still answering your last message.');
    case 'daily_limit':
      return new CoachError('Coach has used up today’s free prompts for everyone. Try again tomorrow.', 'daily');
    case 'free_unavailable':
      return new CoachError('Free prompts are paused right now. Try again later.');
    case 'provider_no_credits':
      return new CoachError(`Your ${provider} account is out of credits. Add credits with ${provider}, or use a different key.`, 'key');
    case 'provider_rate_limit':
      return new CoachError(`${provider} rate limit or quota reached. Check your ${provider} billing, or retry shortly.`);
    case 'refused':
      return new CoachError('Coach can’t help with that one.');
    case 'overloaded':
      return new CoachError('Coach is overloaded right now. Try again shortly.');
    case 'rate_limited':
    case 'busy':
      return new CoachError('Coach is busy right now. Try again shortly.');
    default:
      return new CoachError('Something went wrong on our side. Try again.');
  }
}

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
    const result = await runChat({
      mode: m,
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
    prose.innerHTML = markdown(reply);
    counted();
  } catch (err) {
    if (frame) cancelAnimationFrame(frame);
    if (convo !== history) return;
    if (controller.signal.aborted && streamed.trim()) {
      // keep what arrived so the conversation stays coherent
      history.push({ role: 'assistant', content: streamed });
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
    addError('You have run out of credits.', [['Add API key', () => openAccess('credits')], retry]);
    track('out_of_credits');
  } else if (kind === 'expired') {
    session = null;
    save(STORE.session, null);
    addError('Your sign-in expired.', [retry]);
    openAccess('expired');
  } else if (kind === 'daily') {
    addError(err.message, [['Add API key', () => openAccess('key')], retry]);
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
