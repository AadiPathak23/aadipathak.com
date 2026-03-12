import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { RESUME_URL } from "../../constants";
import emailjs from "@emailjs/browser";

const EMAILJS_PUBLIC_KEY = "9RWSXUPNgU1PPAe6K";
const EMAILJS_SERVICE_ID = "service_nm1b6f4";
const EMAILJS_TEMPLATE_ID = "template_diuhd0s";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type ButtonState = "idle" | "sending" | "success" | "error";

function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setButtonState("sending");

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name.trim(),
        from_email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        to_email: "aadipathak2323@gmail.com",
      });

      setButtonState("success");
      setFormData(INITIAL_FORM);
    } catch {
      setButtonState("error");
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setButtonState("idle");
    }, 3000);
  };

  const buttonLabel = {
    idle: "SEND MESSAGE \u2192",
    sending: "SENDING...",
    success: "MESSAGE SENT \u2713",
    error: "FAILED TO SEND \u2717",
  }[buttonState];

  const buttonClass = {
    idle: "bg-cyan text-[#0a0a0f] hover:bg-cyan/90 shadow-[0_0_18px_rgba(6,182,212,0.2)]",
    sending: "bg-cyan/60 text-[#0a0a0f]/70 cursor-not-allowed",
    success: "bg-[#22c55e] text-[#0a0a0f] shadow-[0_0_16px_rgba(34,197,94,0.25)]",
    error: "bg-[#ef4444] text-white shadow-[0_0_16px_rgba(239,68,68,0.25)]",
  }[buttonState];

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-8 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <span className="block font-black text-[3rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] uppercase section-watermark leading-none tracking-tighter whitespace-nowrap">
          CONTACT
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
            <span className="text-cyan">&#9632;</span> connection.open // listening
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs text-text-muted/50 tracking-wider hidden sm:block lowercase"
          >
            05 // contact
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-sm text-text-muted mb-10"
        >
          &rarr; Let&apos;s <span className="text-cyan">build</span> something together
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 lg:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="md:col-span-1 xl:col-span-3"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text">GET IN TOUCH</h2>

            <p className="mt-5 text-base sm:text-lg text-text-muted leading-relaxed max-w-2xl">
              Whether you&apos;re working on an AI/ML project, looking for a collaborator, or just want to talk about
              LLMs and cricket - I&apos;d love to hear from you.
            </p>

            <a
              href="mailto:aadipathak2323@gmail.com"
              className="inline-flex items-center gap-2 mt-7 bg-cyan text-[#0a0a0f] px-5 py-3 rounded-lg font-mono text-sm font-semibold tracking-wide hover:bg-cyan/90 transition-all duration-200 shadow-[0_0_18px_rgba(6,182,212,0.2)]"
            >
              <FaEnvelope size={14} />
              aadipathak2323@gmail.com &rarr;
            </a>

            <div className="flex items-center gap-2 mt-5">
              <a
                href="https://github.com/AadiPathak23"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-border text-text-muted flex items-center justify-center hover:bg-cyan hover:text-[#0a0a0f] hover:border-cyan transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={15} />
              </a>
              <a
                href="https://linkedin.com/in/aadipathak"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-border text-text-muted flex items-center justify-center hover:bg-cyan hover:text-[#0a0a0f] hover:border-cyan transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={15} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-border text-text-muted flex items-center justify-center hover:bg-cyan hover:text-[#0a0a0f] hover:border-cyan transition-colors"
                aria-label="Twitter"
              >
                <FaXTwitter size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-3xl">
              <div className="surface-card bg-bg-card p-4">
                <span className="font-mono text-[10px] tracking-widest text-text-muted/60">CURRENTLY</span>
                <p className="mt-1 text-sm text-text">Building AI systems &amp; fine-tuning LLMs</p>
              </div>
              <div className="surface-card bg-bg-card p-4">
                <span className="font-mono text-[10px] tracking-widest text-text-muted/60">LOCATION</span>
                <p className="mt-1 text-sm text-text">Phoenix, AZ &bull; Open to relocate</p>
              </div>
            </div>

            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 font-mono text-xs tracking-wider border border-border rounded-lg px-4 py-2 text-text-muted hover:text-cyan hover:border-cyan/40 transition-colors"
            >
              <FiDownload size={14} />
              DOWNLOAD RESUME &darr;
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="md:col-span-1 xl:col-span-2"
          >
            <div className="surface-card bg-bg-card p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="font-mono text-[11px] tracking-wider text-text-muted/70 block mb-1.5">
                    NAME
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                    className="contact-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="font-mono text-[11px] tracking-wider text-text-muted/70 block mb-1.5">
                    EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="contact-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="font-mono text-[11px] tracking-wider text-text-muted/70 block mb-1.5">
                    SUBJECT
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="What are we building?"
                    className="contact-input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="font-mono text-[11px] tracking-wider text-text-muted/70 block mb-1.5">
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell me about your project..."
                    className="contact-input resize-none"
                    required
                  />
                </div>

                {error && <p className="text-xs text-rose-400">{error}</p>}

                <button
                  type="submit"
                  disabled={buttonState === "sending"}
                  className={`w-full rounded-lg px-4 py-3 font-mono text-sm font-bold tracking-wide transition-all duration-200 ${buttonClass}`}
                >
                  {buttonLabel}
                </button>
              </form>

              <p className="mt-3 text-xs text-text-muted/70">Usually responds within 24 hours</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
