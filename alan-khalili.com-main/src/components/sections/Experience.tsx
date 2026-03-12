import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useTheme } from "../../context/ThemeContext";

// ─── Count-up Hook ───────────────────────────────────────────────────────────

function useCountUp(target: number, trigger: boolean, delay = 0, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (cancelled) return;
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [trigger, target, delay, duration]);

  return value;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Metric {
  value: number;
  rangeEnd?: number;
  suffix: string;
  label: string;
}

interface Module {
  name: string;
  desc: string;
  tags: string[];
}

interface Deployment {
  id: string;
  latest?: boolean;
  title: string;
  company: string;
  location?: string;
  dateRange: string;
  duration: string;
  metrics: Metric[];
  modules: Module[];
  stack: string[];
  accent: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const AGGREGATE_STATS: Metric[] = [
  { value: 3, suffix: "", label: "Deployments" },
  { value: 100, suffix: "K+", label: "Lines Processed" },
  { value: 90, suffix: "%", label: "Max Effort Reduction" },
  { value: 1000, suffix: "+", label: "Data Pairs Built" },
  { value: 30, suffix: "%", label: "Turnaround Improved" },
];

const DEPLOYMENTS: Deployment[] = [
  {
    id: "deployment_01",
    latest: true,
    title: "AI/ML INTERN",
    company: "Persistent Systems",
    location: "Santa Clara, CA",
    dateRange: "May 2025 – Sep 2025",
    duration: "4 months",
    metrics: [
      { value: 100, suffix: "K+", label: "LOC Repositories" },
      { value: 90, suffix: "%", label: "Effort Reduction" },
      { value: 300, rangeEnd: 500, suffix: "", label: "Training Pairs Built" },
    ],
    modules: [
      {
        name: "llm_finetuning",
        desc: "Fine-tuned Qwen3 LLM using LoRA/PEFT and built a repository-aware code assistant enabling cross-file reasoning and automated bug diagnostics.",
        tags: ["LoRA", "PEFT", "Qwen3", "HuggingFace"],
      },
      {
        name: "retrieval_pipeline",
        desc: "Engineered scalable semantic retrieval pipelines with structured repository parsing, chunking, prioritization, and metadata enrichment.",
        tags: ["Semantic Search", "Chunking", "Metadata", "Vector DB"],
      },
      {
        name: "cobol_parser",
        desc: "Developed a COBOL parser using ANTLR to auto-generate technical documentation. Constructed 300–500 instruction-answer pairs evaluated with ROUGE and BERTScore.",
        tags: ["ANTLR", "ROUGE", "BERTScore", "Documentation"],
      },
    ],
    stack: [
      "Python", "LoRA/PEFT", "Qwen3", "HuggingFace", "ANTLR",
      "ROUGE", "BERTScore", "Semantic Retrieval", "CUDA",
    ],
    accent: "#06b6d4",
  },
  {
    id: "deployment_02",
    title: "AI STRATEGY INTERN",
    company: "Persistent Systems",
    location: "India",
    dateRange: "May 2024 – Aug 2024",
    duration: "4 months",
    metrics: [
      { value: 30, suffix: "%", label: "Turnaround Reduction" },
      { value: 40, suffix: "+", label: "Assessment Parameters" },
    ],
    modules: [
      {
        name: "maturity_framework",
        desc: "Designed an enterprise-level GenAI maturity framework evaluating scalability, security, risk exposure, and organizational adoption readiness.",
        tags: ["GenAI Strategy", "Enterprise AI", "Risk Assessment"],
      },
      {
        name: "assessment_tooling",
        desc: "Built structured assessment tooling and refined scoring algorithms with senior leadership, streamlining evaluation workflows.",
        tags: ["Scoring Algorithms", "Stakeholder Management", "Data Analysis"],
      },
    ],
    stack: [
      "GenAI Strategy", "Enterprise Frameworks", "Risk Assessment",
      "Scoring Algorithms", "Python",
    ],
    accent: "#3b82f6",
  },
  {
    id: "deployment_03",
    title: "TECHNOLOGY CONSULTANT",
    company: "Arizona State University",
    dateRange: "Nov 2023 – Nov 2024",
    duration: "1 year",
    metrics: [
      { value: 12, suffix: " months", label: "Continuous Operations" },
    ],
    modules: [
      {
        name: "automation_ops",
        desc: "Automated operational workflows using Python and provided system-level support across Windows/macOS environments and classroom AV infrastructure.",
        tags: ["Python", "Automation", "IT Systems", "macOS", "Windows"],
      },
    ],
    stack: ["Python", "Automation", "Windows", "macOS", "AV Systems"],
    accent: "#8b5cf6",
  },
];

const NARRATIVES = [
  "↑ promoted from strategy to engineering",
  "← career pivot from IT to AI",
];

// ─── Small Components ────────────────────────────────────────────────────────

function CountUpValue({
  target, suffix, trigger, delay = 0,
}: {
  target: number; suffix: string; trigger: boolean; delay?: number;
}) {
  const n = useCountUp(target, trigger, delay);
  return <>{n}{suffix}</>;
}

function RangeCountUp({
  lo, hi, trigger, delay = 0,
}: {
  lo: number; hi: number; trigger: boolean; delay?: number;
}) {
  const a = useCountUp(lo, trigger, delay);
  const b = useCountUp(hi, trigger, delay);
  return <>{a}–{b}</>;
}

function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1 bg-cyan/5 text-cyan border border-cyan/20 tracking-wider rounded-full whitespace-nowrap">
      <span className="w-1 h-1 rounded-full bg-cyan shrink-0" />
      {label}
    </span>
  );
}

