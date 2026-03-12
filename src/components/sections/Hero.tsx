import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FaGithub, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { RESUME_URL } from "../../constants";

// ─── Roles for typing animation ──────────────────────────────────────────────

const ROLES = [
  "AI/ML Engineer",
  "LLM Fine-Tuning Specialist",
  "RAG Systems Architect",
  "Applied AI Researcher",
];

// ─── Terminal script lines ───────────────────────────────────────────────────

interface TermLine {
  text: string;
  type: "prompt" | "output" | "blank" | "kv" | "dict-start" | "dict-entry" | "dict-end" | "comment-kv" | "success" | "help";
  key?: string;
  value?: string;
  comment?: string;
  bracket?: "open" | "close";
}

const TERM_LINES: TermLine[] = [
  { text: "$ python aadi_intro.py", type: "prompt" },
  { text: "", type: "blank" },
  { text: "Loading profile...", type: "output" },
  { text: "", type: "blank" },
  { text: 'name        = "Aadi Pathak"', type: "kv", key: "name", value: '"Aadi Pathak"' },
  { text: 'location    = "Tempe, AZ → New York, NY"', type: "kv", key: "location", value: '"Tempe, AZ → New York, NY"' },
  { text: 'education   = ["ASU (B.S. CS)", "NYU (M.S. CS — Fall \'26)"]', type: "kv", key: "education", value: '["ASU (B.S. CS)", "NYU (M.S. CS — Fall \'26)"]' },
  { text: 'focus       = "LLM Fine-Tuning | RAG | Applied AI"', type: "kv", key: "focus", value: '"LLM Fine-Tuning | RAG | Applied AI"' },
  { text: "experience  = {", type: "dict-start", key: "experience" },
  { text: '  "persistent_systems": "AI/ML Intern",', type: "dict-entry", key: '"persistent_systems"', value: '"AI/ML Intern"' },
  { text: '  "asu":               "Technology Consultant"', type: "dict-entry", key: '"asu"', value: '"Technology Consultant"' },
  { text: "}", type: "dict-end" },
  { text: 'skills.top  = ["Python", "PyTorch", "LoRA", "RAG"]', type: "kv", key: "skills.top", value: '["Python", "PyTorch", "LoRA", "RAG"]' },
  { text: "projects    = 6  # and counting...", type: "comment-kv", key: "projects", value: "6", comment: "# and counting..." },
  { text: 'currently   = "Fine-tuning models & breaking things"', type: "kv", key: "currently", value: '"Fine-tuning models & breaking things"' },
  { text: 'status      = "Available for work ✓"', type: "kv", key: "status", value: '"Available for work ✓"' },
  { text: "", type: "blank" },
  { text: "Profile loaded successfully.", type: "success" },
  { text: "Type 'help' for more commands.", type: "help" },
];

const MOBILE_TERM_LINES: TermLine[] = [
  { text: "$ python aadi_intro.py", type: "prompt" },
  { text: "", type: "blank" },
  { text: "Loading profile...", type: "output" },
  { text: "", type: "blank" },
  { text: 'name     = "Aadi Pathak"', type: "kv", key: "name", value: '"Aadi Pathak"' },
  { text: 'location = "Tempe → NYC"', type: "kv", key: "location", value: '"Tempe → NYC"' },
  { text: 'focus    = "LLM | RAG | AI"', type: "kv", key: "focus", value: '"LLM | RAG | AI"' },
  { text: 'skills   = ["Python", "PyTorch", "LoRA"]', type: "kv", key: "skills", value: '["Python", "PyTorch", "LoRA"]' },
  { text: "projects = 6  # and counting...", type: "comment-kv", key: "projects", value: "6", comment: "# and counting..." },
  { text: 'status   = "Available ✓"', type: "kv", key: "status", value: '"Available ✓"' },
  { text: "", type: "blank" },
  { text: "Profile loaded successfully.", type: "success" },
  { text: "Type 'help' for more commands.", type: "help" },
];

// ─── Interactive command responses ───────────────────────────────────────────

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  skills    → top technical skills",
    "  contact   → how to reach me",
    "  projects  → what I've built",
    "  sudo hire aadi → ???",
    "  clear     → clear terminal",
  ],
  skills: [
    "→ Python, PyTorch, TensorFlow",
    "→ LoRA/PEFT, HuggingFace, LangChain",
    "→ ChromaDB, RAG, Sentence Transformers",
    "→ React, TypeScript, REST APIs",
  ],
  contact: [
    "→ Email:    aadipathak2323@gmail.com",
    "→ GitHub:   github.com/AadiPathak23",
    "→ LinkedIn: linkedin.com/in/aadipathak",
  ],
  projects: [
    "→ Atlas-RAG        Hybrid retrieval RAG system",
    "→ finetune-agent   Automated LLM fine-tuning",
    "→ Asclepius-HI     Healthcare assistant",
    "→ Cricket Predictor ML match prediction (85%)",
    "→ Poem Generator   LSTM poetry generation",
    "→ SwipeJobs        AI job matching",
  ],
  "sudo hire aadi": [
    "Permission granted. Sending offer letter... ✓",
  ],
};

