import { useMemo, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "ml/ai" | "full-stack";
type Filter = "all" | "ml/ai" | "full-stack" | "featured";

interface Metric {
  value: string;
  label: string;
}

interface Project {
  id: string;
  category: Category;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  sourceUrl: string;
  liveUrl?: string;
  featured?: boolean;
  metrics: Metric[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "all" },
  { key: "ml/ai", label: "ml/ai" },
  { key: "full-stack", label: "full-stack" },
  { key: "featured", label: "featured" },
];

const PROJECTS: Project[] = [
  {
    id: "atlas-rag",
    category: "ml/ai",
    date: "January 2026",
    title: "Atlas-RAG",
    subtitle: "Multimodal Retrieval-Augmented Generation System",
    description:
      "Production-grade RAG system that actually works on real codebases — not toy demos. Combines semantic embeddings with TF-IDF for hybrid retrieval, runs entirely local via Ollama, and provides page and line-level citation grounding.",
    tech: ["Python", "ChromaDB", "Ollama", "TF-IDF", "Sentence Transformers", "Hybrid Retrieval"],
    sourceUrl: "https://github.com/AadiPathak23/Atlas-RAG",
    featured: true,
    metrics: [
      { value: "Hybrid", label: "Retrieval Architecture" },
      { value: "Zero-Cost", label: "Local LLM (No API)" },
      { value: "Line-Level", label: "Citation Grounding" },
    ],
  },
  {
    id: "finetune-agent",
    category: "ml/ai",
    date: "February 2026",
    title: "finetune-agent",
    description:
      "End-to-end automated pipeline for LLM fine-tuning — generates instruction datasets, orchestrates LoRA training, validates data quality, and benchmarks with ROUGE and BERTScore.",
    tech: ["Python", "HuggingFace", "LoRA/PEFT", "ROUGE", "BERTScore"],
    sourceUrl: "https://github.com/AadiPathak23",
    metrics: [
      { value: "LoRA", label: "Training Method" },
      { value: "E2E", label: "Automated Pipeline" },
    ],
  },
  {
    id: "asclepius-hi",
    category: "full-stack",
    date: "November 2025",
    title: "Asclepius-HI",
    description:
      "Full-stack healthcare assistant with secure authentication, structured triage workflows, and responsive dashboards for both doctors and patients.",
    tech: ["React 18", "TypeScript", "Prisma", "JWT", "REST APIs"],
    sourceUrl: "#",
    liveUrl: "#",
    metrics: [
      { value: "JWT", label: "Secure Auth" },
      { value: "2 Dashboards", label: "Doctor + Patient" },
    ],
  },
  {
    id: "cricket-win-predictor",
    category: "ml/ai",
    date: "August 2024",
    title: "Cricket Win Predictor",
    description:
      "Random Forest model trained on 10,000+ ODI matches predicting match outcomes using venue, toss, and live-match features with an interactive Streamlit interface.",
    tech: ["Python", "scikit-learn", "Random Forest", "Streamlit", "Pandas"],
    sourceUrl: "https://github.com/AadiPathak23/Cricket-Win-Predictor",
    metrics: [
      { value: "85%", label: "Prediction Accuracy" },
      { value: "10K+", label: "Matches Analyzed" },
    ],
  },
  {
    id: "poem-generator",
    category: "ml/ai",
    date: "2024",
    title: "Poem Generator",
    description:
      "LSTM neural network trained on 500K+ Shakespeare characters generating original poetry with creativity controls and NLP preprocessing.",
    tech: ["Python", "TensorFlow", "LSTM", "Keras", "NLP"],
    sourceUrl: "https://github.com/AadiPathak23/Poem-generator",
    metrics: [
      { value: "500K+", label: "Characters Trained" },
      { value: "LSTM", label: "Architecture" },
    ],
  },
  {
    id: "swipejobs",
    category: "full-stack",
    date: "2025",
    title: "SwipeJobs",
    description:
      "AI-powered job search assistant with resume parsing, intelligent matching algorithms, and a swipe-based UX for discovering opportunities.",
    tech: ["Python", "AI/ML", "Resume Parsing", "Job Matching"],
    sourceUrl: "https://github.com/AadiPathak23/SwipeJobs-",
    metrics: [
      { value: "AI-Powered", label: "Job Matching" },
      { value: "Auto-Apply", label: "Smart Applications" },
    ],
  },
];

// ─── Syntax Helpers ──────────────────────────────────────────────────────────

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="code-keyword">{children}</span>;
}
function Fn({ children }: { children: React.ReactNode }) {
  return <span className="code-func">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="code-string">{children}</span>;
}
function Cm({ children }: { children: React.ReactNode }) {
  return <span className="code-comment">{children}</span>;
}
function Nm({ children }: { children: React.ReactNode }) {
  return <span className="code-number">{children}</span>;
}

