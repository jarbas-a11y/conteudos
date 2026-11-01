// Cuts silences from public/original.mp4 → public/cut.mp4 and writes src/pro/edit.json
// with word timings and scene windows remapped to the cut timeline.
// Usage: node scripts/build-edit.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";

const SRC = "public/original.mp4";
const OUT = "public/cut.mp4";
const DUR = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${SRC}`).toString());

// Silences to keep (dramatic pauses), in original seconds.
const KEEP_PAUSES = [[38.6, 39.2]];

const log = execSync(`ffmpeg -i ${SRC} -af silencedetect=noise=-32dB:d=0.35 -f null - 2>&1`).toString();
const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
const removed = starts
  .map((s, i) => [s + 0.1, (ends[i] ?? DUR) - 0.08])
  .filter(([a, b]) => b - a >= 0.15)
  .filter(([a, b]) => !KEEP_PAUSES.some(([x, y]) => a < y && b > x));

const keep = [];
let t = 0;
for (const [a, b] of removed) {
  keep.push([t, a]);
  t = b;
}
keep.push([t, DUR]);

const map = (sec) => {
  let out = 0;
  for (const [a, b] of keep) {
    if (sec <= a) return out;
    if (sec <= b) return out + (sec - a);
    out += b - a;
  }
  return out;
};

const parts = keep
  .map(([a, b], i) => `[0:v]trim=${a}:${b},setpts=PTS-STARTPTS[v${i}];[0:a]atrim=${a}:${b},asetpts=PTS-STARTPTS[a${i}];`)
  .join("");
const concat = keep.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${keep.length}:v=1:a=1[v][a]`;
execSync(
  `ffmpeg -v error -y -i ${SRC} -filter_complex "${parts}${concat}" -map "[v]" -map "[a]" -c:v libx264 -crf 15 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart ${OUT}`,
);

// Merge whisper sub-word tokens into words.
const tokens = JSON.parse(fs.readFileSync("public/original-captions.json", "utf8"));
const words = [];
for (const tk of tokens) {
  const txt = tk.text;
  if (!txt.trim()) continue;
  if (/^\s/.test(txt) || words.length === 0) words.push({ text: txt.trim(), start: tk.startMs / 1000 });
  else words[words.length - 1].text += txt.trim();
}
words.forEach((w, i) => (w.end = Math.min(words[i + 1]?.start ?? w.start + 0.4, w.start + 0.9)));

// Scene windows in original seconds (cover burned-in hook text and numbers 1–7).
const SCENES = [
  ["hook", 0, 3.0],
  ["c1", 4.95, 7.6],
  ["c2", 9.25, 12.5],
  ["c3", 13.45, 16.3],
  ["c4", 18.7, 21.9],
  ["c5", 26.62, 29.3],
  ["c6", 30.8, 33.7],
  ["c7", 37.3, 40.95],
];

const cutDur = map(DUR);
const edit = {
  duration: +cutDur.toFixed(3),
  cuts: keep.slice(1).map(([a]) => +map(a).toFixed(3)),
  words: words.map((w) => ({ text: w.text, start: +map(w.start).toFixed(3), end: +map(w.end).toFixed(3) })),
  scenes: SCENES.map(([id, a, b]) => ({ id, start: +map(a).toFixed(3), end: +map(b).toFixed(3) })),
};
fs.writeFileSync("src/pro/edit.json", JSON.stringify(edit, null, 1));
console.log(`removed ${removed.length} pauses, ${DUR.toFixed(2)}s → ${cutDur.toFixed(2)}s`);
console.log(edit.scenes);
