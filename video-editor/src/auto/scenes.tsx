import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop, Bubble, Icon, Label, Orbit, ease, pop } from "./kit";
import { Puppet } from "./puppet";
import { COND, K, clamp } from "./theme";

export type SceneProps = { d: number; b: number[] };
const at = (b: number[], i: number, d: number, frac: number) => b[i] ?? Math.round(d * frac);
const IMG = (n: string) => `autocensura/${n}`;

// Camera: keyframed scale / translate / rotate for the whole scene.
const Cam: React.FC<{
  keys: number[];
  scale: number[];
  x?: number[];
  y?: number[];
  rot?: number[];
  origin?: string;
  children: React.ReactNode;
}> = ({ keys, scale, x, y, rot, origin = "50% 45%", children }) => {
  const frame = useCurrentFrame();
  const e = { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) };
  return (
    <AbsoluteFill
      style={{
        transformOrigin: origin,
        scale: String(interpolate(frame, keys, scale, e)),
        translate: `${x ? interpolate(frame, keys, x, e) : 0}px ${y ? interpolate(frame, keys, y, e) : 0}px`,
        rotate: rot ? `${interpolate(frame, keys, rot, e)}deg` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ n: number; title: string; at?: number }> = ({ n, title, at: a = 4 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, a, 14);
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 70,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: p,
        translate: `${(1 - p) * -60}px 0`,
      }}
    >
      <div
        style={{
          background: K.orange,
          color: K.white,
          fontFamily: COND,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 54,
          padding: "2px 22px 0 16px",
          clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)",
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 40, color: K.paper, letterSpacing: 3, textTransform: "uppercase" }}>{title}</div>
    </div>
  );
};

// ── 1 · Abertura de impacto — autocensura ──────────────────────────
export const S1: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const slam = at(b, 0, d, 0.28);
  const five = at(b, 1, d, 0.15);
  const sometimes = at(b, 2, d, 0.42);
  const reasonable = at(b, 3, d, 0.68);
  const saying = at(b, 4, d, 0.79);
  const thinks = at(b, 5, d, 0.89);
  const changes = [0, five, slam, sometimes, reasonable, saying];
  const last = changes.filter((c) => c <= frame).pop() ?? 0;
  const punch = interpolate(frame - last, [0, 3, 12], [1.09, 1.05, 1], clamp);
  const icons: Array<Parameters<typeof Bubble>[0]["icon"]> = ["dots", "x", "scribble", "micOff", "quote"];
  const tapeIn = ease(frame, slam, 10);
  const tapeOut = ease(frame, reasonable - 10, 12);
  const fiveP = pop(frame, five, 12) * (1 - ease(frame, sometimes, 10));
  const ring = interpolate(frame, [five, slam], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Cam keys={[0, 14, d]} scale={[1.6, 1.08, 1.0]} y={[160, 0, -10]}>
        <Backdrop plate={IMG("p1.jpg")} plateOpacity={0.45} />
      </Cam>
      <Cam keys={[0, 14, d]} scale={[1.9, 1.12, 1.03]} y={[260, 0, -20]} origin="50% 40%">
        <Orbit cx={540} cy={760} rx={520} ry={430} at={6} tilt={-18} arc={0.42} width={8} />
        <Orbit cx={540} cy={760} rx={600} ry={500} at={10} tilt={160} arc={0.3} width={5} speed={-0.7} opacity={0.8} />
        <AbsoluteFill style={{ scale: String(punch), transformOrigin: "50% 40%" }}>
          <Puppet
            x={540}
            y={1760}
            height={1300}
            pose={[
              [0, "chin", "desconfiado"],
              [five, "pointUp", "arregalado"],
              [slam, "open", "chocado"],
              [sometimes, "sheepish", "apreensivo"],
              [reasonable, "crossed", "ironico"],
              [saying, "chin", "pensativo"],
            ]}
          />
        </AbsoluteFill>
        {icons.map((ic, i) => {
          const ang = (([200, 160, 330, 15, 50][i] + frame * 0.35) * Math.PI) / 180;
          return (
            <Bubble
              key={ic}
              icon={ic}
              at={8 + i * 6}
              outAt={reasonable - 6}
              x={540 + Math.cos(ang) * 440}
              y={720 + Math.sin(ang) * 380}
              size={190}
              tail={Math.cos(ang) > 0 ? "left" : "right"}
            />
          );
        })}
      </Cam>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 230,
          width: 230,
          height: 230,
          scale: String(fiveP),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="230" height="230" viewBox="0 0 230 230" style={{ position: "absolute", inset: 0 }}>
          <circle cx="115" cy="115" r="100" fill={K.ink} stroke={K.paper} strokeWidth="10" />
          <circle cx="115" cy="115" r="78" fill="none" stroke={K.orange} strokeWidth="22" strokeDasharray={490} strokeDashoffset={490 * (1 - ring)} transform="rotate(-90 115 115)" />
        </svg>
        <span style={{ position: "relative", fontFamily: COND, fontWeight: 900, fontSize: 96, color: K.paper }}>5s</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: 1180,
          height: 190,
          background: K.ink,
          rotate: "-6deg",
          scale: `${tapeIn} 1`,
          translate: `${tapeOut * 1300}px 0`,
          transformOrigin: "left center",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: COND,
            fontWeight: 900,
            fontSize: 170,
            letterSpacing: 6,
            color: K.paper,
            opacity: ease(frame, slam + 4, 8),
            translate: `${(1 - ease(frame, slam + 4, 12)) * 200}px 0`,
          }}
        >
          AUTO<span style={{ color: K.orange }}>CENSURA</span>
        </div>
      </div>
      <Label text={"PROVAR QUE É\nRAZOÁVEL"} at={reasonable} x={330} y={300} rot={-4} size={88} from="left" />
      <Label text={"O QUE\nREALMENTE PENSA"} at={thinks} x={800} y={1230} rot={5} size={50} tone="orange" from="right" />
    </AbsoluteFill>
  );
};

