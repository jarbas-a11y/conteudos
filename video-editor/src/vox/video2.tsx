import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/2.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Demote, Draw, Headline, Jarbas, Sfx, Spot, Svg, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

const INFO = ["PREPARO", "CONHECIMENTO", "INFORMAÇÃO"];

// Small info card used across the video.
const InfoCard: React.FC<{ t: string; at: number; x: number; y: number; dim?: number; w?: number }> = ({ t, at, x, y, dim = 0, w = 300 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "18px 0",
        textAlign: "center",
        borderRadius: 18,
        background: "rgba(20,36,90,0.9)",
        border: `2px solid ${V.cyan}`,
        color: V.white,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 1,
        scale: String(p),
        opacity: Math.min(1, p * 2) * (1 - 0.65 * dim),
        filter: dim > 0.05 ? `blur(${dim * 3}px)` : undefined,
        boxShadow: `0 0 ${30 * (1 - dim)}px ${V.cyan}44`,
      }}
    >
      {t}
    </div>
  );
};

// 1 · Hook — "EU SEI", then the path to it breaks (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const rupt = cue("isso nao e");
  const sumiu = cue("nervosismo ou memoria");
  const broken = ease(f, rupt, 14);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Spot x={330} y={980} r={420} at={0} />
      <Jarbas
        x={330}
        y={1460}
        height={1000}
        enter={-14}
        pose={[
          [0, "hips", "sorriso"],
          [rupt, "shrug", "arregalado"],
        ]}
      />
      <Headline text="EU *SEI.*" at={0} x={560} w={480} align="left" y={300} size={150} />
      <Svg>
        <path d="M640 520 L640 640" stroke={V.cyan} strokeWidth={6} strokeDasharray={broken > 0.5 ? "10 26" : "0"} opacity={1 - 0.6 * broken} />
      </Svg>
      {[0, 1, 2].map((i) => (
        <InfoCard key={i} t={INFO[i]} at={6 + i * 4} x={600} y={660 + i * 110} w={400} dim={broken * 0.6} />
      ))}
      <Headline text="então por que *sumiu?*" at={sumiu} x={520} w={540} align="left" y={1060} size={78} />
      <Sfx at={rupt} src="switch" volume={0.15} />
    </AbsoluteFill>
  );
};

// 2 · It's not lack of preparation
const NotLack: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const at = [cue("preparo"), cue("conhecimento"), cue("conhecimento") + 6];
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Headline text="não é *falta* de…" at={0} y={260} size={100} />
        {INFO.map((t, i) => (
          <div key={t} style={{ position: "absolute", left: 170, top: 620 + i * 190, width: 740, display: "flex", alignItems: "center", gap: 30 }}>
            <InfoCard t={t} at={at[i]} x={0} y={0} w={560} />
            <div style={{ position: "absolute", left: 600, top: 8, width: 84, height: 84, borderRadius: 42, background: V.cyan, color: V.navy0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 900, fontFamily: SANS, scale: String(pop(f, at[i] + 8, 10)) }}>
              ✓
            </div>
          </div>
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// 3 · Something else going on in your head
const Elsewhere: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const cab = cue("cabeca naquele");
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Headline text="outra coisa *acontecendo*" at={cue("outra coisa")} y={260} size={92} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={900} r={250} fill="none" stroke={V.line} strokeWidth={6} />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 + f * 0.05;
            const p = ease(f, cab + i * 3, 12);
            return <circle key={i} cx={540 + Math.cos(a) * 140 * p} cy={900 + Math.sin(a) * 140 * p} r={22} fill={i % 2 ? V.violet : V.cyan} opacity={p} />;
          })}
        </svg>
        <div style={{ position: "absolute", top: 1220, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: V.mute, opacity: ease(f, cab, 12) }}>
          NA SUA CABEÇA, NAQUELE MOMENTO
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 4 · You knew it — material connected to "SEI"
const KnewIt: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const items: Array<[string, string, number, number]> = [
    ["sabia o assunto", "ASSUNTO", 110, 520],
    ["conversou", "CONVERSA", 620, 520],
    ["leu estudou", "ESTUDO", 110, 1180],
    ["preparou os slides", "SLIDES", 620, 1180],
  ];
  const lit = cue("a informacao estava");
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Svg>
          {items.map(([c, , x, y], i) => (
            <Draw key={i} d={`M${x + 175} ${y + 40} L540 900`} at={cue(c) + 4} color={V.cyan} width={4} opacity={0.7} />
          ))}
        </Svg>
        {items.map(([c, t, x, y]) => (
          <InfoCard key={t} t={t} at={cue(c)} x={x} y={y} w={350} />
        ))}
        <div style={{ position: "absolute", left: 540 - 150, top: 900 - 150, width: 300, height: 300, borderRadius: 150, display: "flex", alignItems: "center", justifyContent: "center", background: ease(f, lit, 12) > 0.5 ? V.cyan : "rgba(20,36,90,0.95)", border: `4px solid ${V.cyan}`, boxShadow: `0 0 ${80 * ease(f, lit, 12)}px ${V.cyan}`, fontFamily: DISPLAY, fontWeight: 900, fontSize: 90, color: ease(f, lit, 12) > 0.5 ? V.navy0 : V.white, scale: String(pop(f, 2, 14)) }}>
          SEI
        </div>
        <Headline text="a informação *estava lá*" at={lit} y={1400} size={70} />
      </Cam>
    </AbsoluteFill>
  );
};

