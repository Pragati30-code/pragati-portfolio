// src/components/ContactFooter.jsx
import { C } from "../constants";
import { useIsMobile } from "../hooks";

export const Contact = () => {
  const isMobile = useIsMobile();
  const btns = [
    { label:"LinkedIn", href:"https://linkedin.com/in/pragatipanwar3005", bg:"#0077b5" },
    { label:"GitHub", href:"https://github.com/Pragati30-code", bg:"#24292f" },
    { label:"Email", href:"mailto:pragatipanwar30@gmail.com", bg:`linear-gradient(135deg, ${C.violet}cc, ${C.mint}cc)` },
  ];

  return (
    <section id="contact" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", background:`${C.surface}66`, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" }}>
        <div className="reveal">
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 04. let's connect</p>
          <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem,5vw,3.8rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em", marginBottom:"1.1rem", lineHeight:1.05 }}>
            Let's Build Something<br /><span style={{ color:C.pink }}>Together!</span> 🌸
          </h2>
          <p style={{ color:C.muted, lineHeight:1.85, fontSize:"0.93rem", margin:"0 auto 2.5rem", maxWidth:440 }}>
            Whether it's code, crafts, or a cool idea — I'm always up for a chat. Open to internships, full-time roles &amp; collaborations 💬
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", flexDirection:isMobile?"column":"row", alignItems:"center" }}>
            {btns.map((btn) => (
              <a key={btn.label} href={btn.href} target={btn.href.startsWith("mailto")?"_self":"_blank"} rel="noreferrer"
                style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.78rem 1.7rem", borderRadius:999, background:btn.bg, color:"white", textDecoration:"none", fontFamily:"'Syne', sans-serif", fontWeight:600, fontSize:"0.87rem", transition:"transform 0.28s, box-shadow 0.28s", boxShadow:"0 4px 18px rgba(0,0,0,0.28)", width:isMobile?"76%":"auto", justifyContent:"center" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 14px 32px rgba(0,0,0,0.38)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.28)"; }}>
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer style={{ position:"relative", zIndex:1, padding:"1.8rem 1.5rem", textAlign:"center", borderTop:`1px solid ${C.border}` }}>
    <p style={{ fontFamily:"'DM Serif Display', serif", fontStyle:"italic", fontSize:"1.05rem", color:C.muted }}>
      Crafted with <span style={{ color:C.pink }}>♥</span> &amp; a lot of <span style={{ color:C.violet }}>🧵</span> by <br />
      <span style={{ color:C.text }}>Pragati Panwar</span>
    </p>
    <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.6rem", color:C.muted+"66", marginTop:"0.4rem", letterSpacing:"0.09em" }}>
      ✨ CODING WITH LOGIC, CREATING WITH HEART ✨
    </p>
  </footer>
);