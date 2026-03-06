// src/components/Background.jsx
import { useEffect, useRef } from "react";
import { C } from "../constants";
import { useIsMobile } from "../hooks";

export const GlobalStyle = () => {
  useEffect(() => {
    const id = "pragati-global";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #0a0a0f; color: #f0eaf8; font-family: 'Syne', sans-serif; overflow-x: hidden; cursor: none; }
      @media (max-width: 768px) { body { cursor: auto; } }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #0a0a0f; }
      ::-webkit-scrollbar-thumb { background: #b06aff44; border-radius: 4px; }
      @keyframes float { 0%,100%{transform:translateY(0) rotate(0)} 33%{transform:translateY(-12px) rotate(1.5deg)} 66%{transform:translateY(-5px) rotate(-1deg)} }
      @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes blink-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }
      @keyframes slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fade-in { from{opacity:0} to{opacity:1} }
      @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes menu-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.75s cubic-bezier(0.16,1,0.3,1),transform 0.75s cubic-bezier(0.16,1,0.3,1); }
      .reveal.in-view { opacity:1; transform:translateY(0); }
      .reveal-left { opacity:0; transform:translateX(-36px); transition:opacity 0.85s cubic-bezier(0.16,1,0.3,1),transform 0.85s cubic-bezier(0.16,1,0.3,1); }
      .reveal-left.in-view { opacity:1; transform:translateX(0); }
      .reveal-right { opacity:0; transform:translateX(36px); transition:opacity 0.85s cubic-bezier(0.16,1,0.3,1),transform 0.85s cubic-bezier(0.16,1,0.3,1); }
      .reveal-right.in-view { opacity:1; transform:translateX(0); }
      @media (max-width: 768px) {
        .reveal-left,.reveal-right { transform:translateY(24px); }
        .reveal-left.in-view,.reveal-right.in-view { transform:translateY(0); }
      }
    `;
    document.head.appendChild(el);
  }, []);
  return null;
};

export const CustomCursor = () => {
  const ring = useRef(null);
  const dot = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const tgt = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
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

export const ThreadCanvas = () => {
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
        this.lw = 0.8 + Math.random() * 1.2;
        this.wave = Math.random() * Math.PI * 2;
        this.wAmp = 18 + Math.random() * 45;
        this.spd = 0.22 + Math.random() * 0.35;
        this.t = 0;
      }
      tick() { this.y += this.spd; this.wave += 0.013; this.t += 0.004; if (this.y > H + 100) this.reset(); }
      draw() {
        const ox = Math.sin(this.wave) * this.wAmp;
        ctx.save(); ctx.globalAlpha = this.alpha; ctx.strokeStyle = this.color; ctx.lineWidth = this.lw; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x + Math.cos(this.angle) * this.len * 0.33 + ox, this.y + Math.sin(this.angle) * this.len * 0.33, this.x + Math.cos(this.angle + this.t) * this.len * 0.66 - ox * 0.5, this.y + Math.sin(this.angle) * this.len * 0.66, this.x + Math.cos(this.angle + this.t * 2) * this.len, this.y + Math.sin(this.angle) * this.len);
        ctx.stroke(); ctx.restore();
      }
    }
    resize();
    for (let i = 0; i < 38; i++) threads.push(new T());
    const loop = () => { ctx.clearRect(0, 0, W, H); threads.forEach((t) => { t.tick(); t.draw(); }); id = requestAnimationFrame(loop); };
    loop();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
};