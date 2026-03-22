import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink,
  Mail,
  Menu,
  Shield,
  Twitter,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitContact } from "./hooks/useQueries";
import AdminPage from "./pages/AdminPage";

// ─── Node Network SVG Animation ───────────────────────────────────────────────
function NodeNetwork() {
  const cx = 200;
  const cy = 200;
  const r = 120;
  const nodes = Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return {
      id: `n${i}`,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  const lines: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      lines.push([i, j]);
    }
  }

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.75 0.14 248)" stopOpacity="1" />
          <stop
            offset="100%"
            stopColor="oklch(0.44 0.17 292)"
            stopOpacity="0.6"
          />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map(([i, j], idx) => (
        <line
          key={`line-${i}-${j}`}
          x1={nodes[i].x}
          y1={nodes[i].y}
          x2={nodes[j].x}
          y2={nodes[j].y}
          stroke="oklch(0.62 0.14 248 / 0.4)"
          strokeWidth="1"
          filter="url(#lineGlow)"
          style={{
            animation: `flow-line ${2 + idx * 0.3}s ease-in-out infinite`,
            strokeDasharray: 100,
          }}
        />
      ))}

      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="url(#nodeGrad)"
        filter="url(#glow)"
        style={{ animation: "pulse-node 2.5s ease-in-out infinite" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={16}
        fill="oklch(0.62 0.14 248 / 0.1)"
        style={{ animation: "pulse-node 2.5s ease-in-out infinite 0.3s" }}
      />

      {nodes.map((node, i) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={14}
            fill="oklch(0.62 0.14 248 / 0.08)"
            style={{
              animation: `pulse-node ${2 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={6}
            fill="url(#nodeGrad)"
            filter="url(#glow)"
            style={{
              animation: `pulse-node ${2 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const networks = [
  {
    name: "Internet Computer",
    ticker: "ICP",
    color: "0.55 0.18 260",
    logo: null,
  },
  {
    name: "Aptos",
    ticker: "APT",
    color: "0.55 0.14 292",
    logo: "https://cryptologos.cc/logos/aptos-apt-logo.png?v=040",
  },
  { name: "Osmosis", ticker: "OSMO", color: "0.52 0.2 310", logo: null },
  { name: "Persistence", ticker: "XPRT", color: "0.58 0.16 248", logo: null },
  { name: "Juno", ticker: "JUNO", color: "0.5 0.15 270", logo: null },
  { name: "Axelar", ticker: "AXL", color: "0.53 0.13 230", logo: null },
  { name: "Agoric", ticker: "BLD", color: "0.57 0.17 200", logo: null },
  { name: "Stargaze", ticker: "STARS", color: "0.54 0.19 320", logo: null },
  { name: "Polkadot", ticker: "DOT", color: "0.54 0.2 330", logo: null },
];

const whyCards = [
  {
    Icon: Users,
    title: "Highly Skilled Team",
    desc: "We are a professional team of developers, systems engineers and social media strategists.",
    delay: 0,
    ocid: "why.card",
  },
  {
    Icon: Shield,
    title: "Top Security",
    desc: "Enterprise-grade security with redundant infrastructure and 24/7 monitoring.",
    delay: 0.15,
    ocid: "why.card",
  },
  {
    Icon: Zap,
    title: "High Performance",
    desc: "99.9% uptime SLA with optimized nodes for maximum staking rewards.",
    delay: 0.3,
    ocid: "why.card",
  },
];

const stats = [
  { value: "9+", label: "Networks Supported" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Infrastructure Monitoring" },
  { value: "Italy", label: "Based in" },
];

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const submitMutation = useSubmitContact();

  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const networksRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (hash === "#admin") {
    return (
      <>
        <Toaster position="top-right" />
        <AdminPage />
      </>
    );
  }

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitMutation.mutateAsync(formData);
      toast.success("Message sent! We'll be in touch soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const navLinks = [
    { label: "Home", ref: heroRef },
    { label: "About", ref: aboutRef },
    { label: "Why Us", ref: whyRef },
    { label: "Networks", ref: networksRef },
    { label: "Contact", ref: contactRef },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <button
            type="button"
            onClick={() => scrollTo(heroRef)}
            className="flex items-center"
            data-ocid="nav.link"
          >
            <img
              src="https://www.5elementsnodes.com/wp-content/uploads/2023/12/LOGO-1.png"
              alt="5 Elements Nodes"
              className="h-10 w-auto object-contain"
            />
          </button>

          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.ref)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo(contactRef)}
              className="bg-primary text-primary-foreground hover:opacity-90 glow-blue font-semibold"
              data-ocid="nav.primary_button"
            >
              Contact Us
            </Button>
          </nav>

          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.toggle"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.label}
                    onClick={() => scrollTo(link.ref)}
                    className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  onClick={() => scrollTo(contactRef)}
                  className="bg-primary text-primary-foreground w-full"
                  data-ocid="nav.primary_button"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, oklch(0.62 0.14 248 / 0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 80%, oklch(0.44 0.17 292 / 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Professional Validation Services
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient">Blockchain</span>{" "}
              <br className="hidden md:block" />
              Validation <span className="text-foreground">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Secure, reliable Proof-of-Stake staking infrastructure. We
              validate the most promising Web3 networks so you can stake with
              confidence and earn passively.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => scrollTo(contactRef)}
                className="bg-primary text-primary-foreground hover:opacity-90 glow-blue font-semibold px-8"
                data-ocid="hero.primary_button"
              >
                Start Staking
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo(aboutRef)}
                className="border-border hover:border-primary/60 font-semibold px-8"
                data-ocid="hero.secondary_button"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, oklch(0.62 0.14 248 / 0.12) 0%, transparent 70%)",
                }}
              />
              <NodeNetwork />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
        >
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent" />
        </motion.div>
      </section>

      {/* ABOUT */}
      <section ref={aboutRef} id="about" className="py-24 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 30% 50%, oklch(0.44 0.17 292 / 0.05) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
              About Us
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              5 Elements Nodes is a{" "}
              <span className="text-gradient">PoS Blockchain Validation</span>{" "}
              Service
            </h2>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                We are an engaged collective of professionals, experienced
                validators and community managers, privacy oriented and focused
                on supporting Web3 with the most promising projects, both
                on-chain and off-chain.
              </p>
              <p>
                We offer high-quality validation services that simplify staking,
                allowing users to participate easily and securely, with the
                opportunity to earn passively.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-6 text-center card-glow bg-card"
              >
                <div className="font-heading text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section ref={whyRef} id="why" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              Why Choose Us
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Built for{" "}
              <span className="text-gradient">Performance & Trust</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((card) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: card.delay }}
                className="rounded-2xl p-8 bg-card card-glow flex flex-col gap-5"
                data-ocid="why.card"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.62 0.14 248 / 0.15)",
                    boxShadow: "0 0 16px oklch(0.62 0.14 248 / 0.2)",
                  }}
                >
                  <card.Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold mb-2">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORKS */}
      <section ref={networksRef} id="networks" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
              Supported Networks
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Validating the <span className="text-gradient">Best Chains</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {networks.map((network, i) => (
              <motion.div
                key={network.ticker}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl p-5 bg-card text-center card-glow group cursor-default"
                data-ocid={`networks.item.${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold overflow-hidden"
                  style={{
                    background: `oklch(${network.color} / 0.2)`,
                    border: `1px solid oklch(${network.color} / 0.4)`,
                    boxShadow: `0 0 16px oklch(${network.color} / 0.2)`,
                    color: `oklch(${network.color})`,
                  }}
                >
                  {network.logo ? (
                    <img
                      src={network.logo}
                      alt={network.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    network.ticker.slice(0, 2)
                  )}
                </div>
                <div className="font-heading font-semibold text-sm">
                  {network.name}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {network.ticker}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section ref={contactRef} id="contact" className="py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              Get in Touch
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Ready to <span className="text-gradient">Start Staking?</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Reach out and our team will get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:col-span-2 flex flex-col gap-6"
            >
              <div className="rounded-2xl p-6 bg-card card-glow">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="text-primary" />
                  <span className="font-semibold text-sm">Email</span>
                </div>
                <a
                  href="mailto:info@5elementsnodes.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  info@5elementsnodes.com
                </a>
              </div>
              <div className="rounded-2xl p-6 bg-card card-glow">
                <div className="flex items-center gap-3 mb-2">
                  <Twitter size={18} className="text-primary" />
                  <span className="font-semibold text-sm">Twitter</span>
                </div>
                <a
                  href="https://twitter.com/5elementsnodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  @5elementsnodes <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="md:col-span-3 rounded-2xl p-8 bg-card card-glow flex flex-col gap-5"
              data-ocid="contact.modal"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  className="bg-background/60 border-border focus:border-primary"
                  data-ocid="contact.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="bg-background/60 border-border focus:border-primary"
                  data-ocid="contact.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your staking needs..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  rows={5}
                  className="bg-background/60 border-border focus:border-primary resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitMutation.isPending}
                className="bg-primary text-primary-foreground hover:opacity-90 glow-blue font-semibold w-full"
                data-ocid="contact.submit_button"
              >
                {submitMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
              {submitMutation.isError && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="contact.error_state"
                >
                  Something went wrong. Please try again.
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <img
                src="https://www.5elementsnodes.com/wp-content/uploads/2023/12/LOGO-1.png"
                alt="5 Elements Nodes"
                className="h-10 w-auto object-contain mb-3"
              />
              <p className="text-sm text-muted-foreground max-w-xs">
                Professional PoS blockchain validation services based in Italy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-widest text-muted-foreground">
                Quick Links
              </h4>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.label}
                    onClick={() => scrollTo(link.ref)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-widest text-muted-foreground">
                Social
              </h4>
              <a
                href="https://twitter.com/5elementsnodes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-ocid="footer.link"
              >
                <Twitter size={16} /> @5elementsnodes
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              © {new Date().getFullYear()} 5 Elements Nodes. All rights
              reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
