import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { BsDatabase } from "react-icons/bs";
import {
  FaBrain,
  FaChartLine,
  FaDatabase,
  FaJava,
  FaRocket,
  FaSearch,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import {
  SiAmazonwebservices,
  SiAntdesign,
  SiCplusplus,
  SiSharp,
  SiDocker,
  SiGit,
  SiGithub,
  SiGnubash,
  SiHuggingface,
  SiJupyter,
  SiLinux,
  SiMongodb,
  SiNumpy,
  SiNvidia,
  SiOpenai,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPytorch,
  SiPython,
  SiScikitlearn,
  SiTensorflow,
  SiVercel,
  SiVscodium,
} from "react-icons/si";

interface PipelineStage {
  id: string;
  label: string;
  subtitle: string;
  icon: IconType;
  skills: string[];
}

interface ProficiencyItem {
  name: string;
  value: number;
}

interface StatLine {
  key: string;
  command: string;
  value: string;
  context: string;
}

type SkillCategory = "ML / AI" | "LANGUAGES" | "DATA & INFRA" | "TOOLS & PLATFORMS";
type SkillFilter = "ALL" | SkillCategory;

interface SkillIconItem {
  name: string;
  category: SkillCategory;
  icon: IconType;
  color: string;
}

interface CertificationItem {
  issuer: string;
  title: string;
  meta: string;
  accent: string;
  ongoing?: boolean;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "data",
    label: "DATA",
    subtitle: "Collection & Preprocessing",
    icon: FaDatabase,
    skills: ["Pandas", "NumPy", "SQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: "model",
    label: "MODEL",
    subtitle: "Training & Fine-Tuning",
    icon: FaBrain,
    skills: ["PyTorch", "TensorFlow", "HuggingFace", "LoRA/PEFT", "scikit-learn"],
  },
  {
    id: "retrieval",
    label: "RETRIEVAL",
    subtitle: "RAG & Search",
    icon: FaSearch,
    skills: ["ChromaDB", "TF-IDF", "Embeddings", "Vector Search", "Hybrid Retrieval"],
  },
  {
    id: "evaluate",
    label: "EVALUATE",
    subtitle: "Testing & Benchmarks",
    icon: FaChartLine,
    skills: ["ROUGE", "BERTScore", "Prompt Evaluation", "Dataset Validation"],
  },
  {
    id: "deploy",
    label: "DEPLOY",
    subtitle: "Ship & Scale",
    icon: FaRocket,
    skills: ["Docker", "AWS", "Git", "Vercel", "Linux", "CUDA"],
  },
];

const SKILL_FILTERS: SkillFilter[] = [
  "ALL",
  "ML / AI",
  "LANGUAGES",
  "DATA & INFRA",
  "TOOLS & PLATFORMS",
];

const SKILL_ICON_ITEMS: SkillIconItem[] = [
  { name: "PyTorch", category: "ML / AI", icon: SiPytorch, color: "#ee4c2c" },
  { name: "TensorFlow", category: "ML / AI", icon: SiTensorflow, color: "#ff6f00" },
  { name: "scikit-learn", category: "ML / AI", icon: SiScikitlearn, color: "#0ea5e9" },
  { name: "HuggingFace", category: "ML / AI", icon: SiHuggingface, color: "#fbbf24" },
  { name: "LoRA/PEFT", category: "ML / AI", icon: SiOpenai, color: "var(--skill-icon-neutral)" },
  { name: "Jupyter", category: "ML / AI", icon: SiJupyter, color: "#f97316" },
  { name: "NumPy", category: "ML / AI", icon: SiNumpy, color: "#3b82f6" },
  { name: "Pandas", category: "ML / AI", icon: SiPandas, color: "#8b5cf6" },

  { name: "Python", category: "LANGUAGES", icon: SiPython, color: "#facc15" },
  { name: "C/C++", category: "LANGUAGES", icon: SiCplusplus, color: "#3b82f6" },
  { name: "Java", category: "LANGUAGES", icon: FaJava, color: "#ef4444" },
  { name: "SQL", category: "LANGUAGES", icon: BsDatabase, color: "#22d3ee" },
  { name: "C#", category: "LANGUAGES", icon: SiSharp, color: "#a855f7" },
  { name: "MATLAB", category: "LANGUAGES", icon: SiGnubash, color: "#94a3b8" },

  { name: "PostgreSQL", category: "DATA & INFRA", icon: SiPostgresql, color: "#3b82f6" },
  { name: "MongoDB", category: "DATA & INFRA", icon: SiMongodb, color: "#22c55e" },
  { name: "Docker", category: "DATA & INFRA", icon: SiDocker, color: "#0ea5e9" },
  { name: "AWS", category: "DATA & INFRA", icon: SiAmazonwebservices, color: "#f59e0b" },
  { name: "CUDA", category: "DATA & INFRA", icon: SiNvidia, color: "#22c55e" },
  { name: "Linux", category: "DATA & INFRA", icon: SiLinux, color: "#facc15" },

  { name: "Git", category: "TOOLS & PLATFORMS", icon: SiGit, color: "#f97316" },
  { name: "GitHub", category: "TOOLS & PLATFORMS", icon: SiGithub, color: "var(--skill-icon-neutral)" },
  { name: "VS Code", category: "TOOLS & PLATFORMS", icon: SiVscodium, color: "#3b82f6" },
  { name: "Postman", category: "TOOLS & PLATFORMS", icon: SiPostman, color: "#f97316" },
  { name: "Vercel", category: "TOOLS & PLATFORMS", icon: SiVercel, color: "var(--skill-icon-neutral)" },
  { name: "ANTLR", category: "TOOLS & PLATFORMS", icon: SiAntdesign, color: "#3b82f6" },
];

const PRIMARY_STACK: ProficiencyItem[] = [
  { name: "Python", value: 95 },
  { name: "PyTorch", value: 85 },
  { name: "HuggingFace/Transformers", value: 85 },
  { name: "RAG Systems (ChromaDB/Vector)", value: 80 },
  { name: "LoRA/PEFT Fine-Tuning", value: 80 },
  { name: "SQL/PostgreSQL", value: 75 },
];

const SUPPORTING_STACK: ProficiencyItem[] = [
  { name: "Docker/AWS", value: 70 },
  { name: "C/C++", value: 80 },
  { name: "React/TypeScript", value: 65 },
  { name: "Java", value: 75 },
  { name: "CUDA/GPU Optimization", value: 85 },
  { name: "MATLAB", value: 55 },
];

const STAT_LINES: StatLine[] = [
  {
    key: "models",
    command: "print(aadi.models_finetuned)",
    value: "3+",
    context: "Qwen3, GPT fine-tunes, LoRA experiments",
  },
  {
    key: "datasets",
    command: "print(aadi.datasets_built)",
    value: "1000+ pairs",
    context: "Instruction-answer datasets for supervised tuning",
  },
  {
    key: "languages",
    command: "print(aadi.languages)",
    value: "6",
    context: "Python, C/C++, Java, SQL, C#, MATLAB",
  },
  {
    key: "certifications",
    command: "print(aadi.certifications)",
    value: "3",
    context: "IBM + DeepLearning.AI credentials",
  },
  {
    key: "hackathons",
    command: "print(aadi.hackathons_won)",
    value: "2",
    context: "Cross-team AI prototyping competitions",
  },
  {
    key: "loc",
    command: "print(aadi.loc_processed)",
    value: "100K+",
    context: "Repository-scale code understanding pipelines",
  },
];

const CERTIFICATION_ITEMS: CertificationItem[] = [
  {
    issuer: "IBM",
    title: "Fundamentals of Generative AI",
    meta: "2024",
    accent: "#3b82f6",
  },
  {
    issuer: "DeepLearning.AI",
    title: "Gen AI with LLMs",
    meta: "2025",
    accent: "#ef4444",
  },
  {
    issuer: "DeepLearning.AI",
    title: "Neural Networks & Deep Learning",
    meta: "Ongoing",
    accent: "#ef4444",
    ongoing: true,
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(media.matches);

    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function PipelineConnector({
  vertical,
  animateFlow,
  delay,
}: {
  vertical: boolean;
  animateFlow: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !animateFlow || prefersReducedMotion) return;

    let raf = 0;
    let last = performance.now();
    let offset = 0;

    const tick = (time: number) => {
      const delta = (time - last) / 1000;
      last = time;
      offset = (offset + delta * 36) % 40;
      node.style.setProperty("--flow-offset", `${offset.toFixed(2)}px`);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [animateFlow, prefersReducedMotion, vertical]);

  return (
    <motion.div
      initial={vertical ? { opacity: 0, scaleY: 0 } : { opacity: 0, scaleX: 0 }}
      animate={animateFlow ? { opacity: 1, scaleX: 1, scaleY: 1 } : {}}
      transition={{ duration: 0.45, delay }}
      className={`pipeline-connector ${vertical ? "pipeline-connector-vertical" : "pipeline-connector-horizontal"}`}
    >
      <div ref={ref} className="pipeline-flow-line" />
    </motion.div>
  );
}

function ProficiencyColumn({
  title,
  subtitle,
  items,
  inView,
  delayOffset,
}: {
  title: string;
  subtitle: string;
  items: ProficiencyItem[];
  inView: boolean;
  delayOffset: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delayOffset }}
      className="surface-card bg-bg-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-cyan shrink-0" />
        <h3 className="font-bold text-text text-base sm:text-lg">{title}</h3>
      </div>
      <p className="font-mono text-[11px] text-text-muted mb-5">{subtitle}</p>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <span className="font-mono text-[11px] text-text-muted tracking-wider">{item.name}</span>
              <span className="font-mono text-[11px] text-cyan">{item.value}%</span>
            </div>
            <div className="proficiency-track">
              <motion.div
                className="proficiency-fill"
                initial={{ width: 0 }}
                animate={inView ? { width: `${item.value}%` } : {}}
                transition={{ duration: 0.75, ease: "easeOut", delay: delayOffset + index * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [activeStageId, setActiveStageId] = useState(PIPELINE_STAGES[0].id);
  const [activeSkillFilter, setActiveSkillFilter] = useState<SkillFilter>("ALL");
  const [visibleStatLines, setVisibleStatLines] = useState(0);
  const terminalStarted = useRef(false);

  const visibleSkills = useMemo(() => {
    if (activeSkillFilter === "ALL") return SKILL_ICON_ITEMS;
    return SKILL_ICON_ITEMS.filter((skill) => skill.category === activeSkillFilter);
  }, [activeSkillFilter]);

  useEffect(() => {
    if (!isInView || terminalStarted.current) return;
    terminalStarted.current = true;

    const timers: number[] = [];
    STAT_LINES.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleStatLines(index + 1);
        }, 240 + index * 300),
      );
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isInView]);

  const activeStage = PIPELINE_STAGES.find((stage) => stage.id === activeStageId) ?? PIPELINE_STAGES[0];

  return (
    <section id="skills" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="section-watermark block font-black text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] uppercase leading-none tracking-tighter whitespace-nowrap">
          SKILLS
        </span>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted tracking-wider"
          >
            <span className="text-cyan">&#9632;</span> model.capabilities // loaded
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted/50 tracking-wider hidden sm:block lowercase"
          >
            01 // skills
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm text-text-muted mb-10"
        >
          &rarr; My <span className="text-cyan">AI/ML</span> engineering stack
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="surface-card bg-bg-card p-4 sm:p-6 mb-8"
        >
          <div className="hidden md:flex items-center justify-between gap-3">
            {PIPELINE_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = activeStageId === stage.id;

              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, x: -22 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.15 }}
                    onMouseEnter={() => setActiveStageId(stage.id)}
                    onFocus={() => setActiveStageId(stage.id)}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`pipeline-stage-card ${isActive ? "pipeline-stage-card-active" : ""}`}
                  >
                    <Icon className="text-cyan text-2xl" />
                    <span className="font-black text-sm text-text tracking-wide mt-2">{stage.label}</span>
                    <span className="font-mono text-[10px] text-text-muted mt-1 text-center">{stage.subtitle}</span>
                  </motion.button>

                  {index < PIPELINE_STAGES.length - 1 && (
                    <PipelineConnector vertical={false} animateFlow={isInView} delay={0.26 + index * 0.15} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden flex flex-col items-stretch gap-3">
            {PIPELINE_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = activeStageId === stage.id;

              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.2 + index * 0.15 }}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`pipeline-stage-card pipeline-stage-card-mobile ${isActive ? "pipeline-stage-card-active" : ""}`}
                  >
                    <Icon className="text-cyan text-2xl" />
                    <span className="font-black text-sm text-text tracking-wide mt-2">{stage.label}</span>
                    <span className="font-mono text-[10px] text-text-muted mt-1 text-center">{stage.subtitle}</span>
                  </motion.button>

                  {index < PIPELINE_STAGES.length - 1 && (
                    <PipelineConnector vertical animateFlow={isInView} delay={0.26 + index * 0.15} />
                  )}
                </div>
              );
            })}
          </div>

          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="pipeline-active-panel mt-5"
          >
            <p className="font-mono text-[11px] tracking-wider text-text-muted mb-2">
              {activeStage.label} // skillset
            </p>
            <div className="flex flex-wrap gap-2">
              {activeStage.skills.map((skill) => (
                <span key={skill} className="pipeline-skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="surface-card bg-bg-card p-4 sm:p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-5">
            {SKILL_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSkillFilter(filter)}
                className={`font-mono text-[11px] tracking-wider rounded-full px-4 py-2 transition-all duration-200 ${
                  activeSkillFilter === filter
                    ? "bg-cyan text-[#0a0a0f] border border-cyan"
                    : "border border-cyan/20 text-text-muted hover:border-cyan/50 hover:text-text"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            <AnimatePresence mode="popLayout">
              {visibleSkills.map((skill, index) => {
                const Icon = skill.icon;

                return (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    transition={{ duration: 0.24, delay: index * 0.025 }}
                    className="stack-skill-card"
                  >
                    <Icon className="stack-skill-icon" style={{ color: skill.color }} />
                    <span className="stack-skill-name">{skill.name}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8"
        >
          <ProficiencyColumn
            title="Primary Stack"
            subtitle="What I build with daily"
            items={PRIMARY_STACK}
            inView={isInView}
            delayOffset={0.3}
          />
          <ProficiencyColumn
            title="Supporting Skills"
            subtitle="What rounds me out"
            items={SUPPORTING_STACK}
            inView={isInView}
            delayOffset={0.38}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="skills-terminal-shell"
        >
          <div className="skills-terminal-head">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="font-mono text-[11px] text-text-muted">aadi_stats.py - running...</span>
          </div>

          <div className="skills-terminal-body">
            <div className="skills-terminal-lines">
              {STAT_LINES.map((line, index) => {
                if (index >= visibleStatLines) return null;

                const showCursor = index === STAT_LINES.length - 1 && visibleStatLines === STAT_LINES.length;

                return (
                  <motion.div
                    key={line.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="skills-terminal-line group"
                  >
                    <span className="skills-terminal-prompt">&gt;&gt;&gt;</span>{" "}
                    <span className="skills-terminal-command">{line.command}</span>{" "}
                    <span className="skills-terminal-arrow">&rarr;</span>{" "}
                    <span className="skills-terminal-value">&quot;{line.value}&quot;</span>
                    {showCursor && <span className="animate-blink skills-terminal-cursor">|</span>}
                    <span className="skills-terminal-tooltip">{line.context}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8"
        >
          <p className="font-mono text-sm text-text-muted mb-4">
            &rarr; <span className="text-cyan">Certifications</span> &amp; Credentials
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CERTIFICATION_ITEMS.map((cert, index) => (
              <motion.article
                key={cert.title}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="certification-card"
              >
                <span className="certification-accent" style={{ background: cert.accent }} />

                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  {cert.issuer}
                </p>
                <h4 className="text-sm sm:text-base font-semibold text-text leading-snug">{cert.title}</h4>

                <div className="mt-3 font-mono text-[11px] text-text-muted flex items-center gap-2">
                  {cert.ongoing && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan" />
                    </span>
                  )}
                  <span>{cert.meta}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
