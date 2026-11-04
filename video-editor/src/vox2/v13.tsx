import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AlarmClock, CalendarDays, Check, ClipboardList, DoorOpen, Frown, Heart, KeyRound, Lock, Puzzle, RotateCcw, Shield, Swords, Users, Wrench } from "lucide-react";
import tokens from "../../public/vox/captions/13.json";
import { Ctx, SceneDef, TOP, VoxVideo } from "./engine";
import { Avatar, Bg, Bubble, Burst, Chip, Cursor, Giant, Glass, Ico, Jarbas, Label, Orbit, Sfx, Stroke, Svg, Tile, track } from "./kit";
import { DISPLAY, MONO, P, UI, clamp, ease, expo, pop, rnd } from "./theme";

const Notif: React.FC<{ x: number; y: number; w?: number; at: number; app: string; who: string; text: string; out?: number }> = ({ x, y, w = 900, at, app, who, text, out }) => (
  <Glass x={x} y={y} w={w} h={200} r={44} at={at} out={out} from="up" strong>
    <div style={{ display: "flex", gap: 26, alignItems: "center", height: "100%", padding: "0 34px" }}>
      <div style={{ width: 100, height: 100, borderRadius: 26, background: `linear-gradient(135deg, ${P.violet}, ${P.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, color: P.white }}>{who[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: UI, fontWeight: 600, fontSize: 24, color: P.mute, letterSpacing: 1 }}>
          <span>{app.toUpperCase()}</span>
          <span>agora</span>
        </div>
        <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 36, color: P.white, marginTop: 6 }}>{who}</div>
        <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 34, color: "#D5DAF2", marginTop: 2 }}>{text}</div>
      </div>
    </div>
  </Glass>
);

/* 0 · Hook — Jarbas (moment 1) buried under a growing justification */
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const cinco = cue("5 minutos");
  const lines = Math.floor(interpolate(f, [4, cinco + 20], [1, 14], clamp));
  const t = Math.floor(interpolate(f, [0, cinco + 20], [0, 300], clamp));
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 470, top: 640, width: 540, padding: "30px 36px", borderRadius: "40px 40px 10px 40px", background: `linear-gradient(160deg, ${P.violet}, #4E33D8)`, boxShadow: `0 30px 80px ${P.violet}55`, scale: String(pop(f, 0, 12)), transformOrigin: "0% 100%" }}>
        <div style={{ fontFamily: UI, fontWeight: 800, fontSize: 52, color: P.white }}>Não.</div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,0.35)", marginTop: 16, width: `${60 + rnd(i) * 40}%` }} />
        ))}
      </div>
      <Glass x={600} y={470} w={380} h={110} r={55} at={6} from="pop">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, height: "100%", fontFamily: MONO, fontWeight: 700, fontSize: 48, color: t > 200 ? P.danger : P.cyan }}>
          <Ico I={AlarmClock} size={48} color={t > 200 ? P.danger : P.cyan} />
          {String(Math.floor(t / 60)).padStart(2, "0")}:{String(t % 60).padStart(2, "0")}
        </div>
      </Glass>
      <Jarbas x={260} y={1640} height={760} enter={-14} pose={[[0, "talk", "falando"], [40, "open", "apreensivo"], [cinco, "sheepish", "chocado"]]} />
    </AbsoluteFill>
  );
};

/* 1 · Reasons pile up until an apology */
const Pile: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const det = cue("detalhes");
  const desc = cue("desculpas");
  const items: Array<[number, string]> = [ // [appear frame, kind]
    [2, "motivo"],
    [det - 6, "detalhe"],
    [det + 4, "detalhe"],
    [det + 12, "detalhe"],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {items.map(([at, t], i) => (
        <Bubble key={i} x={160 - i * 20} y={1300 - i * 170} w={880} at={at} me size={60} text={["porque…", "e também…", "aí…", "e ainda…"][i]} dim={f > desc ? 0.5 : 0} />
      ))}
      <Bubble x={100} y={600} w={920} at={desc} me size={76} text="…desculpa, tá?" />
      <Burst x={900} y={640} at={desc} color={P.cyan} />
    </AbsoluteFill>
  );
};

