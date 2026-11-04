import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Brain, Eye, Hourglass, Lock, Send, Sparkles, Star, Type, XCircle } from "lucide-react";
import tokens from "../../public/vox/captions/14.json";
import { Ctx, SceneDef, TOP, VoxVideo } from "./engine";
import { Avatar, Bg, Bubble, Burst, Chip, Giant, Glass, Ico, Jarbas, Label, Neural, Orbit, Stroke, Svg, Tile, Window, track } from "./kit";
import { DISPLAY, MONO, P, SERIF, UI, ease, pop, rnd } from "./theme";

const CHAT = [
  ["Ana", "alguém viu o jogo ontem?"],
  ["Léo", "vi! que final"],
  ["Rafa", "e o restaurante novo?"],
  ["Ana", "fui sábado, muito bom"],
  ["Léo", "bora marcar então"],
  ["Rafa", "sexta?"],
  ["Ana", "fechado"],
  ["Léo", "quem mais vai?"],
];

/** Group chat that keeps flowing. */
const Flow: React.FC<{ x: number; y: number; w: number; h: number; at: number; speed?: number; out?: number }> = ({ x, y, w, h, at, speed = 0.06, out }) => {
  const f = useCurrentFrame();
  const n = Math.floor(Math.max(0, f - at) * speed);
  return (
    <Window x={x} y={y} w={w} h={h} at={at} out={out} title="grupo · 5 pessoas">
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, display: "flex", flexDirection: "column", gap: 14, padding: "0 24px" }}>
        {Array.from({ length: 5 }).map((_, k) => {
          const i = n + k;
          const [who, t] = CHAT[i % CHAT.length];
          return (
            <div key={i} style={{ alignSelf: "flex-start", padding: "16px 24px", borderRadius: "24px 24px 24px 6px", background: "rgba(36,52,112,0.95)", fontFamily: UI, fontSize: 32, color: P.white }}>
              <span style={{ color: [P.cyan, P.lav, "#FFC46B"][i % 3], fontWeight: 700, marginRight: 10 }}>{who}</span>
              {t}
            </div>
          );
        })}
      </div>
    </Window>
  );
};

/* 0 · Hook — Jarbas (moment 1) drafting and deleting */
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const certo = cue("jeito certo");
  const drafts = ["Eu acho que…", "Na verdade…", "Talvez seja…"];
  const cyc = 34;
  const k = Math.floor(f / cyc) % drafts.length;
  const t = f % cyc;
  const d = drafts[k];
  const shown = t < 18 ? d.slice(0, Math.floor(t / 1.4)) : d.slice(0, Math.max(0, d.length - Math.floor((t - 22) * 2.4)));
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Glass x={420} y={640} w={600} h={140} r={70} at={2} from="pop" glow={P.violet}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 36px", gap: 16, fontFamily: UI, fontWeight: 600, fontSize: 42, color: P.white }}>
          {shown}
          <span style={{ color: P.cyan, opacity: f % 14 < 8 ? 1 : 0 }}>|</span>
          <div style={{ marginLeft: "auto", width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico I={Send} size={38} color={P.dim} /></div>
        </div>
      </Glass>
      <Chip x={700} y={830} at={certo} text={`rascunho ${k + 1 + Math.floor(f / (cyc * 3)) * 3}`} tone="glass" size={30} />
      <Jarbas x={280} y={1640} height={760} enter={-14} pose={[[0, "chin", "pensativo"], [40, "type", "desconfiado"], [certo, "facepalm", "apreensivo"]]} />
    </AbsoluteFill>
  );
};

