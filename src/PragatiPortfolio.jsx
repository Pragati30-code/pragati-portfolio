import { useState, useEffect, useRef, useCallback } from "react";

// ── FRAMER MOTION via CDN (loaded via script in index.html)
// Using inline React with hooks + CSS animations for full portability

const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#16161f",
  border: "#ffffff0f",
  pink: "#ff6eb4",
  violet: "#b06aff",
  mint: "#3dffc0",
  gold: "#ffd166",
  text: "#f0eaf8",
  muted: "#8b7fa8",
};

const style = (obj) => obj;

// ── GLOBAL STYLES injected once
const GlobalStyle = () => {
  useEffect(() => {
    const id = "pragati-global";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body {
        background: #0a0a0f;
        color: #f0eaf8;
        font-family: 'Syne', sans-serif;
        overflow-x: hidden;
        cursor: none;
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0a0a0f; }
      ::-webkit-scrollbar-thumb { background: #b06aff44; border-radius: 4px; }

      @keyframes float {
        0%,100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-12px) rotate(1.5deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes threadDraw {
        from { stroke-dashoffset: 600; opacity: 0; }
        to { stroke-dashoffset: 0; opacity: 1; }
      }
      @keyframes pulse-glow {
        0%,100% { box-shadow: 0 0 20px #ff6eb422, 0 0 60px #b06aff11; }
        50% { box-shadow: 0 0 40px #ff6eb444, 0 0 100px #b06aff22; }
      }
      @keyframes cursor-trail {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.1); }
      }
      @keyframes blink-dot {
        0%,100% { opacity: 1; }
        50% { opacity: 0.2; }
      }
      @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slide-in-up {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes thread-wave {
        0% { d: path("M0,50 Q25,30 50,50 Q75,70 100,50"); }
        50% { d: path("M0,50 Q25,70 50,50 Q75,30 100,50"); }
        100% { d: path("M0,50 Q25,30 50,50 Q75,70 100,50"); }
      }
      @keyframes rotate-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes fill-bar {
        from { width: 0%; }
        to { width: var(--pct); }
      }

      .reveal {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal.in-view {
        opacity: 1;
        transform: translateY(0);
      }
      .reveal-left {
        opacity: 0;
        transform: translateX(-40px);
        transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal-left.in-view { opacity: 1; transform: translateX(0); }
      .reveal-right {
        opacity: 0;
        transform: translateX(40px);
        transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal-right.in-view { opacity: 1; transform: translateX(0); }

      .magnetic-btn {
        transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
      }
      .thread-svg path {
        stroke-dasharray: 600;
        stroke-dashoffset: 600;
      }
      .thread-svg.in-view path {
        animation: threadDraw 2s cubic-bezier(0.16,1,0.3,1) forwards;
      }
    `;
    document.head.appendChild(el);
  }, []);
  return null;
};

// ── CUSTOM CURSOR
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = pos.current.x + "px";
        cursorRef.current.style.top = pos.current.y + "px";
      }
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 6, height: 6, borderRadius: "50%",
        background: COLORS.pink,
        transform: "translate(-50%,-50%)",
        transition: "none",
      }} />
      <div ref={cursorRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9998,
        width: 36, height: 36, borderRadius: "50%",
        border: `1.5px solid ${COLORS.violet}66`,
        transform: "translate(-50%,-50%)",
        backdropFilter: "invert(0.05)",
      }} />
    </>
  );
};

// ── THREAD CANVAS BACKGROUND
const ThreadCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const threads = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    class Thread {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * (W || window.innerWidth);
        this.y = init ? Math.random() * (H || window.innerHeight) : -80;
        this.len = 120 + Math.random() * 200;
        this.angle = (Math.PI / 2) + (Math.random() - 0.5) * 0.6;
        this.color = [COLORS.pink, COLORS.violet, COLORS.mint, COLORS.gold][Math.floor(Math.random() * 4)];
        this.alpha = 0.025 + Math.random() * 0.055;
        this.w = 0.8 + Math.random() * 1.2;
        this.wave = Math.random() * Math.PI * 2;
        this.wAmp = 20 + Math.random() * 50;
        this.speed = 0.25 + Math.random() * 0.4;
        this.t = 0;
      }
      tick() {
        this.y += this.speed;
        this.wave += 0.012;
        this.t += 0.004;
        if (this.y > H + 100) this.reset();
      }
      draw() {
        const ox = Math.sin(this.wave) * this.wAmp;
        const cx1x = this.x + Math.cos(this.angle) * this.len * 0.33 + ox;
        const cx1y = this.y + Math.sin(this.angle) * this.len * 0.33;
        const cx2x = this.x + Math.cos(this.angle + this.t) * this.len * 0.66 - ox * 0.5;
        const cx2y = this.y + Math.sin(this.angle) * this.len * 0.66;
        const ex = this.x + Math.cos(this.angle + this.t * 2) * this.len;
        const ey = this.y + Math.sin(this.angle) * this.len;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(cx1x, cx1y, cx2x, cx2y, ex, ey);
        ctx.stroke();
        ctx.restore();
      }
    }

    resize();
    for (let i = 0; i < 40; i++) threads.push(new Thread());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      threads.forEach(t => { t.tick(); t.draw(); });
      animId = requestAnimationFrame(loop);
    };

    loop();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    }} />
  );
};

// ── SCROLL REVEAL HOOK
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .thread-svg");
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("in-view"), (e.target.dataset.delay || 0) * 1);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => ob.observe(el));
    return () => ob.disconnect();
  });
};

// ── NAV
const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["home", "about", "skills", "projects", "contact"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: "1.2rem 3rem",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: scrolled ? `${COLORS.bg}ee` : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "1.4rem",
        fontStyle: "italic",
        background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.violet})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        letterSpacing: "-0.02em",
      }}>
        Pragati Panwar 🦋
      </div>
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none" }}>
        {links.map(link => (
          <li key={link}>
            <a href={`#${link}`} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              color: activeSection === link ? COLORS.pink : COLORS.muted,
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 0.3s",
              position: "relative",
            }}>
              {link}
              {activeSection === link && (
                <span style={{
                  position: "absolute", bottom: -4, left: 0, right: 0,
                  height: 1, background: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.violet})`,
                  borderRadius: 1,
                }} />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// ── HERO
const Hero = () => {
  const [typed, setTyped] = useState("");
  const phrases = ["Java Backend Developer.", "React Engineer.", "Creative Crafter.", "DSA Problem Solver."];
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timeout;
    const type = () => {
      const phrase = phrases[phraseIdx.current];
      if (!deleting.current) {
        charIdx.current++;
        setTyped(phrase.slice(0, charIdx.current));
        if (charIdx.current === phrase.length) {
          deleting.current = true;
          timeout = setTimeout(type, 1800);
          return;
        }
      } else {
        charIdx.current--;
        setTyped(phrase.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
        }
      }
      timeout = setTimeout(type, deleting.current ? 40 : 80);
    };
    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="home" style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column",
      position: "relative", zIndex: 1,
      padding: "6rem 2rem 4rem",
      textAlign: "center",
    }}>
      {/* Decorative hoop SVG */}
      <div style={{
        position: "absolute", top: "15%", right: "8%",
        width: 180, height: 180, opacity: 0.15,
        animation: "rotate-slow 30s linear infinite",
        pointerEvents: "none",
      }}>
        <svg viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="80" stroke={COLORS.pink} strokeWidth="2" strokeDasharray="8 6" />
          <circle cx="90" cy="90" r="60" stroke={COLORS.violet} strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="90" cy="90" r="40" stroke={COLORS.mint} strokeWidth="1" strokeDasharray="2 10" />
          {/* cross-stitch pattern */}
          {[0,1,2,3].map(i => (
            <g key={i} transform={`rotate(${i*90} 90 90)`}>
              <line x1="90" y1="20" x2="90" y2="50" stroke={COLORS.pink} strokeWidth="1.5" strokeLinecap="round" />
              <line x1="76" y1="28" x2="90" y2="50" stroke={COLORS.violet} strokeWidth="1" strokeLinecap="round" />
              <line x1="104" y1="28" x2="90" y2="50" stroke={COLORS.violet} strokeWidth="1" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </div>

      {/* small badge */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.68rem",
        padding: "0.4rem 1.2rem",
        border: `1px solid ${COLORS.pink}44`,
        borderRadius: 999,
        color: COLORS.pink,
        letterSpacing: "0.12em",
        marginBottom: "2rem",
        background: `${COLORS.pink}0a`,
        animation: "fade-in 0.8s ease both",
      }}>
        ✦ OPEN TO OPPORTUNITIES · FINAL YEAR B.TECH ✦
      </div>

      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
        fontStyle: "italic",
        lineHeight: 0.95,
        letterSpacing: "-0.03em",
        marginBottom: "1.2rem",
        animation: "slide-in-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both",
      }}>
        <span style={{ color: COLORS.text }}>Hey, I'm </span>
        <span style={{
          background: `linear-gradient(135deg, ${COLORS.pink} 0%, ${COLORS.violet} 50%, ${COLORS.mint} 100%)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>Pragati </span>
        <span style={{ color: COLORS.text }}> 🐬</span>
      </h1>

      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
        color: COLORS.muted,
        height: "2rem",
        display: "flex", alignItems: "center", gap: "0.4rem",
        animation: "fade-in 0.9s ease 0.4s both",
        marginBottom: "1.8rem",
      }}>
        <span style={{ color: COLORS.violet }}>{">"}</span>
        <span style={{ color: COLORS.text }}>{typed}</span>
        <span style={{
          display: "inline-block", width: 2, height: "1.2em",
          background: COLORS.pink, borderRadius: 1,
          animation: "blink-dot 1s step-end infinite",
        }} />
      </div>

      <p style={{
        maxWidth: 540,
        fontSize: "1rem",
        lineHeight: 1.85,
        color: COLORS.muted,
        marginBottom: "3rem",
        animation: "slide-in-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both",
      }}>
        I love solving real-world problems with code 🧩 &amp; express creativity through embroidery 🧵.
        Logic and creativity together build powerful things.
      </p>

      <div style={{
        display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
        animation: "slide-in-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both",
      }}>
        <a href="#projects" style={{
          padding: "0.9rem 2.2rem",
          background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.violet})`,
          color: "white", borderRadius: 999, textDecoration: "none",
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
          letterSpacing: "0.04em",
          boxShadow: `0 0 30px ${COLORS.pink}44`,
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = `0 8px 40px ${COLORS.pink}66`; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = `0 0 30px ${COLORS.pink}44`; }}
        >
          View My Work →
        </a>
        <a href="#contact" style={{
          padding: "0.9rem 2.2rem",
          background: "transparent",
          color: COLORS.text, borderRadius: 999, textDecoration: "none",
          fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.9rem",
          border: `1px solid ${COLORS.border}`,
          transition: "all 0.3s",
        }}
          onMouseEnter={e => { e.target.style.borderColor = COLORS.violet; e.target.style.color = COLORS.violet; }}
          onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.text; }}
        >
          Let's Connect 💌
        </a>
      </div>

      {/* scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        animation: "fade-in 1s ease 1.5s both",
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: COLORS.muted, letterSpacing: "0.12em" }}>SCROLL</span>
        <div style={{
          width: 1, height: 48,
          background: `linear-gradient(to bottom, ${COLORS.violet}, transparent)`,
        }} />
      </div>
    </section>
  );
};

// ── MARQUEE STRIP
const MarqueeStrip = () => {
  const items = ["☕ Java", "⚡ Spring Boot", "🌀 React", "🔷 Next.js", "🧩 DSA", "🧵 Embroidery", "✂️ Crafts", "🌐 REST APIs", "🗄️ MySQL", "🔧 Git"];
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      borderTop: `1px solid ${COLORS.border}`,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "1rem 0",
      background: `${COLORS.surface}88`,
      position: "relative", zIndex: 1,
    }}>
      <div style={{
        display: "flex", gap: "3rem",
        animation: "marquee 20s linear infinite",
        width: "max-content",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem",
            color: i % 2 === 0 ? COLORS.pink : COLORS.muted,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}>{item}</span>
        ))}
      </div>
    </div>
  );
};

// ── ABOUT
const About = () => {
  const skills = [
    { label: "Java / Spring Boot", pct: 72, color: COLORS.violet },
    { label: "React / Next.js", pct: 80, color: COLORS.pink },
    { label: "DSA & Algorithms", pct: 75, color: COLORS.mint },
    { label: "JavaScript", pct: 78, color: COLORS.gold },
  ];

  return (
    <section id="about" style={{
      position: "relative", zIndex: 1,
      padding: "7rem 3rem",
      maxWidth: 1100, margin: "0 auto",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        {/* LEFT */}
        <div className="reveal-left">
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: "0.7rem",
            color: COLORS.pink, letterSpacing: "0.2em", marginBottom: "1rem",
            textTransform: "uppercase",
          }}>// 01. about me</p>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            fontStyle: "italic",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "1.8rem",
            color: COLORS.text,
          }}>
            The girl who codes<br />
            <span style={{ color: COLORS.pink }}>&amp; crafts</span> 🌸
          </h2>
          <p style={{ color: COLORS.muted, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "1.2rem" }}>
            I'm <strong style={{ color: COLORS.text }}>Pragati Panwar</strong>, a final year B.Tech student building things that matter. From architecting robust Spring Boot backends to crafting pixel-perfect React frontends — I love this full journey.
          </p>
          <p style={{ color: COLORS.muted, lineHeight: 1.9, fontSize: "0.95rem", marginBottom: "2rem" }}>
            Outside the IDE, you'll find me with a needle and thread, turning fabric into art 🧵. I believe the same patience and precision that makes a beautiful embroidery pattern makes great software.
          </p>

          {/* Skill bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {skills.map((s, i) => (
              <SkillBar key={s.label} {...s} delay={i * 120} />
            ))}
          </div>
        </div>

        {/* RIGHT - decorative grid */}
        <div className="reveal-right" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { icon: "☕", title: "Backend", sub: "Java · Spring Boot · REST APIs", color: COLORS.violet },
            { icon: "⚡", title: "Frontend", sub: "React · Next.js · Tailwind", color: COLORS.pink },
            { icon: "🧵", title: "Embroidery", sub: "Cross-stitch · Patterns · Art", color: COLORS.mint },
            { icon: "🧩", title: "DSA", sub: "Problem Solving · Algorithms", color: COLORS.gold },
          ].map((card, i) => (
            <div key={card.title}
              data-delay={i * 80}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16, padding: "1.5rem",
                transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.borderColor = card.color + "66";
                e.currentTarget.style.boxShadow = `0 20px 40px ${card.color}22`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: COLORS.text, marginBottom: "0.3rem" }}>{card.title}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.muted, lineHeight: 1.6 }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillBar = ({ label, pct, color, delay }) => {
  const barRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!barRef.current) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setActive(true), delay); }
    }, { threshold: 0.5 });
    ob.observe(barRef.current);
    return () => ob.disconnect();
  }, [delay]);

  return (
    <div ref={barRef}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", color: COLORS.text }}>{label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: `${COLORS.surface}`, borderRadius: 999, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: `linear-gradient(to right, ${color}cc, ${color})`,
          width: active ? `${pct}%` : "0%",
          transition: "width 1.4s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: active ? `0 0 10px ${color}66` : "none",
        }} />
      </div>
    </div>
  );
};

// ── SKILLS
const Skills = () => {
  const cats = [
    {
      label: "Backend", icon: "☕", color: COLORS.violet,
      tags: ["Java", "Spring Boot", "Spring MVC", "Hibernate", "JPA", "REST APIs", "MySQL", "Maven"],
    },
    {
      label: "Frontend", icon: "⚡", color: COLORS.pink,
      tags: ["React.js", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      label: "Craft & Tools", icon: "🔧", color: COLORS.mint,
      tags: ["Git & GitHub", "Postman", "IntelliJ", "VS Code", "Vercel", "Render", "Neondb", "Groq"],
    },
  ];

  return (
    <section id="skills" style={{
      position: "relative", zIndex: 1,
      padding: "7rem 3rem",
      background: `${COLORS.surface}66`,
      borderTop: `1px solid ${COLORS.border}`,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: COLORS.pink, letterSpacing: "0.2em", marginBottom: "1rem", textTransform: "uppercase" }}>
            // 02. skills & threads
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontStyle: "italic", color: COLORS.text, letterSpacing: "-0.02em" }}>
            My Toolkit 🪡
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {cats.map((cat, i) => (
            <div key={cat.label} className="reveal" data-delay={i * 150}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20, padding: "2rem",
                position: "relative", overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 50px ${cat.color}1a`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${cat.color}00, ${cat.color}, ${cat.color}00)` }} />
              <div style={{ fontSize: "1.8rem", marginBottom: "0.8rem" }}>{cat.icon}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: COLORS.text, marginBottom: "1.2rem" }}>{cat.label}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {cat.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    padding: "0.3rem 0.8rem",
                    borderRadius: 999,
                    border: `1px solid ${cat.color}33`,
                    color: cat.color,
                    background: `${cat.color}0d`,
                    transition: "all 0.2s",
                    cursor: "default",
                  }}
                    onMouseEnter={e => { e.target.style.background = `${cat.color}22`; e.target.style.transform = "scale(1.08)"; }}
                    onMouseLeave={e => { e.target.style.background = `${cat.color}0d`; e.target.style.transform = ""; }}
                  >{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── PROJECTS
const Projects = () => {
  const projects = [
    {
      name: "RideMate",
      emoji: "🚗",
      status: "wip",
      statusLabel: "In Progress",
      desc: "A campus ride-sharing platform solving real-world commute problems. Robust Spring Boot backend with secure auth, real-time ride matching, and a smooth Next.js frontend.",
      stack: ["Spring Boot", "Java", "Next.js", "MySQL", "REST API", "JWT"],
      gradient: "linear-gradient(135deg, #232350, #1a1a3e)",
      accent: COLORS.violet,
      github: "https://github.com/Pragati30-code/RideMate",
      live: null,
      visual: "🚗",
    },
    {
      name: "Pawfect",
      emoji: "🐾",
      status: "live",
      statusLabel: "Live",
      desc: "A pet healthcare platform built with love for animals 🐶🐱. Connects pet owners with vets, health resources, and care guides. Deployed live on Vercel.",
      stack: ["React", "Next.js", "Tailwind CSS", "Vercel"],
      gradient: "linear-gradient(135deg, #2d1a2e, #1a0d20)",
      accent: COLORS.pink,
      github: null,
      live: "https://pawfect-cure.vercel.app",
      visual: "🐾",
    },
  ];

  return (
    <section id="projects" style={{
      position: "relative", zIndex: 1,
      padding: "7rem 3rem",
      maxWidth: 1100, margin: "0 auto",
    }}>
      <div className="reveal" style={{ marginBottom: "4rem" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: COLORS.pink, letterSpacing: "0.2em", marginBottom: "1rem", textTransform: "uppercase" }}>
          // 03. featured projects
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem,4vw,3.5rem)", fontStyle: "italic", color: COLORS.text, letterSpacing: "-0.02em" }}>
          Things I've Built 🚀
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} reverse={i % 2 !== 0} />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project: p, reverse }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={reverse ? "reveal-right" : "reveal-left"}
      style={{
        display: "grid",
        gridTemplateColumns: reverse ? "1fr 1.4fr" : "1.4fr 1fr",
        gap: "3rem", alignItems: "center",
      }}>
      {/* Visual */}
      {!reverse && (
        <div style={{
          height: 280, borderRadius: 24,
          background: p.gradient,
          border: `1px solid ${p.accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "6rem",
          position: "relative", overflow: "hidden",
          boxShadow: hovered ? `0 30px 80px ${p.accent}33` : `0 10px 40px ${p.accent}11`,
          transition: "box-shadow 0.4s",
          animation: hovered ? "pulse-glow 2s ease-in-out infinite" : "none",
        }}>
          <div style={{
            position: "absolute", inset: 12,
            border: `1.5px dashed ${p.accent}33`, borderRadius: 16,
          }} />
          <div style={{
            fontSize: "7rem",
            animation: "float 4s ease-in-out infinite",
            filter: `drop-shadow(0 0 20px ${p.accent}66)`,
          }}>{p.visual}</div>
        </div>
      )}

      {/* Info */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
          padding: "0.2rem 0.7rem", borderRadius: 999, marginBottom: "1rem",
          background: p.status === "live" ? "#0d2e1a" : "#2a220a",
          color: p.status === "live" ? COLORS.mint : COLORS.gold,
          border: `1px solid ${p.status === "live" ? COLORS.mint : COLORS.gold}33`,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "currentColor", animation: "blink-dot 1.5s ease-in-out infinite",
          }} />
          {p.statusLabel}
        </div>

        <h3 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "2.2rem", fontStyle: "italic",
          color: COLORS.text, letterSpacing: "-0.02em",
          marginBottom: "0.8rem",
        }}>
          {p.name} {p.emoji}
        </h3>

        <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: "0.9rem", marginBottom: "1.2rem" }}>
          {p.desc}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
          {p.stack.map(s => (
            <span key={s} style={{
              fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
              padding: "0.25rem 0.65rem", borderRadius: 6,
              background: `${COLORS.surface}`,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.muted,
            }}>{s}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem",
              color: COLORS.violet, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem",
              transition: "gap 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "0.7rem"}
              onMouseLeave={e => e.currentTarget.style.gap = "0.4rem"}
            >⬡ GitHub →</a>
          )}
          {p.live && (
            <a href={p.live} target="_blank" rel="noreferrer" style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.85rem",
              color: COLORS.pink, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem",
              transition: "gap 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "0.7rem"}
              onMouseLeave={e => e.currentTarget.style.gap = "0.4rem"}
            >🌐 Live Site →</a>
          )}
        </div>
      </div>

      {/* Visual (right side) */}
      {reverse && (
        <div style={{
          height: 280, borderRadius: 24,
          background: p.gradient,
          border: `1px solid ${p.accent}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
          boxShadow: hovered ? `0 30px 80px ${p.accent}33` : `0 10px 40px ${p.accent}11`,
          transition: "box-shadow 0.4s",
        }}>
          <div style={{ position: "absolute", inset: 12, border: `1.5px dashed ${p.accent}33`, borderRadius: 16 }} />
          <div style={{ fontSize: "7rem", animation: "float 4s ease-in-out infinite", filter: `drop-shadow(0 0 20px ${p.accent}66)` }}>
            {p.visual}
          </div>
        </div>
      )}
    </div>
  );
};

// ── CONTACT
const Contact = () => {
  return (
    <section id="contact" style={{
      position: "relative", zIndex: 1,
      padding: "7rem 3rem",
      background: `${COLORS.surface}66`,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div className="reveal">
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: COLORS.pink, letterSpacing: "0.2em", marginBottom: "1rem", textTransform: "uppercase" }}>
            // 04. let's connect
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem,5vw,4rem)", fontStyle: "italic", color: COLORS.text, letterSpacing: "-0.02em", marginBottom: "1.2rem", lineHeight: 1.05 }}>
            Let's Build Something<br />
            <span style={{ color: COLORS.pink }}>Together!</span> 🌸
          </h2>
          <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "3rem", maxWidth: 480, margin: "0 auto 3rem" }}>
            Whether it's code, crafts, or a cool idea — I'm always up for a chat.
            Open to internships, full-time roles &amp; collaborations 💬
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            {[
              { label: "LinkedIn", href: "https://linkedin.com/in/pragatipanwar3005", bg: "#0077b5", icon: "💼" },
              { label: "GitHub", href: "https://github.com/Pragati30-code", bg: "#24292f", icon: "⬡" },
              { label: "Email", href: "mailto:pragatipanwar3005@gmail.com", bg: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.violet})`, icon: "📧" },
            ].map(btn => (
              <a key={btn.label} href={btn.href} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.8rem 1.8rem", borderRadius: 999,
                background: btn.bg, color: "white",
                textDecoration: "none",
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.88rem",
                transition: "transform 0.3s, box-shadow 0.3s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)"; }}
              >
                {btn.icon} {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── FOOTER
const Footer = () => (
  <footer style={{
    position: "relative", zIndex: 1,
    padding: "2rem 3rem",
    textAlign: "center",
    borderTop: `1px solid ${COLORS.border}`,
  }}>
    <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLORS.muted }}>
      Crafted with <span style={{ color: COLORS.pink }}>♥</span> &amp; a lot of{" "}
      <span style={{ color: COLORS.violet }}>🧵</span> by{" "}
      <span style={{ color: COLORS.text }}>Pragati Panwar</span>
    </p>
    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: COLORS.muted + "77", marginTop: "0.4rem", letterSpacing: "0.08em" }}>
      ✨ CODING WITH LOGIC, CREATING WITH HEART ✨
    </p>
  </footer>
);

// ── ACTIVE SECTION HOOK
const useActiveSection = () => {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "contact"];
    const ob = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) ob.observe(el);
    });
    return () => ob.disconnect();
  }, []);
  return active;
};

// ── APP
export default function App() {
  const activeSection = useActiveSection();
  useReveal();

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <GlobalStyle />
      <CustomCursor />
      <ThreadCanvas />
      <Nav activeSection={activeSection} />
      <Hero />
      <MarqueeStrip />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}