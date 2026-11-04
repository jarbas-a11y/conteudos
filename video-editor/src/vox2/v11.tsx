import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AlertTriangle, Brain, Check, Clock, Coins, Ear, Eye, Flame, Link2, Lock, MapPin, MessageSquare, Search, Shield, Sparkles, Star, ThumbsUp, X, Zap } from "lucide-react";
import tokens from "../../public/vox/captions/11.json";
import { Ctx, MID, SceneDef, TOP, VoxVideo } from "./engine";
import { Avatar, Bar, Bg, Bubble, Burst, Chip, Cursor, Gauge, Giant, Glass, Ico, Jarbas, Label, Neural, Orbit, Sfx, Stroke, Svg, Tile, Wave, Window, track } from "./kit";
import { DISPLAY, MONO, P, UI, clamp, ease, expo, pop, rnd } from "./theme";

/* 0 · Hook — Jarbas (moment 1) facing someone he disagrees with */
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const exp = cue("experimenta");
  const crack = interpolate(f, [0, 40], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Svg>
        {[0, 1, 2].map((i) => (
          <Stroke key={i} d={`M540 ${700 + i * 40} l -30 90 l 50 40 l -40 110 l 60 60 l -30 120`} at={2 + i * 3} dur={14} color={i ? P.lav : P.cyan} width={i ? 3 : 7} glow opacity={i ? 0.5 : 1} />
        ))}
      </Svg>
      <Jarbas x={300} y={1600} height={760} enter={-14} pose={[[0, "crossed", "apreensivo"], [32, "chin", "desconfiado"], [62, "shrug", "cetico"], [exp, "pointUp", "empolgado"]]} />
      <Avatar x={810} y={1400} s={2.1} at={-10} tone={P.lav} />
      <Bubble x={520} y={720} w={520} at={4} text="Tenho certeza que é assim." size={42} />
      <Chip x={86} y={760} at={12} text="…" tone="glass" size={40} />
      <Label x={60} y={1640} at={6} text={`opinião A ${crack > 0.5 ? "≠" : "="} opinião B`} w={960} align="center" color={P.lav} />
      <Burst x={540} y={980} at={exp} color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 1 · Pay attention to how you answer — composer under a scanner */
const Respond: React.FC<Ctx> = ({ d }) => {
  const f = useCurrentFrame();
  const scan = interpolate(f, [8, d], [0, 1], clamp);
  const typed = "Não, mas...".slice(0, Math.max(0, Math.floor((f - 10) / 3)));
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Glass x={90} y={900} w={900} h={170} r={85} at={0} from="zoom" glow={P.cyan}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 50px", gap: 26, fontFamily: UI, fontWeight: 600, fontSize: 52, color: P.white }}>
          <Ico I={MessageSquare} size={54} color={P.mute} />
          <span>{typed}<span style={{ color: P.cyan, opacity: f % 14 < 8 ? 1 : 0 }}>|</span></span>
        </div>
      </Glass>
      <div style={{ position: "absolute", left: 60, top: 820 + scan * 340, width: 960, height: 4, background: `linear-gradient(90deg, transparent, ${P.cyan}, transparent)`, boxShadow: `0 0 30px ${P.cyan}`, opacity: ease(f, 6, 6) }} />
      <Tile x={540} y={1300} s={0.8} at={8} I={Eye} tone="cyan" />
      <Label x={0} y={1440} w={1080} align="center" at={14} text="modo observação" color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 2 · A simple structure — three blocks assemble */
const Structure: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {[0, 1, 2].map((i) => {
        const at = 3 + i * 7;
        const p = expo(f, at, 14);
        return (
          <Glass key={i} x={170 + i * 30} y={760 + i * 230} w={740} h={190} at={at} from={i % 2 ? "right" : "left"} glow={i === 1 ? P.cyan : P.violet} tilt={[18 * (1 - p) + 8, -8]}>
            <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 44px", gap: 34 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 96, color: "transparent", WebkitTextStroke: `2.5px ${P.lav}` }}>0{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 22, width: `${[70, 82, 60][i] * ease(f, at + 10, 14)}%`, borderRadius: 11, background: `linear-gradient(90deg, ${P.violet}, ${P.cyan})` }} />
                <div style={{ height: 16, width: `${[45, 55, 38][i] * ease(f, at + 14, 14)}%`, borderRadius: 8, background: "rgba(255,255,255,0.12)", marginTop: 18 }} />
              </div>
            </div>
          </Glass>
        );
      })}
    </AbsoluteFill>
  );
};