/* 1 · Word swap + tone slider, then the topic moves on */
const Revise: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const muda = cue("muda uma palavra");
  const tom = cue("o tom");
  const tone = track(f, [[tom, 0.2], [tom + 12, 0.8], [tom + 24, 0.4], [tom + 36, 0.6]]);
  const s = ease(f, muda + 4, 8);
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={90} y={700} w={900} h={300} at={0} strong>
        <div style={{ padding: "50px 54px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 70, color: P.white, letterSpacing: -2, lineHeight: 1.1 }}>
          Eu acho{" "}
          <span style={{ position: "relative", color: s > 0.5 ? P.dim : P.white }}>
            importante
            <span style={{ position: "absolute", left: -4, top: "55%", height: 7, width: `${s * 105}%`, background: P.danger, borderRadius: 4 }} />
          </span>{" "}
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: P.cyan, opacity: ease(f, muda + 12, 8) }}>relevante</span>
        </div>
      </Glass>
      <Glass x={90} y={1060} w={900} h={190} at={tom - 6}>
        <div style={{ padding: "36px 50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: P.mute }}><span>SUAVE</span><span>FIRME</span></div>
          <div style={{ marginTop: 22, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${P.cyan}, ${P.violet})`, position: "relative" }}>
            <div style={{ position: "absolute", left: `calc(${tone * 100}% - 26px)`, top: -19, width: 52, height: 52, borderRadius: 26, background: P.white, boxShadow: `0 0 20px ${P.lav}` }} />
          </div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 2 · Topic already changed — chat flows past */
const Moved: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="cyan" />
    <Flow x={90} y={620} w={900} h={860} at={0} speed={0.2} />
  </AbsoluteFill>
);

/* 3 · Demanding too much — requirement stack grows */
const Demand: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const n = Math.min(9, Math.floor(f / 4));
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 540 - 300 + rnd(i) * 60 - 30, top: 1500 - i * 92, width: 600, height: 80, borderRadius: 18, background: `linear-gradient(90deg, ${P.violet}${i > 6 ? "ff" : "aa"}, ${P.deep2})`, border: `1.5px solid ${P.lav}55`, rotate: `${(rnd(i + 4) - 0.5) * 8 + (i > 6 ? Math.sin(f) * 2 : 0)}deg`, scale: String(pop(f, i * 4, 10)) }} />
      ))}
    </AbsoluteFill>
  );
};

/* 4 · The checklist of requirements */
const Checklist: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const reqs: Array<[typeof Brain, string, number]> = [
    [Brain, "inteligente", cue("inteligente")],
    [Type, "bem escolhidas", cue("bem escolhidas")],
    [Eye, "zero mal-entendido", cue("interprete errado")],
    [Star, "todos curtirem", cue("interessante")],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Glass x={110} y={640} w={860} h={900} at={0} strong>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 5, color: P.mute, padding: "40px 50px 0" }}>ANTES DE FALAR, GARANTIR:</div>
        {reqs.map(([I, t, at], i) => {
          const c = ease(f, at + 6, 8);
          return (
            <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 130 + i * 185, display: "flex", alignItems: "center", gap: 30, opacity: 0.3 + 0.7 * ease(f, at - 4, 8) }}>
              <div style={{ width: 100, height: 100, borderRadius: 26, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico I={I} size={54} color={P.lav} /></div>
              <div style={{ flex: 1, fontFamily: UI, fontWeight: 700, fontSize: 42, color: P.white }}>{t}</div>
              <div style={{ width: 66, height: 66, borderRadius: 18, border: `4px solid ${c > 0.5 ? P.cyan : P.dim}`, background: c > 0.5 ? P.cyan : "transparent", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.2 * Math.sin(c * Math.PI)) }}>
                {c > 0.5 && <svg width={40} height={40} viewBox="0 0 24 24"><path d="M4 12 L10 18 L20 6" stroke={P.night} strokeWidth={4} fill="none" strokeLinecap="round" /></svg>}
              </div>
            </div>
          );
        })}
      </Glass>
    </AbsoluteFill>
  );
};

/* 5 · Perfection never reaches 100 */
const Perfect: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const v = 99 + Math.min(0.99, 1 - Math.exp(-f / 30)) * 0.99;
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Giant text={`${v.toFixed(1)}%`} at={0} y={900} size={250} />
      <Label x={0} y={1200} w={1080} align="center" at={6} text="perfeição carregando…" color={P.lav} />
    </AbsoluteFill>
  );
};

/* 6 · Real time — LIVE */
const Live: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 540, top: 1000, translate: "-50% -50%", scale: String(pop(f, 0, 12)), display: "flex", alignItems: "center", gap: 26, padding: "34px 60px", borderRadius: 999, background: P.danger, boxShadow: `0 0 80px ${P.danger}88`, fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, color: P.white, letterSpacing: 4, whiteSpace: "nowrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: P.white, opacity: f % 20 < 12 ? 1 : 0.3 }} />
        AO VIVO
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, height: 6, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ position: "absolute", left: `${(f * 1.5) % 100}%`, top: -12, width: 30, height: 30, borderRadius: 15, background: P.cyan, boxShadow: `0 0 20px ${P.cyan}` }} />
      </div>
    </AbsoluteFill>
  );
};

/* 7 · Version history v1..v5 while the group keeps talking */
const Versions: React.FC<Ctx> = ({ cue }) => {
  const q = cue("quinta versao");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Glass key={i} x={70 + i * 18} y={640 + i * 70} w={480} h={150} at={q - 24 + i * 5} from="left" style={{ zIndex: i }}>
          <div style={{ padding: "26px 30px" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: i === 4 ? P.cyan : P.mute }}>v{i + 1}{i === 4 ? " · atual" : ""}</div>
            <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.18)", marginTop: 16, width: `${50 + rnd(i) * 45}%` }} />
          </div>
        </Glass>
      ))}
      <Flow x={600} y={980} w={420} h={600} at={4} speed={0.15} />
    </AbsoluteFill>
  );
};

/* 8 · Perfectionism + fear of error and judgement */
const Judge: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const err = cue("errar");
  const av = cue("avaliado");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Neural x={540} y={860} s={0.9} at={0} hot={f > err ? 1 : 0} />
      <Tile x={300} y={1320} s={0.9} at={err} I={XCircle} tone="danger" />
      <Glass x={480} y={1240} w={480} h={170} at={av - 4} from="right">
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", height: "100%" }}>
          {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={58} color={i < 1 ? P.danger : P.dim} fill={i < 1 ? P.danger : "transparent"} />)}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 9 · Conditions to act — combination lock */
const Conditions: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Tile x={540} y={860} s={1.2} at={0} I={Lock} tone="violet" />
      <div style={{ position: "absolute", left: 200, top: 1080, display: "flex", gap: 30 }}>
        {[0, 1, 2].map((i) => {
          const spin = f * (0.7 + i * 0.3);
          return (
            <div key={i} style={{ width: 200, height: 260, borderRadius: 30, background: "linear-gradient(180deg, #0A1030, #1E2C66 50%, #0A1030)", border: `2px solid ${P.lav}55`, overflow: "hidden", position: "relative", scale: String(pop(f, 4 + i * 4, 12)) }}>
              {[-1, 0, 1].map((k) => {
                const v = Math.floor(spin / 6) + k;
                return <div key={k} style={{ position: "absolute", width: "100%", top: 90 + k * 90 - ((spin / 6) % 1) * 90, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 80, color: k === 0 ? P.white : P.dim }}>{((v % 10) + 10) % 10}</div>;
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 10 · The three self-rules (Jarbas moment 2, captions hidden — thoughts are the text) */
const Rules: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const r: Array<[string, number]> = [
    ["“Eu só vou falar quando tiver certeza.”", cue("eu so vou")],
    ["“Vou esperar encontrar uma maneira melhor.”", cue("vou esperar")],
    ["“Depois eu comento.”", cue("depois eu comento")],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {r.map(([t, at], i) => {
        const p = pop(f, at, 12);
        const active = i === r.filter(([, a]) => f >= a).length - 1;
        return (
          <div key={i} style={{ position: "absolute", left: 70 + i * 40, top: 360 + i * 230, width: 900 - i * 40, padding: "36px 46px", borderRadius: 50, background: active ? `linear-gradient(135deg, ${P.violet}, #4A30CF)` : "rgba(30,44,100,0.9)", border: `2px solid ${P.lav}55`, boxShadow: active ? `0 30px 80px ${P.violet}55` : undefined, scale: String(p), opacity: Math.min(1, p) * (active ? 1 : 0.6), transformOrigin: "0% 100%", fontFamily: SERIF, fontStyle: "italic", fontSize: 66, lineHeight: 1.05, color: P.white }}>
            {t}
          </div>
        );
      })}
      <Jarbas x={760} y={1660} height={640} flip pose={[[0, "chin", "pensativo"], [r[1][1], "crossed", "desconfiado"], [r[2][1], "shrug", "ironico"]]} />
    </AbsoluteFill>
  );
};

