import React from "react";
import { AbsoluteFill, Freeze, Img, staticFile, useCurrentFrame } from "remotion";
import { Briefcase, Clock, DoorOpen, Eye, Heart, Hourglass, Mic, Plane, Rewind, Shield, Star, ThumbsUp, Users } from "lucide-react";
import { Avatar, Gauge, Grain, Ico, Neural, Orbit, Tile, Wave } from "./kit";
import { DISPLAY, MONO, P, SERIF, UI } from "./theme";

export const CW = 1080;
export const CH = 1350;

/* `*text*` → serif italic accent */
const Rich: React.FC<{ t: string; accent?: string }> = ({ t, accent = P.lav }) => (
  <>
    {t.split("*").map((seg, i) =>
      i % 2 ? (
        <span key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: accent, letterSpacing: 0, fontSize: "1.14em", lineHeight: 0.9 }}>
          {seg}
        </span>
      ) : (
        <React.Fragment key={i}>{seg}</React.Fragment>
      ),
    )}
  </>
);

const CBg: React.FC<{ tone?: "violet" | "cyan" | "both" }> = ({ tone = "both" }) => (
  <AbsoluteFill style={{ background: P.night, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(120% 70% at 50% 0%, ${P.deep} 0%, ${P.night} 65%)` }} />
    {tone !== "cyan" && <div style={{ position: "absolute", left: -260, top: 520, width: 1000, height: 1000, borderRadius: "50%", background: `radial-gradient(circle, ${P.violet}50 0%, transparent 62%)` }} />}
    {tone !== "violet" && <div style={{ position: "absolute", left: 520, top: 760, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${P.cyan}30 0%, transparent 62%)` }} />}
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${P.lav}1e 1.4px, transparent 1.6px)`, backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 80%)" }} />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

type Slide = {
  kicker?: string;
  lead?: string;
  title: string;
  body?: string[];
  big?: boolean;
  size?: number;
  visual?: React.ReactNode;
  tone?: "violet" | "cyan" | "both";
  textTop?: number;
};

const Frame: React.FC<{ s: Slide; n: number; total: number }> = ({ s, n, total }) => (
  <AbsoluteFill>
    <CBg tone={s.tone} />
    {s.visual}
    {/* header */}
    <div style={{ position: "absolute", left: 80, top: 64, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: P.white }}>
        V<span style={{ color: "transparent", WebkitTextStroke: `2px ${P.cyan}` }}>O</span>X
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === n ? 40 : 12, height: 12, borderRadius: 6, background: i === n ? `linear-gradient(90deg, ${P.violet}, ${P.cyan})` : "rgba(255,255,255,0.18)" }} />
        ))}
      </div>
    </div>
    {/* text block */}
    <div style={{ position: "absolute", left: 80, right: 80, top: s.textTop ?? 190 }}>
      {s.kicker && (
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: P.cyan, textTransform: "uppercase", marginBottom: 34 }}>
          <span style={{ fontFamily: MONO, color: P.lav }}>{String(n + 1).padStart(2, "0")}</span>
          <span style={{ width: 50, height: 2, background: P.cyan }} />
          {s.kicker}
        </div>
      )}
      {s.lead && <div style={{ fontFamily: UI, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: "#C9CFEA", marginBottom: 24 }}><Rich t={s.lead} /></div>}
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: s.size ?? (s.big ? 104 : 74), lineHeight: 1.02, letterSpacing: -(s.size ?? 74) * 0.03, color: P.white, textWrap: "balance" as never }}>
        <Rich t={s.title} />
      </div>
      {s.body?.map((b, i) => (
        <div key={i} style={{ fontFamily: UI, fontWeight: 500, fontSize: 37, lineHeight: 1.38, color: "#C9CFEA", marginTop: i ? 20 : 38 }}>
          <Rich t={b} accent={P.cyan} />
        </div>
      ))}
    </div>
    {/* footer */}
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 56, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: P.mute }}>
      <span>@jarbasvox</span>
      {n < total - 1 ? <span style={{ color: P.lav }}>arrasta →</span> : <span style={{ color: P.cyan }}>salva e compartilha</span>}
    </div>
  </AbsoluteFill>
);

const Head: React.FC<{ src: string; x: number; y: number; s: number; ring?: boolean }> = ({ src, x, y, s, ring = true }) => (
  <>
    {ring && <Orbit x={x} y={y} r={s * 0.62} at={-60} nodes={4} />}
    <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: `radial-gradient(circle at 50% 40%, ${P.violet}66, ${P.deep} 70%)`, boxShadow: `0 0 120px ${P.violet}55` }} />
    <Img src={staticFile(`vox/heads/${src}.png`)} style={{ position: "absolute", left: x - s * 0.5, top: y - s * 0.6, width: s, height: s * 1.1, objectFit: "contain", filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.6))` }} />
  </>
);