// ── 2 · Excesso de cautela — frases em órbita ──────────────────────
const PHRASES = ["POSSO ESTAR\nERRADO, MAS…", "TALVEZ SEJA\nSÓ EU", "NÃO SEI SE\nFAZ SENTIDO", "TALVEZ", "DESCULPA", "SÓ ACHO\nQUE…", "É SÓ UMA\nIMPRESSÃO", "SE NÃO FOR\nINCÔMODO"];

const Approval: React.FC<{ at: number; out: number }> = ({ at: a, out }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, a, 12) * (1 - ease(frame, out, 10));
  const n = Math.round(interpolate(frame, [a, out], [0, 1240], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 230,
        top: 1150,
        width: 460,
        padding: "18px 0",
        borderRadius: 999,
        background: K.paper,
        boxShadow: "0 24px 50px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        scale: String(p),
      }}
    >
      <Icon name="like" size={74} color={K.orange} />
      <span style={{ fontFamily: COND, fontWeight: 900, fontSize: 84, color: K.ink, fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString("pt-BR")}</span>
      {[0, 1, 2].map((i) => {
        const hp = ease(frame, a + 10 + i * 9, 26);
        return (
          <div key={i} style={{ position: "absolute", right: 40 + i * 50, top: -10 - hp * 160, opacity: (1 - hp) * (frame > a + 10 + i * 9 ? 1 : 0) }}>
            <Icon name="like" size={48} color={K.orange} />
          </div>
        );
      })}
    </div>
  );
};