/* 3 · Defend your opinion without a fight */
const Defend: React.FC<Ctx> = ({ cue }) => {
  const sem = cue("sem transformar");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Orbit x={330} y={1100} r={210} at={0} nodes={4} />
      <Tile x={330} y={1100} s={1.15} at={2} I={Shield} tone="cyan" />
      <Tile x={770} y={1100} s={1.15} at={sem} I={Flame} tone="danger" />
      <Svg>
        <Stroke d="M660 970 L880 1230" at={sem + 10} dur={8} color={P.white} width={14} />
        <Stroke d="M880 970 L660 1230" at={sem + 14} dur={8} color={P.white} width={14} />
      </Svg>
      <Sfx at={sem + 10} src="whip" volume={0.12} />
    </AbsoluteFill>
  );
};

/* 4 · Someone says something you disagree with — meeting window */
const Meeting: React.FC<Ctx> = ({ cue }) => {
  const nao = cue("nao concorda");
  const tiles: Array<[number, number, string, boolean]> = [
    [0, 0, P.lav, true],
    [1, 0, P.cyan, false],
    [0, 1, "#C4B8FF", false],
    [1, 1, P.violet, false],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Window x={70} y={640} w={940} h={900} at={0} title="reunião · 4 participantes" tilt={[6, 0]}>
        {tiles.map(([c, r, tone, speaking], i) => (
          <div key={i} style={{ position: "absolute", left: 26 + c * 450, top: 26 + r * 400, width: 432, height: 380, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: speaking ? `4px solid ${P.cyan}` : `1px solid rgba(255,255,255,0.08)`, boxShadow: speaking ? `0 0 40px ${P.cyan}66` : undefined, overflow: "hidden" }}>
            <Avatar x={216} y={250} s={1.05} at={4 + i * 3} tone={tone} />
            {speaking && <Wave x={130} y={300} w={170} h={50} at={6} bars={12} />}
            <div style={{ position: "absolute", left: 18, bottom: 16, fontFamily: UI, fontWeight: 600, fontSize: 22, color: P.white, padding: "6px 14px", background: "rgba(0,0,0,0.45)", borderRadius: 10 }}>{["Carla", "Você", "Rafa", "Léo"][i]}</div>
          </div>
        ))}
      </Window>
      <Bubble x={110} y={1470} w={620} at={8} text="O custo é o mais importante." size={36} name="Carla" />
      <Chip x={720} y={1010} at={nao} text="" icon={<Ico I={X} size={46} color={P.white} />} tone="danger" size={40} />
    </AbsoluteFill>
  );
};

/* 5 · "Se você já começa dizendo" — composer types the blunt answer */
const Blunt: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="dark" />
      <Bubble x={60} y={720} w={860} at={0} text="O custo é o mais importante." size={54} name="Carla" />
      <Bubble x={300} y={1040} w={720} at={4} me typing={[4, 200]} size={64} />
      <Cursor path={[[6, 900, 1600], [22, 860, 1300]]} clicks={[24]} />
      <div style={{ position: "absolute", left: 300, top: 1250, width: 640, textAlign: "right", fontFamily: UI, fontSize: 24, color: P.mute, opacity: ease(f, 10, 8) }}>digitando…</div>
    </AbsoluteFill>
  );
};

/* 6 · The quote lands — caption hidden, the bubble IS the text */
const Quote1: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const shake = f < 14 ? Math.sin(f * 2.4) * (14 - f) * 1.4 : 0;
  return (
    <AbsoluteFill style={{ translate: `${shake}px 0` }}>
      <Bg tone="dark" intensity={0.6} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${P.danger}33, transparent 60%)`, opacity: ease(f, 0, 6) }} />
      <div style={{ position: "absolute", left: 80, top: 760, width: 920, scale: String(pop(f, 0, 12)), transformOrigin: "100% 100%", padding: "56px 64px", borderRadius: "70px 70px 16px 70px", background: `linear-gradient(135deg, ${P.violet}, #4E33D8)`, boxShadow: `0 40px 100px ${P.violet}66`, fontFamily: DISPLAY, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -3, color: P.white }}>
        Não, você está <span style={{ color: P.danger }}>errado.</span>
      </div>
      <Burst x={900} y={760} at={4} color={P.danger} r={180} />
      <Label x={0} y={1210} w={1080} align="center" at={10} text="enviado · 18:42" />
    </AbsoluteFill>
  );
};