// 5 · "Sumiu." — the connections lose their light
const Gone: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const s = cue("sumiu");
  const dim = ease(f, s - 8, 18);
  return (
    <AbsoluteFill>
      <Bg glow="none" dim={0.3 * dim} />
      <Cam d={d} from={1.06} to={1}>
        <AbsoluteFill style={{ opacity: 1 - 0.7 * dim, filter: `blur(${4 * dim}px)` }}>
          {["ASSUNTO", "CONVERSA", "ESTUDO", "SLIDES"].map((t, i) => (
            <InfoCard key={t} t={t} at={0} x={[110, 620, 110, 620][i]} y={[520, 520, 1180, 1180][i]} w={350} />
          ))}
        </AbsoluteFill>
        <Headline text="chega a sua *vez*" at={cue("chega a sua vez")} y={300} size={90} out={s - 6} />
        <Headline text="SUMIU." at={s} y={800} size={220} stretch={125} />
      </Cam>
      <Sfx at={s} src="shutter-modern" volume={0.15} />
    </AbsoluteFill>
  );
};

// Workspace panel (working memory) with idea slots.
const Workspace: React.FC<{ at: number; y?: number; jam?: number; children?: React.ReactNode; label?: string }> = ({ at, y = 520, jam = 0, children, label = "MEMÓRIA DE TRABALHO" }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 16);
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, height: 560, borderRadius: 40, border: `4px solid ${jam > 0.5 ? V.violet : V.cyan}`, background: "rgba(10,22,60,0.75)", boxShadow: `0 0 60px ${jam > 0.5 ? V.violet : V.cyan}33`, opacity: p, scale: String(0.9 + 0.1 * p), translate: `${Math.sin(f * 1.7) * 6 * jam}px 0` }}>
      <div style={{ position: "absolute", top: -54, left: 0, fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: V.mute }}>{label}</div>
      {children}
    </div>
  );
};

const Idea: React.FC<{ n: number; at: number; x: number; y: number; dim?: number }> = ({ n, at, x, y, dim = 0 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 230, height: 150, borderRadius: 22, background: V.cyan, color: V.navy0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, scale: String(p * (1 - 0.15 * dim)), opacity: 1 - 0.6 * dim }}>
      IDEIA {n}
    </div>
  );
};

const Connector: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: x, top: y, width: 60 * ease(f, at, 10), height: 12, borderRadius: 6, background: V.white, boxShadow: `0 0 16px ${V.cyan}` }} />;
};

// 6 · Working memory organises ideas
const Working: React.FC<Ctx> = ({ d, cue }) => {
  const mt = cue("memoria de trabalho");
  const org = cue("organiza");
  const con = cue("conecta");
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Headline text="memória de *trabalho*" at={mt} y={240} size={98} />
        <Workspace at={mt + 6}>
          <Idea n={1} at={cue("manter")} x={40} y={200} />
          <Idea n={2} at={org} x={335} y={200} />
          <Idea n={3} at={org + 8} x={630} y={200} />
          <Connector x={272} y={268} at={con} />
          <Connector x={567} y={268} at={con + 8} />
        </Workspace>
        <Headline text="decide o que vem *depois*" at={cue("decide o que")} y={1210} size={64} weight={700} />
      </Cam>
    </AbsoluteFill>
  );
};

