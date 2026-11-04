import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Award, Crown, Ear, Eye, HelpCircle, Mic } from "lucide-react";
import tokens from "../../public/vox/captions/8.json";
import { Ctx, SceneDef, TOP, VoxVideo } from "./engine";
import { Avatar, Bg, Bubble, Burst, Chip, Gauge, Glass, Ico, Jarbas, Label, Neural, Orbit, Stroke, Svg, Tile, Wave, Window, track } from "./kit";
import { DISPLAY, MONO, P, UI, clamp, expo, pop } from "./theme";

/* 0 · Hook — Jarbas (moment 1): voice waveform shrinks when someone arrives */
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const muda = cue("jeito de falar");
  const calm = interpolate(f, [muda - 10, muda + 14], [0, 0.85], clamp);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Wave x={110} y={700} w={860} h={240} at={0} bars={40} calm={calm} />
      <Label x={0} y={980} w={1080} align="center" at={4} text={calm > 0.5 ? "volume da voz · 18%" : "volume da voz · 92%"} color={calm > 0.5 ? P.danger : P.cyan} />
      <Jarbas x={300} y={1640} height={720} enter={-14} pose={[[0, "talk", "falando"], [muda, "crossed", "apreensivo"]]} />
      <Avatar x={820} y={1460} s={1.8} at={muda - 6} tone={P.lav} crown />
    </AbsoluteFill>
  );
};

/* 1 · Feeling evaluated though nobody intimidated */
const Evaluated: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const av = cue("avaliado");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Avatar x={540} y={1330} s={2.1} at={0} tone={P.violet} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2 + f * 0.01;
        return (
          <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 380 - 50, top: 1060 + Math.sin(a) * 300 - 50, scale: String(pop(f, av + i * 4, 12)) }}>
            <Ico I={Eye} size={100} color={P.cyan} />
          </div>
        );
      })}
      <Glass x={600} y={700} w={380} h={150} at={av + 10} from="pop">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 40, height: 40, borderRadius: 20, border: `4px solid ${P.lav}` }} />)}
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 2 · The meeting — someone important joins */
const Meeting: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const chega = cue("ate que chega");
  const tiles = [P.violet, P.lav, P.cyan, "#C4B8FF"];
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Window x={70} y={640} w={940} h={900} at={0} title="reunião de planejamento">
        {tiles.map((t, i) => (
          <div key={i} style={{ position: "absolute", left: 26 + (i % 2) * 450, top: 26 + Math.floor(i / 2) * 400, width: 432, height: 380, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: i === 0 && f < chega ? `4px solid ${P.cyan}` : `1px solid rgba(255,255,255,0.08)` }}>
            <Avatar x={216} y={250} s={1.05} at={4 + i * 3} tone={t} />
            {i === 0 && f < chega && <Wave x={130} y={300} w={170} h={50} at={6} bars={12} />}
          </div>
        ))}
      </Window>
      <Glass x={200} y={1540} w={680} h={130} at={chega} from="up" glow={P.cyan}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: "100%", padding: "0 34px", fontFamily: UI, fontWeight: 700, fontSize: 34, color: P.white }}>
          <Ico I={Crown} size={46} color={P.cyan} /> Diretor entrou na sala
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 3 · Boss, someone you admire, someone confident — three badges */
const WhoIs: React.FC<Ctx> = ({ cue }) => {
  const items: Array<[typeof Crown, number, "violet" | "cyan"]> = [
    [Crown, cue("seu chefe"), "violet"],
    [Award, cue("alguem que voce admira"), "cyan"],
    [Mic, cue("muita confianca"), "violet"],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {items.map(([I, at, tone], i) => (
        <Tile key={i} x={230 + i * 310} y={1080 + (i === 1 ? -80 : 0)} s={1.1} at={at} I={I} tone={tone} rot={(i - 1) * 6} />
      ))}
    </AbsoluteFill>
  );
};