/* 7 · …interpreted as an attack */
const Attack: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const at = cue("como um ataque");
  const fly = expo(f, 2, 22);
  return (
    <AbsoluteFill>
      <Bg tone="dark" />
      <Avatar x={760} y={1300} s={1.9} at={-6} tone={P.lav} ring={at} />
      <div style={{ position: "absolute", left: 120 + fly * 360, top: 780 + fly * 160, scale: String(1 - fly * 0.55), padding: "30px 40px", borderRadius: "44px 44px 10px 44px", background: P.violet, fontFamily: UI, fontWeight: 700, fontSize: 44, color: P.white, opacity: 1 - ease(f, 26, 6) }}>Não, você está errado.</div>
      <Tile x={760} y={900} s={0.9} at={at} I={AlertTriangle} tone="danger" />
      <Burst x={760} y={900} at={at} color={P.danger} r={200} />
      <Sfx at={at} src="whip" volume={0.12} />
    </AbsoluteFill>
  );
};

/* 8 · Feeling threatened — brain heats up, threat gauge rises */
const Threat: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const am = cue("ameacada");
  const v = track(f, [[0, 0.15], [am - 6, 0.35], [am + 12, 0.9]]);
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Neural x={540} y={900} s={1.1} at={0} hot={f > am ? 1 : 0} />
      <Gauge x={540} y={1480} s={1.1} at={4} value={v} label="nível de ameaça" color={v > 0.6 ? P.danger : P.cyan} />
    </AbsoluteFill>
  );
};