// ─── Aggregate Impact Banner ─────────────────────────────────────────────────

function AggregateImpactBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="exp-dashboard-banner mb-10 p-4 sm:p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {AGGREGATE_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center ${i === AGGREGATE_STATS.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="font-black text-2xl sm:text-3xl text-cyan tracking-tight leading-none">
              <CountUpValue
                target={stat.value}
                suffix={stat.suffix}
                trigger={inView}
                delay={i * 120}
              />
            </div>
            <div className="font-mono text-[10px] text-text-muted tracking-widest uppercase mt-1.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────

const MODULE_CLAMP_LINES = 3;

function ModuleCard({ mod, inView, delay }: { mod: Module; inView: boolean; delay: number }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
    setClamped(el.scrollHeight > lineHeight * MODULE_CLAMP_LINES + 2);
  }, []);

  return (
    <motion.div
      className="exp-module p-4 sm:p-5 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <span className="font-mono text-xs text-cyan tracking-wider block mb-2.5">
        // {mod.name}
      </span>

      <div className="relative">
        <p
          ref={textRef}
          className={`text-sm text-text-muted leading-relaxed ${clamped && !expanded ? "line-clamp-3" : ""}`}
        >
          {mod.desc}
        </p>
        {clamped && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[11px] text-cyan hover:text-cyan/80 transition-colors mt-1 tracking-wider"
          >
            {expanded ? "show less ↑" : "read more →"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {mod.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[9px] px-2 py-0.5 bg-cyan/5 text-cyan/80 border border-cyan/15 rounded-full tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Deployment Card ─────────────────────────────────────────────────────────

function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isPremium = deployment.latest === true;

  return (
    <motion.div
      ref={ref}
      className={`exp-deployment-card ${isPremium ? "exp-premium" : ""}`}
      style={{
        borderLeftWidth: 4,
        borderLeftColor: deployment.accent,
        ...(isPremium
          ? { boxShadow: `0 0 30px ${deployment.accent}10` }
          : {}),
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      {/* Header */}
      <div className="exp-card-header p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-cyan/60 tracking-widest block mb-1">
              {deployment.id}{deployment.latest ? " // latest" : ""}
            </span>
            <h3 className="font-black text-xl sm:text-2xl text-text tracking-tight">
              {deployment.title}
            </h3>
            <p className="font-mono text-xs text-text-muted mt-0.5">
              {deployment.company}
              {deployment.location ? ` • ${deployment.location}` : ""}
            </p>
          </div>
          <div className="sm:text-right shrink-0 flex flex-col items-start sm:items-end gap-1.5">
            <span className="font-mono text-[10px] text-green tracking-widest flex items-center gap-1">
              ✓ completed
              {isPremium && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
              )}
            </span>
            <span className="font-mono text-xs text-text-muted">
              {deployment.dateRange}
            </span>
            <span className="font-mono text-[10px] border border-text-muted/25 text-text-muted px-2.5 py-0.5 rounded-full">
              {deployment.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-5 sm:px-6 py-4">
        <div
          className={`grid gap-3 ${
            deployment.metrics.length === 1
              ? "grid-cols-1 max-w-[220px]"
              : deployment.metrics.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {deployment.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="exp-metric-box p-3 sm:p-4 text-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <div className="font-black text-2xl sm:text-3xl text-cyan tracking-tight leading-none">
                {m.rangeEnd !== undefined ? (
                  <RangeCountUp
                    lo={m.value}
                    hi={m.rangeEnd}
                    trigger={inView}
                    delay={400 + i * 100}
                  />
                ) : (
                  <CountUpValue
                    target={m.value}
                    suffix={m.suffix}
                    trigger={inView}
                    delay={400 + i * 100}
                  />
                )}
              </div>
              <div className="font-mono text-[10px] text-text-muted tracking-widest uppercase mt-1.5">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="px-5 sm:px-6 pb-4">
        <div
          className={`grid gap-3 ${
            deployment.modules.length === 1
              ? "grid-cols-1"
              : deployment.modules.length === 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 lg:grid-cols-3"
          }`}
          style={{ alignItems: "stretch" }}
        >
          {deployment.modules.map((mod, i) => (
            <ModuleCard key={mod.name} mod={mod} inView={inView} delay={0.5 + i * 0.12} />
          ))}
        </div>
      </div>

      {/* Tech Stack Footer */}
      <div className="border-t border-border px-5 sm:px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-0.5 h-3.5 bg-cyan rounded-full" />
          <span className="font-mono text-[10px] text-text-muted/60 tracking-widest">
            ## tech_stack
          </span>
        </div>
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {deployment.stack.map((s) => (
            <TechPill key={s} label={s} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Narrative Connector ─────────────────────────────────────────────────────

function NarrativeConnector({ text }: { text: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center py-2"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="exp-connector-line h-6" />
      <div className="w-2.5 h-2.5 rounded-full border-2 border-cyan/40 bg-bg my-1.5" />
      <span className="font-mono text-[10px] text-text-muted/50 tracking-wider text-center px-4 my-1">
        {text}
      </span>
      <div className="exp-connector-line h-6" />
    </motion.div>
  );
}

// ─── Career Trajectory ───────────────────────────────────────────────────────

function CareerTrajectory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { theme } = useTheme();

  const points = [
    { x: 100, y: 85, label: "IT Support", color: "#8b5cf6" },
    { x: 400, y: 50, label: "AI Strategy", color: "#3b82f6" },
    { x: 700, y: 15, label: "AI/ML Engineering", color: "#06b6d4" },
  ];

  const curvePath = "M 100 85 C 200 78 300 57 400 50 C 500 43 600 22 700 15";
  const textFill = theme === "dark" ? "#94a3b8" : "#475569";
  const dotStroke = theme === "dark" ? "#0a0a0f" : "#f1f5f9";

  return (
    <motion.div
      ref={ref}
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-0.5 h-3.5 bg-cyan rounded-full" />
        <span className="font-mono text-[10px] text-text-muted/60 tracking-widest">
          ## career_trajectory
        </span>
      </div>

      {/* Desktop / Tablet */}
      <div className="hidden sm:block">
        <svg viewBox="0 0 800 130" className="w-full" style={{ height: 120 }}>
          <defs>
            <linearGradient id="traj-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <motion.path
            d={curvePath}
            fill="none"
            stroke="url(#traj-gradient)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />

          {points.map((p, i) => (
            <g key={p.label}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill={p.color}
                stroke={dotStroke}
                strokeWidth={3}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.3 }}
              />
              <motion.text
                x={p.x}
                y={p.y + 24}
                textAnchor="middle"
                fill={textFill}
                fontSize={11}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.05em"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.3 }}
              >
                {p.label}
              </motion.text>
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden justify-between items-end px-2 py-4">
        {points.map((p, i) => (
          <motion.div
            key={p.label}
            className="flex flex-col items-center gap-2"
            style={{ paddingBottom: `${i * 12}px` }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.2 }}
          >
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ backgroundColor: p.color, borderColor: dotStroke }}
            />
            <span className="font-mono text-[9px] text-text-muted text-center tracking-wider leading-tight">
              {p.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="section-watermark block font-black text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] uppercase leading-none tracking-tighter whitespace-nowrap">
          EXPERIENCE
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
            <span className="text-cyan">&#9632;</span> model.experience // inference_ready
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted/50 tracking-wider hidden sm:block lowercase"
          >
            03 // experience
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm text-text-muted mb-12"
        >
          &rarr; Where my models met <span className="text-cyan">production</span>
        </motion.div>

        <AggregateImpactBanner />

        <div>
          {DEPLOYMENTS.map((dep, i) => (
            <div key={dep.id}>
              <DeploymentCard deployment={dep} />
              {i < DEPLOYMENTS.length - 1 && (
                <NarrativeConnector text={NARRATIVES[i]} />
              )}
            </div>
          ))}
        </div>

        <CareerTrajectory />
      </div>
    </section>
  );
}

export default Experience;