// 7 · Limited by nature
const Limited: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const lim = cue("limitada");
  const bounce = interpolate(f, [lim + 6, lim + 16, lim + 24, lim + 34], [400, 120, 180, 400], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Workspace at={0}>
          <Idea n={1} at={0} x={40} y={200} />
          <Idea n={2} at={0} x={335} y={200} />
          <Idea n={3} at={0} x={630} y={200} />
        </Workspace>
        <div style={{ position: "absolute", left: 425, top: 1100 + bounce * 0.4, width: 230, height: 150, borderRadius: 22, border: `3px dashed ${V.mute}`, color: V.mute, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, opacity: ease(f, lim + 4, 8) }}>
          IDEIA 4
        </div>
        <Headline text="capacidade *limitada*" at={lim} y={240} size={98} />
      </Cam>
    </AbsoluteFill>
  );
};

// 8 · Worries invade the workspace (Jarbas, moment 2)
const Invaded: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const ws: Array<[string, string]> = [
    ["minha voz", "Minha voz está tremendo?"],
    ["sera que perceberam", "Será que perceberam?"],
    ["estou falando", "Estou falando rápido?"],
    ["o que aquela", "O que estão achando de mim?"],
  ];
  const first = cue("minha voz");
  const jam = ease(f, cue("estou falando"), 20);
  return (
    <AbsoluteFill>
      <Bg glow="violet" dim={0.1 * jam} />
      <Cam d={d}>
        <Workspace at={0} y={260} jam={jam}>
          {[1, 2, 3].map((n, i) => (
            <Idea key={n} n={n} at={0} x={40 + i * 295} y={60} dim={jam} />
          ))}
          {ws.map(([c, t], i) => {
            const a = cue(c);
            const p = ease(f, a, 18);
            return (
              <div key={t} style={{ position: "absolute", left: 30 + (i % 2) * 430, top: 250 + Math.floor(i / 2) * 140, width: 410, padding: "16px 20px", borderRadius: 18, background: V.violet, color: V.white, fontFamily: SANS, fontStyle: "italic", fontWeight: 700, fontSize: 34, lineHeight: 1.15, opacity: p, translate: `${(1 - p) * (i % 2 ? 260 : -260)}px ${(1 - p) * 700}px`, rotate: `${(i % 2 ? 2 : -2) * p}deg` }}>
                {t}
              </div>
            );
          })}
        </Workspace>
        <Jarbas
          x={540}
          y={1490}
          height={620}
          pose={[
            [0, "listen", "pensativo"],
            [first, "chin", "apreensivo"],
            [cue("estou falando"), "facepalm", "apreensivo"],
          ]}
        />
      </Cam>
      {ws.map(([c], i) => (
        <Sfx key={i} at={cue(c)} src="mouse-click" volume={0.14} />
      ))}
    </AbsoluteFill>
  );
};

// 9 · Same resources, split attention
const Split: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const mon = cue("monitorar");
  const share = interpolate(f, [cue("dividir os mesmos"), mon + 40], [0.15, 0.7], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="os *mesmos* recursos" at={cue("dividir os mesmos")} y={250} size={96} />
        <div style={{ position: "absolute", left: 90, top: 700, width: 900, height: 160, borderRadius: 30, overflow: "hidden", display: "flex", opacity: ease(f, 6, 12) }}>
          <div style={{ width: `${(1 - share) * 100}%`, background: V.cyan, display: "flex", alignItems: "center", paddingLeft: 30, fontFamily: DISPLAY, fontWeight: 850, fontSize: 40, color: V.navy0, whiteSpace: "nowrap", overflow: "hidden" }}>
            RACIOCINAR
          </div>
          <div style={{ flex: 1, background: V.violet, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30, fontFamily: DISPLAY, fontWeight: 850, fontSize: 40, color: V.white, whiteSpace: "nowrap", overflow: "hidden" }}>
            MONITORAR
          </div>
        </div>
        <Headline text="mais difícil *acessar*" at={cue("acessar aquilo")} y={1050} size={92} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 42, color: V.mute, opacity: ease(f, cue("ja sabia"), 12) }}>
          aquilo que você já sabia
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 10 · Having it vs accessing it under pressure
const Access: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const ter = cue("ter a informacao");
  const acc = cue("conseguir acessar");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Card at={ter} x={90} y={560} w={380} tone="cyan" style={{ textAlign: "center", fontSize: 64 }}>
          SABER
        </Card>
        <Card at={acc} x={560} y={500} w={430} tone="violet" style={{ textAlign: "center", fontSize: 50 }}>
          ACESSAR SOB PRESSÃO
        </Card>
        <Svg>
          <Draw d="M470 640 C 520 640, 520 900, 560 900 S 760 760, 775 700" at={acc + 6} color={V.white} width={5} dash />
        </Svg>
        <div style={{ position: "absolute", left: 495, top: 760, width: 90, height: 90, borderRadius: 45, border: `4px solid ${V.violet}`, color: V.violet, fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", scale: String(pop(f, acc + 20, 10)) }}>
          ≠
        </div>
        <Headline text="uma diferença *importante*" at={cue("uma diferenca")} y={260} size={86} />
      </Cam>
    </AbsoluteFill>
  );
};