// ─── Render a single terminal line with syntax coloring ──────────────────────

function renderTermLine(line: TermLine): React.ReactNode {
  switch (line.type) {
    case "prompt":
      return <><span className="term-prompt">$ </span><span className="term-cmd">{line.text.slice(2)}</span></>;
    case "output":
      return <span className="term-output">{line.text}</span>;
    case "blank":
      return "\u00A0";
    case "kv":
      return renderKV(line.key!, line.value!);
    case "dict-start":
      return <><span className="term-key">{line.key!.padEnd(12)}</span><span className="term-eq"> = </span><span className="term-bracket">{"{"}</span></>;
    case "dict-entry":
      return <><span className="term-indent">{"  "}</span><span className="term-string">{line.key!}</span><span className="term-eq">: </span><span className="term-string">{line.value!}</span>{line.text.endsWith(",") ? <span className="term-eq">,</span> : null}</>;
    case "dict-end":
      return <span className="term-bracket">{"}"}</span>;
    case "comment-kv":
      return <><span className="term-key">{line.key!.padEnd(12)}</span><span className="term-eq"> = </span><span className="term-value">{line.value!}</span>{"  "}<span className="term-comment">{line.comment!}</span></>;
    case "success":
      return <span className="term-success">{line.text}</span>;
    case "help":
      return <span className="term-help">{line.text}</span>;
    default:
      return line.text;
  }
}

function renderKV(key: string, value: string): React.ReactNode {
  const padded = key.padEnd(12);
  const isStatusLine = key === "status";
  const hasListOrDict = value.startsWith("[");

  if (isStatusLine) {
    return <><span className="term-key">{padded}</span><span className="term-eq"> = </span><span className="term-success">{value}</span></>;
  }

  if (hasListOrDict) {
    return <><span className="term-key">{padded}</span><span className="term-eq"> = </span>{renderList(value)}</>;
  }

  return <><span className="term-key">{padded}</span><span className="term-eq"> = </span><span className="term-string">{value}</span></>;
}

function renderList(val: string): React.ReactNode {
  const inner = val.slice(1, -1);
  const items = inner.split(", ");
  return (
    <>
      <span className="term-bracket">[</span>
      {items.map((item, i) => (
        <span key={i}>
          <span className="term-string">{item}</span>
          {i < items.length - 1 && <span className="term-eq">, </span>}
        </span>
      ))}
      <span className="term-bracket">]</span>
    </>
  );
}

// ─── Terminal Component ──────────────────────────────────────────────────────

function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typingDone, setTypingDone] = useState(false);
  const [commandHistory, setCommandHistory] = useState<{ type: "cmd" | "output"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasStartedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const lines = isMobile ? MOBILE_TERM_LINES : TERM_LINES;

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (reducedMotion) {
      setVisibleLines(lines.length);
      setTypingDone(true);
      return;
    }

    let current = 0;
    const reveal = () => {
      current++;
      setVisibleLines(current);
      if (current < lines.length) {
        const delay = lines[current]?.type === "blank" ? 150 : 300;
        setTimeout(reveal, delay);
      } else {
        setTypingDone(true);
      }
    };
    setTimeout(reveal, 800);

    const handleScroll = () => {
      if (!typingDone) {
        setVisibleLines(lines.length);
        setTypingDone(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lines, reducedMotion, typingDone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines, commandHistory]);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setCommandHistory([]);
      return;
    }

    const response = COMMANDS[trimmed];
    const newEntries: { type: "cmd" | "output"; text: string }[] = [
      { type: "cmd", text: cmd },
    ];

    if (response) {
      response.forEach((line) => newEntries.push({ type: "output", text: line }));
    } else {
      newEntries.push({ type: "output", text: `Command not found: '${trimmed}'. Try 'help'` });
    }

    setCommandHistory((prev) => [...prev, ...newEntries]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(inputValue);
      setInputValue("");
    }
  };

  const handleTerminalClick = () => {
    if (typingDone && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="hero-terminal w-full"
      onClick={handleTerminalClick}
    >
      {/* Title bar */}
      <div className="hero-term-titlebar flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/80" />
          <span className="w-3 h-3 rounded-full bg-amber-300/80" />
          <span className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <span className="font-mono text-[10px] text-text-muted tracking-wider">
          aadi_intro.py — running
        </span>
        <div className="w-12" />
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="hero-term-body font-mono text-[11px] sm:text-xs leading-[1.8] p-4 overflow-y-auto"
        style={{ maxHeight: "420px" }}
      >
        {/* Auto-typed script lines */}
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={`s-${i}`} className="whitespace-pre-wrap break-all sm:break-normal">
            {renderTermLine(line)}
          </div>
        ))}

        {/* Interactive command history */}
        {commandHistory.map((entry, i) => (
          <div key={`c-${i}`} className="whitespace-pre-wrap break-all sm:break-normal">
            {entry.type === "cmd" ? (
              <><span className="term-prompt">$ </span><span className="term-cmd">{entry.text}</span></>
            ) : (
              <span className="term-output">{entry.text}</span>
            )}
          </div>
        ))}

        {/* Input line */}
        {typingDone && (
          <div className="flex items-center">
            <span className="term-prompt">$ </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="hero-term-input flex-1 bg-transparent border-none outline-none font-mono text-[11px] sm:text-xs text-text caret-cyan"
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
            />
            {!isFocused && !inputValue && (
              <span className="animate-blink text-cyan">▌</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Role typing animation ───────────────────────────────────────────────────

function RoleTyping() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentRole.length) {
            setDisplayText(currentRole.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentRole.slice(0, displayText.length - 1));
          } else {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <div className="font-mono text-sm sm:text-base">
      <span className="text-text-muted">const role = "</span>
      <span className="text-cyan">{displayText}</span>
      <span className="animate-blink text-cyan">|</span>
      <span className="text-text-muted">";</span>
    </div>
  );
}

// ─── Scroll indicator ────────────────────────────────────────────────────────

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) setVisible(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.5 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-text-muted/50">
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <span className="font-mono text-[9px] text-text-muted/40 tracking-widest uppercase">
        scroll to explore
      </span>
    </motion.div>
  );
}

