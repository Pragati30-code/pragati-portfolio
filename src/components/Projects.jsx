// src/components/Projects.jsx
import { useState } from "react";
import { C } from "../constants";
import { useIsMobile } from "../hooks";

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
        {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.84rem", color:C.violet, textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={(e) => e.target.style.color=C.pink} onMouseLeave={(e) => e.target.style.color=C.violet}>⬡ GitHub →</a>}
        {p.live && <a href={p.live} target="_blank" rel="noreferrer" style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:"0.84rem", color:C.pink, textDecoration:"none", transition:"color 0.2s" }} onMouseEnter={(e) => e.target.style.color=C.violet} onMouseLeave={(e) => e.target.style.color=C.pink}>🌐 Live Site →</a>}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="reveal" style={{ background:C.card, borderRadius:20, overflow:"hidden", border:`1px solid ${C.border}` }}>
        <div>{visualBox}</div>
        <div style={{ padding:"1.4rem 1.4rem 1.6rem" }}>{infoBox}</div>
      </div>
    );
  }

  return (
    <div className={reverse?"reveal-right":"reveal-left"}
      style={{ display:"grid", gridTemplateColumns:reverse?"1fr 1.45fr":"1.45fr 1fr", gap:"3.2rem", alignItems:"center" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {!reverse && visualBox}{infoBox}{reverse && visualBox}
    </div>
  );
};

export const Projects = () => {
  const isMobile = useIsMobile();
  const projects = [
    { name:"Pawfect", emoji:"🐾", status:"live", statusLabel:"Live", desc:"A pet healthcare platform built with love for animals 🐶🐱. Connects pet owners with vets, health resources, and care guides. Deployed live on Vercel.", stack:["Java","Springboot","React","Next.js","Tailwind CSS","PostgreSQL","Hibernate","JWT","GroqAPI"], gradient:"linear-gradient(135deg, #261426, #180f1e)", accent:C.pink, github:null, live:"https://pawfect-cure.vercel.app", visual:"🐾" },
    { name:"RideMate", emoji:"🚗", status:"wip", statusLabel:"In Progress", desc:"A campus ride-sharing platform solving real-world commute problems. Robust Spring Boot backend with secure JWT auth, ride matching, and a smooth Next.js frontend.", stack:["Spring Boot","Java","Maven","React","PostgreSQL","Hibernate","RestAPI","Websocket","JWT"], gradient:"linear-gradient(135deg, #1c1c40, #14143a)", accent:C.violet, github:"https://github.com/Pragati30-code/RideMate", live:null, visual:"🚗" },
  ];

  return (
    <section id="projects" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", maxWidth:1100, margin:"0 auto" }}>
      <div className="reveal" style={{ marginBottom:isMobile?"2.5rem":"4rem" }}>
        <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 03. featured projects</p>
        <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem,4vw,3.4rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em" }}>Things I've Built 🚀</h2>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:isMobile?"1.5rem":"3.5rem" }}>
        {projects.map((p, i) => <ProjectCard key={p.name} p={p} reverse={!isMobile&&i%2!==0} isMobile={isMobile} />)}
      </div>
    </section>
  );
};