// 11 · Studying more doesn't always fix it
const Study: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const est = cue("estudar mais");
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: "absolute", left: 340 + (i % 2) * 14, top: 1160 - i * 82, width: 400, height: 70, borderRadius: 12, background: i % 2 ? V.cyanDim : V.cyan, opacity: ease(f, est + i * 3, 8), translate: `0 ${(1 - ease(f, est + i * 3, 10)) * -200}px` }} />
        ))}
        <Headline text="estudar *mais*" at={est} y={260} size={110} />
        <Headline text="nem sempre resolve" at={cue("nem sempre")} y={420} size={70} weight={650} color={V.mute} />
      </Cam>
    </AbsoluteFill>
  );
};

// 12 · Payoff — content is there, interference is too much
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const falta = cue("nao falta conteudo");
  const demais = cue("coisa demais");
  const pull = interpolate(f, [demais, demais + 40], [1.25, 0.92], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const worries = ["voz tremendo?", "perceberam?", "rápido demais?", "o que acham?", "e se eu errar?", "tô suando?"];
  return (
    <AbsoluteFill>
      <Bg glow="both" dim={0.1} />
      <AbsoluteFill style={{ scale: String(pull), transformOrigin: "50% 50%" }}>
        {["IDEIA 1", "IDEIA 2", "IDEIA 3"].map((t, i) => (
          <InfoCard key={t} t={t} at={2 + i * 3} x={150 + i * 270} y={860} w={240} />
        ))}
        {worries.map((t, i) => {
          const a = (i / worries.length) * Math.PI * 2 + f * 0.01;
          const p = ease(f, demais + i * 3, 12);
          return (
            <div key={t} style={{ position: "absolute", left: 540 + Math.cos(a) * 390 - 130, top: 900 + Math.sin(a) * 330 - 30, width: 260, padding: "12px 0", textAlign: "center", borderRadius: 999, background: `${V.violet}cc`, color: V.white, fontFamily: SANS, fontStyle: "italic", fontWeight: 700, fontSize: 30, opacity: p }}>
              {t}
            </div>
          );
        })}
      </AbsoluteFill>
      <Demote at={demais + 30}>
        <Headline text="não falta *conteúdo.*" at={falta} y={260} size={92} />
      </Demote>
      <Headline text="sobra _interferência._" at={demais + 30} y={1300} size={92} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "geralmente tambem", C: NotLack },
  { at: "o problema pode estar", C: Elsewhere },
  { at: "porque pensa antes", C: KnewIt },
  { at: "so que chega", C: Gone },
  { at: "uma das explicacoes", C: Working },
  { at: "geralmente nao existe", C: Limited },
  { at: "entao se no meio", C: Invaded },
  { at: "voce comeca a dividir", C: Split },
  { at: "por isso existe", C: Access },
  { at: "e talvez seja por isso", C: Study },
  { at: "as vezes nao falta", C: Payoff },
];

export const V2_DURATION = 72.56 + 1.6;
export const Vox2: React.FC = () => (
  <VoxVideo
    audio="vox/audio/2.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V2_DURATION}
    keys={["branco", "nervosismo", "memoria", "preparo", "conhecimento", "sumiu", "trabalho", "limitada", "dividir", "recursos", "monitorar", "acessar", "pressao", "conteudo", "demais"]}
  />
);
