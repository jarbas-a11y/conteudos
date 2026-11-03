import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/3.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Draw, Figure, Headline, Jarbas, Sfx, Spot, Svg, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

const PATH = {
  A: "M200 1000 L200 1080 L120 1140 L280 1200 L120 1260 L280 1320 L200 1380 L200 1440",
  B: "M540 1000 L540 1120 L500 1120 L560 1180 L580 1060 L620 1240 L560 1240 L540 1300 L540 1440",
  C: "M880 1000 C 980 1060, 780 1120, 880 1180 C 980 1240, 780 1300, 880 1360 L880 1440",
};

const Stamp: React.FC<{ at: number; x: number; y: number; text?: string; rot?: number }> = ({ at, x, y, text = "TRAVEI", rot = -6 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [at, at + 5, at + 9], [2.2, 0.92, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${rot}deg`, scale: String(s), opacity: f >= at ? 1 : 0, padding: "6px 26px", border: `6px solid ${V.violet}`, color: V.violet, fontFamily: DISPLAY, fontWeight: 900, fontStretch: "120%", fontSize: 64, letterSpacing: 4, textShadow: `0 0 20px ${V.violet}88` }}>
      {text}
    </div>
  );
};

// 1 · Hook — two people freeze; same outside, different inside (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const trav = cue("travar");
  const fora = cue("por fora");
  const dentro = cue("por dentro");
  const dif = cue("diferente em cada");
  const lift = interpolate(f, [dentro, dentro + 26], [0, -330], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <AbsoluteFill style={{ translate: `0 ${lift}px` }}>
        <Jarbas x={270} y={1300} height={680} enter={-14} pose={[[0, "listen", "neutro"], [trav, "crossed", "apreensivo"]]} />
        <Jarbas x={810} y={1300} height={680} enter={-14} pose={[[0, "listen", "neutro"], [trav, "facepalm", "chocado"]]} />
        <Stamp at={trav} x={270} y={500} />
        <Stamp at={trav + 5} x={810} y={500} rot={5} />
        <Svg>
          <Draw d="M380 500 L700 500" at={fora} color={V.white} width={5} dash />
        </Svg>
        <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: V.white, opacity: ease(f, fora + 6, 10) }}>
          POR FORA: IGUAL
        </div>
        <Svg>
          <Draw d="M270 1330 C 270 1500, 160 1560, 210 1720 S 330 1900, 270 2000" at={dentro + 4} color={V.cyan} width={7} glow />
          <Draw d="M810 1330 L810 1440 L740 1500 L880 1580 L740 1660 L880 1740 L810 1800 L810 2000" at={dentro + 8} color={V.violet} width={7} glow />
        </Svg>
      </AbsoluteFill>
      <Headline text="mesmo *resultado.*" at={dentro + 10} y={1080} size={80} />
      <Headline text="motivos _diferentes._" at={dif} y={1200} size={80} />
      <Sfx at={trav} src="shutter-modern" volume={0.12} />
    </AbsoluteFill>
  );
};

const Label: React.FC<{ at: number; tag: string; text: string; color: string }> = ({ at, tag, text, color }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 12);
  return (
    <div style={{ position: "absolute", left: 80, top: 230, display: "flex", alignItems: "center", gap: 24, opacity: p, translate: `${(1 - p) * -50}px 0` }}>
      <div style={{ width: 110, height: 110, borderRadius: 30, background: color, color: V.navy0, fontFamily: DISPLAY, fontWeight: 900, fontSize: 74, display: "flex", alignItems: "center", justifyContent: "center" }}>{tag}</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 850, fontStretch: "112%", fontSize: 58, color: V.white, lineHeight: 1 }}>{text}</div>
    </div>
  );
};

// 2 · Person A — fear of getting it wrong: the line keeps being revised
const PersonA: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const start = cue("eu preciso falar");
  const drafts = ["Bom dia, então…", "Então, pessoal…", "Bom, eu acho que…"];
  const step = Math.max(0, Math.min(drafts.length - 1, Math.floor((f - start) / 18)));
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Label at={0} tag="A" text={"MEDO DE\nERRAR".replace("\n", " ")} color={V.cyan} />
        <Figure x={540} y={1180} s={1.6} at={0} tone={V.cyan} />
        <div style={{ position: "absolute", left: 150, top: 560, width: 780, padding: "28px 34px", borderRadius: 26, background: "rgba(14,26,70,0.9)", border: `2px solid ${V.line}`, fontFamily: SANS, fontWeight: 600, fontSize: 48, color: V.white, opacity: ease(f, start, 10) }}>
          {drafts.map((t, i) => (
            <div key={t} style={{ textDecoration: i < step ? "line-through" : "none", opacity: i < step ? 0.35 : i === step ? 1 : 0, height: i <= step ? "auto" : 0 }}>
              {t}
            </div>
          ))}
        </div>
        <Thought text="“Não posso errar.”" at={cue("nao posso parecer")} x={560} y={880} w={460} size={48} tail="left" />
      </Cam>
    </AbsoluteFill>
  );
};

// 3 · Person B — fighting the body
const PersonB: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const cor = cue("coracao acelerando");
  const ecg = Array.from({ length: 12 })
    .map((_, i) => `L${80 + i * 80} 640 L${100 + i * 80} 640 L${110 + i * 80} 560 L${125 + i * 80} 720 L${135 + i * 80} 640`)
    .join(" ");
  const pulse = 1 + 0.06 * Math.max(0, Math.sin(f * 0.55)) * ease(f, cor, 10);
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Label at={0} tag="B" text="MEDO DOS SINTOMAS" color={V.violet} />
        <Svg>
          <Draw d={`M80 640 ${ecg}`} at={cor} dur={40} color={V.violet} width={6} glow />
        </Svg>
        <div style={{ position: "absolute", inset: 0, scale: String(pulse), transformOrigin: "50% 62%" }}>
          <Figure x={540} y={1180} s={1.6} at={0} tone={V.violet} />
        </div>
        <Thought text="“Preciso me acalmar. Ninguém pode perceber.”" at={cue("preciso me acalmar")} x={120} y={820} w={840} size={46} />
      </Cam>
    </AbsoluteFill>
  );
};

// 4 · Person C — watching everyone's reaction
const PersonC: React.FC<Ctx> = ({ d, cue }) => {
  const an = cue("analisar tanto");
  const others: Array<[number, number]> = [
    [190, 760],
    [890, 760],
    [190, 1260],
    [890, 1260],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Label at={0} tag="C" text="JULGAMENTO" color={V.white} />
        <Figure x={540} y={1010} s={1.5} at={0} tone={V.white} />
        {others.map(([x, y], i) => (
          <React.Fragment key={i}>
            <Figure x={x} y={y} s={0.8} at={an + i * 4} tone={V.mute} />
            <Svg>
              <Draw d={`M540 900 L${x} ${y - 40}`} at={an + 6 + i * 4} color={V.white} width={4} dash opacity={0.8} />
            </Svg>
          </React.Fragment>
        ))}
        <Headline text="nem presta atenção no que *diz*" at={cue("nem consegue")} y={1380} size={60} weight={700} />
      </Cam>
    </AbsoluteFill>
  );
};

// 5 · Three paths, one outcome
const Paths: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const func = cue("funcoes diferentes");
  const end = cue("razoes diferentes");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="mesmo comportamento," at={cue("um mesmo comportamento")} y={200} size={64} />
        <Headline text="*funções* diferentes" at={func} y={300} size={64} />
        {(["A", "B", "C"] as const).map((k, i) => (
          <div key={k} style={{ position: "absolute", left: [200, 540, 880][i] - 55, top: 860, width: 110, height: 110, borderRadius: 30, background: [V.cyan, V.violet, V.white][i], color: V.navy0, fontFamily: DISPLAY, fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, 4 + i * 5, 12)) }}>
            {k}
          </div>
        ))}
        <Svg>
          <Draw d={PATH.A} at={10} dur={30} color={V.cyan} width={7} glow />
          <Draw d={PATH.B} at={14} dur={30} color={V.violet} width={7} glow />
          <Draw d={PATH.C} at={18} dur={30} color={V.white} width={7} glow />
          <Draw d="M200 1440 L540 1500 M880 1440 L540 1500 M540 1440 L540 1500" at={44} dur={14} color={V.white} width={5} />
        </Svg>
        <Card at={end} x={190} y={1500} w={700} tone="solid" from="pop" style={{ textAlign: "center", fontSize: 50 }}>
          DIFICULDADE PARA FALAR
        </Card>
      </Cam>
    </AbsoluteFill>
  );
};

// 6 · The same technique fits one path, not the others
const Technique: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const tec = cue("mesma tecnica");
  const aj = cue("ajuda uma pessoa");
  const nao = cue("nao fazer");
  const x = interpolate(f, [tec, aj], [-300, 200], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Svg>
          <path d={PATH.A} stroke={V.cyan} strokeWidth={7} fill="none" opacity={0.9} />
          <path d={PATH.B} stroke={V.violet} strokeWidth={7} fill="none" opacity={ease(f, nao, 10) > 0.5 ? 0.35 : 0.9} />
          <path d={PATH.C} stroke={V.white} strokeWidth={7} fill="none" opacity={ease(f, nao, 10) > 0.5 ? 0.35 : 0.9} />
        </Svg>
        <div style={{ position: "absolute", left: x - 120, top: 780, width: 240, padding: "18px 0", textAlign: "center", borderRadius: 999, background: V.cyan, color: V.navy0, fontFamily: DISPLAY, fontWeight: 900, fontSize: 40 }}>
          TÉCNICA
        </div>
        <div style={{ position: "absolute", left: 150, top: 1000, width: 100, height: 100, borderRadius: 50, background: V.cyan, color: V.navy0, fontSize: 64, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, aj + 4, 10)) }}>
          ✓
        </div>
        {[540, 880].map((cx, i) => (
          <div key={cx} style={{ position: "absolute", left: cx - 50, top: 1000, width: 100, height: 100, borderRadius: 50, border: `4px solid ${V.mute}`, color: V.mute, fontSize: 60, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, nao + 4 + i * 4, 10)) }}>
            ?
          </div>
        ))}
        <Headline text="a mesma *técnica*" at={tec} y={240} size={96} />
        <Headline text="não ajuda todo mundo" at={nao} y={380} size={64} weight={650} color={V.mute} />
      </Cam>
    </AbsoluteFill>
  );
};

// 7 · Respirar / ensaiar / se expor
const Advice: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const items: Array<[string, string]> = [
    ["respirar", "RESPIRAR"],
    ["ensaiar", "ENSAIAR"],
    ["se expor", "SE EXPOR"],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Headline text="mandar todo mundo…" at={0} y={260} size={78} weight={700} />
        {items.map(([c, t], i) => (
          <Card key={t} at={cue(c)} x={140 + i * 40} y={560 + i * 220} w={720} tone="cyan" from="right" style={{ fontSize: 72, textAlign: "center" }}>
            {t}
          </Card>
        ))}
        <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 42, color: V.mute, opacity: ease(f, cue("pode ate ajudar"), 10) }}>
          pode até ajudar alguém
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 8 · The real question (Jarbas, moment 2)
const Question: React.FC<Ctx> = ({ d, cue }) => {
  const q = cue("o que exatamente");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <AbsoluteFill style={{ opacity: 0.25 }}>
          <Svg>
            <path d={PATH.A} stroke={V.cyan} strokeWidth={7} fill="none" transform="translate(0 -200)" />
            <path d={PATH.B} stroke={V.violet} strokeWidth={7} fill="none" transform="translate(0 -200)" />
            <path d={PATH.C} stroke={V.white} strokeWidth={7} fill="none" transform="translate(0 -200)" />
          </Svg>
        </AbsoluteFill>
        <Spot x={540} y={1050} r={420} at={0} />
        <Jarbas x={540} y={1470} height={760} pose={[[0, "listen", "neutro"], [q, "chin", "pensativo"]]} />
        <Headline text="uma pergunta *mais* *importante*" at={cue("uma pergunta")} y={230} size={74} out={q - 4} />
        <Headline text="o que *exatamente* está acontecendo?" at={q} y={230} size={80} />
      </Cam>
    </AbsoluteFill>
  );
};

// 9 · Payoff — outside vs inside
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const fora = cue("por fora");
  const dentro = cue("por dentro");
  const pull = interpolate(f, [dentro, dentro + 40], [1.08, 0.94], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" dim={0.1} />
      <AbsoluteFill style={{ scale: String(pull) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 4, background: V.line, opacity: ease(f, fora, 12) }} />
        <div style={{ position: "absolute", left: 80, top: 250, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: V.mute, opacity: ease(f, 2, 10) }}>POR FORA</div>
        {[200, 540, 880].map((x, i) => (
          <React.Fragment key={x}>
            <Figure x={x} y={640} s={0.9} at={4 + i * 3} tone={V.mute} />
            <Stamp at={fora + 8 + i * 3} x={x} y={430} rot={i % 2 ? 4 : -4} />
          </React.Fragment>
        ))}
        <div style={{ position: "absolute", left: 80, top: 900, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: V.white, opacity: ease(f, dentro, 10) }}>POR DENTRO</div>
        <Svg>
          <g transform="translate(0 -60)">
            <Draw d={PATH.A} at={dentro + 4} color={V.cyan} width={7} glow />
            <Draw d={PATH.B} at={dentro + 8} color={V.violet} width={7} glow />
            <Draw d={PATH.C} at={dentro + 12} color={V.white} width={7} glow />
          </g>
        </Svg>
      </AbsoluteFill>
      <Sfx at={dentro} src="ding" volume={0.1} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "uma pessoa pode entrar", C: PersonA },
  { at: "outra ate sabe", C: PersonB },
  { at: "e uma terceira", C: PersonC },
  { at: "na psicologia", C: Paths },
  { at: "e e por isso que a mesma", C: Technique },
  { at: "mandar todo mundo respirar", C: Advice },
  { at: "mas antes disso", C: Question },
  { at: "porque os sintomas", C: Payoff },
];

export const V3_DURATION = 56.4 + 1.6;
export const Vox3: React.FC = () => (
  <VoxVideo
    audio="vox/audio/3.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V3_DURATION}
    keys={["travar", "fora", "dentro", "diferente", "incompetente", "coracao", "acelerando", "reacao", "funcoes", "diferentes", "tecnica", "respirar", "ensaiar", "expor", "exatamente", "sintomas"]}
  />
);
