/* Canon — narration settings.

   Canon looks for narration in three places, in order:
     1. /canon/audio/<id>.mp3          pre-rendered with scripts/speak.mjs (free, no key in the browser)
     2. the browser's cache            anything Deepgram has already made on this device
     3. Deepgram Aura                  generated live, if `deepgramKey` below is set and the caps allow
   If none of those produce a file, the browser's own British voice reads it.

   ⚠ This file is served to every visitor. A key put here is public: anyone can
   read it from the page source and spend your Deepgram credit. The caps below
   are stored in the visitor's own browser, so they pace one reader — they do not
   protect the key. The safe way to get the Aura voice for everyone is to render
   the files once on your machine and commit them:

       DEEPGRAM_API_KEY=… node canon/scripts/speak.mjs

   Leave `deepgramKey` empty for that route. Use a live key only with one you are
   happy to publish and can rotate. */
window.CANON_CONFIG = {
  deepgramKey: '',            // e.g. 'dg_…' — see the warning above
  voice: 'aura-2-draco-en',   // British baritone; aura-2-pandora-en is the female equivalent
  perDay: 3,                  // most recordings Deepgram may generate per day, per browser
  totalLimit: 30,             // most it may ever generate on this browser; after that, the browser voice
};
