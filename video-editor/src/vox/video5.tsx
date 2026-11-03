import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import tokens from "../../public/vox/captions/5.json";
import { Ctx, SceneDef, VoxVideo } from "./engine";
import { Bg, Cam, Card, Chat, Demote, Draw, Figure, Headline, Jarbas, Sfx, Spot, Svg, Thought, ease, pop } from "./kit";
import { DISPLAY, SANS, V, clamp } from "./theme";

const Calendar: React.FC<{ at: number; x: number; y: number; day: string; label?: string; hot?: number; s?: number }> = ({ at, x, y, day, label = "APRESENTAÇÃO", hot = 0, s = 1 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300 * s, scale: String(p), borderRadius: 26, overflow: "hidden", background: "rgba(14,26,70,0.95)", border: `3px solid ${hot > 0.5 ? V.violet : V.line}`, boxShadow: `0 0 ${40 * hot}px ${V.violet}` }}>
      <div style={{ background: hot > 0.5 ? V.violet : V.cyanDim, padding: "12px 0", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 24 * s, letterSpacing: 3, color: V.white }}>{label}</div>
      <div style={{ padding: "18px 0 22px", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 120 * s, color: V.white, lineHeight: 1 }}>{day}</div>
    </div>
  );
};

// 0 · Hook — passing the presentation, "UFA" (Jarbas, moment 1)
const Hook: React.FC<Ctx> = ({ cue }) => {
  const f = useCurrentFrame();
  const colega = cue("para um colega");
  const alivio = cue("alivio enorme");
  const prob = cue("problema enorme");
  const warm = ease(f, alivio, 20) * (1 - ease(f, prob, 16));
  const pull = interpolate(f, [prob, prob + 30], [1, 0.82], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 50%, ${V.cyan}${Math.round(warm * 40).toString(16).padStart(2, "0")}, transparent)` }} />
      <AbsoluteFill style={{ scale: String(pull), transformOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 150, top: 230, width: 780, height: 440, borderRadius: 24, background: "rgba(14,26,70,0.95)", border: `3px solid ${V.line}`, padding: 40 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 850, fontSize: 56, color: V.white }}>Resultados Q3</div>
          {[0.9, 0.7, 0.8].map((w, i) => (
            <div key={i} style={{ height: 22, width: `${w * 100}%`, borderRadius: 11, background: V.line, marginTop: 34 }} />
          ))}
        </div>
        <Jarbas
          x={330}
          y={1440}
          height={640}
          enter={-14}
          pose={[
            [0, "crossed", "apreensivo"],
            [colega, "pointR", "apreensivo"],
            [alivio, "open", "sorriso"],
          ]}
        />
        <Figure x={830} y={1250} s={1.1} at={colega - 6} tone={V.violet} />
        <div style={{ position: "absolute", left: 690, top: 1350, width: 290, padding: "12px 0", textAlign: "center", borderRadius: 999, border: `3px solid ${V.violet}`, color: V.violet, fontFamily: SANS, fontWeight: 800, fontSize: 28, opacity: ease(f, colega, 10) }}>
          PASSAR PARA OUTRO
        </div>
        <Headline text="UFA." at={alivio} y={720} x={560} w={480} align="left" size={170} color={V.cyan} />
        <Svg>
          <Draw d="M330 1520 C 330 1700, 900 1700, 900 1500 C 900 1300, 560 1250, 560 1460" at={prob + 10} dur={30} color={V.violet} width={6} dash />
        </Svg>
      </AbsoluteFill>
      <Headline text="e na _próxima_ vez?" at={prob + 20} y={1300} size={90} />
      <Sfx at={alivio} src="ding" volume={0.12} />
    </AbsoluteFill>
  );
};

// 1 · What solved it today makes it bigger tomorrow
const Bigger: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const maior = cue("ficar maior");
  const grow = 1 + 0.45 * ease(f, maior, 20);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Card at={4} x={90} y={700} w={380} tone="cyan" style={{ textAlign: "center" }}>
          HOJE
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, marginTop: 12, color: V.cyan }}>evitou ✓</div>
        </Card>
        <Svg>
          <Draw d="M480 790 L600 790" at={14} width={6} color={V.white} />
        </Svg>
        <div style={{ position: "absolute", left: 620, top: 690, width: 380, scale: String(grow), transformOrigin: "0% 30%" }}>
          <Card at={18} x={0} y={0} w={380} tone="violet" style={{ textAlign: "center" }}>
            PRÓXIMA
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, marginTop: 12, color: V.violet }}>apresentação</div>
          </Card>
        </div>
        <Headline text="fica *maior* da próxima vez" at={maior} y={260} size={80} />
      </Cam>
    </AbsoluteFill>
  );
};

// 2 · Two days thinking about it
const Days: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const dois = cue("dois dias");
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Headline text="você *sabe* que vai precisar apresentar" at={cue("voce sabe")} y={230} size={66} />
        <Calendar at={4} x={390} y={620} day="12" hot={ease(f, dois, 20)} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + f * 0.03;
          return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 330 - 18, top: 820 + Math.sin(a) * 300 - 18, width: 36, height: 36, borderRadius: 18, background: V.violet, opacity: ease(f, dois + i * 4, 10) * 0.8, boxShadow: `0 0 20px ${V.violet}` }} />;
        })}
        <Headline text="2 dias pensando nisso" at={dois} y={1180} size={70} weight={700} color={V.violet} />
      </Cam>
    </AbsoluteFill>
  );
};

// 3 · The offer
const Offer: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const se = cue("se quiser");
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Calendar at={0} x={90} y={300} day="12" s={0.7} hot={1} />
        <Chat text="Se quiser, eu posso apresentar essa parte pra você." at={se} x={120} y={760} w={820} />
        <div style={{ position: "absolute", left: 140, top: 1120, display: "flex", gap: 30, opacity: ease(f, se + 30, 12) }}>
          <div style={{ padding: "20px 34px", borderRadius: 999, border: `3px solid ${V.line}`, color: V.mute, fontFamily: DISPLAY, fontWeight: 850, fontSize: 40, opacity: 0.5, textDecoration: "line-through" }}>APRESENTAR</div>
          <div style={{ padding: "20px 34px", borderRadius: 999, background: V.violet, color: V.white, fontFamily: DISPLAY, fontWeight: 850, fontSize: 40 }}>ACEITAR</div>
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 4 · Relief — anxiety drops
const Relief: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const ufa = cue("imediatamente sente");
  const cai = cue("ansiedade cai");
  const lvl = interpolate(f, [cai, cai + 30], [0.92, 0.18], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Bg glow="cyan" />
      <Cam d={d}>
        <Headline text="UFA." at={ufa} y={300} size={260} color={V.cyan} />
        <div style={{ position: "absolute", left: 440, top: 700, width: 200, height: 600, borderRadius: 100, border: `4px solid ${V.line}`, overflow: "hidden", opacity: ease(f, cai - 6, 10) }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: `linear-gradient(0deg, ${V.violet}, ${V.cyan})` }} />
        </div>
        <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 5, color: V.white, opacity: ease(f, cai, 10) }}>
          ANSIEDADE
        </div>
        <Headline text="o corpo *relaxa*" at={cue("seu corpo")} y={1400} size={58} weight={700} />
      </Cam>
    </AbsoluteFill>
  );
};

// 5 · Relief reinforces escape
const Reinforce: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const ref = cue("reforcar a fuga");
  const nodes: Array<[string, number, number, string]> = [
    ["DESCONFORTO", 540, 560, V.violet],
    ["EVITAR", 540, 860, V.white],
    ["ALÍVIO", 540, 1160, V.cyan],
  ];
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        {nodes.map(([t, x, y, c], i) => (
          <div key={t} style={{ position: "absolute", left: x - 230, top: y - 60, width: 460, padding: "30px 0", textAlign: "center", borderRadius: 999, border: `4px solid ${c}`, color: c, fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, scale: String(pop(f, 6 + i * 10, 12)) }}>
            {t}
          </div>
        ))}
        <Svg>
          <Draw d="M540 630 L540 790" at={14} width={6} color={V.white} />
          <Draw d="M540 930 L540 1090" at={24} width={6} color={V.white} />
          <Draw d="M780 1160 C 960 1160, 960 860, 780 860" at={ref} dur={26} width={8} color={V.cyan} glow />
        </Svg>
        <Headline text="o alívio *reforça* a fuga" at={ref} y={250} size={84} />
        <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: V.mute, opacity: ease(f, cue("mesma coisa de novo"), 12) }}>
          mais chance de repetir
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// 6 · The lesson your brain learns (Jarbas, moment 2)
const Lesson: React.FC<Ctx> = ({ d, cue }) => {
  const meu = cue("meu colega");
  const perigo = cue("eu estava em perigo");
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <Demote at={perigo}>
          <Thought text="“Meu colega apresentou.”" at={meu} x={160} y={300} w={760} size={52} />
        </Demote>
        <Thought text="“Eu estava em perigo, evitei e fiquei melhor.”" at={perigo} x={90} y={560} w={900} size={56} tail="left" />
        <Spot x={540} y={1150} r={380} at={0} color={V.violet} />
        <Jarbas
          x={540}
          y={1480}
          height={640}
          pose={[
            [0, "listen", "pensativo"],
            [perigo, "chin", "cetico"],
          ]}
        />
      </Cam>
    </AbsoluteFill>
  );
};

// 7 · The loop repeats; the escape route grows
const Repeat: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const laps = [cue("ai chega a proxima"), cue("depois outra"), cue("e outra")];
  const lap = laps.filter((l) => f >= l).length;
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={900} r={330} fill="none" stroke={V.line} strokeWidth={10} />
          <path d="M540 570 A330 330 0 0 1 870 900" fill="none" stroke={V.violet} strokeWidth={10 + lap * 10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${10 + lap * 8}px ${V.violet})` }} />
          <circle cx={540 + Math.cos(f * 0.12) * 330} cy={900 + Math.sin(f * 0.12) * 330} r={22} fill={V.white} />
        </svg>
        <Calendar at={laps[0]} x={390} y={760} day={["12", "19", "26", "03"][lap] ?? "03"} s={0.85} label="PRÓXIMA" />
        <Headline text="evitar fica mais *tentador*" at={cue("mais tentador")} y={250} size={76} />
        <Headline text="depois outra. e outra." at={laps[1]} y={1330} size={70} weight={700} color={V.violet} />
      </Cam>
    </AbsoluteFill>
  );
};

