// src/components/Nav.jsx
import { useState, useEffect } from "react";
import { C } from "../constants";
import { useIsMobile } from "../hooks";

export const Nav = ({ active }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const links = ["home", "about", "skills"];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

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
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, padding:isMobile?"1rem 1.4rem":"1.1rem 3rem", display:"flex", justifyContent:"space-between", alignItems:"center", background:scrolled||menuOpen?`${C.bg}ee`:"transparent", backdropFilter:scrolled||menuOpen?"blur(20px)":"none", borderBottom:scrolled?`1px solid ${C.border}`:"none", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
        <a href="#home" style={{ fontFamily:"'DM Serif Display', serif", fontSize:"1.45rem", fontStyle:"italic", background:`linear-gradient(135deg, ${C.pink}, ${C.violet})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", textDecoration:"none" }}>
          Pragati 🦋
        </a>

        {!isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:"2.5rem" }}>
            {links.map((lnk) => (
              <a key={lnk} href={`#${lnk}`} style={linkStyle(lnk)}>
                {lnk}
                {active === lnk && <span style={{ position:"absolute", bottom:-4, left:0, right:0, height:1, background:`linear-gradient(to right, ${C.pink}, ${C.violet})`, borderRadius:1 }} />}
              </a>
            ))}
            <a href="/resume.pdf" target="_blank" rel="noreferrer"
              style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", padding:"0.45rem 1.1rem", border:`1px solid ${C.pink}66`, borderRadius:999, color:C.pink, textDecoration:"none", letterSpacing:"0.09em", textTransform:"uppercase", background:`${C.pink}0d`, transition:"all 0.25s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background=`${C.pink}22`; e.currentTarget.style.borderColor=C.pink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background=`${C.pink}0d`; e.currentTarget.style.borderColor=`${C.pink}66`; }}>
              Resume ↗
            </a>
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:"4px 2px" }}>
            {[0,1,2].map((i) => (
              <span key={i} style={{ display:"block", width:22, height:1.5, background:menuOpen&&i===1?"transparent":C.text, borderRadius:2, transition:"all 0.3s", transform:menuOpen?(i===0?"rotate(45deg) translate(4.5px, 4.5px)":i===2?"rotate(-45deg) translate(4.5px, -4.5px)":"none"):"none" }} />
            ))}
          </button>
        )}
      </nav>

      {isMobile && menuOpen && (
        <div style={{ position:"fixed", top:"58px", left:0, right:0, zIndex:299, background:`${C.bg}f5`, backdropFilter:"blur(24px)", borderBottom:`1px solid ${C.border}`, padding:"1.2rem 1.6rem 1.6rem", display:"flex", flexDirection:"column", gap:0, animation:"menu-in 0.22s ease both" }}>
          {links.map((lnk, i) => (
            <a key={lnk} href={`#${lnk}`} onClick={() => setMenuOpen(false)}
              style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.88rem", color:active===lnk?C.pink:C.muted, textDecoration:"none", letterSpacing:"0.09em", textTransform:"uppercase", padding:"0.95rem 0", borderBottom:`1px solid ${C.border}`, transition:"color 0.2s" }}>
              <span style={{ color:C.violet, marginRight:"0.6rem" }}>{String(i+1).padStart(2,"0")}.</span>{lnk}
            </a>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noreferrer"
            style={{ marginTop:"1rem", display:"flex", alignItems:"center", justifyContent:"center", padding:"0.8rem", background:`linear-gradient(135deg, ${C.pink}22, ${C.violet}22)`, border:`1px solid ${C.pink}44`, borderRadius:10, fontFamily:"'Space Mono', monospace", fontSize:"0.8rem", color:C.pink, textDecoration:"none", letterSpacing:"0.09em", textTransform:"uppercase" }}>
            📄 Resume ↗
          </a>
        </div>
      )}
    </>
  );
};