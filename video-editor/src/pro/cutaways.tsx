import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, INTER, SERIF, clamp } from "./theme";
import { Counter, Cutaway, MotionBlur, Reveal, progress } from "./primitives";

const brl = (n: number) => "R$ " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const Badge: React.FC<{ n: number; dark?: boolean; at?: number }> = ({ n, dark, at = 0 }) => (
  <Reveal at={at} dir="down" dist={30} blur={10}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px",
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(17,17,17,0.06)",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(17,17,17,0.08)",
        fontFamily: INTER,
        fontWeight: 600,
        fontSize: 30,
        color: dark ? C.white : C.ink,
        letterSpacing: 1,
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: 6, background: C.lime, boxShadow: `0 0 14px ${C.lime}` }} />
      {String(n).padStart(2, "0")} / 07
    </div>
  </Reveal>
);

const Col: React.FC<{ children: React.ReactNode; top?: number; gap?: number; align?: "flex-start" | "center" }> = ({
  children,
  top,
  gap = 0,
  align = "flex-start",
}) => (
  <AbsoluteFill
    style={{
      padding: top === undefined ? "180px 84px 360px" : `${top}px 84px 0`,
      display: "flex",
      flexDirection: "column",
      justifyContent: top === undefined ? "center" : "flex-start",
      alignItems: align,
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

// ── Hook ───────────────────────────────────────────────────────────
export const Hook: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const bar = progress(frame, 34, 12);
  return (
    <Cutaway duration={d} bg={C.paper} instant>
      <AbsoluteFill style={{ scale: String(1 + frame * 0.0006) }}>
        <Col>
          <Reveal at={0} dir="left" dist={80} dur={10}>
            <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 70, color: C.ink, letterSpacing: -2 }}>
              Coisas sobre
            </div>
          </Reveal>
          <Reveal at={7} dir="up" dist={90} blur={24}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 190, lineHeight: 0.95, color: C.ink, letterSpacing: -4 }}>
              comunicação
            </div>
          </Reveal>
          <Reveal at={18} dir="right" dist={80} dur={10}>
            <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 60, color: C.gray, letterSpacing: -1.5, marginTop: 26 }}>
              que me deixariam
            </div>
          </Reveal>
          <div style={{ position: "relative", marginTop: 34 }}>
            <div
              style={{
                position: "absolute",
                left: -18,
                right: -18,
                top: 34,
                bottom: 18,
                background: C.lime,
                scale: `${bar} 1`,
                transformOrigin: "left center",
                rotate: "-1.5deg",
              }}
            />
            <Reveal at={28} dir="up" dist={120} blur={30} scaleFrom={1.3}>
              <div
                style={{
                  position: "relative",
                  fontFamily: INTER,
                  fontStyle: "italic",
                  fontWeight: 900,
                  fontSize: 200,
                  lineHeight: 1,
                  color: C.ink,
                  letterSpacing: -8,
                }}
              >
                MAIS RICO
              </div>
            </Reveal>
          </div>
        </Col>
      </AbsoluteFill>
    </Cutaway>
  );
};

