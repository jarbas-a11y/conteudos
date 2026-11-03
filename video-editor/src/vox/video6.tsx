import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/6.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Chat, Headline, ItemNumber, Jarbas, Sfx, Spot, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

const Pill: React.FC<{ t: string; at: number; x: number; y: number; rot?: number; size?: number }> = ({ t, at, x, y, rot = 0, size = 44 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg`, scale: String(pop(f, at, 12)), padding: "16px 30px", borderRadius: 999, background: "rgba(20,36,90,0.95)", border: `2px solid ${V.cyan}`, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: size, boxShadow: `0 0 30px ${V.cyan}33`, whiteSpace: "nowrap" }}>
      {t}
    </div>
  );
};

// 0 · Hook — polite phrases, fear underneath (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const medo = cue("medo de incomodar");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <div style={{ position: "absolute", top: 640, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontStretch: "120%", fontSize: 130, lineHeight: 0.95, color: V.violet, opacity: 0.85 * ease(f, medo, 18), filter: `blur(${(1 - ease(f, medo, 18)) * 10}px)`, textShadow: `0 0 60px ${V.violet}` }}>
        MEDO DE
        <br />
        INCOMODAR?
      </div>
      <Pill t="DESCULPA INCOMODAR." at={2} x={90} y={250} rot={-3} />
      <Pill t="NÃO PRECISA." at={8} x={480} y={390} rot={3} />
      <Pill t="PRA MIM TÁ ÓTIMO." at={14} x={150} y={520} rot={-2} />
      <Spot x={540} y={1230} r={380} at={0} />
      <Jarbas x={540} y={1490} height={600} enter={-14} pose={[[0, "sheepish", "sorriso"], [medo, "crossed", "apreensivo"]]} />
    </AbsoluteFill>
  );
};

const Item: React.FC<{ n: number; title: string; d: number; children: React.ReactNode }> = ({ n, title, d, children }) => (
  <AbsoluteFill>
    <Bg glow="both" />
    <Cam d={d}>
      <ItemNumber n={n} at={0} y={170} />
      <Headline text={title} at={6} y={420} x={80} w={920} align="left" size={66} stagger={2} />
      {children}
    </Cam>
  </AbsoluteFill>
);

// 1 · Apology bigger than the request
const I1: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const des = cue("desculpa incomodar");
  const grow = interpolate(f, [des, des + 40], [44, 96], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Item n={1} d={d} title="pedir *desculpa* antes de um pedido normal">
      <div style={{ position: "absolute", left: 100, top: 720, width: 880, padding: "34px 40px", borderRadius: 30, background: "rgba(14,26,70,0.92)", border: `2px solid ${V.line}`, opacity: ease(f, 14, 10) }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: grow, lineHeight: 1, color: V.violet }}>Desculpa incomodar…</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: V.mute, marginTop: 24, opacity: ease(f, cue("sera que voce consegue"), 10) }}>será que você consegue me ajudar com isso?</div>
      </div>
    </Item>
  );
};

// 2 · Accepting any time slot
const I2: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const slots: Array<[string, string, boolean]> = [
    ["08:00", "livre", false],
    ["12:30", "almoço com a família", true],
    ["18:00", "livre", false],
  ];
  const ok = cue("pra mim esta otimo");
  return (
    <Item n={2} d={d} title="aceitar *qualquer* horário">
      {slots.map(([h, t, busy], i) => (
        <div key={h} style={{ position: "absolute", left: 110, top: 660 + i * 130, width: 860, padding: "22px 30px", borderRadius: 22, display: "flex", gap: 30, alignItems: "center", background: busy ? `${V.violet}44` : "rgba(20,36,90,0.9)", border: `2px solid ${busy ? V.violet : V.line}`, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: V.white, opacity: ease(f, 8 + i * 5, 10) }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, color: busy ? V.violet : V.cyan }}>{h}</span> {t}
          {busy && <span style={{ marginLeft: "auto", color: V.violet }}>péssimo</span>}
        </div>
      ))}
      <Chat text="Pra mim tá ótimo." at={ok} me x={460} y={1090} />
      <Sfx at={ok} src="mouse-click" volume={0.16} />
    </Item>
  );
};

// 3 · "Não precisa" — the need stays
const I3: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const oferece = cue("oferece ajuda");
  const nao = cue("nao imagina");
  return (
    <Item n={3} d={d} title="dizer *“não* *precisa”* quando precisava">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: "absolute", left: 640 + (i % 2) * 20, top: 1200 - i * 70, width: 320, height: 60, borderRadius: 12, background: V.line, opacity: ease(f, 6 + i * 3, 8), border: `2px solid ${V.violet}55` }} />
      ))}
      <div style={{ position: "absolute", left: 650, top: 1270, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: V.violet, opacity: ease(f, 20, 10) }}>ainda precisa…</div>
      <Chat text="Quer ajuda com isso?" at={oferece} x={100} y={680} />
      <Chat text="Não, imagina. Tá tudo bem." at={nao} me x={100} y={860} w={520} />
    </Item>
  );
};

// 4 · Staying quiet — message deleted before sending
const I4: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const quieto = cue("ficar quieto");
  const msg = "Isso me incomodou.";
  const t = f - quieto;
  const shown = t < 40 ? msg.slice(0, Math.floor(Math.max(0, t) / 2)) : msg.slice(0, Math.max(0, msg.length - Math.floor((t - 46) * 1.5)));
  return (
    <Item n={4} d={d} title="ficar *quieto* quando algo incomoda">
      <div style={{ position: "absolute", left: 100, top: 760, width: 880, padding: "30px 36px", borderRadius: 999, background: "rgba(14,26,70,0.92)", border: `2px solid ${V.line}`, fontFamily: SANS, fontWeight: 600, fontSize: 46, color: V.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          {shown}
          <span style={{ color: V.cyan, opacity: f % 16 < 9 ? 1 : 0 }}>|</span>
        </span>
        <span style={{ width: 70, height: 70, borderRadius: 35, background: V.line, display: "inline-flex", alignItems: "center", justifyContent: "center", color: V.mute, fontSize: 36 }}>➤</span>
      </div>
      <Thought text="“Vão me achar chato.”" at={cue("chato")} x={300} y={1000} w={600} size={46} />
    </Item>
  );
};

// 5 · "Hoje não consigo" turns into a defence
const I5: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const defesa = cue("defesa inteira");
  const lines = Math.floor(interpolate(f, [defesa - 10, defesa + 40], [0, 9], clamp));
  return (
    <Item n={5} d={d} title="explicar *demais* para dizer não">
      <div style={{ position: "absolute", left: 360, top: 640, width: 620, padding: "26px 30px", borderRadius: "34px 34px 8px 34px", background: V.cyan, color: V.navy0, fontFamily: SANS, fontWeight: 700, fontSize: 42, scale: String(pop(f, 12, 12)), transformOrigin: "100% 0%" }}>
        Hoje não consigo.
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{ height: 16, borderRadius: 8, background: "rgba(5,11,31,0.35)", marginTop: 14, width: `${70 + ((i * 37) % 30)}%` }} />
        ))}
      </div>
    </Item>
  );
};

// Mechanism — a safety strategy
const Safety: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const chips: Array<[string, string]> = [
    ["incomodar menos", "INCOMODAR −"],
    ["contrariar menos", "CONTRARIAR −"],
    ["exigir menos", "EXIGIR −"],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Headline text="estratégia de *segurança*" at={cue("estrategia de seguranca")} y={240} size={84} />
        <svg width={420} height={500} viewBox="0 0 100 118" style={{ position: "absolute", left: 330, top: 520, scale: String(pop(f, cue("estrategia") + 4, 14)) }}>
          <path d="M50 3 L94 18 V54 C94 84 74 104 50 115 C26 104 6 84 6 54 V18 Z" fill={`${V.violet}33`} stroke={V.violet} strokeWidth={4} />
        </svg>
        {chips.map(([c, t], i) => (
          <div key={t} style={{ position: "absolute", left: [90, 620, 330][i], top: [1080, 1080, 1220][i], padding: "16px 28px", borderRadius: 999, background: V.violet, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: 40, scale: String(pop(f, cue(c), 12)) }}>
            {t}
          </div>
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// Contrast — kindness as a choice vs fear
const Contrast: React.FC<Ctx> = ({ d, cue }) => (
  <AbsoluteFill>
    <Bg glow="both" />
    <Cam d={d}>
      <Headline text="ser educado é *ótimo*" at={cue("claro que ser")} y={240} size={86} />
      <Card at={cue("o ponto")} x={90} y={620} w={430} tone="cyan" style={{ textAlign: "center", fontSize: 46 }}>
        EU ESCOLHO SER GENTIL
      </Card>
      <Card at={cue("perceber quando")} x={560} y={620} w={430} tone="violet" style={{ textAlign: "center", fontSize: 46 }}>
        TENHO MEDO DE INCOMODAR
      </Card>
    </Cam>
  </AbsoluteFill>
);

// Payoff — getting smaller to fit (Jarbas, moment 2)
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const menor = cue("um pouco menor");
  const small = interpolate(f, [menor - 10, menor + 50], [1, 0.42], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const others = ["pedidos", "horários", "opiniões", "planos", "vontades", "prazos", "favores", "escolhas"];
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d} from={1.04} to={1}>
        {others.map((t, i) => {
          const a = (i / others.length) * Math.PI * 2 - Math.PI / 2;
          const r = 470 - 150 * (1 - small);
          return (
            <div key={t} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 120, top: 900 + Math.sin(a) * r * 0.95 - 34, width: 240, padding: "16px 0", textAlign: "center", borderRadius: 999, background: "rgba(30,48,110,0.95)", color: V.white, fontFamily: SANS, fontWeight: 700, fontSize: 32 * (1 + 0.4 * (1 - small)), scale: String(pop(f, 6 + i * 3, 12)) }}>
              {t}
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: 0, scale: String(small), transformOrigin: "50% 60%" }}>
          <Jarbas x={540} y={1260} height={620} pose={[[0, "listen", "sorriso"], [menor, "sheepish", "apreensivo"]]} />
        </div>
        <Headline text="*GENTILEZA*" at={cue("vida dos outros")} y={230} size={90} />
        <Headline text="_MEDO_" at={cue("vida dos outros") + 18} y={1380} size={90} />
      </Cam>
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "1 pedir desculpa", C: I1 },
  { at: "2 aceitar", C: I2 },
  { at: "3 dizer", C: I3 },
  { at: "4 ficar quieto", C: I4 },
  { at: "5 dar uma justificativa", C: I5 },
  { at: "isso pode funcionar", C: Safety },
  { at: "claro que ser", C: Contrast },
  { at: "e quando ela comeca", C: Payoff },
];

export const V6_DURATION = 62.72 + 1.8;
export const Vox6: React.FC = () => (
  <VoxVideo
    audio="vox/audio/6.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V6_DURATION}
    keys={["gentileza", "incomodar", "rejeitado", "desculpa", "horario", "precisa", "quieto", "justificativa", "seguranca", "desaprovacao", "rejeicao", "escolha", "menor"]}
  />
);
