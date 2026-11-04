import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const root = "/home/user/conteudos/video-editor";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
for (const id of process.argv.slice(2)) {
  const comp = await selectComposition({ serveUrl, id, chromiumOptions: { gl: "swiftshader" } });
  const dir = path.join(root, "out/carousels", id);
  fs.mkdirSync(dir, { recursive: true });
  for (let f = 0; f < comp.durationInFrames; f++) {
    await renderStill({ serveUrl, composition: comp, frame: f, output: path.join(dir, `${String(f + 1).padStart(2, "0")}.png`), imageFormat: "png", chromiumOptions: { gl: "swiftshader" } });
    console.log(id, f + 1);
  }
}
