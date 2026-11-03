import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/4.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Chat, Draw, Headline, ItemNumber, Jarbas, Sfx, Spot, Svg, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

// 0 · Hook — "pra mim tanto faz" while wanting something (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const tf = cue("tanto faz");
  const q = cue("mesmo querendo");
  const five = q + 32;
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <div style={{ position: "absolute", left: 90, top: 200, width: 900, height: 760, borderRadius: 40, background: "rgba(10,20,56,0.85)", border: `2px solid ${V.line}` }} />
      <Chat text="Onde você quer ir?" at={0} x={140} y={260} />
      <Thought text="eu queria outro lugar…" at={q - 10} out={five} x={430} y={420} w={520} size={42} tail="right" />
      <Chat text="Pra mim tanto faz." at={tf} me x={470} y={620} />
      <Spot x={300} y={1230} r={360} at={0} />
      <Jarbas
        x={300}
        y={1480}
        height={560}
        enter={-14}
        pose={[
          [0, "type", "neutro"],
          [tf, "type", "sorriso"],
          [q, "chin", "pensativo"],
        ]}
      />
      <Headline text="5 motivos por *trás* disso" at={five} x={480} w={560} align="left" y={1060} size={68} />
      <Sfx at={tf} src="mouse-click" volume={0.2} />
    </AbsoluteFill>
  );
};

// Shared item frame.
const Item: React.FC<{ n: number; title: string; d: number; children: React.ReactNode; glow?: "cyan" | "violet" | "both" }> = ({ n, title, d, children, glow = "both" }) => (
  <AbsoluteFill>
    <Bg glow={glow} />
    <Cam d={d}>
      <ItemNumber n={n} at={0} y={170} />
      <Headline text={title} at={6} y={420} x={80} w={920} align="left" size={66} stagger={2} />
      {children}
    </Cam>
  </AbsoluteFill>
);

