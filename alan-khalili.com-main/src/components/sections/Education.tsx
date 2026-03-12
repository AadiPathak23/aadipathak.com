import { useState, useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  FaArrowUp,
  FaCrown,
  FaGlobeAmericas,
  FaMedal,
  FaNewspaper,
  FaShieldAlt,
} from "react-icons/fa";
import { GiCricketBat } from "react-icons/gi";
import type { IconType } from "react-icons";

function AnimatedNumber({
  value,
  decimals = 0,
  active,
}: {
  value: number;
  decimals?: number;
  active: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 1500;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setCurrent(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  return <>{decimals > 0 ? current.toFixed(decimals) : Math.round(current)}</>;
}

type StatItem =
  | { display: "number"; value: number; label: string; decimals?: number; icon?: IconType }
  | { display: "text"; text: string; label: string };

type JourneyKey = "amity" | "asu" | "nyu";

interface RunRow {
  key: string;
  value: string;
}

interface JourneyCardData {
  id: JourneyKey;
  institution: string;
  headerColor: string;
  statusKind: "complete" | "in_progress" | "queued";
  rows: RunRow[];
  detailsSummary: string;
}

interface AchievementItem {
  icon: IconType;
  iconColor: string;
  accentColor: string;
  title: string;
  desc: string;
}

const STATS: StatItem[] = [
  { display: "number", value: 3, label: "INSTITUTIONS" },
  { display: "number", value: 18, label: "YEARS OF EDUCATION" },
  { display: "text", text: "LLM Systems", label: "FOCUS" },
  { display: "number", value: 2, label: "COUNTRIES", icon: FaGlobeAmericas },
];

const JOURNEY_CARDS: JourneyCardData[] = [
  {
    id: "amity",
    institution: "AMITY INTERNATIONAL SCHOOL",
    headerColor: "#1a3a6b",
    statusKind: "complete",
    detailsSummary: "// 5 leadership roles",
    rows: [
      { key: "run_name", value: '"High School Diploma - CBSE"' },
      { key: "institution", value: '"Amity International School"' },
      { key: "location", value: '"Gurgaon, India"' },
      { key: "duration", value: '"2008 - 2021"' },
      { key: "metric.class_x", value: "92" },
      { key: "metric.class_xii", value: "93.4" },
      { key: "status", value: "complete" },
    ],
  },
  {
    id: "asu",
    institution: "ARIZONA STATE UNIVERSITY",
    headerColor: "#8c1d40",
    statusKind: "in_progress",
    detailsSummary: "// 9 courses • 130+ credits",
    rows: [
      { key: "run_name", value: '"B.S. Computer Science"' },
      { key: "institution", value: '"Arizona State University"' },
      { key: "location", value: '"Tempe, AZ"' },
      { key: "duration", value: '"Aug 2022 - May 2026"' },
      { key: "metric.gpa", value: "3.30" },
      { key: "status", value: "training..." },
    ],
  },
  {
    id: "nyu",
    institution: "NEW YORK UNIVERSITY",
    headerColor: "#7c3aed",
    statusKind: "queued",
    detailsSummary: "// 3 focus areas",
    rows: [
      { key: "run_name", value: '"M.S. Computer Science"' },
      { key: "institution", value: '"New York University"' },
      { key: "location", value: '"New York, NY"' },
      { key: "duration", value: '"Aug 2026 - May 2028"' },
      { key: "metric.track", value: '"LLM Systems"' },
      { key: "status", value: "queued" },
    ],
  },
];

const ASU_COURSE_GROUPS = [
  {
    label: "systems",
    courses: ["Operating Systems", "Distributed Systems"],
  },
  {
    label: "theory",
    courses: ["Data Structures & Algorithms", "Theory of Computation", "Probability & Statistics"],
  },
  {
    label: "applied",
    courses: ["Intro to ML", "Software QA Testing", "Cybersecurity", "iOS Development"],
  },
];

const AMITY_ACHIEVEMENTS: AchievementItem[] = [
  {
    icon: FaCrown,
    iconColor: "#facc15",
    accentColor: "#4a90d9",
    title: "School Prefect",
    desc: "Selected among top students for academic and extracurricular excellence.",
  },
  {
    icon: GiCricketBat,
    iconColor: "#22c55e",
    accentColor: "#1a3a6b",
    title: "State-Level Cricketer",
    desc: "Represented school team in state-level cricket competitions.",
  },
  {
    icon: FaNewspaper,
    iconColor: "#4a90d9",
    accentColor: "#4a90d9",
    title: "Web Magazine Editor",
    desc: "Led weekly publishing and authored articles for the school magazine.",
  },
  {
    icon: FaShieldAlt,
    iconColor: "#06b6d4",
    accentColor: "#1a3a6b",
    title: "House Captain",
    desc: "Directed events and student participation for one of four houses.",
  },
  {
    icon: FaMedal,
    iconColor: "#1a3a6b",
    accentColor: "#4a90d9",
    title: "Cadet Corps Commander",
    desc: "Winning commander for the school cadet corps program.",
  },
];

function PillTag({ children }: { children: string }) {
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 bg-cyan/10 text-cyan border border-cyan/20 tracking-wider rounded-full">
      {children}
    </span>
  );
}

function RunField({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 font-mono text-[11px] sm:text-xs leading-relaxed">
      <span className="text-text-muted/70 shrink-0">{k}:</span>
      <span className="text-text break-all">{children}</span>
    </div>
  );
}

function DetailsDisclosure({
  summary,
  open,
  onToggle,
  children,
}: {
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left font-mono text-[11px] text-text-muted hover:text-cyan transition-colors"
      >
        {summary} {open ? "[-]" : "[+]"}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [expanded, setExpanded] = useState<Record<JourneyKey, boolean>>({
    amity: false,
    asu: false,
    nyu: false,
  });

  const usaFlag = String.fromCodePoint(0x1f1fa, 0x1f1f8);
  const rocket = String.fromCodePoint(0x1f680);

  const toggleDetails = (key: JourneyKey) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderStatus = (kind: JourneyCardData["statusKind"]) => {
    if (kind === "complete") return <span className="font-mono text-[11px] text-green-300">{"\u2713 complete"}</span>;
    if (kind === "in_progress") {
      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-breathe-dot" />
          {"\u25C9 in progress"}
        </span>
      );
    }
    return <span className="font-mono text-[11px] text-slate-200">{"\u25CE queued"}</span>;
  };

  const renderDetails = (id: JourneyKey) => {
    if (id === "asu") {
      return (
        <>
          <div className="space-y-3">
            {ASU_COURSE_GROUPS.map((group) => (
              <div key={group.label}>
                <span className="font-mono text-[10px] text-text-muted/65 tracking-wider block mb-1">
                  // {group.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.courses.map((course) => (
                    <PillTag key={course}>{course}</PillTag>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-border/70 bg-bg/35">
            <p className="text-sm text-text-muted leading-relaxed">
              &rarr; Completed <span className="text-cyan font-semibold">130+ credit hours</span> across systems, theory, and applied CS
            </p>
          </div>
        </>
      );
    }

    if (id === "nyu") {
      return (
        <>
          <p className="text-sm text-text-muted leading-relaxed">
            Focused on advancing applied AI/ML research across LLM systems, retrieval-augmented generation, and scalable inference architecture.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {["LLM Systems", "RAG", "Applied AI Research"].map((t) => (
              <PillTag key={t}>{t}</PillTag>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <p className="font-mono text-sm text-text-muted mb-3">
          &rarr; <span className="text-cyan">Leadership</span> &amp; Achievements
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {AMITY_ACHIEVEMENTS.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.title}
                className="group relative rounded-lg border border-border/60 bg-bg/35 pl-3 pr-2.5 py-2.5 transition-all duration-200 hover:bg-bg/55"
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-all duration-200 group-hover:w-1.5"
                  style={{ background: achievement.accentColor }}
                />
                <div className="flex items-start gap-2.5">
                  <Icon className="text-sm mt-0.5 shrink-0" style={{ color: achievement.iconColor }} />
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] text-text font-semibold block leading-tight">{achievement.title}</span>
                    <span className="text-[11px] text-text-muted leading-snug block mt-0.5">{achievement.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="font-mono text-[11px] text-text-muted leading-relaxed">
          <span className="text-cyan">13 years</span> // <span className="text-cyan">5 leadership roles</span> // state-level athlete // published editor
        </p>
      </>
    );
  };

  const renderCard = (card: JourneyCardData, index: number) => (
    <motion.article
      key={card.id}
      initial={{ opacity: 0, x: index === 0 ? -26 : index === 1 ? -10 : 12, y: 0 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.45 + index * 0.17 }}
      className="surface-card bg-bg-card overflow-hidden"
    >
      <div className="px-4 py-2 flex items-center justify-between" style={{ background: card.headerColor }}>
        <span className="font-mono text-[11px] font-bold tracking-wider text-white">{card.institution}</span>
        {renderStatus(card.statusKind)}
      </div>

      <div className="p-4">
        <div className="rounded-lg border border-border/70 bg-bg/35 p-3 space-y-1.5">
          {card.rows.map((row) => (
            <RunField key={row.key} k={row.key}>
              {row.value}
            </RunField>
          ))}
        </div>

        {card.id === "nyu" && (
          <p className="mt-3 text-sm text-text-muted">Joining Fall 2026 to push the boundaries of AI/ML research.</p>
        )}

        {card.id === "amity" && (
          <div className="mt-4">
            <div className="flex items-end justify-between gap-2">
              <div className="text-center min-w-[96px]">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">Class X Boards</p>
                <span className="font-mono text-3xl font-black text-text leading-none">92%</span>
              </div>
              <FaArrowUp className="text-cyan text-base mb-2" />
              <div className="text-center min-w-[96px]">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">Class XII Boards</p>
                <span className="font-mono text-3xl font-black text-text leading-none">93.4%</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-2">Consistent top performer across board examinations</p>
          </div>
        )}

        <DetailsDisclosure
          summary={card.detailsSummary}
          open={expanded[card.id]}
          onToggle={() => toggleDetails(card.id)}
        >
          {renderDetails(card.id)}
        </DetailsDisclosure>
      </div>
    </motion.article>
  );

  return (
    <section id="education" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="section-watermark block font-black text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] uppercase leading-none tracking-tighter whitespace-nowrap">
          EDUCATION
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
            <span className="text-cyan">&#9632;</span> training.data // epochs complete
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted/50 tracking-wider hidden sm:block lowercase"
          >
            02 // education
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm text-text-muted mb-10"
        >
          &rarr; Academic <span className="text-cyan">foundation</span> behind the models
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-6 border-b border-cyan/20"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-2xl sm:text-3xl font-bold text-text mb-1 inline-flex items-center gap-1.5 justify-center">
                {stat.display === "text" ? (
                  <span className="text-cyan">{stat.text}</span>
                ) : (
                  <>
                    {stat.icon && <stat.icon className="text-cyan text-base sm:text-lg" />}
                    <AnimatedNumber value={stat.value} decimals={stat.decimals ?? 0} active={isInView} />
                  </>
                )}
              </div>
              <div className="font-mono text-[10px] sm:text-xs text-text-muted tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="text-center text-base sm:text-[1.1rem] text-text-muted mb-10"
        >
          From building robots in <span className="text-text font-semibold">Gurgaon</span> to fine-tuning LLMs in the{" "}
          <span className="text-text font-semibold">Valley</span> &mdash; and next stop, <span className="text-text font-semibold">New York</span>.
        </motion.p>

        <div className="hidden lg:block relative mb-12">
          <div className="relative pt-14">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.32 }}
              className="absolute top-3 left-[16%] right-[16%] h-[2px] origin-left bg-gradient-to-r from-slate-500/35 via-cyan/45 to-cyan"
            />

            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.95 }}
              className="absolute top-[-18px] left-[31%] -translate-x-1/2 font-mono text-[10px] text-text-muted"
            >
              {`2021 // moved to USA ${usaFlag}`}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 1.1 }}
              className="absolute top-[-18px] left-[69%] -translate-x-1/2 font-mono text-[10px] text-cyan"
            >
              {`2026 // next chapter ${rocket}`}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 0.88 }}
              className="absolute top-1.5 left-[31%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan/70 border border-bg"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 1.02 }}
              className="absolute top-1.5 left-[69%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan border border-bg"
            />

            <div className="grid grid-cols-3 gap-6 items-start">
              {JOURNEY_CARDS.map((card, index) => renderCard(card, index))}
            </div>
          </div>
        </div>

        <div className="lg:hidden relative mb-12">
          <div className="relative pl-7">
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
              transition={{ duration: 0.85, ease: "easeOut", delay: 0.34 }}
              className="absolute left-2 top-3 bottom-3 w-px origin-top bg-gradient-to-b from-slate-500/35 via-cyan/45 to-cyan"
            />

            {JOURNEY_CARDS.map((card, index) => (
              <div key={`mobile-${card.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.46 + index * 0.17 }}
                  className="surface-card bg-bg-card overflow-hidden mb-5 relative"
                >
                  <span
                    className={`absolute -left-[18px] top-4 w-3 h-3 rounded-full border border-bg ${
                      card.id === "asu" ? "bg-cyan animate-breathe-dot" : card.id === "nyu" ? "bg-blue-300" : "bg-cyan/70"
                    }`}
                  />
                  <div className="px-4 py-2 flex items-center justify-between" style={{ background: card.headerColor }}>
                    <span className="font-mono text-[11px] font-bold tracking-wider text-white">{card.institution}</span>
                    {renderStatus(card.statusKind)}
                  </div>
                  <div className="p-4">
                    <div className="rounded-lg border border-border/70 bg-bg/35 p-3 space-y-1.5">
                      {card.rows.map((row) => (
                        <RunField key={row.key} k={row.key}>
                          {row.value}
                        </RunField>
                      ))}
                    </div>

                    {card.id === "nyu" && (
                      <p className="mt-3 text-sm text-text-muted">Joining Fall 2026 to push the boundaries of AI/ML research.</p>
                    )}

                    {card.id === "amity" && (
                      <div className="mt-4 flex items-end justify-between gap-2">
                        <div className="text-center min-w-[96px]">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">Class X Boards</p>
                          <span className="font-mono text-3xl font-black text-text leading-none">92%</span>
                        </div>
                        <FaArrowUp className="text-cyan text-base mb-2" />
                        <div className="text-center min-w-[96px]">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted mb-1">Class XII Boards</p>
                          <span className="font-mono text-3xl font-black text-text leading-none">93.4%</span>
                        </div>
                      </div>
                    )}

                    {card.id === "amity" && (
                      <p className="text-xs text-text-muted mt-2">Consistent top performer across board examinations</p>
                    )}

                    <DetailsDisclosure
                      summary={card.detailsSummary}
                      open={expanded[card.id]}
                      onToggle={() => toggleDetails(card.id)}
                    >
                      {renderDetails(card.id)}
                    </DetailsDisclosure>
                  </div>
                </motion.article>

                {index < JOURNEY_CARDS.length - 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.86 + index * 0.17 }}
                    className={`font-mono text-[10px] mb-4 ml-1 ${index === 0 ? "text-text-muted" : "text-cyan"}`}
                  >
                    {index === 0 ? `2021 // moved to USA ${usaFlag}` : `2026 // next chapter ${rocket}`}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 1.05 }}
          className="flex justify-center mt-12"
        >
          <div className="education-code-snippet">
            <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto">
              <code>
                <span className="code-keyword">from</span> <span className="code-variable">amity.school</span> <span className="code-keyword">import</span>{" "}
                <span className="code-string">foundation</span>
                {"\n"}
                <span className="code-keyword">from</span> <span className="code-variable">asu.cs</span> <span className="code-keyword">import</span>{" "}
                <span className="code-string">engineering</span>
                {"\n"}
                <span className="code-keyword">from</span> <span className="code-variable">nyu.cs</span> <span className="code-keyword">import</span>{" "}
                <span className="code-string">masters</span>  <span className="code-comment"># loading...</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Education;