/* 2 · The invite + no energy */
const Invite: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const vont = cue("vontade");
  const lvl = track(f, [[vont - 10, 0.8], [vont + 14, 0.08]]);
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Notif x={90} y={700} at={0} app="Mensagens" who="Lu" text="Bora sair hoje à noite?" />
      <Glass x={330} y={1060} w={420} h={200} at={vont - 8} from="pop">
        <div style={{ display: "flex", alignItems: "center", gap: 20, height: "100%", padding: "0 40px" }}>
          <div style={{ width: 230, height: 100, borderRadius: 20, border: `5px solid ${P.white}`, padding: 8, position: "relative" }}>
            <div style={{ height: "100%", width: `${lvl * 100}%`, borderRadius: 10, background: lvl < 0.2 ? P.danger : P.cyan }} />
            <div style={{ position: "absolute", right: -20, top: 30, width: 12, height: 40, borderRadius: 4, background: P.white }} />
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: lvl < 0.2 ? P.danger : P.white }}>{Math.round(lvl * 100)}%</div>
        </div>
      </Glass>
      <Sfx at={2} src="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

/* 3 · The short answer gets skipped */
const Skip: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const comeca = cue("voce comeca");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Chip x={540} y={900} at={4} text="Obrigado! Hoje não vou." tone="cyan" size={52} center strike={comeca - 4} />
      <Glass x={90} y={1120} w={900} h={150} r={75} at={comeca - 2} from="up" glow={P.violet}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 44px", fontFamily: UI, fontWeight: 600, fontSize: 46, color: P.white }}>
          Então, é que<span style={{ color: P.cyan, opacity: f % 14 < 8 ? 1 : 0 }}>|</span>
        </div>
      </Glass>
      <Cursor path={[[6, 800, 1500], [comeca - 8, 520, 940]]} clicks={[]} />
    </AbsoluteFill>
  );
};

/* 4 · The long excuse (caption hidden — the bubble is the text) */
const Excuse: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const parts: Array<[string, number, typeof AlarmClock]> = [
    ["Então, é que essa semana foi meio corrida,", 0, CalendarDays],
    ["amanhã preciso acordar cedo,", cue("amanha"), AlarmClock],
    ["ainda tenho umas coisas pra resolver…", cue("ainda tem"), ClipboardList],
  ];
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <div style={{ position: "absolute", left: 70, top: 380, width: 940, padding: "50px 56px", borderRadius: "60px 60px 14px 60px", background: `linear-gradient(160deg, ${P.violet}, #4A30CF)`, boxShadow: `0 40px 100px ${P.violet}55`, scale: String(pop(f, 0, 12)), transformOrigin: "100% 100%" }}>
        {parts.map(([t, at], i) => (
          <div key={i} style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 70, lineHeight: 1.05, letterSpacing: -2, color: P.white, opacity: ease(f, at - 2, 6), translate: `0 ${(1 - expo(f, at - 2, 10)) * 30}px`, marginTop: i ? 18 : 0 }}>{t}</div>
        ))}
      </div>
      {parts.map(([, at, I], i) => (
        <Tile key={i} x={230 + i * 310} y={1420} s={0.85} at={at + 4} I={I} tone={i === 1 ? "cyan" : "violet"} rot={(i - 1) * 6} />
      ))}
    </AbsoluteFill>
  );
};

