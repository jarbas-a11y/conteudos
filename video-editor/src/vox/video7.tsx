import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/7.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Chat, Figure, Headline, Jarbas, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

// Translucent "unsaid" layers between two people.
const Layers: React.FC<{ n: number; x?: number; at?: number[]; tilt?: number }> = ({ n, x = 540, at = [], tilt = 0 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const p = ease(f, at[i] ?? 0, 16);
        return (
          <div key={i} style={{ position: "absolute", left: x - 70 + i * 16 - (n * 16) / 2, top: 560 + i * 6, width: 140, height: 760, borderRadius: 30, background: `linear-gradient(180deg, ${V.violet}30, ${V.cyan}18)`, border: `2px solid ${V.violet}66`, opacity: p * 0.9, scale: `1 ${p}`, rotate: `${tilt}deg`, backdropFilter: "blur(4px)" }} />
        );
      })}
    </>
  );
};

// 0 · Hook — little fighting because someone never speaks (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const nao = cue("nao porque");
  const fala = cue("alguem nunca fala");
  const pull = interpolate(f, [nao, nao + 30], [1.12, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const travel = ease(f, fala, 26);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <AbsoluteFill style={{ scale: String(pull), transformOrigin: "50% 60%" }}>
        <Jarbas x={260} y={1420} height={600} enter={-14} pose={[[0, "listen", "neutro"], [fala, "crossed", "pensativo"]]} />
        <Figure x={840} y={1240} s={1.4} at={-14} tone={V.violet} />
        {["…", "isso me incomodou", "de novo?"].map((t, i) => (
          <div key={t} style={{ position: "absolute", left: 40 + i * 70, top: 700 - i * 120, padding: "12px 24px", borderRadius: 999, background: `${V.violet}44`, border: `2px solid ${V.violet}88`, color: V.white, fontFamily: SANS, fontStyle: "italic", fontWeight: 600, fontSize: 32, opacity: ease(f, nao + 6 + i * 6, 12) * 0.85 }}>
            {t}
          </div>
        ))}
        <div style={{ position: "absolute", left: 380 + travel * 260, top: 940, padding: "16px 28px", borderRadius: 999, background: V.cyan, color: V.navy0, fontFamily: SANS, fontWeight: 700, fontSize: 34, opacity: f < fala ? 0 : 1 - ease(f, fala + 14, 12), scale: String(1 - 0.5 * travel) }}>
          sabe o que é…
        </div>
      </AbsoluteFill>
      <Headline text="POUCA BRIGA." at={0} y={220} size={110} out={fala - 4} />
      <Headline text="alguém *não fala.*" at={fala} y={220} size={110} />
    </AbsoluteFill>
  );
};

// 1 · Letting things pass — thoughts get stored, not dropped
const LetPass: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const qs: Array<[string, string]> = [
    ["nao vale a pena", "“Não vale a pena falar disso.”"],
    ["deixa pra la", "“Deixa pra lá.”"],
    ["depois eu converso", "“Depois eu converso.”"],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Headline text="parece estar *funcionando*" at={cue("parecer que esta")} y={230} size={80} />
        <Headline text="deixa *passar.* depois outra." at={cue("voce deixa uma")} y={420} size={56} weight={700} color={V.mute} />
        <div style={{ position: "absolute", left: 640, top: 900, width: 360, height: 460, borderRadius: 30, border: `3px dashed ${V.violet}`, opacity: ease(f, 10, 12) }}>
          <div style={{ position: "absolute", top: -50, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: V.violet }}>GUARDADO</div>
        </div>
        {qs.map(([c, t], i) => {
          const a = cue(c);
          const into = ease(f, a + 40, 18);
          return (
            <div key={t} style={{ position: "absolute", left: 80 + into * 580, top: 560 + i * 130 + into * (380 - i * 10), width: 560, scale: String(1 - 0.45 * into), transformOrigin: "0 0" }}>
              <Thought text={t} at={a} x={0} y={0} w={560} size={42} tail="none" />
            </div>
          );
        })}
      </Cam>
    </AbsoluteFill>
  );
};

