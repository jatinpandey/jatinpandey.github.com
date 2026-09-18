/* Exact duration of an MP3, by walking its frame headers.

   Deepgram's audio arrives without a Xing or Info header, so browsers report a
   duration of Infinity until the whole file has been fetched — and Chrome often
   keeps reporting it afterwards. Counting frames here means the page can be told
   the real length up front instead of guessing from the word count. */

const RATES = {
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],   // MPEG 1 Layer III
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],       // MPEG 2/2.5 Layer III
};
const FREQ = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

export function durationOf(buf) {
  let i = 0;
  // step over an ID3v2 tag if there is one
  if (buf.length > 10 && buf.toString('ascii', 0, 3) === 'ID3') {
    i = 10 + ((buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | (buf[9] & 0x7f));
  }
  let seconds = 0;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) { i++; continue; }   // find the sync word
    const versionBits = (buf[i + 1] >> 3) & 0x03;
    const layerBits = (buf[i + 1] >> 1) & 0x03;
    const rateIndex = (buf[i + 2] >> 4) & 0x0f;
    const freqIndex = (buf[i + 2] >> 2) & 0x03;
    const padding = (buf[i + 2] >> 1) & 0x01;
    if (versionBits === 1 || layerBits !== 1 || rateIndex === 0 || rateIndex === 15 || freqIndex === 3) {
      i++; continue;                                                          // not a Layer III frame
    }
    const mpeg1 = versionBits === 3;
    const bitrate = RATES[mpeg1 ? 1 : 2][rateIndex] * 1000;
    const freq = FREQ[versionBits][freqIndex];
    const samples = mpeg1 ? 1152 : 576;
    const length = Math.floor((samples / 8) * bitrate / freq) + padding;
    if (length <= 0) { i++; continue; }
    seconds += samples / freq;
    i += length;
  }
  return seconds;
}
