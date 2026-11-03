import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/1.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Brackets, Cam, Chat, Demote, Draw, Figure, Headline, Jarbas, Sfx, Spot, Svg, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

// 1 · Hook — same person, two states (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const other = cue("e perto de outras");
  const nem = cue("nem parece eu");
  const eu = cue("eu e o mais");
  const cara = cue("cara por que");
  const take = interpolate(f, [other, nem + 6], [540, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const grow = interpolate(f, [other, nem + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <AbsoluteFill style={{ clipPath: `inset(0 ${1080 - take}px 0 0)`, background: `linear-gradient(180deg, ${V.cyan}22, transparent 70%)` }}>
        <Jarbas x={270} y={1420} height={760} expr="sorriso" enter={-14} pose={[[0, "open"]]} />
        <Headline text="*À* *VONTADE*" at={4} y={230} x={20} w={500} size={92} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${take}px)`, background: `linear-gradient(180deg, ${V.violet}26, transparent 70%)` }}>
        <Jarbas
          enter={-14}
          x={810 - 150 * grow}
          y={1420}
          height={760 + 200 * grow}
          pose={[
            [0, "crossed", "apreensivo"],
            [cara, "facepalm", "apreensivo"],
          ]}
        />
        <Headline text="NEM PARECE" at={nem} y={230} size={104} out={eu + 4} />
        <Headline text="_EU_" at={eu} y={330} x={40} w={420} align="left" size={230} out={cara - 4} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: take - 3, top: 0, width: 6, height: 1920, background: V.white, boxShadow: `0 0 30px ${V.cyan}`, opacity: take > 4 ? 1 : 0 }} />
      <Thought text="“Cara… por que eu fiquei daquele jeito?”" at={cue("por que eu fiquei")} x={60} y={190} w={720} size={50} />
      <Sfx at={nem} src="switch" />
    </AbsoluteFill>
  );
};

// 2 · Spontaneous talk — bubbles float freely
const Free: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const words: Array<[string, string, number, number]> = [
    ["brinca", "brinca haha", 140, 980],
    ["da opiniao", "dá opinião", 560, 860],
    ["conta historia", "conta história", 120, 700],
    ["discorda", "discorda", 600, 560],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Headline text="fala *qualquer* coisa" at={cue("fala qualquer")} y={240} size={96} />
        <Figure x={540} y={1250} s={1.5} at={0} tone={V.cyan} />
        {words.map(([c, t, x, y], i) => {
          const a = cue(c);
          return <Chat key={i} text={t} at={a} x={x} y={y - Math.max(0, f - a) * 0.6} />;
        })}
      </Cam>
    </AbsoluteFill>
  );
};

// 3 · A specific person enters — composition closes
const Someone: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const enter = cue("uma pessoa especifica");
  const shift = cue("muda");
  const close = ease(f, shift, 30);
  return (
    <AbsoluteFill>
      <Bg glow="violet" dim={0.25 * close} />
      <Cam d={d}>
        <Figure x={330} y={1150} s={1.4} at={0} tone={V.cyan} />
        <div style={{ position: "absolute", inset: 0, translate: `${(1 - ease(f, enter, 24)) * 500}px 0` }}>
          <Figure x={800} y={1080} s={1.9} at={enter} tone={V.violet} />
        </div>
        <Headline text="uma pessoa *específica*" at={enter} y={250} size={100} />
      </Cam>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${200 * close}px ${120 * close}px rgba(3,6,18,0.9)` }} />
    </AbsoluteFill>
  );
};