// ── 01 · Saber fazer ≠ ser reconhecido ─────────────────────────────
export const ValueChart: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const draw = progress(frame, 10, 34);
  const pts = [
    [0, 330],
    [180, 300],
    [360, 310],
    [540, 210],
    [720, 150],
    [912, 40],
  ];
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const len = 1300;
  return (
    <Cutaway duration={d} bg={`linear-gradient(180deg, ${C.black} 0%, #07162E 100%)`}>
      <Col top={250} align="center">
        <Badge n={1} dark />
        <Reveal at={3} dur={10}>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 56, color: C.white, marginTop: 60, letterSpacing: -1.5, textAlign: "center" }}>
            Saber fazer não basta.
          </div>
        </Reveal>
        <Reveal at={9} dur={10}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: "#9DB8FF", marginTop: 6, textAlign: "center", lineHeight: 1.05 }}>
            precisam ver
            <br />o seu valor.
          </div>
        </Reveal>
        <Reveal at={14} dir="up" dist={80} blur={26} scaleFrom={0.9}>
          <div
            style={{
              fontFamily: INTER,
              fontWeight: 800,
              fontSize: 300,
              letterSpacing: -14,
              lineHeight: 1,
              marginTop: 70,
              background: `linear-gradient(180deg, #7FB2FF 0%, ${C.blue} 60%, #0B3FA8 100%)`,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            <Counter from={12} to={91} at={14} dur={36} format={(n) => `${Math.round(n)}%`} />
          </div>
        </Reveal>
      </Col>
      <svg width={1080} height={420} viewBox="-84 -20 1080 420" style={{ position: "absolute", left: 0, bottom: 160 }}>
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${path} L912 400 L0 400 Z`} fill="url(#area)" opacity={draw} />
        <path
          d={path}
          fill="none"
          stroke="#6FA4FF"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: `drop-shadow(0 0 12px ${C.blue})` }}
        />
        {pts.map(([x, y], i) => {
          const s = interpolate(draw, [i / pts.length, i / pts.length + 0.12], [0, 1], clamp);
          return <circle key={i} cx={x} cy={y} r={11 * s} fill={C.white} />;
        })}
      </svg>
      <Reveal at={20} style={{ position: "absolute", bottom: 100, width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, color: "rgba(255,255,255,0.6)", letterSpacing: 4 }}>
          VALOR PERCEBIDO
        </span>
      </Reveal>
    </Cutaway>
  );
};

// ── 02 · Explicar demais enfraquece ────────────────────────────────
export const ExplainDrain: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const drain = interpolate(frame, [62, 80], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const reps = [0, 1, 2, 3, 4];
  return (
    <Cutaway duration={d} bg={C.paper}>
      <Col>
        <Badge n={2} />
        <Reveal at={2} dir="left" dist={90}>
          <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 150, color: C.ink, letterSpacing: -7, marginTop: 70, lineHeight: 1 }}>
            Explicar
          </div>
        </Reveal>
        <div style={{ position: "relative", height: 330, width: "100%" }}>
          {reps.map((i) => (
            <Reveal
              key={i}
              at={15 + i * 3}
              dir="right"
              dist={260}
              blur={30}
              dur={9}
              style={{ position: "absolute", left: i * 30, top: i * 76 }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 150,
                  lineHeight: 1,
                  color: i === 0 ? C.ink : `rgba(17,17,17,${0.55 - i * 0.1})`,
                }}
              >
                demais
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal at={56} dur={10}>
          <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 52, color: C.gray, marginTop: 120, letterSpacing: -1 }}>
            enfraquece o seu
          </div>
        </Reveal>
        <Reveal at={58} dir="up" dist={70} blur={22}>
          <div
            style={{
              fontFamily: INTER,
              fontStyle: "italic",
              fontWeight: Math.round(900 - 800 * drain),
              fontSize: 158,
              letterSpacing: -6 + 10 * drain,
              lineHeight: 1.05,
              color: C.ink,
              opacity: 1 - 0.65 * drain,
            }}
          >
            ARGUMENTO
          </div>
        </Reveal>
      </Col>
    </Cutaway>
  );
};

// ── 03 · Evitar conflitos sai caro ─────────────────────────────────
const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.72)",
      border: "2px solid rgba(255,255,255,0.95)",
      borderRadius: 44,
      boxShadow: "0 40px 90px rgba(80,60,200,0.18), 0 6px 18px rgba(80,60,200,0.08)",
      padding: "44px 52px",
      ...style,
    }}
  >
    {children}
  </div>
);

export const CostCard: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [44, 47, 50, 53], [0, -10, 8, 0], clamp);
  return (
    <Cutaway duration={d} bg={`radial-gradient(120% 80% at 50% 30%, #F4F2FF 0%, ${C.lavender} 60%, #DCD8F7 100%)`}>
      <Col align="center">
        <Badge n={3} />
        <Reveal at={3}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 108, color: C.ink, marginTop: 70, textAlign: "center", lineHeight: 1 }}>
            Evitar conflitos
          </div>
        </Reveal>
        <Reveal at={9} dir="up" dist={120} blur={26} scaleFrom={0.88} style={{ marginTop: 80, translate: `${shake}px 0` }}>
          <GlassCard style={{ width: 860 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 28, color: "#555", letterSpacing: 2 }}>
                CUSTO TOTAL
              </span>
              <span
                style={{
                  fontFamily: INTER,
                  fontWeight: 700,
                  fontSize: 26,
                  color: C.white,
                  background: C.pink,
                  borderRadius: 999,
                  padding: "8px 18px",
                  opacity: progress(frame, 40, 6),
                }}
              >
                +126%
              </span>
            </div>
            <div style={{ fontFamily: INTER, fontWeight: 800, fontSize: 128, color: C.ink, letterSpacing: -5, marginTop: 14 }}>
              <Counter from={0} to={250928} at={12} dur={34} format={brl} />
            </div>
          </GlassCard>
        </Reveal>
        {["Conversa difícil adiada", "Oportunidade perdida"].map((t, i) => (
          <Reveal key={t} at={24 + i * 7} dir="up" dist={80} blur={18} style={{ marginTop: 28 }}>
            <GlassCard style={{ width: 860, padding: "30px 44px", display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, background: C.pink, boxShadow: `0 0 16px ${C.pink}` }} />
              <span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 44, color: C.ink, letterSpacing: -1 }}>{t}</span>
            </GlassCard>
          </Reveal>
        ))}
      </Col>
    </Cutaway>
  );
};

