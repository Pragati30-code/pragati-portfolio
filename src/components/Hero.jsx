// src/components/Hero.jsx
import { useState, useEffect, useRef } from "react";
import { C } from "../constants";
import { useIsMobile } from "../hooks";

export const Hero = () => {
  const isMobile = useIsMobile();
  const [typed, setTyped] = useState("");
  const phrases = ["Java Backend Developer.", "React Engineer.", "Creative Crafter.", "DSA Problem Solver.", "Final-Year Btech Stud."];
  const pIdx = useRef(0);
  const cIdx = useRef(0);
  const del = useRef(false);

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
    <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", position:"relative", zIndex:1, textAlign:"center", padding:isMobile?"5.5rem 1.4rem 3rem":"6rem 2rem 4rem" }}>
      {!isMobile && (
        <div style={{ position:"absolute", top:"14%", right:"7%", width:190, height:190, opacity:0.1, animation:"rotate-slow 32s linear infinite", pointerEvents:"none" }}>
          <svg viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="82" stroke={C.pink} strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="90" cy="90" r="62" stroke={C.violet} strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="90" cy="90" r="42" stroke={C.mint} strokeWidth="1" strokeDasharray="2 10" />
            {[0,1,2,3].map((i) => (
              <g key={i} transform={`rotate(${i*90} 90 90)`}>
                <line x1="90" y1="18" x2="90" y2="50" stroke={C.pink} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="76" y1="26" x2="90" y2="50" stroke={C.violet} strokeWidth="1" strokeLinecap="round" />
                <line x1="104" y1="26" x2="90" y2="50" stroke={C.violet} strokeWidth="1" strokeLinecap="round" />
              </g>
            ))}
          </svg>
        </div>
      )}

      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:isMobile?"0.6rem":"0.68rem", padding:"0.4rem 1.2rem", border:`1px solid ${C.pink}44`, borderRadius:999, color:C.pink, letterSpacing:"0.12em", marginBottom:"1.8rem", background:`${C.pink}0a`, animation:"fade-in 0.8s ease both", display:"inline-flex", alignItems:"center", gap:"0.5rem" }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:C.mint, boxShadow:`0 0 6px ${C.mint}`, animation:"blink-dot 2s ease-in-out infinite" }} />
        OPEN TO OPPORTUNITIES
      </div>

      <h1 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"clamp(2.8rem,12vw,4.8rem)":"clamp(3.8rem,9vw,7.5rem)", fontStyle:"italic", lineHeight:0.95, letterSpacing:"-0.03em", marginBottom:"1.2rem", animation:"slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}>
        <span style={{ color:C.text }}>Hola! </span>
        <span style={{ background:`linear-gradient(135deg, ${C.pink} 0%, ${C.violet} 50%, ${C.mint} 100%)`, backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite" }}>Coders </span>
        <span style={{ color:C.text }}> 👋</span>
      </h1>

      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:isMobile?"0.82rem":"clamp(0.95rem,2.2vw,1.25rem)", height:"2rem", display:"flex", alignItems:"center", gap:"0.4rem", animation:"fade-in 0.9s ease 0.3s both", marginBottom:"1.6rem" }}>
        <span style={{ color:C.violet }}>{">"}</span>
        <span style={{ color:C.text }}>{typed}</span>
        <span style={{ display:"inline-block", width:2, height:"1.1em", background:C.pink, borderRadius:1, animation:"blink-dot 1s step-end infinite" }} />
      </div>

      <p style={{ maxWidth:isMobile?"100%":520, fontSize:isMobile?"0.88rem":"0.97rem", lineHeight:1.88, color:C.muted, marginBottom:"2.5rem", animation:"slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both", padding:isMobile?"0 0.3rem":0 }}>
        I love solving real-world problems with code 🧩 &amp; express creativity through embroidery 🧵. Logic and creativity together build powerful things.
      </p>

      <div style={{ display:"flex", gap:"1rem", flexDirection:isMobile?"column":"row", alignItems:"center", justifyContent:"center", animation:"slide-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.58s both", width:isMobile?"100%":"auto" }}>
        <a href="#projects" style={{ padding:"0.9rem 2.2rem", background:`linear-gradient(135deg, ${C.pink}, ${C.violet})`, color:"white", borderRadius:999, textDecoration:"none", fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.9rem", letterSpacing:"0.04em", boxShadow:`0 0 28px ${C.pink}44`, transition:"transform 0.25s, box-shadow 0.25s", width:isMobile?"78%":"auto", textAlign:"center" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 10px 36px ${C.pink}66`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 0 28px ${C.pink}44`; }}>
          View My Work →
        </a>
        <a href="#contact" style={{ padding:"0.9rem 2.2rem", background:"transparent", color:C.text, borderRadius:999, textDecoration:"none", fontFamily:"'Syne', sans-serif", fontWeight:600, fontSize:"0.9rem", border:`1px solid ${C.border}`, transition:"all 0.25s", width:isMobile?"78%":"auto", textAlign:"center" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor=C.violet; e.currentTarget.style.color=C.violet; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text; }}>
          Let's Connect 💌
        </a>
      </div>

      {!isMobile && (
        <div style={{ position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", animation:"fade-in 1s ease 1.4s both" }}>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.58rem", color:C.muted, letterSpacing:"0.14em" }}>SCROLL</span>
          <div style={{ width:1, height:46, background:`linear-gradient(to bottom, ${C.violet}, transparent)` }} />
        </div>
      )}
    </section>
  );
};

export const Marquee = () => {
  const items = ["☕ Java","⚡ Spring Boot","🌀 React","🔷 Next.js","🧩 DSA","🧵 Embroidery","✂️ Crafts","🌐 REST APIs","🗄️ MySQL","🔧 Git"];
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