/* 9 · Defend vs listen — icon bars, no repeated words */
const DefendListen: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const ouvir = cue("ouvir");
  const def = cue("se defender");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {[
        [Shield, def, 0.92, P.violet],
        [Ear, ouvir, 0.14, P.cyan],
      ].map(([I, at, v, c], i) => (
        <React.Fragment key={i}>
          <Tile x={190} y={860 + i * 380} s={0.9} at={(at as number) - 4} I={I as typeof Shield} tone={i ? "cyan" : "violet"} />
          <div style={{ position: "absolute", left: 330, top: 820 + i * 380, width: 660, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(v as number) * 100 * expo(f, at as number, 22)}%`, borderRadius: 40, background: `linear-gradient(90deg, ${P.violet}, ${c as string})`, boxShadow: `0 0 30px ${c as string}88` }} />
          </div>
          <div style={{ position: "absolute", left: 330, top: 920 + i * 380, fontFamily: DISPLAY, fontWeight: 800, fontSize: 90, color: c as string, opacity: ease(f, (at as number) + 6, 8) }}>{Math.round((v as number) * 100 * expo(f, at as number, 22))}%</div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

/* 10 · Lowering resistance — a wall of tiles dissolves */
const Wall: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const dim = cue("diminuir");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Avatar x={170} y={1400} s={1.3} at={0} tone={P.violet} />
      <Avatar x={910} y={1400} s={1.3} at={0} tone={P.lav} />
      {Array.from({ length: 24 }).map((_, i) => {
        const c = i % 4;
        const r = Math.floor(i / 4);
        const go = expo(f, dim + rnd(i) * 14, 18);
        const dx = (rnd(i + 7) - 0.5) * 900 * go;
        const dy = -go * (300 + rnd(i + 3) * 500);
        return <div key={i} style={{ position: "absolute", left: 390 + c * 78, top: 1030 + r * 78, width: 70, height: 70, borderRadius: 14, background: `linear-gradient(150deg, ${P.violet}cc, ${P.deep})`, border: `1.5px solid ${P.lav}66`, translate: `${dx}px ${dy}px`, rotate: `${go * (rnd(i) - 0.5) * 300}deg`, opacity: (1 - go) * pop(f, i * 0.6, 10) }} />;
      })}
      <Svg>
        <Stroke d="M290 1200 C 450 1120, 630 1120, 790 1200" at={dim + 18} dur={20} color={P.cyan} width={6} glow />
      </Svg>
    </AbsoluteFill>
  );
};

/* 11 · Step 01 */
const Step: React.FC<Ctx & { n: string; I: typeof Check; tone?: "violet" | "cyan" }> = ({ n, I, tone = "violet" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone={tone === "cyan" ? "cyan" : "violet"} />
      <Giant text={n} at={0} y={640} size={640} outline color={tone === "cyan" ? P.cyan : P.lav} />
      <Tile x={540} y={960} s={1.2} at={6} I={I} tone={tone} />
      <div style={{ position: "absolute", left: 340, top: 1340, display: "flex", gap: 24 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 110, height: 14, borderRadius: 7, background: i < Number(n) ? `linear-gradient(90deg, ${P.violet}, ${P.cyan})` : "rgba(255,255,255,0.1)", opacity: ease(f, 8 + i * 3, 8) }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
const Step1: React.FC<Ctx> = (c) => <Step {...c} n="01" I={Check} />;
const Step2: React.FC<Ctx> = (c) => <Step {...c} n="02" I={Eye} tone="cyan" />;

/* 12 · Chat: other's point, you start typing */
const ChatA: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Avatar x={150} y={790} s={0.55} at={0} tone={P.lav} />
    <Bubble x={230} y={700} w={800} at={2} text="O custo é o mais importante." size={52} name="Carla" />
    <Bubble x={340} y={1040} w={640} at={10} me typing={[10, 400]} size={40} />
  </AbsoluteFill>
);

/* 13 · Quote: "Entendi o que você quer dizer" (caption hidden) */
const Quote2: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Bubble x={230} y={640} w={700} at={-20} text="O custo é o mais importante." size={36} name="Carla" dim={0.4} />
      <div style={{ position: "absolute", left: 90, top: 860, width: 900, scale: String(pop(f, 0, 12)), transformOrigin: "100% 100%", padding: "50px 60px", borderRadius: "64px 64px 14px 64px", background: `linear-gradient(135deg, ${P.violet}, #4E33D8)`, boxShadow: `0 40px 100px ${P.violet}66`, fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: -3, color: P.white }}>
        Entendi o que você <span style={{ color: P.cyan }}>quer dizer.</span>
      </div>
      <Chip x={170} y={1290} at={18} text="" icon={<Ico I={ThumbsUp} size={44} color={P.night} />} tone="cyan" size={40} />
      <Sfx at={2} src="mouse-click" volume={0.15} />
    </AbsoluteFill>
  );
};

/* 15 · Quote: "Mas eu vejo isso de outra maneira" (caption hidden) */
const Quote3: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Bubble x={90} y={560} w={900} at={-20} me text="Entendi o que você quer dizer." size={40} dim={0.4} />
      <div style={{ position: "absolute", left: 90, top: 780, width: 900, scale: String(pop(f, 0, 12)), transformOrigin: "100% 100%", padding: "50px 60px", borderRadius: "64px 64px 14px 64px", background: `linear-gradient(135deg, ${P.violet}, #4E33D8)`, boxShadow: `0 40px 100px ${P.violet}66`, fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: -3, color: P.white }}>
        Mas eu vejo isso de <span style={{ color: P.cyan }}>outra maneira.</span>
      </div>
      <Sfx at={2} src="mouse-click" volume={0.15} />
    </AbsoluteFill>
  );
};

/* 16 · Step 03 — explain calmly: calm waveform + steady pulse */
const Calm: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const tq = cue("tranquilidade");
  const calm = interpolate(f, [tq - 10, tq + 10], [0, 0.75], clamp);
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Giant text="03" at={0} y={600} size={420} outline color={P.cyan} />
      <Wave x={140} y={1060} w={800} h={260} at={4} bars={40} calm={calm} />
      <Svg>
        <path d={`M100 1460 ${Array.from({ length: 30 }).map((_, i) => `L${100 + i * 30} ${1460 - (i % 6 === 3 ? 90 * (1 - calm) + 20 : 0)}`).join(" ")}`} fill="none" stroke={P.lav} strokeWidth={4} opacity={ease(f, 8, 8)} />
      </Svg>
      <Label x={0} y={1530} w={1080} align="center" at={tq} text="72 bpm · estável" color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 17 · "Por exemplo" */
const Example: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Tile x={540} y={1180} s={1} at={4} I={Sparkles} tone="violet" />
    <Orbit x={540} y={1180} r={240} at={0} nodes={3} speed={0.03} />
  </AbsoluteFill>
);