// ── 04 · História muda a percepção (neon draw) ─────────────────────
export const StoryNeon: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 32], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lit = progress(frame, 30, 12);
  const len = 2400;
  const bubble =
    "M180 120 H720 Q820 120 820 220 V470 Q820 570 720 570 H420 L300 680 L320 570 H180 Q80 570 80 470 V220 Q80 120 180 120 Z";
  const col = lit > 0.5 ? C.lime : C.white;
  return (
    <Cutaway duration={d} bg={C.black}>
      <Col top={250} align="center">
        <Badge n={4} dark />
        <Reveal at={2}>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 34, color: "rgba(255,255,255,0.75)", marginTop: 70 }}>
            {lit > 0.5 ? "resultado:" : "contar bem uma"}
          </div>
        </Reveal>
      </Col>
      <svg width={900} height={760} viewBox="0 0 900 760" style={{ position: "absolute", left: 90, top: 520 }}>
        <path
          d={bubble}
          fill={C.lime}
          fillOpacity={0.12 * lit}
          stroke={col}
          strokeWidth={14 + 16 * lit}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - draw)}
          style={{ filter: `drop-shadow(0 0 ${10 + 30 * lit}px ${col}) drop-shadow(0 0 ${4 + 60 * lit}px ${col})` }}
        />
        {[0, 1, 2].map((i) => {
          const s = progress(frame, 18 + i * 4, 8);
          return <circle key={i} cx={300 + i * 150} cy={345} r={34 * s} fill={col} style={{ filter: `drop-shadow(0 0 20px ${col})` }} />;
        })}
      </svg>
      <Reveal at={34} dir="up" dist={60} blur={24} style={{ position: "absolute", bottom: 330, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 60, color: C.white, letterSpacing: -1.5 }}>uma boa</div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 170,
            lineHeight: 1,
            color: C.lime,
            textShadow: `0 0 40px ${C.lime}88`,
          }}
        >
          história.
        </div>
      </Reveal>
    </Cutaway>
  );
};

// ── 05 · Ouvir é habilidade (prompt UI typing) ─────────────────────
export const ListenPrompt: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const text = "ouvir também é comunicar";
  const typed = Math.floor(interpolate(frame, [8, 36], [0, text.length], clamp));
  const sent = frame >= 40;
  const press = interpolate(frame, [38, 41, 45], [1, 0.86, 1], clamp);
  const bars = Array.from({ length: 28 });
  return (
    <Cutaway duration={d} bg={C.dark}>
      <Col align="center">
        <Badge n={5} dark />
        <Reveal at={2}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 120, color: C.white, marginTop: 80, lineHeight: 1 }}>
            Ouvir
          </div>
        </Reveal>
        <Reveal at={5}>
          <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 52, color: "rgba(255,255,255,0.6)", marginTop: 10, letterSpacing: -1 }}>
            é uma baita habilidade
          </div>
        </Reveal>
        <Reveal at={4} dir="up" dist={90} blur={22} scaleFrom={0.92} style={{ marginTop: 110 }}>
          <div
            style={{
              width: 900,
              borderRadius: 40,
              background: "#16191C",
              border: "2px solid #262A2F",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              padding: "34px 36px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-14 0M12 19v3" stroke={C.dark} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 42, color: typed ? C.white : "#5C6168" }}>
                {typed ? text.slice(0, typed) : "Escreva um prompt…"}
                <span style={{ opacity: frame % 16 < 8 && !sent ? 1 : 0, color: C.lime }}>|</span>
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 34 }}>
              <div style={{ display: "flex", gap: 14 }}>
                {["Escuta ativa", "Empatia"].map((t) => (
                  <span key={t} style={{ fontFamily: INTER, fontWeight: 500, fontSize: 26, color: "#A3A8AF", border: "2px solid #2A2E33", borderRadius: 14, padding: "10px 18px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: C.lime,
                  scale: String(press),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: sent ? `0 0 30px ${C.lime}` : "none",
                }}
              >
                <svg width="34" height="34" viewBox="0 0 24 24">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke={C.dark} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ display: "flex", gap: 10, alignItems: "center", height: 220, marginTop: 70, opacity: progress(frame, 40, 8) }}>
          {bars.map((_, i) => {
            const h = 30 + Math.abs(Math.sin(frame * 0.35 + i * 0.7) * Math.cos(i * 0.4)) * 170 * progress(frame, 40 + (i % 7), 10);
            return <div key={i} style={{ width: 16, height: h, borderRadius: 8, background: C.lime, boxShadow: `0 0 18px ${C.lime}66` }} />;
          })}
        </div>
      </Col>
    </Cutaway>
  );
};