export const S2: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const reveal = at(b, 0, d, 0.55);
  return (
    <AbsoluteFill>
      <Backdrop plate={IMG("p2.jpg")} plateOpacity={0.3} />
      <Cam keys={[0, reveal, reveal + 30, d]} scale={[1.1, 1.05, 0.82, 0.78]} origin="50% 50%">
        <Orbit cx={540} cy={900} rx={470} ry={150} at={2} tilt={-8} arc={0.85} width={7} />
        <Orbit cx={540} cy={900} rx={620} ry={220} at={reveal} tilt={6} arc={0.6} width={5} speed={-1} />
        {PHRASES.map((t, i) => {
          const first = i < 4;
          const start = first ? at(b, i + 1, d, 0.06 + i * 0.1) : reveal + (i - 4) * 5;
          const ang = ((first ? i * 90 : 45 + (i - 4) * 90) * Math.PI) / 180 + frame * 0.012;
          const depth = (Math.sin(ang) + 1) / 2;
          const rx = first ? 330 : 400;
          const ry = first ? 520 : 760;
          return (
            <div key={t} style={{ position: "absolute", inset: 0, zIndex: depth > 0.5 ? 5 : 1 }}>
              <Label
                text={t}
                at={start}
                x={540 + Math.cos(ang) * rx}
                y={860 + Math.sin(ang) * ry}
                rot={((i * 37) % 14) - 7}
                size={(first ? 96 : 70) * (0.8 + depth * 0.35)}
                style={{ filter: `brightness(${0.65 + depth * 0.4})` }}
              />
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <Bubble icon="dots" at={2} x={540} y={860} size={340} bob={14} />
        </div>
      </Cam>
      <Label text="APROVAÇÃO" at={at(b, 5, d, 0.1)} outAt={at(b, 1, d, 0.3) - 12} x={540} y={420} rot={-3} size={150} tone="orange" />
      <Approval at={at(b, 5, d, 0.1) + 6} out={at(b, 1, d, 0.3) - 12} />
    </AbsoluteFill>
  );
};

// ── 3 · Reunião — hesitação ────────────────────────────────────────
export const S3: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const raise = at(b, 3, d, 0.3);
  const cuts = [0, Math.round(d * 0.33), Math.round(d * 0.66)];
  const seg = cuts.filter((c) => frame >= c).length - 1;
  const zoom = [1.0, 1.18, 1.32][seg] + interpolate(frame, [cuts[seg], cuts[seg] + 40], [0, 0.03], clamp);
  return (
    <AbsoluteFill>
      <Backdrop plate={IMG("p3.jpg")} plateOpacity={0.6} />
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "52% 38%" }}>
        <Puppet
          x={540}
          y={1620}
          height={1150}
          pose={[
            [0, "chin", "pensativo"],
            [at(b, 3, d, 0.3), "raise", "empolgado"],
            [at(b, 4, d, 0.45), "listen", "apreensivo"],
            [at(b, 1, d, 0.6), "talk", "falando"],
            [at(b, 2, d, 0.8), "shrug", "apreensivo"],
          ]}
        />
        {[0, 1, 2, 3].map((i) => {
          const p = pop(frame, raise + i * 2, 8);
          const ang = (-120 + i * 22) * (Math.PI / 180);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 820 + Math.cos(ang) * 150,
                top: 650 + Math.sin(ang) * 150,
                width: 14,
                height: 64 * p,
                background: K.orange,
                borderRadius: 7,
                rotate: `${(ang * 180) / Math.PI + 90}deg`,
                boxShadow: `0 0 14px ${K.orange}`,
                opacity: p,
              }}
            />
          );
        })}
        <Bubble icon="dots" at={raise + 10} x={220} y={540} size={170} tone="orange" />
      </AbsoluteFill>
      <Label text={"OPINIÃO\nDIFERENTE"} at={at(b, 3, d, 0.3)} x={760} y={330} rot={4} size={96} tone="orange" from="right" />
      <Label text={"ENTENDO O\nOUTRO LADO…"} at={at(b, 1, d, 0.6)} x={360} y={1140} rot={-3} size={80} from="left" />
      <Label text={"TALVEZ EU NÃO TENHA\nTODAS AS INFORMAÇÕES"} at={at(b, 2, d, 0.8)} x={600} y={1330} rot={2} size={64} from="right" />
    </AbsoluteFill>
  );
};