// 2 · What isn't said piles up into layers
const PileUp: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const acc = cue("se acumulando");
  const sozinho = cue("carregar sozinho");
  const nem = cue("nem sabe");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Figure x={200} y={1060} s={1.2} at={0} tone={V.cyan} />
        <Figure x={880} y={1060} s={1.2} at={0} tone={V.violet} />
        <Layers n={5} at={[acc, acc + 8, sozinho, sozinho + 8, sozinho + 16]} />
        <Headline text="vai se *acumulando*" at={acc} y={230} size={90} />
        <div style={{ position: "absolute", left: 700, top: 1260, width: 340, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: V.mute, opacity: ease(f, nem, 12) }}>
          o outro nem sabe que existe
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 3 · Two perspectives
const Perspective: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const cheio = cue("cheio de um problema");
  const nunca = cue("nunca existiu");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <div style={{ position: "absolute", left: 539, top: 200, width: 2, height: 1250, background: V.line, opacity: ease(f, 4, 10) }} />
        <div style={{ position: "absolute", left: 40, top: 230, width: 460, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: V.violet, textAlign: "center", opacity: ease(f, cheio, 10) }}>O QUE EU SINTO</div>
        <div style={{ position: "absolute", left: 580, top: 230, width: 460, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: V.cyan, textAlign: "center", opacity: ease(f, nunca, 10) }}>O QUE O OUTRO SABE</div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 70 + (i % 2) * 30, top: 330 + i * 140, width: 380, height: 110, borderRadius: 22, background: `${V.violet}${(30 + i * 10).toString(16)}`, border: `2px solid ${V.violet}88`, scale: String(pop(f, cheio + i * 4, 10)) }} />
        ))}
        <div style={{ position: "absolute", left: 620, top: 700, width: 380, padding: "24px 30px", borderRadius: 26, background: "rgba(30,48,110,0.9)", color: V.white, fontFamily: SANS, fontWeight: 600, fontSize: 38, opacity: ease(f, nunca, 12) }}>
          “Tá tudo bem, né?”
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 4 · Quick reward — tension drops now, the bother stays
const Reward: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const rec = cue("recompensa muito rapida");
  const inc = cue("o incomodo nao");
  const tension = interpolate(f, [rec, rec + 30], [0.9, 0.25], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="evitar *conflito*" at={cue("evitar conflito")} y={230} size={96} out={rec - 4} />
        <Headline text="recompensa *rápida*" at={rec} y={230} size={96} />
        <div style={{ position: "absolute", left: 110, top: 620, width: 860, opacity: ease(f, 6, 10) }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: V.white, marginBottom: 14 }}>TENSÃO AGORA</div>
          <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.08)" }}>
            <div style={{ height: 30, width: `${tension * 100}%`, borderRadius: 15, background: V.cyan, boxShadow: `0 0 20px ${V.cyan}` }} />
          </div>
        </div>
        <Card at={inc} x={250} y={900} w={580} tone="violet" from="pop" style={{ textAlign: "center" }}>
          O INCÔMODO
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: V.violet, marginTop: 12 }}>não desaparece</div>
        </Card>
        <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: V.mute, opacity: ease(f, cue("continuar evitando"), 12) }}>
          …e evitar fica mais provável
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 5 · Swallowing — the distance grows
const Swallow: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const steps: Array<[string, string]> = [
    ["engole uma", "ENGOLE"],
    ["engole outra", "ENGOLE OUTRA"],
    ["mais seco", "MAIS SECO"],
    ["mais distante", "MAIS DISTANTE"],
    ["detalhes", "IRRITA COM DETALHES"],
  ];
  const n = steps.filter(([c]) => f >= cue(c)).length;
  const gap = n * 22;
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Figure x={220 - gap} y={1100} s={1.2} at={0} tone={V.cyan} />
        <Figure x={860 + gap} y={1100} s={1.2} at={0} tone={V.violet} />
        <Layers n={Math.max(1, n + 3)} at={Array.from({ length: 8 }).map(() => 0)} />
        {steps.map(([c, t], i) => (
          <div key={t} style={{ position: "absolute", left: 540, top: 260 + i * 90, translate: "-50% 0", padding: "12px 28px", borderRadius: 999, background: V.violet, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: 38, whiteSpace: "nowrap", scale: String(pop(f, cue(c), 10)) }}>
            {t}
          </div>
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// 6 · "Mas o que foi?" — twenty conversations in your head (Jarbas, moment 2)
const WhatHappened: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const foi = cue("mas o que foi");
  const vinte = cue("20 conversas");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Figure x={880} y={760} s={1.1} at={0} tone={V.violet} />
        <Chat text="Mas o que foi?" at={foi} x={500} y={380} w={520} />
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          const r = 300 + (i % 3) * 40;
          return <div key={i} style={{ position: "absolute", left: 360 + Math.cos(a) * r - 26, top: 1000 + Math.sin(a) * r * 0.8 - 18, width: 52, height: 36, borderRadius: 18, background: `${V.violet}aa`, scale: String(pop(f, vinte + i * 1.5, 10)) }} />;
        })}
        <Jarbas x={360} y={1360} height={620} pose={[[0, "listen", "neutro"], [foi, "crossed", "cetico"], [vinte, "chin", "pensativo"]]} />
        <Headline text="20 conversas *só na sua cabeça*" at={vinte + 10} y={230} size={66} out={d - 12} />
      </Cam>
    </AbsoluteFill>
  );
};