/* 11 · Waiting for ideal conditions — opportunities pass by */
const Pass: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const bem = cue("bem recebida");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Tile x={190} y={1080} s={1.35} at={0} I={Hourglass} tone="violet" />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 1100 - ((f * 9 + i * 230) % 1500);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 760 + (i % 3) * 210, width: 300, height: 170, borderRadius: 24, background: `linear-gradient(135deg, ${P.cyan}55, ${P.deep2})`, border: `2px solid ${P.cyan}88`, opacity: x < 330 ? Math.max(0, (x + 200) / 530) : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ico I={Sparkles} size={76} color={P.cyan} />
          </div>
        );
      })}
      <Bubble x={420} y={1420} w={560} at={bem - 6} me size={40} text="acho que…" />
      <Chip x={820} y={1580} at={bem + 6} text="♥ 4" tone="cyan" size={34} />
    </AbsoluteFill>
  );
};

/* 12 · The biggest trap */
const Trap: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="dark" />
    <Giant text="!" at={0} y={760} size={700} color={P.danger} />
    <Burst x={540} y={1100} at={6} color={P.danger} r={260} />
  </AbsoluteFill>
);

/* 13 · Avoiding judgement → out of the conversation */
const OutOfChat: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const abre = cue("abrindo mao");
  const dim = ease(f, abre, 14);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {[[300, 900, P.lav], [780, 900, P.cyan], [300, 1300, "#C4B8FF"], [780, 1300, P.violet]].map(([x, y, c], i) => (
        <Avatar key={i} x={x as number} y={y as number} s={1} at={i * 2} tone={c as string} />
      ))}
      <Avatar x={540} y={1100 + dim * 380} s={1.2} at={0} tone={P.violet} dim={dim} ring={4} />
      <Svg>
        {[[300, 900], [780, 900], [300, 1300], [780, 1300]].map(([x, y], i) => (
          <Stroke key={i} d={`M540 1060 L${x} ${y - 40}`} at={4 + i * 2} dur={10} color={P.cyan} width={4} opacity={1 - dim * 0.9} />
        ))}
      </Svg>
      <Chip x={540} y={1640} at={abre + 8} text="fora da conversa" tone="glass" size={32} center />
    </AbsoluteFill>
  );
};

