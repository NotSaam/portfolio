import BootIntro from "./components/BootIntro";
import AuroraBackground from "./components/AuroraBackground";
import ScrollProgress from "./components/ScrollProgress";
import CommandPalette from "./components/CommandPalette";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Focus from "./components/Focus";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <BootIntro />
      <AuroraBackground />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Focus />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