// 7 · Choosing silence vs not being able to speak
const Choose: React.FC<Ctx> = ({ d, cue }) => (
  <AbsoluteFill>
    <Bg glow="both" />
    <Cam d={d}>
      <Headline text="não é transformar tudo em *discussão*" at={2} y={240} size={74} out={cue("tem coisa") - 4} />
      <Headline text="tem coisa que vale *deixar* *passar*" at={cue("tem coisa")} y={240} size={74} />
      <Card at={cue("escolher nao falar")} x={90} y={640} w={430} tone="cyan" style={{ textAlign: "center", fontSize: 50 }}>
        ESCOLHER NÃO FALAR
      </Card>
      <Card at={cue("nao conseguir falar")} x={560} y={640} w={430} tone="violet" style={{ textAlign: "center", fontSize: 50 }}>
        NÃO CONSEGUIR FALAR
      </Card>
    </Cam>
  </AbsoluteFill>
);

// Payoff — no fight, but distance
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const dist = cue("uma distancia");
  const away = interpolate(f, [0, d], [1.05, 0.86], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="both" dim={0.15} />
      <AbsoluteFill style={{ scale: String(away) }}>
        <Figure x={170} y={1100} s={1.1} at={0} tone={V.cyan} />
        <Figure x={910} y={1100} s={1.1} at={0} tone={V.violet} />
        <Layers n={9} at={Array.from({ length: 9 }).map((_, i) => 4 + i * 4)} />
      </AbsoluteFill>
      <Headline text="SEM BRIGA." at={cue("evita uma briga")} y={240} size={110} />
      <Headline text="mas com _distância._" at={dist} y={1380} size={96} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "e no comeco", C: LetPass },
  { at: "so que aquilo que voce", C: PileUp },
  { at: "ate que chega", C: Perspective },
  { at: "e isso acontece", C: Reward },
  { at: "entao voce engole", C: Swallow },
  { at: "e a outra pessoa", C: WhatHappened },
  { at: "isso nao significa", C: Choose },
  { at: "porque as vezes o silencio", C: Payoff },
];

export const V7_DURATION = 77.16 + 1.8;
export const Vox7: React.FC = () => (
  <VoxVideo
    audio="vox/audio/7.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V7_DURATION}
    keys={["briga", "fala", "acumulando", "irritacoes", "problema", "recompensa", "incomodo", "evitando", "engole", "distante", "conversas", "escolher", "conseguir", "silencio", "distancia"]}
  />
);