const Loop: React.FC<{ y: number }> = ({ y }) => {
  const nodes: Array<[string, number, number, string]> = [
    ["medo", 540, y, P.danger],
    ["evitar", 820, y + 230, P.white],
    ["alívio", 260, y + 230, P.cyan],
  ];
  return (
    <>
      <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill={P.lav} /></marker>
        </defs>
        <path d={`M650 ${y + 40} Q 800 ${y + 70} 800 ${y + 170}`} stroke={P.lav} strokeWidth={5} fill="none" markerEnd="url(#ar)" />
        <path d={`M690 ${y + 260} Q 540 ${y + 330} 390 ${y + 260}`} stroke={P.lav} strokeWidth={5} fill="none" markerEnd="url(#ar)" />
        <path d={`M280 ${y + 170} Q 290 ${y + 70} 430 ${y + 40}`} stroke={P.cyan} strokeWidth={7} fill="none" markerEnd="url(#ar)" style={{ filter: `drop-shadow(0 0 10px ${P.cyan})` }} />
      </svg>
      {nodes.map(([t, x, yy, c]) => (
        <div key={t} style={{ position: "absolute", left: x, top: yy, translate: "-50% -50%", padding: "22px 40px", borderRadius: 999, border: `3px solid ${c}`, background: "rgba(17,28,61,0.9)", fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: c }}>{t}</div>
      ))}
    </>
  );
};

const IconRow: React.FC<{ y: number; items: Array<[typeof Star, string, number]> }> = ({ y, items }) => (
  <>
    {items.map(([I, c, dim], i) => (
      <div key={i} style={{ position: "absolute", left: 230 + i * 310, top: y, translate: "-50% -50%", rotate: `${(i - 1) * 6}deg`, opacity: 1 - dim * 0.65 }}>
        <Tile x={0} y={0} s={1} at={-60} I={I} tone={i === 1 ? "cyan" : "violet"} />
      </div>
    ))}
  </>
);

const Stars: React.FC<{ n: number; color: string; I?: typeof Star }> = ({ n, color, I = Star }) => (
  <div style={{ display: "flex", gap: 10 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <I key={i} size={54} color={color} fill={i < n ? color : "transparent"} strokeWidth={2} />
    ))}
  </div>
);

const Card: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; glow?: string }> = ({ x, y, w, h, children, glow = P.violet }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 34, padding: 2, background: `linear-gradient(140deg, ${P.lav}88, rgba(255,255,255,0.06) 40%, ${P.cyan}66)`, boxShadow: `0 40px 90px rgba(2,4,12,0.6), 0 0 80px ${glow}33` }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 32, background: "linear-gradient(180deg, rgba(26,40,92,0.95), rgba(10,16,40,0.96))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)", position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

const Ecg: React.FC<{ y: number; spike: number; color: string }> = ({ y, spike, color }) => (
  <svg width={CW} height={300} style={{ position: "absolute", left: 0, top: y }}>
    <path d={`M80 150 ${Array.from({ length: 23 }).map((_, i) => { const x = 80 + i * 40; return i % 4 === 2 ? `L${x - 10} 150 L${x} ${150 - spike} L${x + 10} ${150 + spike * 0.5} L${x + 20} 150` : `L${x + 20} 150`; }).join(" ")}`} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
  </svg>
);

