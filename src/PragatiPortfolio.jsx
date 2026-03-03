import { useState, useEffect, useRef } from "react";

// ── MOBILE HOOK
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
};

// ── COLORS
const C = {
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

// ── GLOBAL STYLES
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
      @media (max-width: 768px) { body { cursor: auto; } }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0a0a0f; }
      ::-webkit-scrollbar-thumb { background: #b06aff44; border-radius: 4px; }

      @keyframes float {
        0%,100% { transform: translateY(0) rotate(0); }
        33%      { transform: translateY(-12px) rotate(1.5deg); }
        66%      { transform: translateY(-5px) rotate(-1deg); }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes blink-dot {
        0%,100% { opacity: 1; }
        50%      { opacity: 0.2; }
      }
      @keyframes slide-up {
        from { opacity: 0; transform: translateY(40px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes rotate-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @keyframes menu-in {
        from { opacity: 0; transform: translateY(-8px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal.in-view { opacity: 1; transform: translateY(0); }

      .reveal-left {
        opacity: 0;
        transform: translateX(-36px);
        transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal-left.in-view { opacity: 1; transform: translateX(0); }

      .reveal-right {
        opacity: 0;
        transform: translateX(36px);
        transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1);
      }
      .reveal-right.in-view { opacity: 1; transform: translateX(0); }

      @media (max-width: 768px) {
        .reveal-left  { transform: translateY(24px); }
        .reveal-right { transform: translateY(24px); }
        .reveal-left.in-view  { transform: translateY(0); }
        .reveal-right.in-view { transform: translateY(0); }
      }
    `;
    document.head.appendChild(el);
  }, []);
  return null;
};

// ── SCROLL REVEAL
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const ob = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add("in-view"), delay);
        }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => ob.observe(el));
    return () => ob.disconnect();
  });
};

// ── ACTIVE SECTION
const useActiveSection = () => {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const ids = ["home", "about", "skills", "projects", "contact"];
    const ob = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) ob.observe(el); });
    return () => ob.disconnect();
  }, []);
  return active;
};

// ── CUSTOM CURSOR (desktop only)
const CustomCursor = () => {
  const ring = useRef(null);
  const dot  = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const tgt  = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const mv = (e) => {
      tgt.current = { x: e.clientX, y: e.clientY };
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
    };
    const loop = () => {
      pos.current.x += (tgt.current.x - pos.current.x) * 0.12;
      pos.current.y += (tgt.current.y - pos.current.y) * 0.12;
      if (ring.current) { ring.current.style.left = pos.current.x + "px"; ring.current.style.top = pos.current.y + "px"; }
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", mv);
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf.current); };
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div ref={dot} style={{ position:"fixed", pointerEvents:"none", zIndex:9999, width:6, height:6, borderRadius:"50%", background:C.pink, transform:"translate(-50%,-50%)" }} />
      <div ref={ring} style={{ position:"fixed", pointerEvents:"none", zIndex:9998, width:36, height:36, borderRadius:"50%", border:`1.5px solid ${C.violet}55`, transform:"translate(-50%,-50%)" }} />
    </>
  );
};

// ── THREAD CANVAS BG
const ThreadCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, id;
    const COLS = [C.pink, C.violet, C.mint, C.gold];
    const threads = [];

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };

    class T {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x = Math.random() * (W || window.innerWidth);
        this.y = init ? Math.random() * (H || window.innerHeight) : -80;
        this.len = 100 + Math.random() * 180;
        this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        this.color = COLS[Math.floor(Math.random() * COLS.length)];
        this.alpha = 0.022 + Math.random() * 0.048;
        this.lw    = 0.8 + Math.random() * 1.2;
        this.wave  = Math.random() * Math.PI * 2;
        this.wAmp  = 18 + Math.random() * 45;
        this.spd   = 0.22 + Math.random() * 0.35;
        this.t     = 0;
      }
      tick() { this.y += this.spd; this.wave += 0.013; this.t += 0.004; if (this.y > H + 100) this.reset(); }
      draw() {
        const ox = Math.sin(this.wave) * this.wAmp;
        ctx.save();
        ctx.globalAlpha = this.alpha; ctx.strokeStyle = this.color; ctx.lineWidth = this.lw; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(
          this.x + Math.cos(this.angle) * this.len * 0.33 + ox,
          this.y + Math.sin(this.angle) * this.len * 0.33,
          this.x + Math.cos(this.angle + this.t) * this.len * 0.66 - ox * 0.5,
          this.y + Math.sin(this.angle) * this.len * 0.66,
          this.x + Math.cos(this.angle + this.t * 2) * this.len,
          this.y + Math.sin(this.angle) * this.len
        );
        ctx.stroke(); ctx.restore();
      }
    }

    resize();
    for (let i = 0; i < 38; i++) threads.push(new T());
    const loop = () => { ctx.clearRect(0, 0, W, H); threads.forEach(t => { t.tick(); t.draw(); }); id = requestAnimationFrame(loop); };
    loop();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
};

// ── NAV
const Nav = ({ active }) => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const isMobile = useIsMobile();

  // Nav links — removed Projects & Contact, added Resume
  const links = ["home", "about", "skills"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // close menu on resize to desktop
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const linkStyle = (lnk) => ({
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.7rem",
    color: active === lnk ? C.pink : C.muted,
    textDecoration: "none",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    transition: "color 0.3s",
    position: "relative",
  });

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        padding: isMobile ? "1rem 1.4rem" : "1.1rem 3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrolled || menuOpen ? `${C.bg}ee` : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Logo */}
        <a href="#home" style={{
          fontFamily: "'DM Serif Display', serif", fontSize: "1.45rem", fontStyle: "italic",
          background: `linear-gradient(135deg, ${C.pink}, ${C.violet})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          textDecoration: "none",
        }}>Pragati 🦋</a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {links.map((lnk) => (
              <a key={lnk} href={`#${lnk}`} style={linkStyle(lnk)}>
                {lnk}
                {active === lnk && (
                  <span style={{ position:"absolute", bottom:-4, left:0, right:0, height:1, background:`linear-gradient(to right, ${C.pink}, ${C.violet})`, borderRadius:1 }} />
                )}
              </a>
            ))}
            {/* Resume button */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.68rem",
                padding: "0.45rem 1.1rem",
                border: `1px solid ${C.pink}66`,
                borderRadius: 999,
                color: C.pink,
                textDecoration: "none",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                background: `${C.pink}0d`,
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${C.pink}22`; e.currentTarget.style.borderColor = C.pink; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${C.pink}0d`; e.currentTarget.style.borderColor = `${C.pink}66`; }}
            >
              Resume ↗
            </a>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:"4px 2px" }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: "block", width: 22, height: 1.5,
                background: (menuOpen && i === 1) ? "transparent" : C.text,
                borderRadius: 2, transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                    : i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                    : "none"
                  : "none",
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", top: "58px", left: 0, right: 0, zIndex: 299,
          background: `${C.bg}f5`, backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "1.2rem 1.6rem 1.6rem",
          display: "flex", flexDirection: "column", gap: 0,
          animation: "menu-in 0.22s ease both",
        }}>
          {links.map((lnk, i) => (
            <a key={lnk} href={`#${lnk}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: "0.88rem",
                color: active === lnk ? C.pink : C.muted,
                textDecoration: "none", letterSpacing: "0.09em", textTransform: "uppercase",
                padding: "0.95rem 0",
                borderBottom: `1px solid ${C.border}`,
                transition: "color 0.2s",
              }}
            >
              <span style={{ color: C.violet, marginRight: "0.6rem" }}>{String(i + 1).padStart(2, "0")}.</span>
              {lnk}
            </a>
          ))}
          {/* Resume in mobile menu */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0.8rem",
              background: `linear-gradient(135deg, ${C.pink}22, ${C.violet}22)`,
              border: `1px solid ${C.pink}44`,
              borderRadius: 10,
              fontFamily: "'Space Mono', monospace", fontSize: "0.8rem",
              color: C.pink, textDecoration: "none", letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            📄 Resume ↗
          </a>
        </div>
      )}
    </>
  );
};

// ── HERO
const Hero = () => {
  const isMobile = useIsMobile();
  const [typed, setTyped] = useState("");
  const phrases = ["Java Backend Developer.", "React Engineer.", "Creative Crafter.", "DSA Problem Solver.", "Final-Year Btech Stud."];
  const pIdx = useRef(0); const cIdx = useRef(0); const del = useRef(false);

  useEffect(() => {
    let tm;
    const type = () => {
      const ph = phrases[pIdx.current];
      if (!del.current) {
        cIdx.current++;
        setTyped(ph.slice(0, cIdx.current));
        if (cIdx.current === ph.length) { del.current = true; tm = setTimeout(type, 1800); return; }
      } else {
        cIdx.current--;
        setTyped(ph.slice(0, cIdx.current));
        if (cIdx.current === 0) { del.current = false; pIdx.current = (pIdx.current + 1) % phrases.length; }
      }
      tm = setTimeout(type, del.current ? 38 : 78);
    };
    tm = setTimeout(type, 700);
    return () => clearTimeout(tm);
  }, []);

  return (
    <section id="home" style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
      position: "relative", zIndex: 1, textAlign: "center",
      padding: isMobile ? "5.5rem 1.4rem 3rem" : "6rem 2rem 4rem",
    }}>

      {/* Decorative spinning hoop — desktop only */}
      {!isMobile && (
        <div style={{ position:"absolute", top:"14%", right:"7%", width:190, height:190, opacity:0.1, animation:"rotate-slow 32s linear infinite", pointerEvents:"none" }}>
          <svg viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="82" stroke={C.pink}   strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="90" cy="90" r="62" stroke={C.violet} strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="90" cy="90" r="42" stroke={C.mint}   strokeWidth="1" strokeDasharray="2 10" />
            {[0,1,2,3].map((i) => (
              <g key={i} transform={`rotate(${i*90} 90 90)`}>
                <line x1="90" y1="18" x2="90" y2="50" stroke={C.pink}   strokeWidth="1.5" strokeLinecap="round" />
                <line x1="76" y1="26" x2="90" y2="50" stroke={C.violet} strokeWidth="1"   strokeLinecap="round" />
                <line x1="104" y1="26" x2="90" y2="50" stroke={C.violet} strokeWidth="1"  strokeLinecap="round" />
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Open to opportunities badge — no B.Tech text */}
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: isMobile ? "0.6rem" : "0.68rem",
        padding: "0.4rem 1.2rem",
        border: `1px solid ${C.pink}44`, borderRadius: 999,
        color: C.pink, letterSpacing: "0.12em",
        marginBottom: "1.8rem",
        background: `${C.pink}0a`,
        animation: "fade-in 0.8s ease both",
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
      }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:C.mint, boxShadow:`0 0 6px ${C.mint}`, animation:"blink-dot 2s ease-in-out infinite" }} />
        OPEN TO OPPORTUNITIES
      </div>

      <h1 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: isMobile ? "clamp(2.8rem, 12vw, 4.8rem)" : "clamp(3.8rem, 9vw, 7.5rem)",
        fontStyle: "italic", lineHeight: 0.95, letterSpacing: "-0.03em",
        marginBottom: "1.2rem",
        animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both",
      }}>
        <span style={{ color: C.text }}>Hola! </span>
        <span style={{
          background: `linear-gradient(135deg, ${C.pink} 0%, ${C.violet} 50%, ${C.mint} 100%)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>Coders </span>
        <span style={{ color: C.text }}> 👋</span>
      </h1>

      {/* Typewriter */}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: isMobile ? "0.82rem" : "clamp(0.95rem, 2.2vw, 1.25rem)",
        height: "2rem", display: "flex", alignItems: "center", gap: "0.4rem",
        animation: "fade-in 0.9s ease 0.3s both", marginBottom: "1.6rem",
        flexWrap: "nowrap",
      }}>
        <span style={{ color: C.violet }}>{">"}</span>
        <span style={{ color: C.text }}>{typed}</span>
        <span style={{ display:"inline-block", width:2, height:"1.1em", background:C.pink, borderRadius:1, animation:"blink-dot 1s step-end infinite" }} />
      </div>

      <p style={{
        maxWidth: isMobile ? "100%" : 520,
        fontSize: isMobile ? "0.88rem" : "0.97rem",
        lineHeight: 1.88, color: C.muted,
        marginBottom: "2.5rem",
        animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both",
        padding: isMobile ? "0 0.3rem" : 0,
      }}>
        I love solving real-world problems with code 🧩 &amp; express creativity through embroidery 🧵.
        Logic and creativity together build powerful things.
      </p>

      <div style={{
        display: "flex", gap: "1rem",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center", justifyContent: "center",
        animation: "slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.58s both",
        width: isMobile ? "100%" : "auto",
      }}>
        <a href="#projects" style={{
          padding: "0.9rem 2.2rem",
          background: `linear-gradient(135deg, ${C.pink}, ${C.violet})`,
          color: "white", borderRadius: 999, textDecoration: "none",
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
          letterSpacing: "0.04em",
          boxShadow: `0 0 28px ${C.pink}44`,
          transition: "transform 0.25s, box-shadow 0.25s",
          width: isMobile ? "78%" : "auto", textAlign: "center",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 10px 36px ${C.pink}66`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 0 28px ${C.pink}44`; }}
        >View My Work →</a>
        <a href="#contact" style={{
          padding: "0.9rem 2.2rem",
          background: "transparent", color: C.text,
          borderRadius: 999, textDecoration: "none",
          fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.9rem",
          border: `1px solid ${C.border}`,
          transition: "all 0.25s",
          width: isMobile ? "78%" : "auto", textAlign: "center",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = C.violet; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
        >Let's Connect 💌</a>
      </div>

      {/* Scroll hint — desktop only */}
      {!isMobile && (
        <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", animation:"fade-in 1s ease 1.4s both" }}>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.14em" }}>SCROLL</span>
          <div style={{ width:1, height:46, background:`linear-gradient(to bottom, ${C.violet}, transparent)` }} />
        </div>
      )}
    </section>
  );
};

// ── MARQUEE
const Marquee = () => {
  const items = ["☕ Java", "⚡ Spring Boot", "🌀 React", "🔷 Next.js", "🧩 DSA", "🧵 Embroidery", "✂️ Crafts", "🌐 REST APIs", "🗄️ MySQL", "🔧 Git"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"0.85rem 0", background:`${C.surface}88`, position:"relative", zIndex:1 }}>
      <div style={{ display:"flex", gap:"3rem", animation:"marquee 22s linear infinite", width:"max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.72rem", color:i%2===0?C.pink:C.muted, letterSpacing:"0.08em", whiteSpace:"nowrap" }}>{item}</span>
        ))}
      </div>
    </div>
  );
};

