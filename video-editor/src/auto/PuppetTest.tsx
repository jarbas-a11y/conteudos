import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "./kit";
import { POSES, PoseName, Puppet } from "./puppet";
import { COND, K } from "./theme";

const names = Object.keys(POSES) as PoseName[];
const exprs = ["neutro", "sorriso", "rindo", "empolgado", "desconfiado", "bravo", "surpreso", "chocado", "uau", "apreensivo", "ironico", "pensativo", "piscadinha", "arregalado", "falando", "neutro", "sorriso", "chocado"] as const;

export const PuppetTest: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    {names.map((n, i) => (
      <React.Fragment key={n}>
        <Puppet x={180 + (i % 3) * 360} y={330 + Math.floor(i / 3) * 310} height={290} pose={[[0, n]]} expr={exprs[i]} />
        <div style={{ position: "absolute", left: 180 + (i % 3) * 360 - 150, width: 300, top: 335 + Math.floor(i / 3) * 310, textAlign: "center", fontFamily: COND, fontWeight: 800, fontSize: 30, color: K.paper }}>
          {n} · {exprs[i]}
        </div>
      </React.Fragment>
    ))}
  </AbsoluteFill>
);
