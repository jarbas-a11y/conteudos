import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AlertTriangle, CalendarClock, Check, Flag, Frown, Gamepad2, HelpCircle, NotebookPen, Radar, X } from "lucide-react";
import tokens from "../../public/vox/captions/10.json";
import { Ctx, SceneDef, TOP, VoxVideo } from "./engine";
import { Avatar, Bar, Bg, Bubble, Burst, Chip, Gauge, Glass, Ico, Jarbas, Orbit, Stroke, Svg, Tile, track } from "./kit";
import { DISPLAY, MONO, P, ease, expo, pop, rnd } from "./theme";

const MiniChat: React.FC<{ x: number; y: number; w: number; f0?: number; s?: number }> = ({ x, y, w, f0 = 0, s = 1 }) => {
  const f = useCurrentFrame();
  const n = Math.floor(Math.max(0, f - f0) / 9);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: 10 * s }}>
      {Array.from({ length: 4 }).map((_, k) => {
        const i = n + k;
        const me = i % 2 === 0;
        return <div key={i} style={{ alignSelf: me ? "flex-end" : "flex-start", width: `${45 + rnd(i) * 40}%`, height: 34 * s, borderRadius: 17 * s, background: me ? P.violet : "rgba(255,255,255,0.18)" }} />;
      })}
    </div>
  );
};

/* 0 · Hook — Jarbas (moment 1) rehearsing in his head */
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const cab = cue("na cabeca");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Svg>
        {[0, 1, 2].map((i) => <circle key={i} cx={420 + i * 50} cy={1010 - i * 60} r={(12 + i * 8) * pop(f, 2 + i * 3, 10)} fill={P.lav} />)}
      </Svg>
      <Glass x={330} y={560} w={680} h={360} r={180} at={6} from="pop" glow={P.lav}>
        <MiniChat x={110} y={60} w={460} f0={10} />
      </Glass>
      <Chip x={720} y={520} at={cab} text="ensaio #7" tone="violet" size={30} />
      <Jarbas x={300} y={1640} height={740} enter={-14} pose={[[0, "chin", "pensativo"], [cab + 10, "talk", "falando"]]} />
    </AbsoluteFill>
  );
};

/* 1 · Fork: more prepared or more insecure */
const Fork: React.FC<Ctx> = ({ cue }) => {
  const prep = cue("preparado");
  const ins = cue("inseguro");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Svg>
        <Stroke d="M540 1640 L540 1260" at={2} dur={12} color={P.white} width={8} />
        <Stroke d="M540 1260 C 540 1100, 300 1060, 260 860" at={prep - 6} dur={14} color={P.cyan} width={8} glow />
        <Stroke d="M540 1260 C 540 1100, 780 1060, 820 860" at={ins - 6} dur={14} color={P.danger} width={8} glow />
      </Svg>
      <Tile x={260} y={760} s={0.9} at={prep} I={Check} tone="cyan" />
      <Tile x={820} y={760} s={0.9} at={ins} I={AlertTriangle} tone="danger" />
    </AbsoluteFill>
  );
};

/* 2 · The difficult conversation on the calendar */
const Calendar: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Glass x={110} y={760} w={860} h={420} at={0} from="zoom" strong glow={P.violet}>
      <div style={{ padding: "44px 50px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: P.cyan }}><Ico I={CalendarClock} size={40} color={P.cyan} /> HOJE · 14:00</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 70, color: P.white, marginTop: 24, letterSpacing: -2 }}>1:1 com a Marina</div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          <Chip x={0} y={0} at={10} text="assunto delicado" tone="danger" size={30} />
        </div>
      </div>
    </Glass>
  </AbsoluteFill>
);

/* 3 · Organising what you'll say — outline */
const Outline: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const steps = [cue("abordar"), cue("escolhe as palavras"), cue("organiza")];
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Glass x={110} y={680} w={860} h={760} at={0} strong>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "40px 50px 0", fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: P.mute }}><Ico I={NotebookPen} size={34} color={P.mute} /> ROTEIRO</div>
        {steps.map((at, i) => (
          <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 150 + i * 190, display: "flex", gap: 26, alignItems: "flex-start", opacity: ease(f, at - 2, 8), translate: `${(1 - expo(f, at - 2, 12)) * 60}px 0` }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, color: P.cyan }}>{i + 1}</div>
            <div style={{ flex: 1, paddingTop: 20 }}>
              <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.3)", width: `${[80, 65, 90][i]}%` }} />
              <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.12)", width: `${[55, 70, 45][i]}%`, marginTop: 16 }} />
            </div>
          </div>
        ))}
      </Glass>
    </AbsoluteFill>
  );
};