/* 5 · The reply that solves your "problem" (caption hidden while quoted) */
const Reply: React.FC<Ctx & { quote?: boolean }> = ({ quote }) => {
  const f = useCurrentFrame();
  const ah = quote ? 0 : 99999;
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Bubble x={300} y={430} w={720} at={-30} me size={36} text="…ainda tenho umas coisas pra resolver…" dim={0.5} />
      {!quote && <Bubble x={60} y={760} w={760} at={4} typing={[4, 9999]} size={56} name="Lu" />}
      {f >= ah && (
        <div style={{ position: "absolute", left: 60, top: 740, width: 960, padding: "50px 56px", borderRadius: "60px 60px 60px 14px", background: "rgba(36,52,112,0.97)", border: `2px solid ${P.cyan}66`, boxShadow: `0 40px 100px rgba(0,0,0,0.5)`, scale: String(pop(f, ah, 12)), transformOrigin: "0% 100%", fontFamily: DISPLAY, fontWeight: 800, fontSize: 84, lineHeight: 1.02, letterSpacing: -3, color: P.white }}>
          Ah, mas a gente pode ir <span style={{ color: P.cyan }}>mais cedo,</span> então!
        </div>
      )}
      <Tile x={860} y={1330} s={0.8} at={ah + 24} I={Check} tone="cyan" />
      <Sfx at={ah} src="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

/* 6 · Invent another reason — excuse slot machine */
const Slot: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  const set = ["dor de cabeça", "visita", "prazo", "cansaço", "chuva", "reunião", "cachorro"];
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={110} y={860} w={860} h={330} at={0} from="zoom" strong glow={P.violet}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {[-1, 0, 1].map((k) => {
            const spin = f < 30 ? f * 0.9 : 30 * 0.9 + (f - 30) * 0.05;
            const idx = Math.floor(spin) + k;
            const off = (spin % 1) * 110;
            return (
              <div key={k} style={{ position: "absolute", top: 110 + k * 110 - off, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 76, color: k === 0 ? P.white : P.dim, filter: f < 30 ? "blur(3px)" : undefined }}>{set[((idx % set.length) + set.length) % set.length]}</div>
            );
          })}
        </div>
      </Glass>
      <Label x={0} y={1240} w={1080} align="center" at={6} text="gerando desculpa nova…" color={P.lav} />
    </AbsoluteFill>
  );
};

/* 7 · "Percebe o que aconteceu?" — rewind */
const Rewind: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Orbit x={540} y={1150} r={260} at={0} nodes={5} speed={-0.06} />
      <div style={{ position: "absolute", left: 540, top: 1150, translate: "-50% -50%", rotate: `${-f * 8}deg`, filter: `drop-shadow(0 0 30px ${P.cyan})` }}>
        <Ico I={RotateCcw} size={200} color={P.cyan} stroke={2} />
      </div>
    </AbsoluteFill>
  );
};

/* 8 · Decision becomes a problem the other person fixes */
const Morph: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const prob = cue("um problema");
  const res = cue("tentou resolver");
  const m = ease(f, prob, 10);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <div style={{ position: "absolute", left: 540, top: 1050, translate: "-50% -50%", rotate: `${m * 180}deg`, scale: String(1 - Math.sin(m * Math.PI) * 0.3) }}>
        <Tile x={0} y={0} s={1.5} at={2} I={m < 0.5 ? Lock : Puzzle} tone={m < 0.5 ? "cyan" : "danger"} />
      </div>
      <Avatar x={860} y={1480} s={1.2} at={res - 10} tone={P.lav} />
      <div style={{ position: "absolute", left: 640 + (1 - expo(f, res, 16)) * 200, top: 1180, rotate: `${Math.sin(f * 0.5) * 20 * ease(f, res + 10, 6)}deg`, opacity: ease(f, res, 8), filter: `drop-shadow(0 0 20px ${P.cyan})` }}>
        <Ico I={Wrench} size={130} color={P.cyan} />
      </div>
    </AbsoluteFill>
  );
};