// ── SKILL BAR
const SkillBar = ({ label, pct, color, delay }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setOn(true), delay); }, { threshold: 0.5 });
    ob.observe(ref.current);
    return () => ob.disconnect();
  }, [delay]);
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.35rem" }}>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.7rem", color:C.text }}>{label}</span>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.66rem", color }}>{pct}%</span>
      </div>
      <div style={{ height:5, background:C.surface, borderRadius:999, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <div style={{ height:"100%", borderRadius:999, background:`linear-gradient(to right, ${color}cc, ${color})`, width:on?`${pct}%`:"0%", transition:"width 1.4s cubic-bezier(0.16,1,0.3,1)", boxShadow:on?`0 0 8px ${color}66`:"none" }} />
      </div>
    </div>
  );
};

// ── ABOUT
const About = () => {
  const isMobile = useIsMobile();

  const skills = [
    { label:"Java / Spring Boot", pct:72, color:C.violet },
    { label:"React / Next.js",    pct:80, color:C.pink   },
    { label:"DSA & Algorithms",   pct:75, color:C.mint   },
    { label:"JavaScript",         pct:78, color:C.gold   },
  ];

  const cards = [
    { icon:"☕", title:"Backend",    sub:"Java · Spring Boot · REST APIs", color:C.violet },
    { icon:"⚡", title:"Frontend",   sub:"React · Next.js · Tailwind",     color:C.pink   },
    { icon:"🧩", title:"DSA",        sub:"Problem Solving · Algorithms",   color:C.gold   },
    { icon:"🧵", title:"Embroidery", sub:"Cross-stitch · Patterns · Art",  color:C.mint   },
  ];

  return (
    <section id="about" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", maxWidth:1100, margin:"0 auto" }}>

      {/* Header */}
      <div className="reveal" style={{ marginBottom: isMobile ? "2rem" : "3.5rem" }}>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.6rem" }}>// 01. about me</p>
        <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem, 4vw, 3.4rem)", fontStyle:"italic", lineHeight:1.05, letterSpacing:"-0.02em", color:C.text }}>
          The girl who codes<br /><span style={{ color:C.pink }}>&amp; crafts</span> 🌸
        </h2>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:isMobile?"2.5rem":"5rem", alignItems:"start" }}>

        {/* Left — text + bars */}
        <div className={isMobile ? "reveal" : "reveal-left"}>
          <p style={{ color:C.muted, lineHeight:1.92, fontSize:"0.94rem", marginBottom:"1.1rem" }}>
            I'm <strong style={{ color:C.text }}>Pragati Panwar</strong>, a final year B.Tech student building things that matter. From architecting robust Spring Boot backends to crafting pixel-perfect React frontends — I love the full journey.
          </p>
          <p style={{ color:C.muted, lineHeight:1.92, fontSize:"0.94rem", marginBottom:"2rem" }}>
            Outside the IDE, you'll find me with a needle and thread, turning fabric into art 🧵. The same patience that makes a beautiful embroidery pattern makes great software.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.95rem" }}>
            {skills.map((s, i) => <SkillBar key={s.label} {...s} delay={i * 110} />)}
          </div>
        </div>

        {/* Right — 2×2 cards */}
        <div className={isMobile ? "reveal" : "reveal-right"}
          style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:isMobile?"0.75rem":"1rem" }}>
          {cards.map((card) => (
            <div key={card.title}
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:isMobile?"1.05rem":"1.45rem", transition:"transform 0.3s, border-color 0.3s, box-shadow 0.3s", cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px) scale(1.02)"; e.currentTarget.style.borderColor=card.color+"55"; e.currentTarget.style.boxShadow=`0 18px 40px ${card.color}1e`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow=""; }}
            >
              <div style={{ fontSize:isMobile?"1.5rem":"1.9rem", marginBottom:"0.55rem" }}>{card.icon}</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:isMobile?"0.78rem":"0.92rem", color:C.text, marginBottom:"0.28rem" }}>{card.title}</div>
              <div style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.58rem", color:C.muted, lineHeight:1.65 }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── SKILLS