// ── 4 · Timeline da fala ───────────────────────────────────────────
export const S4: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const t0 = at(b, 0, d, 0.12);
  const t1 = at(b, 1, d, 0.62);
  const fillJ = interpolate(frame, [t0, t1 - 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fillO = ease(frame, t1, 10);
  const sweep = interpolate(frame, [0, d], [10, 330], clamp);
  const barW = 900;
  const jW = barW * 0.78;
  const icons: Array<Parameters<typeof Bubble>[0]["icon"]> = ["scribble", "question", "dots", "gear"];
  return (
    <AbsoluteFill>
      <Backdrop />
      <Kicker n={4} title="Timeline da fala" />
      <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: "absolute", left: 390, top: 360, opacity: ease(frame, 0, 12) }}>
        <rect x={130} y={8} width={40} height={30} rx={6} fill={K.paper} />
        <circle cx={150} cy={165} r={120} fill={K.ink} stroke={K.paper} strokeWidth={14} />
        <path
          d={`M150 165 L150 55 A110 110 0 ${sweep > 180 ? 1 : 0} 1 ${150 + 110 * Math.sin((sweep * Math.PI) / 180)} ${165 - 110 * Math.cos((sweep * Math.PI) / 180)} Z`}
          fill={K.orange}
        />
        <circle cx={150} cy={165} r={10} fill={K.paper} />
      </svg>
      {icons.map((ic, i) => (
        <Bubble key={ic} icon={ic} at={t0 + i * Math.round((t1 - t0) / 5)} x={160 + i * 175} y={820} size={150} />
      ))}
      <Bubble icon="bulb" at={t1} x={920} y={800} size={190} tone="orange" />
      <div style={{ position: "absolute", left: 90, top: 960, width: barW, height: 90 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: jW * fillJ,
            height: 90,
            borderRadius: 14,
            background: `repeating-linear-gradient(135deg, ${K.paperShade} 0 14px, ${K.mute} 14px 28px)`,
            backgroundPosition: `${frame * 2}px 0`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: jW + 18,
            top: 0,
            width: (barW - jW - 18) * fillO,
            height: 90,
            borderRadius: 14,
            background: K.orange,
            boxShadow: `0 0 40px ${K.orange}99`,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1080, width: jW, textAlign: "center", opacity: ease(frame, t0 + 10, 12) }}>
        <div style={{ height: 22, borderLeft: `4px solid ${K.paper}`, borderRight: `4px solid ${K.paper}`, borderBottom: `4px solid ${K.paper}`, borderRadius: "0 0 10px 10px" }} />
        <div style={{ fontFamily: COND, fontWeight: 800, fontSize: 64, color: K.paper, marginTop: 18, letterSpacing: 2 }}>JUSTIFICATIVAS</div>
        <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 38, color: K.mute, letterSpacing: 3 }}>(A MAIOR PARTE)</div>
      </div>
      <div style={{ position: "absolute", left: 90 + jW, top: 1100, width: barW - jW + 40, textAlign: "center", opacity: ease(frame, t1 + 4, 10) }}>
        <div style={{ fontFamily: COND, fontWeight: 900, fontSize: 56, color: K.orange }}>OPINIÃO</div>
        <div style={{ fontFamily: COND, fontWeight: 600, fontSize: 34, color: K.orangeHi }}>(RÁPIDA)</div>
      </div>
    </AbsoluteFill>
  );
};