/* 9 · Need for approval — like meter */
const Approval: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const ap = cue("aprovacao");
  const n = Math.floor(interpolate(f, [ap - 6, ap + 30], [3, 99], clamp));
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={240} y={820} w={600} h={460} at={0} from="zoom" glow={P.danger} strong>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10 }}>
          <div style={{ scale: String(1 + 0.15 * Math.max(0, Math.sin(f * 0.4))), filter: `drop-shadow(0 0 30px ${P.danger})` }}>
            <Heart size={170} color={P.danger} fill={P.danger} />
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 110, color: P.white }}>{n}</div>
        </div>
      </Glass>
    </AbsoluteFill>
  );
};

/* 10 · Social beings — network where one link reddens */
const Social: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const des = cue("desagradar");
  const pts: Array<[number, number]> = [[540, 820], [260, 1000], [820, 1000], [330, 1330], [750, 1330], [540, 1150]];
  const links: Array<[number, number]> = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [0, 5], [1, 5], [2, 5]];
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Svg>
        {links.map(([a, b], i) => (
          <Stroke key={i} d={`M${pts[a][0]} ${pts[a][1]} L${pts[b][0]} ${pts[b][1]}`} at={2 + i * 2} dur={10} color={(a === 2 || b === 2) && f > des ? P.danger : P.lav} width={4} opacity={0.7} />
        ))}
      </Svg>
      {pts.map(([x, y], i) => (
        <Avatar key={i} x={x} y={y + 50} s={i === 5 ? 0.75 : 0.55} at={i * 2} tone={i === 5 ? P.violet : i === 2 && f > des ? P.danger : P.lav} ring={i === 5 ? 6 : undefined} />
      ))}
      <Burst x={820} y={980} at={des} color={P.danger} />
    </AbsoluteFill>
  );
};

/* 11 · Justify every choice — checklist with long annotations */
const Justify: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      <Glass x={100} y={700} w={880} h={760} at={0} strong>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 50, top: 50 + i * 175, right: 50, opacity: ease(f, 4 + i * 6, 8) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: P.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico I={Check} size={40} color={P.night} stroke={3} /></div>
              <div style={{ height: 22, width: 240, borderRadius: 11, background: "rgba(255,255,255,0.3)" }} />
            </div>
            {Array.from({ length: 3 }).map((_, k) => (
              <div key={k} style={{ marginLeft: 76, marginTop: 12, height: 12, borderRadius: 6, background: `${P.lav}55`, width: `${(85 - k * 12) * ease(f, 8 + i * 6 + k * 3, 10)}%` }} />
            ))}
          </div>
        ))}
      </Glass>
    </AbsoluteFill>
  );
};

/* 12 · Bullet-proof reason — shielded document */
const Bulletproof: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const ch = cue("chateado");
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Glass x={250} y={760} w={580} h={720} at={0} tilt={[8, -10]} strong>
        <div style={{ padding: 50 }}>
          {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.15)", marginTop: 26, width: `${55 + rnd(i) * 45}%` }} />)}
        </div>
      </Glass>
      <Tile x={780} y={1380} s={1} at={6} I={Shield} tone="cyan" />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 140 + i * 40, top: 1300 + i * 30, opacity: ease(f, ch + i * 4, 6) * (1 - ease(f, ch + i * 4 + 10, 6)), translate: `${ease(f, ch + i * 4, 10) * 300}px 0` }}>
          <Ico I={Frown} size={80} color={P.danger} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* 13 · The trap */
const Trap: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="dark" />
    <Giant text="!" at={0} y={760} size={700} color={P.danger} />
    <Burst x={540} y={1100} at={6} color={P.danger} r={260} />
  </AbsoluteFill>
);