// 4 · Self-editing — sentence rewritten, joke and opinion never sent
const Editing: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const words = cue("escolher mais as palavras");
  const piada = cue("piada");
  const opin = cue("deixa uma opiniao");
  const exp = cue("presta atencao");
  const full = "Eu acho que essa ideia não funciona.";
  const soft = "Talvez… depende.";
  let text = full;
  const typeEnd = words + 30;
  if (f < typeEnd) text = full.slice(0, Math.floor(interpolate(f, [words, typeEnd], [0, full.length], clamp)));
  else if (f < typeEnd + 22) text = full.slice(0, Math.max(0, full.length - (f - typeEnd) * 2));
  else text = soft.slice(0, Math.floor(interpolate(f, [typeEnd + 22, typeEnd + 40], [0, soft.length], clamp)));
  return (
    <AbsoluteFill>
      <Bg glow="violet" dim={0.15} />
      <Cam d={d}>
        <Headline text="escolhe as *palavras*" at={words} y={230} size={92} out={piada - 4} />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 520,
            width: 900,
            padding: "34px 40px",
            borderRadius: 28,
            background: "rgba(14,26,70,0.85)",
            border: `2px solid ${V.line}`,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 52,
            color: V.white,
            minHeight: 170,
            opacity: ease(f, words - 4, 10),
          }}
        >
          {text}
          <span style={{ color: V.cyan, opacity: f % 16 < 9 ? 1 : 0 }}>|</span>
        </div>
        <Demote at={opin}>
          <Chat text="kkk tive uma piada…" at={piada - 6} out={piada + 18} me x={420} y={800} />
        </Demote>
        <Chat text="Na real, eu discordo." at={opin} out={opin + 22} me x={380} y={960} />
        <Figure x={540} y={1300} s={1.3} at={exp - 6} tone={V.violet} />
        <Brackets x={400} y={1150} w={280} h={300} at={exp} color={V.violet} pulse />
        <Headline text="presta atenção na *expressão*" at={exp} y={230} size={78} />
      </Cam>
      <Sfx at={piada + 18} src="mouse-click" />
      <Sfx at={opin + 22} src="mouse-click" />
    </AbsoluteFill>
  );
};