/* 18 · The full example as a 3-part formula (caption hidden) + cost vs deadline scale */
const Formula: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const a = 0;
  const b = cue("mas eu vejo diferente");
  const c = cue("porque");
  const prazo = cue("o prazo");
  const parts: Array<[string, number, string]> = [
    ["Entendi sua preocupação com o custo,", a, "reconhecer"],
    ["mas eu vejo diferente,", b, "perspectiva"],
    ["porque nesse caso o prazo é mais importante.", c, "motivo"],
  ];
  const tilt = interpolate(f, [prazo, prazo + 18], [0, -14], { ...clamp });
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {parts.map(([t, at, tag], i) => {
        const on = ease(f, at, 8);
        return (
          <div key={i} style={{ position: "absolute", left: 70, top: 300 + i * 250, width: 940, opacity: 0.25 + 0.75 * expo(f, at - 2, 10), translate: `${(1 - expo(f, at - 2, 12)) * 80}px 0` }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: i === 1 ? P.cyan : P.lav, marginBottom: 12 }}>0{i + 1} · {tag.toUpperCase()}</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -2, color: P.white, borderLeft: `6px solid ${on > 0.5 ? (i === 1 ? P.cyan : P.violet) : P.dim}`, paddingLeft: 28 }}>{t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540, top: 1330, rotate: `${tilt}deg`, opacity: ease(f, c, 8) }}>
        <div style={{ position: "absolute", left: -330, top: 0, width: 660, height: 10, borderRadius: 5, background: P.lav }} />
        <div style={{ position: "absolute", left: -380, top: -110, rotate: `${-tilt}deg` }}><Tile x={50} y={50} s={0.6} at={c} I={Coins} tone="glass" /></div>
        <div style={{ position: "absolute", left: 230, top: -110, rotate: `${-tilt}deg` }}><Tile x={50} y={50} s={0.6} at={prazo} I={Clock} tone="cyan" /></div>
      </div>
      <div style={{ position: "absolute", left: 510, top: 1340, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderBottom: `70px solid ${P.violet}`, opacity: ease(f, c, 8) }} />
    </AbsoluteFill>
  );
};

/* 19 · Percebe? — Jarbas (moment 2) + toggles: listened ON, agreed OFF */
const Notice: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const sem = cue("sem precisar");
  const toggles: Array<[typeof Ear, boolean, number]> = [
    [Ear, true, cue("voce reconhecer")],
    [ThumbsUp, false, sem],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Jarbas x={290} y={1560} height={600} pose={[[0, "pointR", "piscadinha"], [sem, "open", "sorriso"]]} />
      {toggles.map(([I, on, at], i) => {
        const k = ease(f, at + 6, 10);
        const val = on ? k : 0;
        return (
          <Glass key={i} x={560} y={760 + i * 260} w={440} h={200} at={at - 4} from="right">
            <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 36px", gap: 30 }}>
              <Ico I={I} size={70} color={on ? P.cyan : P.mute} />
              <div style={{ width: 170, height: 90, borderRadius: 45, background: val > 0.5 ? P.cyan : "rgba(255,255,255,0.12)", position: "relative" }}>
                <div style={{ position: "absolute", top: 9, left: 9 + val * 80, width: 72, height: 72, borderRadius: 36, background: P.white, boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }} />
              </div>
            </div>
          </Glass>
        );
      })}
    </AbsoluteFill>
  );
};

/* 20 · Another detail — magnifier sweep */
const Detail: React.FC<Ctx> = ({ d }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [4, d], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={120} y={760} w={840} h={560} at={0}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 50, top: 60 + i * 80, height: 22, width: `${[80, 64, 72, 50, 76, 40][i]}%`, borderRadius: 11, background: i === 5 ? P.cyan : "rgba(255,255,255,0.12)" }} />
        ))}
      </Glass>
      <div style={{ position: "absolute", left: 200 + t * 520, top: 820 + t * 360, translate: "-50% -50%", filter: `drop-shadow(0 0 30px ${P.cyan})` }}>
        <Ico I={Search} size={220} color={P.white} stroke={1.8} />
      </div>
    </AbsoluteFill>
  );
};