/* 14 · More justifications → more room to negotiate */
const Negotiate: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const neg = cue("negociar");
  const k = interpolate(f, [4, neg + 20], [0.15, 1], clamp);
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={250} y={760} width={580} height={760} rx={24} fill="rgba(17,28,61,0.9)" stroke={P.lav} strokeWidth={4} />
        <path d={`M250 760 L${250 + 470 * (1 - k * 0.6)} ${780 + 60 * k} L${250 + 470 * (1 - k * 0.6)} ${1500 - 60 * k} L250 1520 Z`} fill={`url(#door)`} stroke={P.cyan} strokeWidth={4} />
        <defs>
          <linearGradient id="door" x1="0" x2="1"><stop offset="0" stopColor={P.violet} /><stop offset="1" stopColor={P.deep2} /></linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", left: 600, top: 1060, opacity: ease(f, neg, 8), filter: `drop-shadow(0 0 20px ${P.cyan})` }}><Ico I={DoorOpen} size={120} color={P.cyan} /></div>
      <Label x={0} y={1580} w={1080} align="center" at={4} text={`justificativas: ${Math.round(k * 9)}`} color={P.lav} />
    </AbsoluteFill>
  );
};

/* 15 · Personal decision becomes a debate — ping-pong bubbles */
const Debate: React.FC<Ctx> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Bg tone="violet" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Bubble key={i} x={i % 2 ? 380 : 70} y={760 + i * 150 - Math.max(0, f - 24) * 6} w={630} at={i * 7} me={i % 2 === 1} size={40} text={i % 2 ? "Mas é que…" : "Ah, mas…"} />
      ))}
      <Tile x={540} y={1160} s={0.8} at={20} I={Swords} tone="danger" />
    </AbsoluteFill>
  );
};

/* 16 · Not every choice needs a full defence */
const NoDefense: React.FC<Ctx> = ({ cue }) => {
  const mas = cue("mas nem toda");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Tile x={540} y={1100} s={1.4} at={2} I={Shield} tone="violet" out={mas + 20} />
      <Svg>
        <Stroke d="M330 890 L750 1310" at={mas + 4} dur={10} color={P.danger} width={14} glow />
      </Svg>
      <Tile x={540} y={1100} s={1.2} at={mas + 22} I={KeyRound} tone="cyan" />
      <Label x={0} y={1420} w={1080} align="center" at={mas + 26} text="sua escolha · sua chave" color={P.cyan} />
      <Sfx at={mas + 4} src="whip" volume={0.12} />
    </AbsoluteFill>
  );
};

/* 17 · Jarbas (moment 2) — the simple sentence (caption hidden on the quote) */
const Simple: React.FC<Ctx & { phase: 0 | 1 | 2 }> = ({ phase }) => {
  const f = useCurrentFrame();
  const ob = phase === 0 ? 99999 : phase === 1 ? 0 : -60;
  return (
    <AbsoluteFill>
      <Bg tone="cyan" />
      <Jarbas x={300} y={1640} height={720} pose={[[0, "listen", "pensativo"], [ob, "open", "sorriso"]]} />
      {f >= ob - 2 && (
        <div style={{ position: "absolute", left: 120, top: phase === 2 ? 640 : 420, width: 900, padding: "50px 56px", borderRadius: "60px 60px 14px 60px", background: `linear-gradient(160deg, ${P.violet}, #4A30CF)`, boxShadow: `0 40px 100px ${P.violet}55`, scale: String(pop(f, ob - 2, 12)), transformOrigin: "100% 100%", fontFamily: DISPLAY, fontWeight: 800, fontSize: 84, lineHeight: 1.02, letterSpacing: -3, color: P.white }}>
          Obrigado pelo convite, mas hoje <span style={{ color: P.cyan }}>não vou.</span>
        </div>
      )}
      <Chip x={620} y={1140} at={ob + 40} text="lido ✓✓" tone="glass" size={36} />
    </AbsoluteFill>
  );
};

/* 18 · The difficulty isn't saying no */
const Curious: React.FC<Ctx> = () => (
  <AbsoluteFill>
    <Bg tone="violet" />
    <Giant text="?" at={0} y={700} size={720} serif color={P.lav} />
  </AbsoluteFill>
);