/* ─────────────── Carousel 9 — Minha relação com a ansiedade social hoje ─────────────── */
const C9: Slide[] = [
  {
    title: "A ansiedade social fez parte da minha *história.*",
    body: ["Mas que lugar ela ocupa na minha vida hoje?"],
    size: 96,
    textTop: 170,
    visual: <Head src="pensativo-1" x={540} y={1000} s={420} />,
  },
  {
    kicker: "A história por trás",
    title: "Pra responder a essa pergunta, preciso *voltar* a algumas experiências",
    body: ["que mudaram minha maneira de enxergar a comunicação e a mim mesmo."],
    visual: (
      <>
        <div style={{ position: "absolute", left: 100, right: 100, top: 1050, height: 4, background: `linear-gradient(90deg, ${P.cyan}, ${P.violet}, transparent)` }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ position: "absolute", left: 120 + i * 200, top: 1032, width: 40, height: 40, borderRadius: 20, background: P.night, border: `5px solid ${i === 0 ? P.cyan : P.lav}`, opacity: 1 - i * 0.16 }} />
        ))}
        <div style={{ position: "absolute", left: 120, top: 1110 }}><Ico I={Rewind} size={60} color={P.cyan} /></div>
      </>
    ),
  },
  {
    kicker: "Quando tudo parecia mais difícil",
    title: "Situações que pareciam simples para outras pessoas exigiam um *esforço enorme* de mim.",
    body: ["Conversar, me expor e lidar com o julgamento dos outros nem sempre eram coisas simples."],
    size: 68,
    visual: (
      <Card x={80} y={980} w={920} h={240}>
        {[["OUTRAS PESSOAS", 0.22, P.cyan], ["EU", 0.96, P.violet]].map(([t, v, c], i) => (
          <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 40 + i * 96 }}>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: P.mute, marginBottom: 12 }}>{t as string} · ESFORÇO</div>
            <div style={{ height: 26, borderRadius: 13, background: "rgba(255,255,255,0.07)" }}>
              <div style={{ height: 26, width: `${(v as number) * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, ${P.violet}, ${c as string})`, boxShadow: `0 0 24px ${c as string}88` }} />
            </div>
          </div>
        ))}
      </Card>
    ),
  },
  {
    kicker: "O que parecia uma solução",
    title: "Muitas vezes, *evitar* era o caminho mais fácil.",
    body: ["E funcionava… pelo menos naquele momento.", "O desconforto passava. A ansiedade diminuía."],
    size: 84,
    visual: (
      <>
        <Tile x={260} y={1080} s={1.1} at={-60} I={DoorOpen} tone="cyan" />
        <Card x={430} y={960} w={570} h={240}>
          <svg width={570} height={240} style={{ position: "absolute", inset: 0 }}>
            <path d="M30 50 C 160 50, 200 60, 260 120 S 420 200, 540 205" fill="none" stroke={P.cyan} strokeWidth={7} style={{ filter: `drop-shadow(0 0 10px ${P.cyan})` }} />
          </svg>
          <div style={{ position: "absolute", left: 30, bottom: 18, fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: P.mute }}>ANSIEDADE · CURTO PRAZO</div>
        </Card>
      </>
    ),
  },
  {
    kicker: "O que demorei a entender",
    title: "Nosso cérebro *aprende* com o alívio.",
    body: ["Quando evitamos algo que provoca medo, podemos reforçar a ideia de que fugir era necessário para ficarmos seguros.", "E isso pode manter o *medo vivo.*"],
    size: 84,
    visual: <Loop y={920} />,
  },
  {
    kicker: "O preço invisível",
    title: "Não era apenas a ansiedade que influenciava minha vida.",
    body: ["Eram também as *escolhas* que eu deixava de fazer por causa dela.", "Oportunidades, experiências e relações acabavam ficando pelo caminho."],
    size: 70,
    visual: <IconRow y={1110} items={[[Briefcase, P.lav, 0.5], [Plane, P.cyan, 0.7], [Users, P.lav, 0.85]]} />,
  },
  {
    kicker: "O começo de uma mudança",
    title: "Comecei a estudar *neurociência,* comportamento humano, ansiedade e comunicação.",
    body: ["Esse conhecimento transformou não apenas minha maneira de enxergar o problema, mas também meu caminho profissional."],
    size: 68,
    visual: <Neural x={540} y={1090} s={0.75} at={-80} />,
  },
  {
    kicker: "Uma descoberta importante",
    lead: "Uma das coisas mais importantes que aprendi:",
    title: "Sentir ansiedade não significa estar em *perigo* ou ser incapaz.",
    body: ["E esperar o medo desaparecer para começar a viver pode se tornar outra forma de *continuar evitando.*"],
    size: 74,
    visual: (
      <>
        <Gauge x={330} y={1150} s={0.62} at={-60} value={0.62} label="ansiedade" color={P.lav} />
        <Tile x={820} y={1100} s={0.9} at={-60} I={Shield} tone="cyan" />
      </>
    ),
  },
  {
    kicker: "E hoje?",
    title: "Essa experiência faz parte da minha *história*",
    body: ["e ajuda a explicar por que trabalho com comunicação.", "Ela contribuiu para construir quem sou, mas *não precisa definir* todas as minhas escolhas."],
    size: 80,
    visual: (
      <>
        <Head src="sorriso-1" x={830} y={1110} s={250} ring={false} />
        <Wave x={90} y={1040} w={560} h={150} at={-60} bars={28} />
      </>
    ),
  },
  {
    lead: "Durante muito tempo, a ansiedade social influenciou aquilo que eu deixava de fazer. Hoje, uma das perguntas que considero mais importantes é:",
    title: "Quanto da sua vida você está deixando de viver enquanto espera o *medo desaparecer?*",
    size: 82,
    textTop: 200,
    visual: <Tile x={540} y={1110} s={0.95} at={-60} I={Hourglass} tone="violet" />,
  },
];