/* 21 · No need to convince at any cost — stuck progress, cancel */
const Convince: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const qq = cue("de qualquer jeito");
  const v = Math.min(0.99, 0.2 + f * 0.02);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Glass x={110} y={820} w={860} h={520} at={0} from="pop" strong>
        <div style={{ padding: "48px 54px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: UI, fontWeight: 700, fontSize: 38, color: P.white }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, border: `5px solid ${P.cyan}`, borderTopColor: "transparent", rotate: `${f * 14}deg` }} />
            Processando acordo…
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, color: P.white, marginTop: 20, letterSpacing: -5 }}>{Math.round(v * 100)}%</div>
          <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,0.08)", marginTop: 6 }}>
            <div style={{ height: 18, width: `${v * 100}%`, borderRadius: 9, background: `linear-gradient(90deg, ${P.violet}, ${P.cyan})` }} />
          </div>
        </div>
      </Glass>
      <Chip x={620} y={1390} at={qq - 10} text="Cancelar" tone="glass" size={38} />
      <Cursor path={[[qq - 14, 900, 1700], [qq, 760, 1420]]} clicks={[qq + 2]} />
      <Sfx at={qq + 2} src="mouse-click" volume={0.15} />
    </AbsoluteFill>
  );
};

/* 22 · Discomfort comes from needing approval — brain + pending approval */
const Approval: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const gar = cue("precisamos garantir");
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Neural x={540} y={820} s={0.8} at={0} hot={0} />
      <Glass x={110} y={1180} w={860} h={210} at={gar - 6} from="up">
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 40px" }}>
          <Avatar x={70} y={110} s={0.5} at={gar} tone={P.lav} />
          <div style={{ marginLeft: 110, flex: 1 }}>
            <div style={{ fontFamily: UI, fontWeight: 700, fontSize: 36, color: P.white }}>Aprovação pendente</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: P.mute, marginTop: 8 }}>aguardando resposta{".".repeat(1 + (Math.floor(f / 8) % 3))}</div>
          </div>
          <div style={{ width: 54, height: 54, borderRadius: 27, border: `6px solid ${P.lav}`, borderTopColor: "transparent", rotate: `${f * 12}deg` }} />
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 23 · Good argument, still someone who thinks differently */
const Different: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const enc = cue("encontrar alguem");
  const send = expo(f, 14, 20);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Glass x={100 + send * 120} y={760 - send * 40} w={520} h={230} at={0} from="left" glow={P.violet}>
        <div style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", gap: 10 }}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={50} color={P.cyan} fill={pop(f, 4 + i * 2, 8) > 0.5 ? P.cyan : "transparent"} />)}</div>
          <div style={{ height: 18, width: "80%", borderRadius: 9, background: "rgba(255,255,255,0.14)", marginTop: 30 }} />
          <div style={{ height: 18, width: "55%", borderRadius: 9, background: "rgba(255,255,255,0.1)", marginTop: 16 }} />
        </div>
      </Glass>
      <Avatar x={780} y={1440} s={1.7} at={enc - 8} tone={P.lav} />
      <svg width={300} height={300} style={{ position: "absolute", left: 640, top: 1000, scale: String(pop(f, enc + 4, 12)) }}>
        <polygon points="150,20 280,260 20,260" fill={`${P.cyan}33`} stroke={P.cyan} strokeWidth={8} />
      </svg>
      <svg width={220} height={220} style={{ position: "absolute", left: 200, top: 1150, scale: String(pop(f, enc + 8, 12)) }}>
        <circle cx={110} cy={110} r={90} fill={`${P.violet}33`} stroke={P.violet} strokeWidth={8} />
      </svg>
    </AbsoluteFill>
  );
};