// 8 · Life organised around the discomfort
const Organize: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const org = cue("organizar algumas");
  const items = ["PROMOÇÃO", "REUNIÕES", "PALESTRAS", "CURSOS", "VIAGENS", "EXPOSIÇÃO"];
  return (
    <AbsoluteFill>
      <Bg glow="violet" />
      <Cam d={d}>
        <div style={{ position: "absolute", left: 540 - 190, top: 900 - 190, width: 380, height: 380, borderRadius: 190, background: `radial-gradient(circle, ${V.violet}88, ${V.violet}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, color: V.white, scale: String(pop(f, org, 14)) }}>
          DESCONFORTO
        </div>
        {items.map((t, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          const r = 260 + 230 * ease(f, org + 10 + i * 3, 18);
          return (
            <div key={t} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 140, top: 900 + Math.sin(a) * r * 0.9 - 32, width: 280, padding: "14px 0", textAlign: "center", borderRadius: 999, background: "rgba(20,36,90,0.95)", border: `2px solid ${V.line}`, color: V.mute, fontFamily: SANS, fontWeight: 800, fontSize: 30, opacity: ease(f, org + 4, 10) }}>
              {t}
            </div>
          );
        })}
        <Headline text="a vida se organiza em *volta* disso" at={org} y={230} size={66} />
      </Cam>
    </AbsoluteFill>
  );
};

// 9 · It looks like a solution
const Solution: React.FC<Ctx> = ({ d, cue }) => {
  const f = useCurrentFrame();
  const sol = cue("parece solucao");
  const flip = ease(f, sol + 20, 14);
  return (
    <AbsoluteFill>
      <Bg glow="both" />
      <Cam d={d}>
        <Headline text="tão *traiçoeiro*" at={cue("traicoeiro")} y={250} size={110} />
        <div style={{ position: "absolute", left: 540 - 220, top: 650, width: 440, height: 440, borderRadius: 220, background: flip > 0.5 ? `${V.violet}33` : `${V.cyan}33`, border: `6px solid ${flip > 0.5 ? V.violet : V.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 220, color: flip > 0.5 ? V.violet : V.cyan, fontWeight: 900, fontFamily: SANS, rotate: `${flip * 360}deg`, scale: String(pop(f, 4, 12)) }}>
          {flip > 0.5 ? "!" : "✓"}
        </div>
        <Headline text="parece *solução*" at={sol} y={1200} size={100} />
      </Cam>
    </AbsoluteFill>
  );
};