/* ─────────────── Carousel 12 — Falar melhor e continuar sofrendo ─────────────── */
const C12: Slide[] = [
  {
    title: "Você pode aprender a falar *melhor*",
    body: ["e continuar sofrendo toda vez que precisa falar."],
    size: 108,
    textTop: 170,
    visual: (
      <>
        <Head src="apreensivo-1" x={540} y={1010} s={360} />
        <div style={{ position: "absolute", left: 760, top: 1060 }}><Tile x={0} y={0} s={0.7} at={-60} I={Mic} tone="cyan" /></div>
      </>
    ),
  },
  {
    kicker: "O paradoxo",
    title: "Uma apresentação pode ser *ótima* pra quem assiste",
    body: ["e um sofrimento enorme pra quem está apresentando."],
    size: 84,
    visual: (
      <>
        <Card x={80} y={930} w={440} h={250}>
          <div style={{ padding: 34 }}><div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: P.mute, marginBottom: 20 }}>PLATEIA</div><Stars n={5} color={P.cyan} /></div>
        </Card>
        <Card x={560} y={930} w={440} h={250} glow={P.danger}>
          <div style={{ padding: 34 }}><div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: P.mute, marginBottom: 20 }}>QUEM FALA</div><Stars n={1} color={P.danger} I={Heart} /></div>
        </Card>
      </>
    ),
  },
  {
    kicker: "O que ninguém vê",
    lead: "Isso acontece porque",
    title: "existe uma parte da comunicação que os outros *não conseguem enxergar*",
    body: ["mas que pode mudar completamente a experiência de quem fala."],
    size: 72,
    visual: (
      <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
        <line x1={60} y1={1010} x2={1020} y2={1010} stroke={P.cyan} strokeWidth={3} strokeDasharray="14 10" />
        <path d="M480 1010 L540 930 L610 1010 Z" fill={P.white} opacity={0.9} />
        <path d="M480 1010 L610 1010 L760 1130 L700 1260 L380 1260 L300 1120 Z" fill={`${P.violet}55`} stroke={P.lav} strokeWidth={4} />
      </svg>
    ),
  },
  {
    kicker: "Duas experiências diferentes",
    title: "Por fora, a pessoa fala com clareza e até recebe elogios.",
    lead: "Imagine alguém fazendo uma apresentação.",
    body: ["Mas *por dentro…*"],
    size: 76,
    visual: (
      <Card x={80} y={960} w={920} h={240}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 40px" }}>
          <Avatar x={80} y={140} s={0.7} at={-60} tone={P.lav} />
          <div style={{ marginLeft: 130, flex: 1 }}>
            <div style={{ height: 20, width: "90%", borderRadius: 10, background: "rgba(255,255,255,0.14)" }} />
            <div style={{ height: 20, width: "60%", borderRadius: 10, background: "rgba(255,255,255,0.1)", marginTop: 16 }} />
          </div>
          <Ico I={ThumbsUp} size={64} color={P.cyan} />
        </div>
      </Card>
    ),
  },
  {
    kicker: "O que pode estar acontecendo",
    title: "O coração está *acelerado.*",
    body: ["Ela monitora cada palavra, interpreta expressões da plateia e conta os minutos para aquilo terminar.", "Pra quem assiste, foi ótimo. Pra ela, foi um *sofrimento.*"],
    size: 92,
    visual: (
      <>
        <Ecg y={960} spike={110} color={P.danger} />
        <div style={{ position: "absolute", left: 80, top: 1180, fontFamily: DISPLAY, fontWeight: 800, fontSize: 60, color: P.white }}>128 <span style={{ fontFamily: MONO, fontSize: 24, color: P.mute, letterSpacing: 3 }}>BPM</span></div>
        <div style={{ position: "absolute", right: 80, top: 1190, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 40, color: P.lav }}><Ico I={Clock} size={44} color={P.lav} />04:59</div>
      </>
    ),
  },
  {
    kicker: "Um detalhe importante",
    title: "Podemos direcionar parte da atenção para *nós mesmos.*",
    lead: "Quando estamos muito preocupados com nossos sintomas ou com a impressão que causamos,",
    body: ["Isso pode tornar a experiência muito mais desgastante."],
    size: 78,
    visual: (
      <>
        <Avatar x={540} y={1110} s={0.9} at={-60} tone={P.lav} />
        <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
          {[-1, 1].map((d) => (
            <path key={d} d={`M${540 + d * 400} 1060 Q ${540 + d * 260} 980 ${540 + d * 130} 1080`} stroke={P.cyan} strokeWidth={6} fill="none" strokeDasharray="18 12" />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 140, top: 1020 }}><Ico I={Eye} size={70} color={P.cyan} /></div>
        <div style={{ position: "absolute", right: 140, top: 1020 }}><Ico I={Eye} size={70} color={P.cyan} /></div>
      </>
    ),
  },
  {
    kicker: "Onde entra a oratória?",
    title: "Aprender técnicas de comunicação é *importante.*",
    body: ["Elas ajudam a falar melhor.", "Mas existe uma diferença…"],
    size: 86,
    visual: (
      <div style={{ position: "absolute", left: 80, right: 80, top: 960, display: "flex", flexWrap: "wrap", gap: 18 }}>
        {["clareza", "repertório", "organização", "voz", "argumentação", "+ habilidades"].map((t, i) => (
          <div key={t} style={{ padding: "18px 32px", borderRadius: 999, background: i % 2 ? "rgba(26,40,92,0.95)" : P.violet, border: `1.5px solid ${P.lav}55`, fontFamily: UI, fontWeight: 700, fontSize: 36, color: P.white }}>{t}</div>
        ))}
      </div>
    ),
  },
  {
    kicker: "O que a técnica não resolve sozinha",
    title: "Saber como falar não é o mesmo que lidar com o *medo* enquanto você fala.",
    body: ["E o contrário também vale: sentir menos ansiedade não ensina automaticamente a improvisar ou argumentar melhor."],
    size: 70,
    visual: (
      <>
        <Card x={80} y={1010} w={420} h={170}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: P.cyan }}>TÉCNICA</div></Card>
        <Card x={580} y={1010} w={420} h={170} glow={P.lav}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: P.lav }}>EMOCIONAL</div></Card>
        <div style={{ position: "absolute", left: 506, top: 1080, width: 68, height: 30, borderTop: `4px dashed ${P.danger}`, borderBottom: `4px dashed ${P.danger}` }} />
      </>
    ),
  },
  {
    kicker: "Por isso trabalho os dois lados",
    title: "Na VOX, integro os fatores *internos* e as habilidades de comunicação.",
    body: ["O objetivo é desenvolver *segurança, confiança e personalidade* para se expressar melhor, mesmo sob pressão."],
    size: 72,
    visual: (
      <svg width={CW} height={CH} style={{ position: "absolute", inset: 0 }}>
        <circle cx={430} cy={1110} r={170} fill={`${P.violet}40`} stroke={P.violet} strokeWidth={5} />
        <circle cx={650} cy={1110} r={170} fill={`${P.cyan}30`} stroke={P.cyan} strokeWidth={5} />
        <text x={330} y={1120} fill={P.white} fontFamily={MONO} fontSize={24} letterSpacing={3}>DENTRO</text>
        <text x={680} y={1120} fill={P.white} fontFamily={MONO} fontSize={24} letterSpacing={3}>FORA</text>
        <circle cx={540} cy={1110} r={14} fill={P.white} />
      </svg>
    ),
  },
  {
    title: "Falar bem e se sentir bem enquanto fala são coisas *diferentes.*",
    body: ["E talvez sua maior dificuldade não esteja naquilo que as pessoas conseguem ver.", "É por isso que a VOX trabalha a comunicação de *dentro para fora.*"],
    size: 86,
    textTop: 190,
    visual: (
      <>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 540 - (60 + i * 70), top: 1080 - (60 + i * 70), width: (60 + i * 70) * 2, height: (60 + i * 70) * 2, borderRadius: "50%", border: `${4 - i * 0.6}px solid ${i % 2 ? P.cyan : P.lav}`, opacity: 1 - i * 0.22 }} />
        ))}
        <div style={{ position: "absolute", left: 510, top: 1050, width: 60, height: 60, borderRadius: 30, background: `linear-gradient(135deg, ${P.violet}, ${P.cyan})`, boxShadow: `0 0 40px ${P.violet}` }} />
      </>
    ),
  },
];

const Deck: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const f = useCurrentFrame();
  const s = slides[Math.min(f, slides.length - 1)];
  return (
    <Freeze frame={90}>
      <Frame s={s} n={f} total={slides.length} />
    </Freeze>
  );
};

export const Carousel9: React.FC = () => <Deck slides={C9} />;
export const Carousel12: React.FC = () => <Deck slides={C12} />;