/* 24 · A social skill — level-up card */
const Skill: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const xp = track(f, [[6, 0.1], [cue("parte dessa") - 4, 0.92]]);
  const lvl = xp > 0.9 ? 2 : 1;
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={140} y={760} w={800} h={700} at={0} from="zoom" glow={P.violet} strong>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
          <Tile x={0} y={0} s={1.1} at={4} I={MessageSquare} tone="cyan" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: P.lav }}>NÍVEL</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 170, color: P.white }}>0{lvl}</div>
        <Bar x={70} y={590} w={660} at={6} value={xp} color={P.cyan} h={30} />
      </Glass>
    </AbsoluteFill>
  );
};

/* 25 · Different opinions, link holds */
const Bond: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const am = cue("uma ameaca");
  const shake = f > am && f < am + 16 ? Math.sin(f * 3) * 8 : 0;
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Avatar x={250} y={1350} s={1.4} at={0} tone={P.violet} />
      <Avatar x={830} y={1350} s={1.4} at={2} tone={P.lav} />
      <svg width={160} height={160} style={{ position: "absolute", left: 170, top: 800, scale: String(pop(f, 6, 12)) }}><circle cx={80} cy={80} r={64} fill={`${P.violet}44`} stroke={P.violet} strokeWidth={8} /></svg>
      <svg width={160} height={160} style={{ position: "absolute", left: 750, top: 800, scale: String(pop(f, 10, 12)) }}><polygon points="80,10 150,140 10,140" fill={`${P.cyan}33`} stroke={P.cyan} strokeWidth={8} /></svg>
      <Svg style={{ translate: `0 ${shake}px` }}>
        <Stroke d="M330 1230 C 450 1150, 630 1150, 750 1230" at={8} dur={16} color={P.cyan} width={10} glow />
      </Svg>
      <div style={{ position: "absolute", left: 540, top: 1160, translate: "-50% -50%", scale: String(pop(f, 16, 12)) }}>
        <Ico I={Link2} size={80} color={P.white} />
      </div>
      <Tile x={540} y={960} s={0.6} at={am} I={Zap} tone="danger" out={am + 18} />
    </AbsoluteFill>
  );
};

/* 26 · The secret — lock */
const Secret: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Orbit x={540} y={1150} r={300} at={0} nodes={6} speed={0.02} />
    <Tile x={540} y={1150} s={1.4} at={4} I={Lock} tone="violet" />
  </AbsoluteFill>
);

/* 27 · Searching for the perfect words — word tiles shuffle */
const Words: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const set = ["então", "veja", "mas", "talvez", "porque", "assim", "claro", "olha", "certo"];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {[0, 1, 2].map((slot) => {
        const k = Math.floor(f / 3 + slot * 3) % set.length;
        return (
          <Glass key={slot} x={90 + slot * 310} y={1020} w={280} h={180} at={slot * 3} from="pop">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: slot === 1 ? P.cyan : P.white, filter: "blur(1.5px)" }}>{set[k]}</div>
          </Glass>
        );
      })}
      <Label x={0} y={1260} w={1080} align="center" at={6} text="buscando combinação…" />
    </AbsoluteFill>
  );
};