const Skills = () => {
  const isMobile = useIsMobile();
  const cats = [
    { label:"Backend",      icon:"☕", color:C.violet, tags:["Java","Spring Boot","Spring MVC","Hibernate","JPA","REST APIs","MySQL","Maven"] },
    { label:"Frontend",     icon:"⚡", color:C.pink,   tags:["React.js","Next.js","JavaScript","TypeScript","Tailwind CSS","HTML5","CSS3"] },
    { label:"Craft & Tools",icon:"🔧", color:C.mint,   tags:["Git & GitHub","Postman","IntelliJ","VS Code","Vercel","Neondb","Render","Groq"] },
  ];
  return (
    <section id="skills" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", background:`${C.surface}66`, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:isMobile?"2.5rem":"4rem" }}>
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 02. skills &amp; threads</p>
          <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem, 4vw, 3.4rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em" }}>My Toolkit 🪡</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:isMobile?"1rem":"1.5rem" }}>
          {cats.map((cat, i) => (
            <div key={cat.label} className="reveal" data-delay={i * 100}
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:isMobile?"1.5rem":"2rem", position:"relative", overflow:"hidden", transition:"transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=`0 22px 55px ${cat.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(to right, ${cat.color}00, ${cat.color}, ${cat.color}00)` }} />
              <div style={{ fontSize:"1.75rem", marginBottom:"0.65rem" }}>{cat.icon}</div>
              <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.02rem", color:C.text, marginBottom:"0.95rem" }}>{cat.label}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem" }}>
                {cat.tags.map((tag) => (
                  <span key={tag}
                    style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.63rem", padding:"0.28rem 0.75rem", borderRadius:999, border:`1px solid ${cat.color}30`, color:cat.color, background:`${cat.color}0c`, transition:"all 0.2s", cursor:"default" }}
                    onMouseEnter={e => { e.target.style.background=`${cat.color}22`; e.target.style.transform="scale(1.08)"; }}
                    onMouseLeave={e => { e.target.style.background=`${cat.color}0c`; e.target.style.transform=""; }}
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

// ── PROJECT CARD
const ProjectCard = ({ p, reverse, isMobile }) => {
  const [hov, setHov] = useState(false);

  const statusPill = (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem", fontFamily:"'Space Mono', monospace", fontSize:"0.62rem", padding:"0.22rem 0.75rem", borderRadius:999, marginBottom:"0.85rem", background:p.status==="live"?"#0d2e1a":"#2a220a", color:p.status==="live"?C.mint:C.gold, border:`1px solid ${p.status==="live"?C.mint:C.gold}33` }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:"currentColor", animation:"blink-dot 1.5s ease-in-out infinite" }} />
      {p.statusLabel}
    </span>
  );

  const visualBox = (
    <div style={{ height:isMobile?175:285, borderRadius:isMobile?16:24, background:p.gradient, border:`1px solid ${p.accent}1e`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", boxShadow:hov?`0 28px 75px ${p.accent}2e`:`0 8px 38px ${p.accent}10`, transition:"box-shadow 0.4s" }}>
      <div style={{ position:"absolute", inset:10, border:`1.5px dashed ${p.accent}2e`, borderRadius:isMobile?10:16 }} />
      <div style={{ fontSize:isMobile?"4.5rem":"7rem", animation:"float 4s ease-in-out infinite", filter:`drop-shadow(0 0 18px ${p.accent}55)` }}>{p.visual}</div>
    </div>
  );

  const infoBox = (
    <div>
      {statusPill}
      <h3 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"1.75rem":"2.1rem", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em", marginBottom:"0.7rem" }}>{p.name} {p.emoji}</h3>
      <p style={{ color:C.muted, lineHeight:1.8, fontSize:isMobile?"0.85rem":"0.9rem", marginBottom:"1.1rem" }}>{p.desc}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"1.3rem" }}>
        {p.stack.map((s) => <span key={s} style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.62rem", padding:"0.22rem 0.6rem", borderRadius:6, background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>{s}</span>)}
      </div>
      <div style={{ display:"flex", gap:"1.1rem" }}>
        {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.84rem", color:C.violet, textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=C.pink} onMouseLeave={e=>e.target.style.color=C.violet}>⬡ GitHub →</a>}
        {p.live   && <a href={p.live}   target="_blank" rel="noreferrer" style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.84rem", color:C.pink,   textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=C.violet} onMouseLeave={e=>e.target.style.color=C.pink}>🌐 Live Site →</a>}
      </div>
    </div>
  );

  // Mobile: always stack (visual on top)
  if (isMobile) {
    return (
      <div className="reveal" style={{ background:C.card, borderRadius:20, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <div style={{ padding:0 }}>{visualBox}</div>
        <div style={{ padding:"1.4rem 1.4rem 1.6rem" }}>{infoBox}</div>
      </div>
    );
  }

  // Desktop: alternating
  return (
    <div className={reverse ? "reveal-right" : "reveal-left"}
      style={{ display:"grid", gridTemplateColumns:reverse?"1fr 1.45fr":"1.45fr 1fr", gap:"3.2rem", alignItems:"center" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {!reverse && visualBox}
      {infoBox}
      {reverse  && visualBox}
    </div>
  );
};

// ── PROJECTS
const Projects = () => {
  const isMobile = useIsMobile();
  const projects = [
    {
      name:"RideMate", emoji:"🚗", status:"wip", statusLabel:"In Progress",
      desc:"A campus ride-sharing platform solving real-world commute problems. Robust Spring Boot backend with secure JWT auth, ride matching, and a smooth Next.js frontend.",
      stack:["Spring Boot","Java","Next.js","MySQL","REST API","JWT"],
      gradient:"linear-gradient(135deg, #1c1c40, #14143a)",
      accent:C.violet, github:"https://github.com/Pragati30-code/RideMate", live:null, visual:"🚗",
    },
    {
      name:"Pawfect", emoji:"🐾", status:"live", statusLabel:"Live",
      desc:"A pet healthcare platform built with love for animals 🐶🐱. Connects pet owners with vets, health resources, and care guides. Deployed live on Vercel.",
      stack:["React","Next.js","Tailwind CSS","Vercel"],
      gradient:"linear-gradient(135deg, #261426, #180f1e)",
      accent:C.pink, github:null, live:"https://pawfect-cure.vercel.app", visual:"🐾",
    },
  ];
  return (
    <section id="projects" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", maxWidth:1100, margin:"0 auto" }}>
      <div className="reveal" style={{ marginBottom:isMobile?"2.5rem":"4rem" }}>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 03. featured projects</p>
        <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem, 4vw, 3.4rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em" }}>Things I've Built 🚀</h2>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:isMobile?"1.5rem":"3.5rem" }}>
        {projects.map((p, i) => <ProjectCard key={p.name} p={p} reverse={!isMobile && i%2!==0} isMobile={isMobile} />)}
      </div>
    </section>
  );
};

// ── CONTACT
const Contact = () => {
  const isMobile = useIsMobile();
  return (
    <section id="contact" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", background:`${C.surface}66`, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
        <div className="reveal">
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 04. let's connect</p>
          <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem, 5vw, 3.8rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em", marginBottom:"1.1rem", lineHeight:1.05 }}>
            Let's Build Something<br /><span style={{ color:C.pink }}>Together!</span> 🌸
          </h2>
          <p style={{ color:C.muted, lineHeight:1.85, fontSize:"0.93rem", margin:"0 auto 2.5rem", maxWidth:440 }}>
            Whether it's code, crafts, or a cool idea — I'm always up for a chat. Open to internships, full-time roles &amp; collaborations 💬
          </p>

          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", flexDirection:isMobile?"column":"row", alignItems:"center" }}>
            {[
              { label:"LinkedIn", href:"https://linkedin.com/in/pragatipanwar3005",  bg:"#0077b5",},
              { label:"GitHub",   href:"https://github.com/Pragati30-code",           bg:"#24292f",},
              // { label:"Resume",   href:"/resume.pdf",                                 bg:`linear-gradient(135deg, ${C.pink}, ${C.violet})`,                 icon:"📄" },
              { label:"Email",    href:"mailto:pragatipanwar30@gmail.com",           bg:`linear-gradient(135deg, ${C.violet}cc, ${C.mint}cc)`, },
            ].map((btn) => (
              <a key={btn.label}
                href={btn.href}
                target={btn.href.startsWith("mailto") ? "_self" : "_blank"}
                rel="noreferrer"
                style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.78rem 1.7rem", borderRadius:999, background:btn.bg, color:"white", textDecoration:"none", fontFamily:"'Syne', sans-serif", fontWeight:600, fontSize:"0.87rem", transition:"transform 0.28s, box-shadow 0.28s", boxShadow:"0 4px 18px rgba(0,0,0,0.28)", width:isMobile?"76%":"auto", justifyContent:"center" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 14px 32px rgba(0,0,0,0.38)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.28)"; }}
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
  <footer style={{ position:"relative", zIndex:1, padding:"1.8rem 1.5rem", textAlign:"center", borderTop:`1px solid ${C.border}` }}>
    <p style={{ fontFamily:"'DM Serif Display', serif", fontStyle:"italic", fontSize:"1.05rem", color:C.muted }}>
      Crafted with <span style={{ color:C.pink }}>♥</span> &amp; a lot of <span style={{ color:C.violet }}>🧵</span> by{" "}
      <br />
      <span style={{ color:C.text }}>Pragati Panwar</span>
    </p>
    <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.6rem", color:C.muted+"66", marginTop:"0.4rem", letterSpacing:"0.09em" }}>
      ✨ CODING WITH LOGIC, CREATING WITH HEART ✨
    </p>
  </footer>
);

// ── APP ROOT
export default function App() {
  const activeSection = useActiveSection();
  useReveal();
  return (
    <div style={{ background:C.bg, minHeight:"100vh" }}>
      <GlobalStyle />
      <CustomCursor />
      <ThreadCanvas />
      <Nav active={activeSection} />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}