// 5 · Signature — watching yourself take part (Jarbas, moment 2)
const Watching: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const assist = cue("se assistir");
  const pull = interpolate(f, [assist - 10, assist + 26], [1.45, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <AbsoluteFill style={{ scale: String(pull * interpolate(f, [0, d], [1, 1.03], clamp)), transformOrigin: "35% 62%" }}>
        <Figure x={720} y={1150} s={1.3} at={0} tone={V.violet} />
        <Jarbas x={360} y={1340} height={640} pose={[[0, "talk", "falando"]]} />
        <Chat text="…e aí eu falei que…" at={6} x={420} y={760} w={520} />
        <div style={{ position: "absolute", left: 610, top: 120, width: 420, height: 640, borderRadius: 22, border: `3px solid ${V.violet}`, background: "rgba(40,20,90,0.35)", overflow: "hidden", opacity: ease(f, assist - 6, 12) }}>
          <Jarbas x={210} y={760} height={560} pose={[[0, "chin", "cetico"]]} />
          <div style={{ position: "absolute", left: 18, top: 14, display: "flex", gap: 10, alignItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: V.violet, letterSpacing: 2 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#FF4D6D", opacity: f % 30 < 18 ? 1 : 0.2 }} />
            REC · VOCÊ
          </div>
        </div>
        <Svg>
          <Draw d="M610 700 Q520 820 470 920" at={assist + 8} color={V.violet} width={5} dash />
        </Svg>
      </AbsoluteFill>
      <Headline text="você se *assiste*" at={assist + 6} y={1395} size={100} />
    </AbsoluteFill>
  );
};

// 6 · Attention shifts from the conversation to yourself
const Attention: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const auto = cue("autoconsciencia");
  const sair = cue("sair um pouco");
  const swing = interpolate(f, [sair, sair + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ang = -20 + 200 * swing;
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="autoconsciência *social*" at={auto} y={230} size={90} />
        <div style={{ position: "absolute", left: 120, top: 660, width: 360, padding: "26px 0", textAlign: "center", borderRadius: 999, border: `3px solid ${V.violet}`, color: V.white, fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, opacity: ease(f, 8, 12), boxShadow: swing > 0.6 ? `0 0 50px ${V.violet}88` : "none" }}>
          VOCÊ
        </div>
        <div style={{ position: "absolute", left: 600, top: 660, width: 380, padding: "26px 0", textAlign: "center", borderRadius: 999, border: `3px solid ${V.cyan}`, color: V.white, fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, opacity: ease(f, 12, 12) * (1 - 0.6 * swing) }}>
          CONVERSA
        </div>
        <div style={{ position: "absolute", left: 540 - 6, top: 1000, width: 12, height: 0, opacity: ease(f, 16, 12) }}>
          <div style={{ position: "absolute", left: -150, top: -150, width: 300, height: 300, borderRadius: "50%", border: `3px dashed ${V.line}` }} />
          <div style={{ position: "absolute", left: 0, top: -6, width: 230, height: 12, borderRadius: 6, background: swing > 0.5 ? V.violet : V.cyan, transformOrigin: "0 50%", rotate: `${ang}deg`, boxShadow: `0 0 24px ${swing > 0.5 ? V.violet : V.cyan}` }} />
          <div style={{ position: "absolute", left: -26, top: -26, width: 52, height: 52, borderRadius: 26, background: V.white }} />
        </div>
        <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: V.mute, opacity: ease(f, 20, 12) }}>
          FOCO DA ATENÇÃO
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 7 · The questions pile in
const Questions: React.FC<Ctx> = ({ d, cue }) => {
  const qs: Array<[string, string, number, number, number]> = [
    ["como eu estou", "Como eu estou parecendo?", 80, 420, 58],
    ["sera que falei", "Será que falei besteira?", 200, 700, 66],
    ["sera que ela", "Será que ela gostou do que eu disse?", 100, 980, 54],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="violet" dim={0.2} />
      <Cam d={d}>
        <AbsoluteFill style={{ filter: "blur(10px)", opacity: 0.35 }}>
          <Figure x={300} y={1250} s={1.3} at={0} tone={V.cyan} />
          <Figure x={780} y={1250} s={1.3} at={0} tone={V.violet} />
        </AbsoluteFill>
        {qs.map(([c, t, x, y, s], i) => (
          <Thought key={i} text={t} at={cue(c)} x={x} y={y} w={800} size={s} tail={i % 2 ? "right" : "left"} />
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// 8 · Control up, spontaneity down
const Control: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const ctrl = cue("tentando controlar");
  const menos = cue("menos espontanea");
  const c = interpolate(f, [ctrl, menos + 20], [0.2, 0.95], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="violet" dim={0.2} />
      <Cam d={d}>
        <Figure x={540} y={900} s={1.6} at={0} tone={V.cyan} />
        {[0, 1, 2].map((i) => (
          <Brackets key={i} x={380 - i * 60} y={700 - i * 60} w={320 + i * 120} h={360 + i * 120} at={ctrl + i * 8} color={V.violet} />
        ))}
        {(
          [
            ["CONTROLE DA IMPRESSÃO", c, V.violet, 1180],
            ["ESPONTANEIDADE", 1.1 - c, V.cyan, 1330],
          ] as const
        ).map(([label, v, col, y]) => (
          <div key={label} style={{ position: "absolute", left: 110, top: y, width: 860, opacity: ease(f, ctrl, 12) }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: V.white, letterSpacing: 3, marginBottom: 12 }}>{label}</div>
            <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.08)" }}>
              <div style={{ height: 22, width: `${Math.max(0, Math.min(1, v)) * 100}%`, borderRadius: 11, background: col, boxShadow: `0 0 20px ${col}` }} />
            </div>
          </div>
        ))}
        <Headline text="menos *espontâneo*" at={menos} y={240} size={100} />
      </Cam>
    </AbsoluteFill>
  );
};

// 9 · Who makes it happen
const Who: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const tags: Array<[string, string, number, number]> = [
    ["admira", "ADMIRA", 90, 520],
    ["intimida", "TE INTIMIDA", 560, 640],
    ["autoridade", "AUTORIDADE", 100, 1080],
    ["aprovacao", "APROVAÇÃO", 560, 1200],
  ];
  const grow = interpolate(f, [0, d], [1, 1.35], clamp);
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <div style={{ position: "absolute", inset: 0, scale: String(grow), transformOrigin: "50% 62%" }}>
          <Figure x={540} y={1000} s={1.6} at={0} tone={V.violet} />
        </div>
        <Headline text="perto de alguém que você…" at={4} y={250} size={70} weight={700} />
        {tags.map(([c, t, x, y]) => (
          <div key={t} style={{ position: "absolute", left: x, top: y, scale: String(pop(f, cue(c), 12)), padding: "18px 30px", borderRadius: 999, background: V.violet, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: 48, boxShadow: `0 0 40px ${V.violet}88` }}>
            {t}
          </div>
        ))}
      </Cam>
    </AbsoluteFill>
  );
};

// 10 · "Eu não sou daquele jeito."
const NotMe: React.FC<Ctx> = ({ d, cue }) => (
  <AbsoluteFill>
    <Bg glow="both" dim={0.15} />
    <Cam d={d}>
      <Thought text="“Eu não sou daquele jeito.”" at={cue("eu nao sou")} x={120} y={560} w={840} size={66} />
      <Headline text="e talvez você *realmente* não seja" at={cue("talvez voce realmente")} y={1060} size={78} />
    </Cam>
  </AbsoluteFill>
);

// 11 · Payoff — frames fall away, the space opens
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const mud = cue("o que mudou");
  const seg = cue("seguro");
  const apar = cue("deixar ela aparecer");
  const open = ease(f, mud, 40);
  return (
    <AbsoluteFill>
      <Bg glow="cyan" dim={0.3 * (1 - open)} />
      <Cam d={d} from={1.04} to={1}>
        {[0, 1].map((i) => (
          <Brackets key={i} x={360 - i * 60} y={620 - i * 60} w={360 + i * 120} h={420 + i * 120} at={0} out={mud + i * 6} color={V.violet} />
        ))}
        <Spot x={540} y={860} r={460} at={mud} />
        <div style={{ position: "absolute", inset: 0, scale: String(0.85 + 0.25 * open), transformOrigin: "50% 50%" }}>
          <Figure x={540} y={860} s={1.6} at={0} tone={open > 0.5 ? V.cyan : V.violet} />
        </div>
        <Headline text="personalidade não mudou" at={cue("talvez sua personalidade")} y={230} size={74} weight={700} out={seg - 6} />
        <Headline text="*SEGURO*" at={seg} y={250} size={170} />
        <Headline text="pra deixar *aparecer*" at={apar} y={1180} size={96} />
      </Cam>
      <Sfx at={seg} src="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "porque pensa tem gente", C: Free },
  { at: "ai aparece uma pessoa", C: Someone },
  { at: "voce comeca a escolher", C: Editing },
  { at: "e aos poucos", C: Watching },
  { at: "na neurociencia", C: Attention },
  { at: "como eu estou parecendo", C: Questions },
  { at: "e quanto mais energia", C: Control },
  { at: "por isso isso costuma", C: Who },
  { at: "e talvez seja por isso", C: NotMe },
  { at: "talvez sua personalidade", C: Payoff },
];

export const V1_DURATION = 78.04 + 1.6;
export const Vox1: React.FC = () => (
  <VoxVideo
    audio="vox/audio/1.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V1_DURATION}
    keys={["vontade", "especifica", "palavras", "piada", "opiniao", "assistir", "autoconsciencia", "social", "atencao", "controlar", "espontanea", "admira", "intimida", "autoridade", "aprovacao", "personalidade", "seguro", "aparecer"]}
  />
);