/* 14 · Plan vs reality */
const Plan: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="cyan" />
    <Svg>
      <Stroke d="M120 900 L960 900" at={2} dur={14} color={P.lav} width={6} dash />
      <Stroke d="M120 1200 C 220 1080, 300 1330, 420 1180 S 600 1060, 680 1260 S 860 1150, 960 1200" at={10} dur={30} color={P.cyan} width={8} glow />
    </Svg>
    <Label x={120} y={840} at={4} text="planejado" color={P.lav} />
    <Label x={120} y={1300} at={14} text="real" color={P.cyan} />
  </AbsoluteFill>
);

/* 15 · The conversation keeps going */
const Going: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Flow x={90} y={620} w={900} h={900} at={0} speed={0.25} />
  </AbsoluteFill>
);

/* 16 · Payoff — the opinion stays in your head */
const Payoff: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const cab = cue("sua cabeca");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Avatar x={540} y={1450} s={2} at={0} tone={P.violet} />
      <Svg>
        {[0, 1, 2].map((i) => <circle key={i} cx={600 + i * 40} cy={1110 - i * 60} r={(14 + i * 8) * pop(f, 4 + i * 4, 10)} fill={P.lav} opacity={0.8} />)}
      </Svg>
      <Glass x={190} y={640} w={700} h={300} r={150} at={14} from="pop" glow={P.lav}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 18 }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 62, color: P.white }}>“eu acho que…”</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: P.mute }}><Ico I={Send} size={30} color={P.dim} /> NÃO ENVIADA</div>
        </div>
      </Glass>
      <Orbit x={540} y={790} r={420} at={cab} nodes={3} speed={0.02} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook, cap: TOP, z: 1.0 },
  { at: "voce pensa na frase", C: Revise, cap: TOP, z: 1.0, tr: "cut" },
  { at: "alguem ja mudou", C: Moved, cap: TOP, z: 1.0 },
  { at: "isso costuma", C: Demand, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "voce quer que", C: Checklist, cap: TOP, z: 1.0, tr: "cut" },
  { at: "so que existe", C: Perfect, cap: TOP, z: 1.0, tr: "flash" },
  { at: "uma conversa acontece", C: Live, cap: TOP, z: 1.0, tr: "cut" },
  { at: "enquanto voce", C: Versions, cap: TOP, z: 1.0 },
  { at: "e tem uma coisa", C: Judge, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "entao a pessoa", C: Conditions, cap: TOP, z: 1.0, tr: "up" },
  { at: "eu so vou", C: Rules, cap: "hidden", z: 1.0, tr: "flash" },
  { at: "o problema e que", C: Pass, cap: TOP, z: 1.0 },
  { at: "e talvez ai", C: Trap, cap: TOP, z: 1.0, tr: "flash" },
  { at: "voce tenta evitar", C: OutOfChat, cap: TOP, z: 1.0, tr: "cut" },
  { at: "no fim", C: Plan, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "porque enquanto", C: Going, cap: TOP, z: 1.0 },
  { at: "e a sua opiniao", C: Payoff, cap: TOP, z: 1.0, tr: "cut" },
];

export const V14_DURATION = 87.44 + 1.6;
export const Vox14: React.FC = () => (
  <VoxVideo
    audio="vox/audio/14.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V14_DURATION}
    emph={{
      opiniao: "cyan",
      certo: "serif",
      tom: "serif",
      assunto: "box",
      demais: "box",
      inteligente: "serif",
      interessante: "serif",
      perfeitamente: "serif",
      real: "box",
      quinta: "cyan",
      versao: "serif",
      perfeccionismo: "serif",
      avaliado: "box",
      condicoes: "box",
      ideais: "serif",
      oportunidades: "cyan",
      perfeita: "strike",
      armadilhas: "box",
      julgado: "serif",
      participar: "cyan",
      planejou: "serif",
      continua: "box",
      cabeca: "serif",
    }}
  />
);