// 10 · Payoff — less fear now, more fear later
const Payoff: React.FC<Ctx> = ({ d, cue }) => {
  const agora = cue("menos medo agora");
  const depois = cue("mais medo");
  return (
    <AbsoluteFill>
      <Bg glow="both" dim={0.1} />
      <Cam d={d} from={1.03} to={1}>
        <Svg>
          <Draw d="M300 760 C 120 960, 120 1060, 300 1180" at={agora + 10} dur={30} color={V.white} width={5} dash />
          <Draw d="M780 1180 C 960 1060, 960 960, 780 760" at={depois} dur={30} color={V.white} width={5} dash />
        </Svg>
        <Headline text="menos medo *agora.*" at={agora} y={600} size={96} />
        <Headline text="mais medo _depois?_" at={depois} y={1100} size={96} />
      </Cam>
      <Sfx at={depois} src="switch" volume={0.1} />
    </AbsoluteFill>
  );
};

const SCENES: SceneDef[] = [
  { at: 0, C: Hook },
  { at: "porque aquilo que resolveu", C: Bigger },
  { at: "imagina a situacao", C: Days },
  { at: "chegando o dia", C: Offer },
  { at: "voce aceita", C: Relief },
  { at: "e e justamente esse alivio", C: Reinforce },
  { at: "entao talvez o aprendizado", C: Lesson },
  { at: "ai chega a proxima", C: Repeat },
  { at: "ate que se comeca", C: Organize },
  { at: "por isso que evitar", C: Solution },
  { at: "foge pra sentir", C: Payoff },
];

export const V5_DURATION = 75.56 + 1.8;
export const Vox5: React.FC = () => (
  <VoxVideo
    audio="vox/audio/5.wav"
    tokens={tokens as Array<{ text: string; startMs: number }>}
    scenes={SCENES}
    duration={V5_DURATION}
    keys={["alivio", "colega", "problema", "maior", "ufa", "ansiedade", "reforcar", "fuga", "evitar", "perigo", "tentador", "traicoeiro", "solucao", "medo"]}
  />
);
