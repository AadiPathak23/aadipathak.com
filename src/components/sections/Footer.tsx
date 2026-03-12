import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { RESUME_URL } from "../../constants";

const FOOTER_LINKS = [
  { label: "SKILLS", href: "#skills" },
  { label: "EDUCATION", href: "#education" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer className="border-t border-cyan/10 pt-10 pb-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-center lg:text-left">
          <div>
            <h3 className="text-lg font-bold tracking-wide text-text">AADI PATHAK</h3>
            <div className="mt-2 inline-flex lg:flex items-center gap-2 font-mono text-xs text-text-muted">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
              </span>
              AVAILABLE FOR WORK
            </div>
            <p className="mt-2 text-sm text-text-muted">Applied AI/ML Engineer building intelligent systems.</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href="https://github.com/AadiPathak23"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-border text-text-muted flex items-center justify-center hover:text-cyan hover:border-cyan/40 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={15} />
            </a>
            <a
              href="https://linkedin.com/in/aadipathak"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg border border-border text-text-muted flex items-center justify-center hover:text-cyan hover:border-cyan/40 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={15} />
            </a>
            <a
              href="mailto:aadipathak2323@gmail.com"
              className="w-9 h-9 rounded-lg border border-border text-text-muted flex items-center justify-center hover:text-cyan hover:border-cyan/40 transition-colors"
              aria-label="Email"
            >
              <FaEnvelope size={15} />
            </a>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-1.5 font-mono text-xs tracking-wider">
            {FOOTER_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-text-muted hover:text-cyan transition-colors">
                {link.label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:text-cyan/80 transition-colors"
            >
              RESUME
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-cyan/10 pt-4">
          <p className="text-center font-mono text-[11px] text-text-muted/70">
            &copy; 2026 Aadi Pathak. Built with React &amp; TypeScript.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