/* 4 · Thinking twice — draft composer with hesitation */
const TwiceThink: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const bes = cue("besteira");
  const dv = cue("duvidas");
  const msg = "Eu acho que a gente devia";
  const t = f % 46;
  const shown = msg.slice(0, Math.max(0, t < 26 ? Math.floor(t * 1.1) : msg.length - Math.floor((t - 26) * 2.5)));
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={90} y={720} w={900} h={160} r={80} at={0} from="zoom">
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 44px", fontFamily: UI, fontWeight: 600, fontSize: 46, color: P.white }}>
          {shown}<span style={{ color: P.cyan, opacity: f % 14 < 8 ? 1 : 0 }}>|</span>
        </div>
      </Glass>
      <Gauge x={540} y={1360} s={1} at={bes - 10} value={track(f, [[bes - 10, 0.2], [dv + 10, 0.85]])} label="dúvida" color={P.lav} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 200 + i * 300, top: 980, scale: String(pop(f, dv + i * 5, 12)) }}>
          <Ico I={HelpCircle} size={110} color={P.lav} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* 5 · Even when you know more — knowledge bars */
const KnowMore: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const mais = cue("muito mais");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {[
        [P.violet, 0.9, "você"],
        [P.lav, 0.35, "ele"],
      ].map(([c, v, who], i) => (
        <React.Fragment key={i}>
          <Avatar x={180} y={900 + i * 330} s={0.8} at={i * 4} tone={c as string} crown={i === 1} />
          <div style={{ position: "absolute", left: 320, top: 860 + i * 330, width: 680, height: 90, borderRadius: 45, background: "rgba(255,255,255,0.06)" }}>
            <div style={{ height: "100%", width: `${(v as number) * 100 * expo(f, mais - 6 + i * 4, 18)}%`, borderRadius: 45, background: `linear-gradient(90deg, ${P.violet}, ${i ? P.lav : P.cyan})`, boxShadow: `0 0 30px ${P.cyan}55` }} />
          </div>
          <Label x={320} y={970 + i * 330} at={mais} text={`domínio do assunto · ${who as string}`} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

/* 6 · "Sabe por quê?" */
const Why: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Orbit x={540} y={1150} r={280} at={0} nodes={4} speed={0.04} />
    <Tile x={540} y={1150} s={1.3} at={2} I={HelpCircle} tone="cyan" />
  </AbsoluteFill>
);

/* 7 · Perceived position — pedestal vs ground */
const Pedestal: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const sup = cue("superioridade");
  const h = 380 * expo(f, sup - 20, 26);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 600, top: 1560 - h, width: 360, height: h, borderRadius: "18px 18px 0 0", background: `linear-gradient(180deg, ${P.lav}, ${P.violet} 30%, ${P.deep})`, boxShadow: `0 0 60px ${P.violet}66` }} />
      <Avatar x={780} y={1430 - h} s={1.3} at={4} tone={P.lav} crown />
      <Avatar x={300} y={1430} s={1.3} at={0} tone={P.violet} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1560, height: 4, background: P.dim }} />
    </AbsoluteFill>
  );
};

/* 8 · Opinion becomes a grade of your worth */
const Grade: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const val = cue("proprio valor");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Bubble x={90} y={700} w={760} at={2} size={46} text="Hmm, não sei se concordo." name="Diretor" />
      <Glass x={300} y={1040} w={480} h={420} at={val - 8} from="zoom" glow={P.danger} strong>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: P.mute }}>MEU VALOR</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 200, color: P.danger, lineHeight: 1 }}>{Math.round(interpolate(f, [val, val + 20], [10, 4], clamp))}</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: P.mute }}>/ 10</div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 9 · Attention split: topic vs impression */
const Split: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const imp = cue("impressao");
  const v = track(f, [[imp - 30, 0.85], [imp + 10, 0.3]]);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1130} r={300} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={70} />
        <circle cx={540} cy={1130} r={300} fill="none" stroke={P.cyan} strokeWidth={70} pathLength={1} strokeDasharray={`${v} 1`} transform="rotate(-90 540 1130)" style={{ filter: `drop-shadow(0 0 16px ${P.cyan})` }} />
        <circle cx={540} cy={1130} r={300} fill="none" stroke={P.danger} strokeWidth={70} pathLength={1} strokeDasharray={`${1 - v} 1`} strokeDashoffset={-v} transform="rotate(-90 540 1130)" />
      </svg>
      <div style={{ position: "absolute", left: 540, top: 1130, translate: "-50% -50%", textAlign: "center" }}>
        <Ico I={Eye} size={90} color={P.white} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 80, color: P.white }}>{Math.round(v * 100)}%</div>
      </div>
      <Label x={0} y={1500} w={1080} align="center" at={6} text="atenção no assunto" color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 10 · Attention you could use to think, listen, speak */