/* 4 · Preparation helps */
const Helps: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Tile x={540} y={960} s={1.3} at={0} I={Check} tone="cyan" />
      <Bar x={190} y={1250} w={700} at={6} value={track(f, [[6, 0.2], [30, 0.82]])} label="preparo" />
    </AbsoluteFill>
  );
};

/* 5 · Imagining the other person's reply */
const TheirReply: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Avatar x={200} y={1040} s={0.9} at={0} tone={P.lav} />
    <Bubble x={320} y={880} w={680} at={4} typing={[4, 9999]} size={64} name="Marina" />
  </AbsoluteFill>
);

/* 6 · Branching tree of what-ifs */
const Tree: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const base = 4;
  const marks = [cue("chateada"), cue("critica"), cue("interpretar")];
  const nodes: Array<[number, number, number, number]> = []; // x,y,parentIndex,at
  nodes.push([540, 1600, -1, base]);
  const levels = 4;
  for (let l = 1; l <= levels; l++) {
    const count = 2 ** l;
    for (let k = 0; k < count; k++) {
      const parent = 2 ** (l - 1) - 1 + Math.floor(k / 2);
      nodes.push([90 + ((k + 0.5) / count) * 900, 1600 - l * 230, parent, base + l * 14 + k * 2]);
    }
  }
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Svg>
        {nodes.map(([x, y, p, at], i) => (p >= 0 ? <Stroke key={i} d={`M${nodes[p][0]} ${nodes[p][1]} L${x} ${y}`} at={at - 6} dur={8} color={i > 14 ? P.danger : P.lav} width={3} opacity={0.8} /> : null))}
      </Svg>
      {nodes.map(([x, y, , at], i) => (
        <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, background: i > 14 ? P.danger : i > 6 ? P.lav : P.cyan, scale: String(pop(f, at, 8)), boxShadow: `0 0 16px ${i > 14 ? P.danger : P.cyan}` }} />
      ))}
      {[Frown, X, HelpCircle].map((I, i) => (
        <div key={i} style={{ position: "absolute", left: 200 + i * 300, top: 560, scale: String(pop(f, marks[i], 12)) }}><Tile x={50} y={50} s={0.6} at={marks[i]} I={I} tone="danger" /></div>
      ))}
    </AbsoluteFill>
  );
};

/* 7 · Five versions of a conversation that never happened */
const Five: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const c = cue("cinco versoes");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {[0, 1, 2, 3, 4].map((i) => {
        const p = expo(f, c - 10 + i * 4, 16);
        return (
          <Glass key={i} x={240 + (i - 2) * 90 * p} y={760 + (i - 2) * 50 * p} w={600} h={620} at={c - 10 + i * 4} from="pop" tilt={[0, (i - 2) * -8 * p]} style={{ zIndex: i }}>
            <div style={{ padding: 30, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: i === 4 ? P.cyan : P.mute }}>versão {i + 1}</div>
            <MiniChat x={40} y={110} w={520} f0={i * 7} />
          </Glass>
        );
      })}
    </AbsoluteFill>
  );
};

/* 8 · An important difference — split */
const Diff: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 538, top: 640, width: 4, height: 1000 * ease(f, 2, 14), background: `linear-gradient(180deg, ${P.cyan}, ${P.violet})`, boxShadow: `0 0 20px ${P.cyan}` }} />
      <Tile x={290} y={1140} s={1} at={8} I={NotebookPen} tone="cyan" />
      <Tile x={790} y={1140} s={1} at={12} I={Radar} tone="danger" />
    </AbsoluteFill>
  );
};

/* 9 · Rehearsing your message = organising ideas */
const Organize: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const t = expo(f, 6, 26);
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      {Array.from({ length: 12 }).map((_, i) => {
        const gx = 220 + (i % 4) * 180;
        const gy = 820 + Math.floor(i / 4) * 180;
        const rx = 100 + rnd(i) * 880;
        const ry = 700 + rnd(i + 20) * 900;
        return <div key={i} style={{ position: "absolute", left: rx + (gx - rx) * t, top: ry + (gy - ry) * t, width: 150, height: 150, borderRadius: 30, rotate: `${(1 - t) * (rnd(i + 5) - 0.5) * 120}deg`, background: `linear-gradient(140deg, ${i % 3 ? P.violet : P.cyan}cc, ${P.deep})`, border: `1.5px solid ${P.lav}66` }} />;
      })}
    </AbsoluteFill>
  );
};

