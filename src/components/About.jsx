// src/components/About.jsx
import { useState, useEffect, useRef } from "react";
import { C } from "../constants";
import { useIsMobile } from "../hooks";

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

export const About = () => {
  const isMobile = useIsMobile();
  const skills = [
    { label:"Java / Spring Boot", pct:72, color:C.violet },
    { label:"React / Next.js", pct:80, color:C.pink },
    { label:"DSA & Algorithms", pct:75, color:C.mint },
    { label:"JavaScript", pct:78, color:C.gold },
  ];
  const cards = [
    { icon:"☕", title:"Backend", sub:"Java · Spring Boot · REST APIs", color:C.violet },
    { icon:"⚡", title:"Frontend", sub:"React · Next.js · Tailwind", color:C.pink },
    { icon:"🧩", title:"DSA", sub:"Problem Solving · Algorithms", color:C.gold },
    { icon:"🧵", title:"Embroidery", sub:"Cross-stitch · Patterns · Art", color:C.mint },
  ];

  return (
    <section id="about" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", maxWidth:1100, margin:"0 auto" }}>
      <div className="reveal" style={{ marginBottom:isMobile?"2rem":"3.5rem" }}>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.6rem" }}>// 01. about me</p>
        <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem,4vw,3.4rem)", fontStyle:"italic", lineHeight:1.05, letterSpacing:"-0.02em", color:C.text }}>
          The girl who codes<br /><span style={{ color:C.pink }}>&amp; crafts</span> 🌸
        </h2>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:isMobile?"2.5rem":"5rem", alignItems:"start" }}>
        <div className={isMobile?"reveal":"reveal-left"}>
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

        <div className={isMobile?"reveal":"reveal-right"} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:isMobile?"0.75rem":"1rem" }}>
          {cards.map((card) => (
            <div key={card.title}
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:isMobile?"1.05rem":"1.45rem", transition:"transform 0.3s, border-color 0.3s, box-shadow 0.3s", cursor:"default" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-6px) scale(1.02)"; e.currentTarget.style.borderColor=card.color+"55"; e.currentTarget.style.boxShadow=`0 18px 40px ${card.color}1e`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow=""; }}>
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