// ─── Lab Summary ─────────────────────────────────────────────────────────────

function LabSummary() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setShowCursor(true), 2600);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="proj-summary-block p-3 sm:p-4 mb-8 overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="font-mono text-[11px] sm:text-xs md:text-sm"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 2, ease: "linear", delay: 0.4 }}
      >
        <span className="text-text">projects</span>
        <span className="text-text-muted">.</span>
        <span className="code-func">summary</span>
        <span className="text-text-muted">()</span>
        <span className="text-cyan">{" → "}</span>
        <span className="text-text-muted">{"{ "}</span>
        <span className="text-text-muted/60">total_experiments: </span>
        <span className="code-string">6</span>
        <span className="text-text-muted">, </span>
        <span className="text-text-muted/60">ml_models: </span>
        <span className="code-string">4</span>
        <span className="text-text-muted">, </span>
        <span className="text-text-muted/60">full_stack: </span>
        <span className="code-string">2</span>
        <span className="text-text-muted">, </span>
        <span className="text-text-muted/60">total_stars: </span>
        <span className="text-cyan">★</span>
        <span className="text-text-muted">, </span>
        <span className="text-text-muted/60">top_accuracy: </span>
        <span className="code-string">"85%"</span>
        <span className="text-text-muted">, </span>
        <span className="text-text-muted/60">favorite_stack: </span>
        <span className="code-string">"Python + PyTorch"</span>
        <span className="text-text-muted">{" }"}</span>
        {showCursor && <span className="animate-blink text-cyan ml-0.5">▌</span>}
      </motion.div>
    </motion.div>
  );
}

// ─── Code Preview ────────────────────────────────────────────────────────────

function CodePreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const lines: (React.ReactNode | null)[] = [
    <><Kw>class</Kw> <Fn>HybridRetriever</Fn>:</>,
    <><Str>{'    """Combines semantic + lexical search'}</Str></>,
    <><Str>{'    for real codebase retrieval."""'}</Str></>,
    null,
    <><Kw>{"    def"}</Kw> <Fn>search</Fn>(<span className="code-variable">self</span>, <span className="code-variable">query</span>: <span className="code-variable">str</span>, <span className="code-variable">k</span>: <span className="code-variable">int</span> = <Nm>10</Nm>):</>,
    <><Cm>{"        # Semantic: dense embeddings"}</Cm></>,
    <>{"        "}<span className="code-variable">semantic</span> = <span className="code-variable">self</span>.<Fn>chroma</Fn>.<Fn>query</Fn>(</>,
    <>{"            "}<span className="code-variable">self</span>.<Fn>embed</Fn>(<span className="code-variable">query</span>), <span className="code-variable">n_results</span>=<span className="code-variable">k</span></>,
    <>{"        )"}</>,
    null,
    <><Cm>{"        # Lexical: exact identifier matching"}</Cm></>,
    <>{"        "}<span className="code-variable">lexical</span> = <span className="code-variable">self</span>.<Fn>tfidf</Fn>.<Fn>search</Fn>(<span className="code-variable">query</span>, <span className="code-variable">k</span>=<span className="code-variable">k</span>)</>,
    null,
    <><Cm>{"        # Fuse with reciprocal rank"}</Cm></>,
    <>{"        "}<Kw>return</Kw> <span className="code-variable">self</span>.<Fn>rrf_merge</Fn>(</>,
    <>{"            "}<span className="code-variable">semantic</span>, <span className="code-variable">lexical</span>,</>,
    <>{"            "}<span className="code-variable">weights</span>=[<Nm>0.6</Nm>, <Nm>0.4</Nm>]</>,
    <>{"        )"}</>,
  ];

  return (
    <motion.div
      ref={ref}
      className="proj-code-preview h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.35 }}
    >
      <div className="code-header h-9 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <span className="font-mono text-[10px] text-text-muted">hybrid_retrieval.py</span>
      </div>
      <div className="p-3 overflow-x-auto">
        <div className="font-mono text-[11px] sm:text-xs leading-[1.75] min-w-[340px]">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="proj-line-number w-7 text-right mr-3 shrink-0 select-none">
                {i + 1}
              </span>
              <span className="code-variable">{line ?? "\u00A0"}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Featured Card ───────────────────────────────────────────────────────────

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="proj-featured-card mb-8"
    >
      <div className="proj-featured-bar" />

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] border border-cyan/30 rounded-full px-2.5 py-1 text-cyan tracking-wider">
                ★ FEATURED EXPERIMENT
              </span>
              <span className="font-mono text-[10px] text-text-muted tracking-wider">
                {project.category} • {project.date}
              </span>
            </div>

            <h3 className="font-black text-2xl md:text-3xl text-text tracking-tight">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="font-mono text-sm text-text-muted mt-1">{project.subtitle}</p>
            )}

            <p className="mt-4 text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
              {project.description}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
              {project.metrics.map((m) => (
                <div key={m.label} className="proj-metric-box">
                  <div className="font-bold text-sm text-cyan leading-tight">{m.value}</div>
                  <div className="font-mono text-[9px] text-text-muted tracking-wider mt-1 uppercase">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-cyan/5 text-cyan border border-cyan/20 tracking-wider"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[11px] border border-border rounded-lg px-3.5 py-2 text-text-muted hover:text-cyan hover:border-cyan/50 transition-colors"
              >
                <FaGithub size={14} />
                View Source ↗
              </a>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            <CodePreview />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Experiment Card ─────────────────────────────────────────────────────────

function ExperimentCard({ project, index }: { project: Project; index: number }) {
  const accentColor = project.category === "ml/ai" ? "bg-cyan" : "bg-violet-500";
  const pillClass =
    project.category === "ml/ai"
      ? "bg-cyan/10 text-cyan border-cyan/25"
      : "bg-violet-500/10 text-violet-300 border-violet-400/25";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="proj-experiment-card flex flex-col"
    >
      <div className={`proj-accent-bar ${accentColor}`} />

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`font-mono text-[10px] tracking-wider border rounded-full px-2 py-0.5 ${pillClass}`}
          >
            {project.category}
          </span>
          <span className="font-mono text-[10px] text-text-muted">{project.date}</span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-text leading-snug">{project.title}</h3>

        <div className="grid grid-cols-2 gap-2 mt-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="proj-metric-box">
              <div className="font-bold text-sm text-cyan leading-tight">{m.value}</div>
              <div className="font-mono text-[9px] text-text-muted tracking-wider mt-0.5 uppercase leading-tight">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex justify-end gap-2">
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-icon-btn"
            aria-label={`${project.title} source code`}
          >
            <FaGithub size={14} />
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-icon-btn"
              aria-label={`${project.title} live demo`}
            >
              <FiExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Coming Soon Card ────────────────────────────────────────────────────────

function ComingSoonCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="proj-coming-soon p-6 text-center mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <span className="font-mono text-xs text-cyan tracking-wider block mb-2">
        // next_experiment
      </span>
      <p className="text-sm text-text-muted mb-1">
        Currently cooking up something new
        <span className="inline-flex gap-0.5 ml-1">
          <span className="proj-dot-1 text-cyan font-bold">.</span>
          <span className="proj-dot-2 text-cyan font-bold">.</span>
          <span className="proj-dot-3 text-cyan font-bold">.</span>
        </span>
      </p>
      <p className="text-sm text-text/80 mb-4">
        Fine-tuning multimodal models &amp; building autonomous AI agents
      </p>
      <a
        href="https://github.com/AadiPathak23"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan hover:text-cyan/80 transition-colors tracking-wider"
      >
        <FaGithub size={14} />
        Watch this space →
      </a>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return PROJECTS;
    if (activeFilter === "featured") return PROJECTS.filter((p) => p.featured);
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const featuredProject = filteredProjects.find((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="section-watermark block font-black text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] uppercase leading-none tracking-tighter whitespace-nowrap">
          PROJECTS
        </span>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted tracking-wider"
          >
            <span className="text-cyan">&#9632;</span> experiments.log // 6 runs
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted/50 tracking-wider hidden sm:block lowercase"
          >
            04 // projects
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm text-text-muted mb-10"
        >
          &rarr; Experiments that <span className="text-cyan">shipped</span>
        </motion.div>

        {/* Lab Summary */}
        <LabSummary />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          <span className="font-mono text-xs text-text-muted/50 tracking-wider">filter_by:</span>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`font-mono text-xs tracking-wider px-3 py-1.5 rounded-full border transition-all duration-200 ${
                activeFilter === f.key
                  ? "border-cyan/50 bg-cyan/10 text-cyan"
                  : "border-border text-text-muted hover:border-cyan/30 hover:text-text"
              }`}
            >
              {f.label}
              {activeFilter === f.key ? " ✓" : ""}
            </button>
          ))}
        </motion.div>

        {/* Featured Project */}
        <AnimatePresence mode="wait">
          {featuredProject && (
            <FeaturedCard key={`featured-${activeFilter}`} project={featuredProject} />
          )}
        </AnimatePresence>

        {/* Regular Project Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {regularProjects.map((project, i) => (
              <ExperimentCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Coming Soon */}
        <ComingSoonCard />
      </div>
    </section>
  );
}

export default Projects;
