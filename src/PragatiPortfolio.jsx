// src/PragatiPortfolio.jsx  ← replace your entire file with this
import { useActiveSection, useReveal } from "./hooks";
import { GlobalStyle, CustomCursor, ThreadCanvas } from "./components/Background";
import { Nav } from "./components/Nav";
import { Hero, Marquee } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Contact, Footer } from "./components/ContactFooter";
import { C } from "./constants";

export default function App() {
  const activeSection = useActiveSection();
  useReveal();
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
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