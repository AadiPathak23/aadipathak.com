import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { RESUME_URL } from "../../constants";

const NAV_ITEMS = [
  { label: "SKILLS", href: "#skills" },
  { label: "EDUCATION", href: "#education" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(Math.min(progress, 1));

      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="nav-container fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="font-mono text-base font-bold text-text tracking-wider shrink-0"
          >
            AADI <span className="text-cyan">■</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-7">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`nav-link font-mono text-[0.8rem] tracking-[0.1em] uppercase transition-colors duration-200 ${
                      isActive ? "text-cyan" : "text-text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <span className="text-cyan mr-1.5 text-[0.5rem] align-middle">●</span>
                    )}
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-3 ml-7">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-resume-btn font-mono text-[0.8rem] tracking-[0.1em] uppercase border border-cyan text-cyan px-4 py-1.5 rounded hover:bg-cyan hover:text-[#0a0a0f] transition-all duration-200"
              >
                RESUME
              </a>

              <button
                onClick={toggleTheme}
                className="nav-theme-btn w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:text-cyan hover:border-cyan/40 transition-all duration-200"
                aria-label="Toggle theme"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {theme === "dark" ? <FiMoon size={14} /> : <FiSun size={14} />}
                </motion.div>
              </button>
            </div>
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="nav-theme-btn w-8 h-8 flex items-center justify-center rounded-full border border-border text-text-muted hover:text-cyan transition-all duration-200"
              aria-label="Toggle theme"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {theme === "dark" ? <FiMoon size={14} /> : <FiSun size={14} />}
              </motion.div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cyan p-1.5"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-[5px]">
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-current transition-all duration-300 origin-center ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll progress bar — bottom edge of navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
          }}
        />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden nav-mobile-menu"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`font-mono text-sm tracking-[0.1em] uppercase py-3 transition-colors duration-200 ${
                      isActive ? "text-cyan" : "text-text-muted"
                    }`}
                  >
                    {isActive && (
                      <span className="text-cyan mr-2 text-[0.5rem] align-middle">●</span>
                    )}
                    {item.label}
                  </a>
                );
              })}
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm tracking-[0.1em] uppercase border border-cyan text-cyan px-4 py-2.5 rounded text-center mt-3 hover:bg-cyan hover:text-[#0a0a0f] transition-all duration-200"
              >
                RESUME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