/* 10 · Predicting every reaction — radar with blips + anticipatory worry */
const RadarScene: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const ant = cue("antecipatoria");
  return (
    <AbsoluteFill>
      <Bg tone="dark" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[1, 2, 3].map((r) => <circle key={r} cx={540} cy={1060} r={r * 130} fill="none" stroke={`${P.cyan}55`} strokeWidth={2} />)}
        <path d={`M540 1060 L${540 + Math.cos(f * 0.12) * 390} ${1060 + Math.sin(f * 0.12) * 390}`} stroke={P.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${P.cyan})` }} />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = rnd(i) * Math.PI * 2;
          const r = 80 + rnd(i + 3) * 300;
          return <circle key={i} cx={540 + Math.cos(a) * r} cy={1060 + Math.sin(a) * r} r={12 * pop(f, 6 + i * 3, 8)} fill={i % 3 ? P.danger : P.lav} />;
        })}
      </svg>
      <Gauge x={540} y={1650} s={0.7} at={ant - 10} value={track(f, [[ant - 10, 0.3], [ant + 12, 0.88]])} label="preocupação" color={P.danger} />
    </AbsoluteFill>
  );
};

/* 11 · Possibilities, many negative — cards flipping red */
const Cards: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const neg = cue("negativas");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {Array.from({ length: 9 }).map((_, i) => {
        const flip = ease(f, neg + i * 3, 10);
        const bad = i !== 4;
        const c = flip > 0.5 && bad ? P.danger : P.cyan;
        return (
          <div key={i} style={{ position: "absolute", left: 150 + (i % 3) * 270, top: 700 + Math.floor(i / 3) * 290, width: 240, height: 260, borderRadius: 26, background: `linear-gradient(150deg, ${c}55, ${P.deep})`, border: `2px solid ${c}`, transform: `perspective(800px) rotateY(${flip * 180}deg)`, scale: String(pop(f, i * 2, 10)), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `rotateY(${flip > 0.5 ? 180 : 0}deg)` }}>
              <Ico I={flip > 0.5 && bad ? AlertTriangle : HelpCircle} size={90} color={c} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 12 · More scenarios, more to control — control panel multiplying */
const Panel: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const n = Math.min(16, 2 + Math.floor(f / 4));
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Glass x={90} y={640} w={900} h={900} at={0} strong>
        {Array.from({ length: n }).map((_, i) => {
          const v = 0.5 + 0.45 * Math.sin(f * (0.08 + rnd(i) * 0.1) + i);
          return (
            <div key={i} style={{ position: "absolute", left: 40 + (i % 4) * 210, top: 40 + Math.floor(i / 4) * 210, width: 180, height: 180, borderRadius: 22, background: "rgba(255,255,255,0.05)", scale: String(pop(f, (i - 2) * 4, 10)) }}>
              <div style={{ position: "absolute", left: 80, top: 20, width: 20, height: 140, borderRadius: 10, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ position: "absolute", left: 66, top: 20 + (1 - v) * 110, width: 48, height: 30, borderRadius: 10, background: i % 3 ? P.lav : P.cyan }} />
            </div>
          );
        })}
      </Glass>
    </AbsoluteFill>
  );
};

/* 13 · Notice how you finish — finish flag */
const Finish: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Svg>
        <Stroke d="M80 1300 L1000 1300" at={2} dur={20} color={P.lav} width={6} dash />
      </Svg>
      <div style={{ position: "absolute", left: 760, top: 1000, scale: String(pop(f, 14, 12)), filter: `drop-shadow(0 0 30px ${P.cyan})` }}><Ico I={Flag} size={260} color={P.cyan} stroke={1.8} /></div>
      <div style={{ position: "absolute", left: 80 + expo(f, 2, 30) * 600, top: 1240, width: 60, height: 60, borderRadius: 30, background: P.white, boxShadow: `0 0 30px ${P.white}` }} />
    </AbsoluteFill>
  );
};

/* 14 · Jarbas (moment 2) — clarity or worry? */
const Choice: React.FC<Ctx> = ({ cue }) => {
  const a = cue("mais clareza");
  const b = cue("ainda mais preocupado");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Jarbas x={300} y={1660} height={700} pose={[[0, "chin", "pensativo"], [b, "shrug", "desconfiado"]]} />
      <Glass x={560} y={760} w={440} h={250} at={a} from="right" glow={P.cyan}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: DISPLAY, fontWeight: 800, fontSize: 90, color: P.cyan }}>A</div>
      </Glass>
      <Glass x={560} y={1060} w={440} h={250} at={b} from="right" glow={P.danger}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: DISPLAY, fontWeight: 800, fontSize: 90, color: P.danger }}>B</div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 15 · Collapse the branches into one message */
const Focus: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const msg = cue("sua mensagem");
  const t = expo(f, msg - 14, 20);
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 420 * (1 - t);
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 70, top: 1080 + Math.sin(a) * r - 40, width: 140, height: 80, borderRadius: 40, background: i % 2 ? `${P.lav}88` : `${P.danger}88`, opacity: 1 - t, scale: String(pop(f, i * 2, 10)) }} />;
      })}
      <div style={{ position: "absolute", left: 540, top: 1080, translate: "-50% -50%", scale: String(pop(f, msg, 14)), padding: "40px 60px", borderRadius: "50px 50px 12px 50px", background: `linear-gradient(135deg, ${P.violet}, #4A30CF)`, boxShadow: `0 30px 80px ${P.violet}66` }}>
        <div style={{ width: 380, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.6)" }} />
        <div style={{ width: 250, height: 26, borderRadius: 13, background: "rgba(255,255,255,0.35)", marginTop: 18 }} />
      </div>
      <Burst x={540} y={1080} at={msg} color={P.cyan} r={260} />
    </AbsoluteFill>
  );
};