// ─── Main Hero ───────────────────────────────────────────────────────────────

function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Grid background */}
      <div className="hero-grid-bg absolute inset-0" />

      {/* Ambient glow behind terminal area */}
      <div className="hero-ambient-glow" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-12 items-center">
          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
              </span>
              <span className="font-mono text-xs text-text-muted tracking-wider">
                online — building something with <span className="text-cyan">LLMs</span> right now
              </span>
            </div>

            {/* Name treatment */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-3 select-none"
            >
              <div className="flex items-end flex-wrap">
                <span className="text-[3.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8rem] xl:text-[9rem] font-black leading-[0.85] tracking-tighter hero-name-muted">
                  AADI
                </span>
                <span
                  className="relative -ml-2 sm:-ml-3 md:-ml-4 lg:-ml-5 text-[3.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[8rem] xl:text-[9rem] font-black leading-[0.85] tracking-tighter text-[#0a0a0f] px-2 sm:px-3 md:px-4 lg:px-5"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                >
                  PATHAK
                </span>
              </div>
              <div className="mt-2 font-mono text-xs text-cyan/70 tracking-wider">
                aadi@ml-lab:~$<span className="animate-blink ml-0.5">▌</span>
              </div>
            </motion.div>

            {/* Role typing */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-5"
            >
              <RoleTyping />
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-sm sm:text-base text-text-muted leading-relaxed max-w-xl mb-7"
            >
              I don't just train models — I build{" "}
              <span className="text-text font-semibold">systems that think</span>. From
              fine-tuning Qwen3 on{" "}
              <span className="text-text font-semibold">100K+ line</span> repositories to
              architecting{" "}
              <span className="text-text font-semibold">hybrid retrieval</span> pipelines
              that actually work on real codebases. Currently finishing my CS degree at ASU,
              heading to <span className="text-text font-semibold">NYU</span> this fall for
              grad school.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-mono text-xs font-medium bg-cyan text-[#0a0a0f] px-5 py-2.5 rounded-md hover:bg-cyan/90 transition-colors duration-200 tracking-wider"
              >
                Explore My Work ↓
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-medium border border-cyan/50 text-cyan px-5 py-2.5 rounded-md hover:bg-cyan/10 transition-colors duration-200 tracking-wider"
              >
                Download Resume ↗
              </a>
            </motion.div>

            {/* "or just say hello" link */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-6"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-mono text-xs text-cyan/70 hover:text-cyan transition-colors tracking-wider"
              >
                or just say hello →
              </a>
            </motion.div>

            {/* Social icons */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-2.5"
            >
              {[
                { icon: <FaGithub size={15} />, href: "https://github.com/AadiPathak23", label: "GitHub" },
                { icon: <FaLinkedinIn size={15} />, href: "https://linkedin.com/in/aadipathak", label: "LinkedIn" },
                { icon: <FaEnvelope size={15} />, href: "mailto:aadipathak2323@gmail.com", label: "Email" },
              ].map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="hero-social-btn"
                  aria-label={s.label}
                  initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.75 + i * 0.08 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — Terminal ──────────────────────────────── */}
          <div className="w-full max-w-lg lg:max-w-none mx-auto lg:mx-0">
            <Terminal />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}

export default Hero;