// ── 06 · Posicionamento = oportunidades ────────────────────────────
export const Opportunities: React.FC<{ d: number }> = ({ d }) => {
  const items = [
    { t: "Nova proposta recebida", s: "R$ 12.000 · agora" },
    { t: "Convite para palestrar", s: "Evento nacional · 2 min" },
    { t: "Parceria aprovada", s: "Contrato anual · 5 min" },
  ];
  return (
    <Cutaway duration={d} bg={C.paper}>
      <Col>
        <Badge n={6} />
        <Reveal at={2} dir="left" dist={90}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, color: C.ink, marginTop: 60, lineHeight: 1 }}>
            Posicionar-se
          </div>
        </Reveal>
        <Reveal at={7} dir="right" dist={90}>
          <div style={{ fontFamily: INTER, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: C.ink, letterSpacing: -4, marginTop: 6 }}>
            = OPORTUNIDADES
          </div>
        </Reveal>
        <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
          {items.map((it, i) => (
            <Reveal key={it.t} at={14 + i * 8} dir="up" dist={140} blur={24} scaleFrom={0.9}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  background: C.white,
                  borderRadius: 40,
                  padding: "34px 40px",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ width: 84, height: 84, borderRadius: 42, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="44" height="44" viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={C.lime} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: C.ink, letterSpacing: -1 }}>{it.t}</div>
                  <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 32, color: C.gray, marginTop: 4 }}>{it.s}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Col>
    </Cutaway>
  );
};

// ── 07 · Falar melhor ≠ falar mais ─────────────────────────────────
export const FinalStatement: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const strike = progress(frame, 86, 10);
  return (
    <Cutaway duration={d} bg={C.black}>
      <Col>
        <Badge n={7} dark />
        <div style={{ marginTop: 90 }}>
          <Reveal at={2} dir="left" dist={160} blur={34}>
            <div style={{ fontFamily: INTER, fontWeight: 900, fontStyle: "italic", fontSize: 172, color: C.white, letterSpacing: -8, lineHeight: 0.95 }}>
              FALAR
              <br />
              MELHOR
            </div>
          </Reveal>
          <Reveal at={44}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 110, color: "rgba(255,255,255,0.7)", marginTop: 20 }}>não é</div>
          </Reveal>
          <Reveal at={67} dir="right" dist={160} blur={34}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  fontFamily: INTER,
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: 172,
                  color: C.lime,
                  letterSpacing: -8,
                  lineHeight: 0.95,
                  textShadow: `0 0 50px ${C.lime}55`,
                }}
              >
                FALAR
                <br />
                MAIS
              </div>
              <div
                style={{
                  position: "absolute",
                  left: -14,
                  right: -24,
                  top: "70%",
                  height: 18,
                  background: C.pink,
                  scale: `${strike} 1`,
                  transformOrigin: "left center",
                  rotate: "-4deg",
                  boxShadow: `0 0 24px ${C.pink}`,
                }}
              />
            </div>
          </Reveal>
        </div>
      </Col>
    </Cutaway>
  );
};

// ── End card ───────────────────────────────────────────────────────
export const EndCard: React.FC<{ d: number }> = ({ d }) => {
  const frame = useCurrentFrame();
  const glow = progress(frame, 14, 14);
  return (
    <Cutaway duration={d + 8} bg={C.black}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Reveal at={2} dur={14} blur={30} scaleFrom={0.85}>
          <MotionBlur x={0} y={0}>
            <div
              style={{
                fontFamily: INTER,
                fontWeight: 800,
                fontSize: 120,
                letterSpacing: -5,
                color: glow > 0.5 ? C.lime : C.white,
                textShadow: `0 0 ${20 + 50 * glow}px ${glow > 0.5 ? C.lime : C.white}`,
              }}
            >
              @jarbasvox
            </div>
          </MotionBlur>
        </Reveal>
        <Reveal at={12}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: "rgba(255,255,255,0.85)", marginTop: 20 }}>
            Comunicação é poder.
          </div>
        </Reveal>
      </AbsoluteFill>
    </Cutaway>
  );
};
