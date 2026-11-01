/**
 * Executa o Whisper.cpp para transcrever o vídeo e gerar captions.json
 *
 * Uso:
 *   npx tsx scripts/transcribe.mts public/meu-video.mp4
 *
 * Requer: ffmpeg instalado no sistema
 */
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Uso: npx tsx scripts/transcribe.mts <caminho-do-video>");
  process.exit(1);
}

const whisperDir = path.join(process.cwd(), "whisper.cpp");
const wavFile = inputFile.replace(/\.[^.]+$/, ".wav");
const outputFile = path.join(
  process.cwd(),
  "public",
  path.basename(inputFile, path.extname(inputFile)) + "-captions.json"
);

console.log("📦 Instalando Whisper.cpp...");
await installWhisperCpp({ to: whisperDir, version: "1.5.5" });

console.log("📥 Baixando modelo medium (PT/EN)...");
await downloadWhisperModel({ model: "medium", folder: whisperDir });

console.log("🎵 Convertendo para WAV 16kHz...");
execSync(`ffmpeg -i "${inputFile}" -ar 16000 -ac 1 "${wavFile}" -y`);

console.log("🎙️  Transcrevendo...");
const whisperOutput = await transcribe({
  model: "medium",
  whisperPath: whisperDir,
  whisperCppVersion: "1.5.5",
  inputPath: wavFile,
  tokenLevelTimestamps: true,
  language: "pt",
});

const { captions } = toCaptions({ whisperCppOutput: whisperOutput });

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(captions, null, 2));
fs.unlinkSync(wavFile);

console.log(`✅ Legendas salvas em: ${outputFile}`);
console.log(`   Total de tokens: ${captions.length}`);