// ── 5 · Opinião curta × desculpa longa (split diagonal) ────────────
export const S5: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const split = ease(frame, 0, 16);
  const swap = at(b, 0, d, 0.45);
  const focusTop = frame < swap;
  const zTop = focusTop ? 1.08 + frame * 0.0006 : 0.96;
  const zBot = focusTop ? 0.96 : 1.08 + (frame - swap) * 0.0006;
  const many = Array.from({ length: 9 });
  return (
    <AbsoluteFill style={{ background: K.bg0 }}>
      <AbsoluteFill style={{ clipPath: `polygon(0 0, 100% 0, 100% ${42 * split + 8}%, 0 ${54 * split}%)`, background: `linear-gradient(160deg, ${K.teal}, ${K.bg1})` }}>
        <AbsoluteFill style={{ scale: String(zTop), transformOrigin: "35% 30%" }}>
          <Puppet x={300} y={930} height={640} expr="empolgado" pose={[[0, "talk"], [40, "stop"]]} />
          <Bubble icon="dots" at={8} x={760} y={380} size={200} tone="orange" />
          <Label text={"A OPINIÃO\n5 SEGUNDOS"} at={10} x={760} y={680} rot={-4} size={74} tone="orange" from="right" />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(0 ${54 * split + 2}%, 100% ${42 * split + 10}%, 100% 100%, 0 100%)`, background: `linear-gradient(200deg, #5A6A70, #2B3940)` }}>
        <AbsoluteFill style={{ scale: String(zBot), transformOrigin: "60% 80%" }}>
          {many.map((_, i) => (
            <Bubble
              key={i}
              icon={i % 3 === 0 ? "dots" : "lines"}
              at={swap - 30 + i * 5}
              x={130 + ((i * 271) % 820)}
              y={1060 + ((i * 137) % 300)}
              size={130 + (i % 3) * 30}
              tail={i % 2 ? "left" : "right"}
            />
          ))}
          <Puppet x={780} y={1880} height={720} expr="apreensivo" pose={[[0, "idle"], [swap, "facepalm"]]} />
          <Label text={"A AUTORIZAÇÃO\n20 SEGUNDOS"} at={swap} x={330} y={1250} rot={3} size={74} from="left" />
        </AbsoluteFill>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 540 - 70,
          top: 920 - 70,
          width: 140,
          height: 140,
          borderRadius: 70,
          background: K.orange,
          scale: String(pop(frame, 14, 12)),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 50px ${K.orange}`,
        }}
      >
        <Icon name="x" size={90} accent={K.white} />
      </div>
    </AbsoluteFill>
  );
};

// ── 6 · Cena social — sorriso defensivo ────────────────────────────
export const S6: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const close = at(b, 0, d, 0.5);
  return (
    <AbsoluteFill>
      <Cam keys={[0, d]} scale={[1.05, 1.15]} x={[60, -60]}>
        <Backdrop plate={IMG("p6.jpg")} plateOpacity={0.75} glow={K.orange} />
      </Cam>
      <Cam keys={[0, close, close + 24, d]} scale={[1.0, 1.0, 1.32, 1.36]} x={[40, -20, 0, 0]} y={[0, 0, 90, 96]} origin="50% 46%">
        <Puppet x={540} y={1700} height={1000} pose={[[0, "listen", "sorriso"], [close, "sheepish"]]} />
        {[0, 1, 2].map((i) => {
          const p = pop(frame, close + 10 + i * 3, 8);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 760 + i * 26,
                top: 610 + i * 40,
                width: 56 * p,
                height: 12,
                borderRadius: 6,
                background: K.orange,
                rotate: `${-40 + i * 30}deg`,
                boxShadow: `0 0 12px ${K.orange}`,
              }}
            />
          );
        })}
      </Cam>
      <Label text={"SORRISO\nDEFENSIVO"} at={close + 20} x={540} y={330} rot={-5} size={104} from="left" />
    </AbsoluteFill>
  );
};

// ── 7 · Dizer "não" com justificativas ─────────────────────────────
export const S7: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const no = at(b, 0, d, 0.12);
  const cards = 6;
  const span = Math.max(8, Math.round((d - no - 40) / cards));
  const scroll = 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Label text={"NÃO É SÓ\nNO TRABALHO"} at={at(b, 1, d, 0.05)} outAt={no - 10} x={540} y={420} rot={-4} size={100} tone="orange" />
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 640,
          width: 520,
          textAlign: "center",
          fontFamily: COND,
          fontWeight: 900,
          fontSize: 300,
          lineHeight: 1,
          color: K.orange,
          textShadow: `0 0 60px ${K.orange}88`,
          scale: String(interpolate(frame, [no, no + 6, no + 12], [2.4, 0.92, 1], clamp) * (1 - 0.45 * interpolate(frame, [no + 30, d], [0, 1], clamp))),
          opacity: frame < no ? 0 : 1 - 0.55 * interpolate(frame, [no + 30, d], [0, 1], clamp),
          filter: `blur(${interpolate(frame, [no + 30, d], [0, 5], clamp)}px)`,
          rotate: `${interpolate(frame, [no + 30, d], [0, -8], clamp)}deg`,
        }}
      >
        NÃO
      </div>
      <div style={{ position: "absolute", left: 470, top: 280, width: 300, height: 220 }}>
        <Bubble icon="x" at={no} x={150} y={110} size={260} tone="orange" tail="left" />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, translate: `0 ${scroll}px` }}>
        {Array.from({ length: cards }).map((_, i) => {
          const a = no + 28 + i * span;
          const p = ease(frame, a, 14);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 70 + ((i * 97) % 260),
                top: 600 + i * 96,
                width: 560,
                height: 140,
                borderRadius: 28,
                background: `linear-gradient(170deg, ${K.paper}, ${K.paperShade})`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 30px",
                opacity: p,
                translate: `${(1 - p) * 300}px ${(1 - p) * -260}px`,
                rotate: `${(i % 2 ? -1 : 1) * (3 + i * 1.5) + (1 - p) * 20}deg`,
              }}
            >
              <div style={{ width: 66, height: 66, borderRadius: 12, border: `5px solid ${K.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={56} accent={K.ink} />
              </div>
              <div style={{ display: "grid", gap: 14, flex: 1 }}>
                <div style={{ height: 14, borderRadius: 7, background: K.ink, width: `${92 - (i % 3) * 10}%` }} />
                <div style={{ height: 14, borderRadius: 7, background: K.mute, width: `${70 - (i % 2) * 18}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 300,
          zIndex: 10,
          fontFamily: COND,
          fontWeight: 900,
          fontSize: 140,
          color: K.orange,
          opacity: ease(frame, no + 10 + span, 8),
          textShadow: `0 0 30px ${K.orange}88`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        +{Math.min(cards, Math.max(0, Math.floor((frame - no - 10) / span) + 1))}
      </div>
    </AbsoluteFill>
  );
};

// ── 8 · Controle de imagem — espelhos ──────────────────────────────
export const S8: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const icons: Array<Parameters<typeof Bubble>[0]["icon"]> = ["like", "group", "badge"];
  const arc = interpolate(frame, [0, d], [-22, 18], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const mult = ease(frame, at(b, 0, d, 0.65), 20);
  return (
    <AbsoluteFill>
      <Backdrop glow={K.orange} />
      <Kicker n={8} title="Como quero ser percebido" />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", rotate: `y ${arc}deg` }}>
          {[0, 1, 2].map((i) => {
            const p = ease(frame, 6 + i * 8, 18);
            const xs = [-300, 0, 300][i];
            const spread = 1 + mult * 0.06;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 540 + xs * spread - 140,
                  top: 470,
                  width: 280,
                  height: 760,
                  transform: `translateZ(${i === 1 ? -120 : 0}px) rotateY(${(i - 1) * -16}deg)`,
                  opacity: p,
                  translate: `0 ${(1 - p) * 120}px`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: "polygon(10% 0, 90% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)",
                    background: `linear-gradient(160deg, #42555E, #1A2930)`,
                    border: `6px solid ${K.paperShade}`,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
                    <div
                      style={{
                        fontFamily: COND,
                        fontWeight: 900,
                        fontSize: 64,
                        color: K.paper,
                        writingMode: "vertical-rl",
                        rotate: "180deg",
                        letterSpacing: 6,
                        opacity: ease(frame, 18 + i * 8, 14),
                      }}
                    >
                      {["SIMPÁTICO", "RAZOÁVEL", "EDUCADO"][i]}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <span key={k} style={{ fontSize: 40, color: K.orange, opacity: ease(frame, 30 + i * 8 + k * 4, 6), textShadow: `0 0 12px ${K.orange}` }}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(115deg, transparent ${30 + ((frame * 0.8 + i * 30) % 120) - 40}%, rgba(255,255,255,0.28) ${35 + ((frame * 0.8 + i * 30) % 120) - 40}%, transparent ${45 + ((frame * 0.8 + i * 30) % 120) - 40}%)`,
                    }}
                  />
                </div>
                <Bubble icon={icons[i]} at={20 + i * 8} x={250} y={90} size={150} />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>

      <Label text="NEGOCIAÇÃO" at={at(b, 1, d, 0.35)} x={540} y={330} rot={-3} size={90} tone="glass" />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1262,
          width: 900,
          padding: "22px 34px",
          borderRadius: 28,
          background: "rgba(10,20,26,0.82)",
          border: `2px solid ${K.teal}`,
          display: "grid",
          gap: 16,
          opacity: ease(frame, 12, 14),
          translate: `0 ${(1 - ease(frame, 12, 16)) * 80}px`,
        }}
      >
        {(
          [
            ["SIMPATIA", 0.35, 0.95],
            ["FIRMEZA", 0.8, 0.18],
            ["CONCORDAR", 0.3, 0.9],
          ] as const
        ).map(([label, a, z], i) => {
          const t = interpolate(frame, [20 + i * 10, d - 20], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const wob = Math.sin(frame / 7 + i) * 0.02;
          const v = a + (z - a) * t + wob;
          return (
            <div key={label} style={{ display: "grid", gridTemplateColumns: "230px 1fr", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: COND, fontWeight: 800, fontSize: 38, color: K.paper, letterSpacing: 2 }}>{label}</span>
              <div style={{ position: "relative", height: 14, borderRadius: 7, background: "#2B3C45" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v * 100}%`, borderRadius: 7, background: i === 1 ? K.mute : K.orange }} />
                <div style={{ position: "absolute", top: -13, left: `calc(${v * 100}% - 20px)`, width: 40, height: 40, borderRadius: 20, background: K.paper, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── 9 · Insight final — voz mais firme ─────────────────────────────
export const S9: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const breath = (Math.sin(frame / 26) + 1) / 2;
  const line = at(b, 0, d, 0.45);
  return (
    <AbsoluteFill>
      <Cam keys={[0, d]} scale={[1.0, 1.12]}>
        <Backdrop glow={K.orange} plate={IMG("p9.jpg")} plateOpacity={0.35} />
        <AbsoluteFill style={{ background: `radial-gradient(45% 30% at 50% 40%, ${K.orange}${Math.round(40 + breath * 30).toString(16)} 0%, transparent 70%)` }} />
        {[-1, 1].map((s) => (
          <svg key={s} width={300} height={700} viewBox="0 0 300 700" style={{ position: "absolute", left: s < 0 ? 150 : 630, top: 380, scale: `${s} 1` }}>
            <path
              d="M240 20 Q40 350 240 680"
              fill="none"
              stroke={K.orange}
              strokeWidth={12 + breath * 4}
              strokeLinecap="round"
              strokeDasharray={900}
              strokeDashoffset={900 * (1 - ease(frame, 10, 30))}
              style={{ filter: `drop-shadow(0 0 ${12 + breath * 14}px ${K.orange})` }}
            />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={150 - i * 10} y1={250 + i * 90} x2={20 - i * 10} y2={230 + i * 100} stroke={K.paper} strokeWidth={8} strokeLinecap="round" opacity={ease(frame, 30 + i * 4, 10)} />
            ))}
          </svg>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 730, height: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const firm = ease(frame, line, 24);
            const env = Math.exp(-(((i - 12) / 7) ** 2));
            const shaky = 26 + 46 * Math.abs(Math.sin(frame * 0.9 + i * 2.7) * Math.cos(frame * 0.37 + i * 1.3)) * env;
            const steady = 70 + 300 * env * (0.55 + 0.45 * Math.abs(Math.sin(frame * 0.18 + i * 0.42)));
            const h = shaky + (steady - shaky) * firm;
            return (
              <div
                key={i}
                style={{
                  width: 18,
                  height: h,
                  borderRadius: 9,
                  background: firm > 0.5 ? K.orange : K.mute,
                  opacity: 0.55 + 0.45 * firm,
                  boxShadow: firm > 0.5 ? `0 0 ${18 * firm}px ${K.orange}` : "none",
                }}
              />
            );
          })}
        </div>
      </Cam>
      {["EDUCADA", "RESPEITOSA", "EMPÁTICA"].map((w, i) => (
        <Label key={w} text={w} at={at(b, 1 + i, d, 0.7 + i * 0.04)} x={[270, 810, 540][i]} y={[1130, 1180, 1300][i]} rot={[-5, 4, -2][i]} size={84} tone="glass" />
      ))}
      <Label text={"SEM PEDIR DESCULPAS\nPOR EXISTIR"} at={at(b, 4, d, 0.9)} x={540} y={420} rot={-2} size={96} tone="orange" />
      {[["PRECISA", "1"], ["ACRESCENTA", "+7"]].map(([k, v], i) => (
        <div
          key={k}
          style={{
            position: "absolute",
            top: 1150,
            left: i ? 580 : 120,
            width: 380,
            padding: "18px 0",
            textAlign: "center",
            borderRadius: 20,
            background: i ? "rgba(242,107,58,0.25)" : "rgba(236,239,239,0.12)",
            border: `3px solid ${i ? K.orange : K.paper}`,
            fontFamily: COND,
            fontWeight: 800,
            fontSize: 44,
            color: K.paper,
            opacity: ease(frame, at(b, 5 + i, d, 0.3 + i * 0.1), 12) * (1 - ease(frame, at(b, 1, d, 0.7) - 14, 10)),
            scale: String(0.8 + 0.2 * ease(frame, at(b, 5 + i, d, 0.3 + i * 0.1), 12)),
          }}
        >
          {k} <span style={{ color: i ? K.orange : K.paper, fontWeight: 900, fontSize: 64 }}>{v}</span>
        </div>
      ))}
      <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", opacity: ease(frame, line, 20) * (1 - ease(frame, at(b, 4, d, 0.9) - 10, 10)) }}>
        <div style={{ fontFamily: COND, fontWeight: 900, fontSize: 120, color: K.paper, letterSpacing: 4, lineHeight: 1 }}>
          VOZ MAIS <span style={{ color: K.orange }}>FIRME</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── 10 · Gancho — o rótulo dos outros ──────────────────────────────
export const S10: React.FC<SceneProps> = ({ d, b }) => {
  const frame = useCurrentFrame();
  const labels = [
    { t: "ARROGANTE", x: 320, y: 470, r: -6 },
    { t: "DIFÍCIL", x: 780, y: 560, r: 5 },
    { t: "CHATO", x: 300, y: 760, r: 4 },
    { t: "EGOÍSTA", x: 760, y: 860, r: -5 },
  ];
  const q = at(b, 4, d, 0.72);
  const qp = pop(frame, q, 16);
  const push = interpolate(frame, [q, q + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Backdrop glow={K.orange} plate={IMG("p10.jpg")} plateOpacity={0.3} />
      <Cam keys={[0, q, d]} scale={[1.0, 1.1, 1.18]}>
        {labels.map((l, i) => (
          <Label
            key={l.t}
            text={l.t}
            at={at(b, i, d, 0.08 + i * 0.14)}
            x={540 + (l.x - 540) * (1 + push * 0.8)}
            y={700 + (l.y - 700) * (1 + push * 0.8)}
            rot={l.r}
            size={110}
            tone={i % 2 ? "orange" : "glass"}
            style={{ opacity: 1 - push * 0.7 }}
          />
        ))}
        <Puppet x={860} y={1470} height={640} pose={[[0, "chinL"], [q, "shrug"]]} />
      </Cam>
      <div
        style={{
          position: "absolute",
          left: 540 - 150,
          top: 1110,
          width: 300,
          height: 250,
          borderRadius: 18,
          border: `5px solid ${K.orangeHi}`,
          background: "rgba(242,107,58,0.22)",
          boxShadow: `0 0 ${40 + qp * 40}px ${K.orange}`,
          scale: String(qp * (1 + interpolate(frame, [q, d], [0, 0.35], clamp))),
          rotate: "-4deg",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: COND,
          fontWeight: 900,
          fontSize: 200,
          color: K.paper,
        }}
      >
        ?
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 330,
          width: "100%",
          textAlign: "center",
          fontFamily: COND,
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 70,
          letterSpacing: 6,
          color: K.orange,
          opacity: ease(frame, q + 24, 14),
        }}
      >
        CONTINUA…
      </div>
    </AbsoluteFill>
  );
};

export const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
