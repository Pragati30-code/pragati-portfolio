// src/components/Skills.jsx
import { C } from "../constants";
import { useIsMobile } from "../hooks";

export const Skills = () => {
  const isMobile = useIsMobile();
  const cats = [
    { label:"Backend", icon:"☕", color:C.violet, tags:["Java","Spring Boot","Spring MVC","Hibernate","JPA","REST APIs","MySQL","Maven"] },
    { label:"Frontend", icon:"⚡", color:C.pink, tags:["React.js","Next.js","JavaScript","TypeScript","Tailwind CSS","HTML5","CSS3"] },
    { label:"Craft & Tools", icon:"🔧", color:C.mint, tags:["Git & GitHub","Postman","IntelliJ","VS Code","Vercel","Neondb","Render","Groq"] },
  ];

  return (
    <section id="skills" style={{ position:"relative", zIndex:1, padding:isMobile?"4rem 1.4rem":"7rem 3rem", background:`${C.surface}66`, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:isMobile?"2.5rem":"4rem" }}>
          <p style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.68rem", color:C.pink, letterSpacing:"0.2em", marginBottom:"0.9rem", textTransform:"uppercase" }}>// 02. skills &amp; threads</p>
          <h2 style={{ fontFamily:"'DM Serif Display', serif", fontSize:isMobile?"2.1rem":"clamp(2.4rem,4vw,3.4rem)", fontStyle:"italic", color:C.text, letterSpacing:"-0.02em" }}>My Toolkit 🪡</h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:isMobile?"1rem":"1.5rem" }}>
          {cats.map((cat, i) => (
            <div key={cat.label} className="reveal" data-delay={i*100}
              style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:isMobile?"1.5rem":"2rem", position:"relative", overflow:"hidden", transition:"transform 0.3s, box-shadow 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow=`0 22px 55px ${cat.color}18`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(to right, ${cat.color}00, ${cat.color}, ${cat.color}00)` }} />
              <div style={{ fontSize:"1.75rem", marginBottom:"0.65rem" }}>{cat.icon}</div>
              <h3 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"1.02rem", color:C.text, marginBottom:"0.95rem" }}>{cat.label}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem" }}>
                {cat.tags.map((tag) => (
                  <span key={tag}
                    style={{ fontFamily:"'Space Mono', monospace", fontSize:"0.63rem", padding:"0.28rem 0.75rem", borderRadius:999, border:`1px solid ${cat.color}30`, color:cat.color, background:`${cat.color}0c`, transition:"all 0.2s", cursor:"default" }}
                    onMouseEnter={(e) => { e.target.style.background=`${cat.color}22`; e.target.style.transform="scale(1.08)"; }}
                    onMouseLeave={(e) => { e.target.style.background=`${cat.color}0c`; e.target.style.transform=""; }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};