// 1 · Not wanting to seem difficult
const I1: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const mao = cue("abrir mao");
  const swap = ease(f, mao, 12);
  return (
    <Item n={1} d={d} title="não quer parecer *chato*">
      <div style={{ position: "absolute", left: 120, top: 760, width: 840, height: 180, borderRadius: 30, background: "rgba(14,26,70,0.9)", border: `2px solid ${V.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 850, fontSize: 80, color: V.cyan, translate: `0 ${-swap * 180}px` }}>EU PREFIRO…</div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 850, fontSize: 80, color: V.white, translate: `0 ${(1 - swap) * 180}px` }}>TANTO FAZ</div>
      </div>
      <Thought text="“Vão me achar difícil?”" at={cue("exigente")} x={260} y={1060} w={620} size={46} />
    </Item>
  );
};

// 2 · Avoiding disagreement — my pick backs off before it's said
const I2: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const esc = cue("escolhe primeiro");
  const back = ease(f, esc, 16);
  return (
    <Item n={2} d={d} title="evitar que *discordem* de você">
      <Card at={cue("evitar a possibilidade")} x={110} y={760} w={400} tone="plain" style={{ textAlign: "center", fontSize: 60 }}>
        PIZZA
      </Card>
      <div style={{ position: "absolute", inset: 0, translate: `${back * 160}px ${back * 120}px`, scale: String(1 - 0.35 * back), opacity: 1 - 0.65 * back, transformOrigin: "80% 50%" }}>
        <Card at={cue("evitar a possibilidade") + 6} x={570} y={760} w={400} tone="cyan" style={{ textAlign: "center", fontSize: 60 }}>
          JAPONÊS
        </Card>
        <div style={{ position: "absolute", left: 640, top: 960, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: V.cyan, opacity: ease(f, 20, 10) }}>
          ← o que eu queria
        </div>
      </div>
      <Headline text="o outro escolhe *primeiro*" at={esc} y={1220} size={60} weight={700} />
    </Item>
  );
};

// 3 · Their preference goes in front of mine
const I3: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const frente = cue("na frente");
  const p = interpolate(f, [frente, frente + 24], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const depois = cue("so depois perceber");
  return (
    <Item n={3} d={d} title="a vontade do outro vem *antes*">
      <div style={{ position: "absolute", left: 110 + p * 600, top: 760 + p * 280, width: 420, scale: String(1 - 0.45 * p), opacity: 1 - 0.4 * p, transformOrigin: "100% 100%" }}>
        <div style={{ padding: "40px 0", textAlign: "center", borderRadius: 30, border: `3px solid ${V.cyan}`, background: "rgba(20,36,90,0.95)", fontFamily: DISPLAY, fontWeight: 850, fontSize: 50, color: V.cyan, boxShadow: f > depois ? `0 0 ${30 + 20 * Math.sin(f / 5)}px ${V.cyan}` : "none" }}>
          MINHA VONTADE
        </div>
      </div>
      <div style={{ position: "absolute", left: 550 - p * 330, top: 760, width: 420, scale: String(1 + 0.25 * p), zIndex: 2, opacity: ease(f, 10, 12) }}>
        <div style={{ padding: "40px 0", textAlign: "center", borderRadius: 30, background: V.violet, fontFamily: DISPLAY, fontWeight: 850, fontSize: 50, color: V.white, boxShadow: `0 0 40px ${V.violet}88` }}>VONTADE DO OUTRO</div>
      </div>
      <div style={{ position: "absolute", top: 1300, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 42, color: V.mute, opacity: ease(f, depois, 12) }}>
        …e só depois: o que eu queria?
      </div>
    </Item>
  );
};

// 4 · Avoiding conflict discomfort — "tanto faz" ends the tension
const I4: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const tens = cue("ameaca");
  const end = cue("encerra o risco");
  const jit = (1 - ease(f, end, 6)) * ease(f, tens, 10);
  const pts = Array.from({ length: 16 }).map((_, i) => `${300 + i * 30} ${980 + (i % 2 ? -1 : 1) * 40 * jit * (0.6 + 0.4 * Math.sin(f / 2 + i))}`).join(" L");
  return (
    <Item n={4} d={d} title="fugir do *desconforto* do conflito" glow="violet">
      <Card at={12} x={70} y={900} w={240} tone="cyan" style={{ textAlign: "center" }}>
        EU
      </Card>
      <Card at={16} x={770} y={900} w={240} tone="violet" style={{ textAlign: "center" }}>
        OUTRO
      </Card>
      <Svg>
        <path d={`M${pts}`} fill="none" stroke={V.violet} strokeWidth={6} opacity={ease(f, tens, 8) * (1 - ease(f, end, 6))} style={{ filter: `drop-shadow(0 0 10px ${V.violet})` }} />
      </Svg>
      <div style={{ position: "absolute", left: 540, top: 980, translate: "-50% -50%", rotate: "-5deg", scale: String(interpolate(f, [end, end + 5, end + 9], [2.2, 0.92, 1], clamp)), opacity: f >= end ? 1 : 0, padding: "10px 30px", border: `6px solid ${V.cyan}`, color: V.cyan, fontFamily: DISPLAY, fontWeight: 900, fontSize: 70 }}>
        TANTO FAZ
      </div>
      <Headline text="tensão · rejeição · desaprovação" at={tens} y={1240} size={48} weight={700} color={V.mute} />
      <Sfx at={end} src="shutter-modern" volume={0.12} />
    </Item>
  );
};

// 5 · So used to adapting (Jarbas, moment 2)
const I5: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const after = cue("so percebe depois");
  const choices = ["RESTAURANTE", "FILME", "HORÁRIO", "VIAGEM"];
  return (
    <Item n={5} d={d} title="nem sabe mais o que *prefere*">
      {choices.map((t, i) => {
        const a = 10 + i * 12;
        return (
          <div key={t} style={{ position: "absolute", left: 110 + (i % 2) * 450, top: 680 + Math.floor(i / 2) * 140, width: 410, padding: "20px 24px", borderRadius: 20, background: "rgba(20,36,90,0.9)", border: `2px solid ${V.line}`, display: "flex", justifyContent: "space-between", fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: V.white, scale: String(pop(f, a, 10)), opacity: 1 - 0.6 * ease(f, after, 12) }}>
            {t} <span style={{ color: V.violet }}>cedi</span>
          </div>
        );
      })}
      <Thought text="“Na verdade, eu queria ter ido naquele outro lugar.”" at={cue("na verdade")} x={90} y={960} w={900} size={44} />
      <Jarbas x={540} y={1490} height={420} enter={after - 4} pose={[[0, "facepalm", "apreensivo"]]} />
    </Item>
  );
};

// Mechanism — ceding becomes the automatic answer
const Loop: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const auto = cue("resposta automatica");
  const nodes: Array<[string, number, number, string]> = [
    ["EVITA O ATRITO", 540, 640, "evita o atrito"],
    ["SENTE ALÍVIO", 820, 1020, "sente alivio"],
    ["CEDER = SEGURO", 260, 1020, "ceder"],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="vira resposta *automática*" at={auto} y={230} size={84} />
        <Svg>
          <Draw d="M640 700 Q820 760 820 940" at={cue("evita o atrito") + 6} width={5} color={V.white} />
          <Draw d="M700 1080 Q540 1180 380 1080" at={cue("sente alivio") + 6} width={5} color={V.white} />
          <Draw d="M260 940 Q260 760 440 700" at={cue("ceder") + 6} width={5} color={V.white} />
        </Svg>
        {nodes.map(([t, x, y, c]) => (
          <div key={t} style={{ position: "absolute", left: x - 180, top: y - 55, width: 360, padding: "28px 0", textAlign: "center", borderRadius: 999, background: t.startsWith("CEDER") ? V.violet : "rgba(20,36,90,0.95)", border: `3px solid ${t.startsWith("CEDER") ? V.violet : V.cyan}`, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: 38, scale: String(pop(f, cue(c), 12)) }}>
            {t}
          </div>
        ))}
        <div style={{ position: "absolute", left: 540 - 60, top: 880, width: 120, height: 120, borderRadius: 60, border: `4px dashed ${V.line}`, rotate: `${f * 3}deg`, opacity: ease(f, auto, 10) }} />
      </Cam>
    </AbsoluteFill>
  );
};

// Fechamento — genuine choice vs discomfort
const TwoKinds: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const esc = cue("e uma escolha");
  const desc = cue("parece desconfortavel");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="às vezes *realmente* tanto faz" at={cue("claro que")} y={230} size={74} />
        <Card at={cue("claro que") + 24} x={90} y={600} w={430} tone="cyan" style={{ textAlign: "center" }}>
          “TANTO FAZ”
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: V.cyan, marginTop: 14, opacity: ease(f, esc, 10) }}>uma escolha</div>
        </Card>
        <Card at={cue("o ponto")} x={560} y={600} w={430} tone="violet" style={{ textAlign: "center" }}>
          “TANTO FAZ”
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: V.violet, marginTop: 14, opacity: ease(f, desc, 10) }}>por desconforto</div>
        </Card>
        <div style={{ position: "absolute", top: 940, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 850, fontSize: 52, color: V.white, opacity: ease(f, cue("o ponto"), 12) }}>
          perceber a diferença
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// Payoff — "EU" fades out of your own choices, then comes back
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const menos = cue("aparecer cada vez menos");
  const cards = ["JANTAR", "SÉRIE", "FÉRIAS", "HORÁRIO", "PASSEIO"];
  const shrink = interpolate(f, [0, menos + 30], [1, 0.25], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const back = ease(f, d - 70, 24);
  return (
    <AbsoluteFill>
      <Bg glow="both" dim={0.15 * (1 - back)} />
      <Cam d={d}>
        {cards.map((t, i) => (
          <div key={t} style={{ position: "absolute", left: 80 + (i % 3) * 320, top: 560 + Math.floor(i / 3) * 330, width: 280, height: 280, borderRadius: 30, background: "rgba(20,36,90,0.9)", border: `2px solid ${V.line}`, scale: String(pop(f, 6 + i * 6, 12)), opacity: 1 - 0.7 * back }}>
            <div style={{ padding: "26px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, color: V.white }}>{t}</div>
            <div style={{ position: "absolute", left: "50%", top: "58%", translate: "-50% -50%", fontFamily: DISPLAY, fontWeight: 900, fontSize: 120 * Math.max(0.05, shrink - i * 0.05), color: V.cyan, opacity: Math.max(0, shrink - i * 0.08) }}>EU</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontStretch: "125%", fontSize: 260, color: V.cyan, textShadow: `0 0 60px ${V.cyan}88`, opacity: back, scale: String(0.6 + 0.4 * back) }}>
          EU
        </div>
        <Headline text="E *VOCÊ?*" at={d - 40} y={1110} size={120} />
      </Cam>
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "1 voce nao quer", C: I1 },
  { at: "2 voce quer evitar", C: I2 },
  { at: "3 voce automaticamente", C: I3 },
  { at: "4 voce quer evitar", C: I4 },
  { at: "5 voce se acostumou", C: I5 },
  { at: "quando esse tipo", C: Loop },
  { at: "claro que muitas", C: TwoKinds },
  { at: "porque as vezes de tanto", C: Payoff },
];

export const V4_DURATION = 84.36 + 2.2;
export const Vox4: React.FC = () => (
  <VoxVideo
    audio="vox/audio/4.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V4_DURATION}
    keys={["tanto", "faz", "chato", "preferencia", "discordarem", "frente", "conflito", "desconforto", "prefere", "automatica", "alivio", "ceder", "escolha", "aparecer"]}
  />
);