/* 19 · Payoff — accept they may not like the answer */
const Payoff: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const gost = cue("goste");
  return (
    <AbsoluteFill>
      <Bg tone="both" />
      <Avatar x={300} y={1420} s={1.6} at={0} tone={P.violet} ring={6} />
      <Avatar x={800} y={1420} s={1.4} at={4} tone={P.lav} />
      <Bubble x={560} y={880} w={480} at={gost - 4} size={44} text="ah… ok" name="Lu" />
      <div style={{ position: "absolute", left: 870, top: 1080, scale: String(pop(f, gost + 6, 12)) }}><Ico I={Frown} size={90} color={P.lav} /></div>
      <div style={{ position: "absolute", left: 230, top: 1000, scale: String(pop(f, gost + 20, 12)), filter: `drop-shadow(0 0 20px ${P.cyan})` }}><Ico I={Users} size={130} color={P.cyan} /></div>
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook, cap: TOP, z: 1.0 },
  { at: "porque voce comeca", C: Pile, cap: TOP, z: 1.0, tr: "cut" },
  { at: "imagina que alguem", C: Invite, cap: TOP, z: 1.12 },
  { at: "em vez de simplesmente", C: Skip, cap: TOP, z: 1.08, tr: "cut" },
  { at: "entao e que", C: Excuse, cap: "hidden", z: 1.0, tr: "flash" },
  { at: "e a pessoa responde", C: Reply, cap: TOP, z: 1.0, tr: "cut" },
  { at: "ah mas", C: (c) => <Reply {...c} quote />, cap: "hidden", z: 1.0, tr: "cut" },
  { at: "ai voce precisa", C: Slot, cap: TOP, z: 1.12 },
  { at: "percebe o que", C: Rewind, cap: TOP, z: 1.2, tr: "zoom" },
  { at: "voce estava tentando", C: Morph, cap: TOP, z: 1.12 },
  { at: "e isso tem muito", C: Approval, cap: TOP, z: 1.12, tr: "flash" },
  { at: "como somos", C: Social, cap: TOP, z: 1.06 },
  { at: "e algumas pessoas", C: Justify, cap: TOP, z: 1.06, tr: "up" },
  { at: "e quase como", C: Bulletproof, cap: TOP, z: 1.06 },
  { at: "so que existe", C: Trap, cap: TOP, z: 1.05, tr: "flash" },
  { at: "quanto mais justificativas", C: Negotiate, cap: TOP, z: 1.06, tr: "zoom" },
  { at: "e sem perceber", C: Debate, cap: TOP, z: 1.0 },
  { at: "claro que existem", C: NoDefense, cap: TOP, z: 1.2, tr: "cut" },
  { at: "as vezes um simples", C: (c) => <Simple {...c} phase={0} />, cap: TOP, z: 1.0, tr: "flash" },
  { at: "obrigado pelo convite", C: (c) => <Simple {...c} phase={1} />, cap: "hidden", z: 1.0, tr: "cut" },
  { at: "comunica exatamente", C: (c) => <Simple {...c} phase={2} />, cap: TOP, z: 1.0, tr: "cut" },
  { at: "o curioso", C: Curious, cap: TOP, z: 1.0, tr: "zoom" },
  { at: "esta em aceitar", C: Payoff, cap: TOP, z: 1.06, tr: "cut" },
];

export const V13_DURATION = 86.4 + 1.6;
export const Vox13: React.FC = () => (
  <VoxVideo
    audio="vox/audio/13.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V13_DURATION}
    emph={{
      simples: "serif",
      justificativa: "box",
      "5": "cyan",
      desculpas: "serif",
      decisao: "box",
      vontade: "serif",
      simplesmente: "cyan",
      inventar: "serif",
      percebe: "serif",
      problema: "strike",
      resolver: "cyan",
      aprovacao: "serif",
      sociais: "cyan",
      desagradar: "box",
      escolha: "serif",
      convincente: "serif",
      chateado: "box",
      armadilha: "box",
      negociar: "cyan",
      debate: "box",
      defesa: "strike",
      curioso: "serif",
      aceitar: "serif",
      goste: "box",
    }}
  />
);