const Capacity: React.FC<Ctx> = ({ cue }) => {
  const items: Array<[typeof Ear, number]> = [
    [Eye, cue("pensar")],
    [Ear, cue("ouvir")],
    [Mic, cue("se expressar")],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Neural x={540} y={880} s={0.8} at={0} />
      {items.map(([I, at], i) => (
        <Tile key={i} x={230 + i * 310} y={1400} s={0.9} at={at} I={I} tone="cyan" dim={0.5} />
      ))}
    </AbsoluteFill>
  );
};

/* 11 · Jarbas (moment 2) — what if they had no title? */
const WhatIf: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const sem = cue("nao tivesse");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Jarbas x={300} y={1640} height={700} pose={[[0, "chin", "pensativo"], [sem + 20, "pointR", "ironico"]]} />
      <Avatar x={790} y={1400} s={1.6} at={0} tone={P.lav} crown={f < sem + 10} />
      <Chip x={680} y={950} at={4} text="Diretor" tone="violet" size={38} strike={sem + 10} />
      <Burst x={790} y={1090} at={sem + 10} color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 12 · Payoff — same capacity, different position */
const Payoff: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const pos = cue("a posicao");
  const lift = 300 * expo(f, pos, 26);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 120, top: 1560 - lift, width: 360, height: lift, borderRadius: "18px 18px 0 0", background: `linear-gradient(180deg, ${P.cyan}, ${P.violet} 40%, ${P.deep})` }} />
      <div style={{ position: "absolute", left: 600, top: 1260, width: 360, height: 300, borderRadius: "18px 18px 0 0", background: `linear-gradient(180deg, ${P.lav}, ${P.violet} 30%, ${P.deep})` }} />
      <Avatar x={300} y={1430 - lift} s={1.3} at={0} tone={P.violet} ring={pos + 10} />
      <Avatar x={780} y={1130} s={1.3} at={0} tone={P.lav} />
      <Svg>
        <Stroke d={`M300 ${1250 - lift} L780 950`} at={pos + 20} dur={14} color={P.cyan} width={4} dash />
      </Svg>
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook, cap: TOP, z: 1.0 },
  { at: "as vezes aquela pessoa", C: Evaluated, cap: TOP, z: 1.05 },
  { at: "imagina uma reuniao", C: Meeting, cap: TOP, z: 1.0, tr: "cut" },
  { at: "pode ser seu chefe", C: WhoIs, cap: TOP, z: 1.1 },
  { at: "de repente", C: TwiceThink, cap: TOP, z: 1.0, tr: "flash" },
  { at: "e o interessante", C: KnowMore, cap: TOP, z: 1.0 },
  { at: "sabe por que", C: Why, cap: TOP, z: 1.1, tr: "zoom" },
  { at: "porque a maneira", C: Pedestal, cap: TOP, z: 1.0, tr: "cut" },
  { at: "pode acabar tratando", C: Grade, cap: TOP, z: 1.0 },
  { at: "e ai a conversa", C: Split, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "o problema e que", C: Capacity, cap: TOP, z: 1.05 },
  { at: "agora pensa", C: WhatIf, cap: TOP, z: 1.0, tr: "flash" },
  { at: "talvez o que", C: Payoff, cap: TOP, z: 1.0, tr: "cut" },
];

export const V8_DURATION = 85 + 1.6;
export const Vox8: React.FC = () => (
  <VoxVideo
    audio="vox/audio/8.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V8_DURATION}
    emph={{
      muda: "serif",
      intimidar: "box",
      avaliado: "serif",
      importante: "box",
      admira: "serif",
      confianca: "cyan",
      besteira: "box",
      duvidas: "serif",
      conhece: "cyan",
      posicao: "serif",
      superioridade: "box",
      valor: "serif",
      figura: "box",
      impressao: "serif",
      atencao: "cyan",
      dificuldade: "serif",
      capacidade: "strike",
    }}
  />
);