/* 28 · Payoff — standing your ground while the other disagrees */
const Payoff: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const nc = cue("ele nao concorda");
  const des = cue("desconfortavel");
  const pin = expo(f, 2, 18);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      {Array.from({ length: 10 }).map((_, i) => {
        const y = 900 + i * 60;
        const x = ((f * (14 + i * 3) + rnd(i) * 1080) % 1400) - 200;
        return <div key={i} style={{ position: "absolute", left: 1080 - x, top: y, width: 160 + rnd(i) * 120, height: 4, borderRadius: 2, background: `linear-gradient(90deg, transparent, ${P.lav}88)`, opacity: ease(f, nc, 10) * 0.8 }} />;
      })}
      <div style={{ position: "absolute", left: 300, top: 760 - (1 - pin) * 300, translate: "-50% 0", opacity: pin, filter: `drop-shadow(0 0 30px ${P.cyan})` }}>
        <MapPin size={170} color={P.cyan} fill={`${P.cyan}33`} strokeWidth={1.8} />
      </div>
      <Avatar x={300} y={1340} s={1.6} at={0} tone={P.violet} ring={4} />
      <Avatar x={820} y={1340} s={1.4} at={nc - 6} tone={P.lav} />
      <Chip x={720} y={930} at={nc} text="" icon={<Ico I={X} size={44} color={P.white} />} tone="danger" size={40} />
      <Glass x={110} y={1530} w={860} h={130} at={des - 6} from="up">
        <div style={{ display: "flex", alignItems: "center", gap: 24, height: "100%", padding: "0 40px", fontFamily: MONO, fontSize: 28, color: P.lav, letterSpacing: 3 }}>
          <Ico I={Brain} size={46} color={P.lav} />
          DESCONFORTO 38% · POSIÇÃO MANTIDA
          <Ico I={Check} size={46} color={P.cyan} />
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook, z: 1.0, cap: TOP },
  { at: "comece prestando", C: Respond, z: 1.08, cap: TOP, tr: "cut" },
  { at: "existe uma maneira", C: Structure, cap: TOP },
  { at: "defender sua opiniao", C: Defend, z: 1.35, cap: TOP, tr: "zoom" },
  { at: "imagina que alguem", C: Meeting, z: 1.0, cap: TOP },
  { at: "se voce ja comeca", C: Blunt, z: 1.05, cap: TOP, tr: "cut" },
  { at: "nao voce esta errado", C: Quote1, z: 1.0, cap: "hidden", tr: "flash" },
  { at: "dependendo do contexto", C: Attack, cap: TOP },
  { at: "e quando alguem sente", C: Threat, z: 1.2, cap: TOP, tr: "zoom" },
  { at: "e comum ficar", C: DefendListen, z: 1.08, cap: TOP },
  { at: "so que existe", C: Wall, z: 1.1, cap: TOP, tr: "flash" },
  { at: "primeiro reconheca", C: Step1, z: 1.2, cap: TOP, tr: "up" },
  { at: "pode ser algo", C: ChatA, z: 1.1, cap: TOP, tr: "cut" },
  { at: "entendi o que voce", C: Quote2, z: 1.0, cap: "hidden", tr: "cut" },
  { at: "depois apresente", C: Step2, z: 1.2, cap: TOP, tr: "up" },
  { at: "mas eu vejo isso", C: Quote3, z: 1.0, cap: "hidden", tr: "cut" },
  { at: "e ai explique", C: Calm, z: 1.1, cap: TOP, tr: "up" },
  { at: "por exemplo", C: Example, z: 1.35, cap: MID, tr: "zoom" },
  { at: "entendi sua preocupacao", C: Formula, z: 1.0, cap: "hidden", tr: "cut" },
  { at: "percebe", C: Notice, z: 1.0, cap: TOP, tr: "flash" },
  { at: "e tem outro detalhe", C: Detail, cap: TOP },
  { at: "nao precisa terminar", C: Convince, z: 1.1, cap: TOP, tr: "cut" },
  { at: "as vezes o desconforto", C: Approval, cap: TOP, tr: "zoom" },
  { at: "mas voce pode apresentar", C: Different, z: 1.08, cap: TOP },
  { at: "discordar e uma", C: Skill, cap: TOP, tr: "flash" },
  { at: "e parte dessa", C: Bond, z: 1.08, cap: TOP },
  { at: "no fim talvez", C: Secret, z: 1.3, cap: TOP, tr: "zoom" },
  { at: "encontrar as palavras", C: Words, z: 1.04, cap: TOP },
  { at: "mas em conseguir", C: Payoff, z: 1.04, cap: TOP, tr: "cut" },
];

export const V11_DURATION = 88.0 + 1.6;
export const Vox11: React.FC = () => (
  <VoxVideo
    audio="vox/audio/11.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V11_DURATION}
    emph={{
      discordar: "serif",
      responde: "box",
      simples: "serif",
      opiniao: "cyan",
      discussao: "strike",
      concorda: "strike",
      errado: "box",
      ataque: "box",
      ameacada: "serif",
      ouvir: "cyan",
      resistencia: "serif",
      reconheca: "box",
      perspectiva: "serif",
      tranquilidade: "serif",
      exemplo: "serif",
      percebe: "serif",
      concordar: "strike",
      detalhe: "serif",
      convencer: "box",
      aceite: "box",
      diferente: "serif",
      habilidade: "box",
      ameaca: "strike",
      relacionamento: "serif",
      segredo: "serif",
      palavras: "cyan",
      posicionar: "box",
      desconfortavel: "serif",
    }}
  />
);