/* 16 · Payoff — prepare vs control */
const Payoff: React.FC<Ctx> = ({ cue }) => {
  const ctrl = cue("tentar controlar");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Tile x={290} y={1000} s={1.15} at={2} I={NotebookPen} tone="cyan" />
      <Chip x={290} y={1210} at={10} text="" icon={<Ico I={Check} size={44} color={P.night} />} tone="cyan" size={36} center />
      <Tile x={790} y={1000} s={1.15} at={ctrl} I={Gamepad2} tone="danger" />
      <Chip x={790} y={1210} at={ctrl + 10} text="" icon={<Ico I={X} size={44} color={P.white} />} tone="danger" size={36} center />
      <Orbit x={290} y={1000} r={170} at={4} nodes={3} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook, cap: TOP, z: 1.0 },
  { at: "se sim", C: Fork, cap: TOP, z: 1.0, tr: "cut" },
  { at: "pensa numa conversa", C: Calendar, cap: TOP, z: 1.05 },
  { at: "voce comeca imaginando", C: Outline, cap: TOP, z: 1.0, tr: "cut" },
  { at: "ate ai", C: Helps, cap: TOP, z: 1.05, tr: "zoom" },
  { at: "so que em algum", C: TheirReply, cap: TOP, z: 1.0, tr: "cut" },
  { at: "ai prepara", C: Tree, cap: TOP, z: 1.0 },
  { at: "quando percebe", C: Five, cap: TOP, z: 1.0, tr: "flash" },
  { at: "e aqui tem", C: Diff, cap: TOP, z: 1.05, tr: "zoom" },
  { at: "quando voce ensaia", C: Organize, cap: TOP, z: 1.0 },
  { at: "mas quando comeca", C: RadarScene, cap: TOP, z: 1.0, tr: "cut" },
  { at: "seu pensamento", C: Cards, cap: TOP, z: 1.0 },
  { at: "e quanto mais", C: Panel, cap: TOP, z: 1.0, tr: "up" },
  { at: "por isso", C: Finish, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "voce esta com", C: Choice, cap: TOP, z: 1.0, tr: "flash" },
  { at: "se for a segunda", C: Focus, cap: TOP, z: 1.0 },
  { at: "porque se preparar", C: Payoff, cap: TOP, z: 1.05, tr: "cut" },
];

export const V10_DURATION = 98 + 1.6;
export const Vox10: React.FC = () => (
  <VoxVideo
    audio="vox/audio/10.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V10_DURATION}
    emph={{
      ensaia: "serif",
      preparado: "cyan",
      inseguro: "box",
      dificil: "serif",
      palavras: "serif",
      ajudar: "cyan",
      responder: "serif",
      chateada: "box",
      cinco: "cyan",
      versoes: "serif",
      diferenca: "box",
      organizando: "serif",
      antecipatoria: "box",
      negativas: "strike",
      controlar: "serif",
      termina: "box",
      clareza: "cyan",
      preocupado: "serif",
      mensagem: "box",
      aconteceu: "serif",
    }}
  />
);
