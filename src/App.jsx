import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { push, ref } from 'firebase/database';
import {
  TrendingDown, Clock, Lock, HeadphonesIcon, AlertTriangle,
  UserCheck, FileCheck, ShoppingBag, Wallet, ChevronRight,
  Star, Quote, ArrowRight, Check, Sparkles, Shield, Zap,
  IndianRupee, Users, Building2, Briefcase, Home as HomeIcon,
  Rocket, Mail, Phone, MapPin, Send,
} from 'lucide-react';
import logo from '../src/assets/logo.webp';
import heroIllustration from '../src/assets/hero_2.png';
import { db } from './lib/firebase';

/* ─── Data ─── */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
];

const problems = [
  { title: 'Low Commission', text: 'Many agents receive limited payouts despite high effort and dedication to clients.', Icon: TrendingDown, color: 'from-[#2fbfcb]/20 to-[#213875]/20', accent: 'text-[#ffe07d]' },
  { title: 'Delayed Payments', text: 'Long waiting periods for commission payouts disrupt cash flow and planning.', Icon: Clock, color: 'from-[#2fbfcb]/20 to-[#213875]/20', accent: 'text-[#ffe07d]' },
  { title: 'Limited Products', text: 'Restricted product options reduce earning potential and client satisfaction.', Icon: Lock, color: 'from-[#2fbfcb]/20 to-[#213875]/20', accent: 'text-[#ffe07d]' },
  { title: 'No Backend Support', text: 'Lack of professional assistance impacts conversions and agent confidence.', Icon: HeadphonesIcon, color: 'from-[#2fbfcb]/20 to-[#213875]/20', accent: 'text-[#ffe07d]' },
  { title: 'Slow Growth', text: 'Hard to scale income without the right ecosystem and partnerships.', Icon: AlertTriangle, color: 'from-[#2fbfcb]/20 to-[#213875]/20', accent: 'text-[#ffe07d]' },
];

const features = [
  { title: 'Attractive Payouts', text: 'Earn competitive commissions across insurance categories.', Icon: IndianRupee },
  { title: 'Fast & Transparent', text: 'Reliable and timely payout structure you can count on.', Icon: Zap },
  { title: 'Multiple Products', text: 'Access Life, Health, Motor and more under one roof.', Icon: Shield },
  { title: 'Dedicated Support', text: 'Expert backend team to help you close more deals.', Icon: HeadphonesIcon },
  { title: 'Unlimited Growth', text: 'Scale your income with strong industry partnerships.', Icon: Rocket },
];

const benefits = [
  { text: 'Higher Income Opportunity', Icon: IndianRupee },
  { text: 'Strong Partner Network', Icon: Users },
  { text: 'Quick Onboarding Process', Icon: Zap },
  { text: 'Reliable Payout Structure', Icon: Shield },
  { text: 'Dedicated Support Team', Icon: HeadphonesIcon },
  { text: 'Multiple Insurance Products', Icon: Briefcase },
  { text: 'Opportunity to Scale', Icon: Rocket },
  { text: 'Professional Growth Platform', Icon: Sparkles },
];

const whoCanJoin = [
  { role: 'Insurance Advisors', Icon: Building2, desc: 'Licensed insurance professionals looking for better payouts', gradient: 'from-primary to-brand-blue-light' },
  { role: 'Financial Consultants', Icon: Briefcase, desc: 'Wealth & tax planners seeking additional income streams', gradient: 'from-primary to-brand-blue-light' },
  { role: 'Loan Agents', Icon: Building2, desc: 'Banking & lending professionals expanding their portfolio', gradient: 'from-primary to-brand-blue-light' },
  { role: 'Real Estate Consultants', Icon: HomeIcon, desc: 'Property & housing agents diversifying revenue', gradient: 'from-primary to-brand-blue-light' },
  { role: 'Freelancers', Icon: Sparkles, desc: 'Independent sales professionals seeking flexibility', gradient: 'from-primary to-brand-blue-light' },
  { role: 'Anyone Ambitious', Icon: Rocket, desc: 'Anyone passionate about insurance sales and growth', gradient: 'from-primary to-brand-blue-light' },
];

const testimonials = [
  { text: 'AgentsConnect helped me increase my monthly income by 3x with their competitive payout structure. The support team is phenomenal.', name: 'Rajesh K.', role: 'Insurance Advisor', avatar: 'R', rating: 5 },
  { text: 'Smooth onboarding and amazing support team. They truly care about agent success. I onboarded in just 15 minutes!', name: 'Priya S.', role: 'Financial Consultant', avatar: 'P', rating: 5 },
  { text: 'Multiple product options helped me close more clients and grow my business faster than I ever imagined possible.', name: 'Amit P.', role: 'Freelance Agent', avatar: 'A', rating: 5 },
];

const steps = [
  { label: 'Register Yourself', desc: 'Quick sign-up in under 2 minutes with basic details', Icon: UserCheck },
  { label: 'Complete Onboarding', desc: 'Simple KYC & verification — fully digital process', Icon: FileCheck },
  { label: 'Start Selling', desc: 'Access multiple insurance products instantly', Icon: ShoppingBag },
  { label: 'Earn Payouts', desc: 'Receive attractive, timely commissions directly', Icon: Wallet },
];

const stats = [
  { value: '500+', label: 'Active Agents', Icon: Users },
  { value: '₹10Cr+', label: 'Payouts Processed', Icon: IndianRupee },
  { value: '50+', label: 'Insurance Partners', Icon: Building2 },
  { value: '98%', label: 'Satisfaction Rate', Icon: Star },
];

const initialFormData = {
  name: '',
  phone: '',
  city: '',
  message: '',
};

/* ─── Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94]} },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94]} },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94]} },
};

/* ─── Components ─── */
function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'show' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, subtext, light = false, badge }) {
  return (
    <motion.div variants={fadeUp} className="mb-14 text-center md:mb-20">
      {badge && (
        <motion.span
          className={`mb-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] ${light ? 'border border-primary-foreground/10 bg-primary-foreground/10 text-primary-foreground/90' : 'border border-border bg-accent text-slate-800'}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </motion.span>
      )}
      <h2 className={`font-heading text-3xl font-extrabold tracking-tight md:text-4xl lg:text-[3.5rem] lg:leading-[1.15] ${light ? 'text-primary-foreground' : 'text-foreground'}`}>
        {title}
      </h2>
      {subtext && (
        <p className={`mx-auto mt-5 max-w-2xl text-lg leading-relaxed ${light ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
          {subtext}
        </p>
      )}
    </motion.div>
  );
}

function CountUpStat({ value, label, icon }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const StatIcon = icon;
  return (
    <motion.div ref={ref} variants={fadeUp} className="group text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94]}}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/10 text-primary-foreground/80 transition-transform duration-300 group-hover:scale-110">
          <StatIcon className="h-5 w-5" />
        </div>
        <div className="font-heading text-4xl font-extrabold text-primary-foreground md:text-5xl">
          {value}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">{label}</p>
      </motion.div>
    </motion.div>
  );
}

function FloatingOrb({ className }) {
  return <div className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

/* ─── Page ─── */
const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      message: formData.message.trim(),
    };

    if (!payload.name || !payload.phone || !payload.city) {
      setSubmitState({ status: 'error', message: 'Please fill in name, phone and city.' });
      return;
    }

    const missingFirebase =
      !import.meta.env.VITE_FIREBASE_API_KEY?.trim() ||
      !import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() ||
      !import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim();
    if (missingFirebase) {
      setSubmitState({
        status: 'error',
        message:
          'Firebase is not configured. Add VITE_FIREBASE_* keys to .env, rebuild, then redeploy.',
      });
      return;
    }

    setSubmitState({ status: 'loading', message: '' });

    try {
      await push(ref(db, 'agentLeads'), {
        ...payload,
        source: 'website',
        createdAt: new Date().toISOString(),
      });

      setFormData(initialFormData);
      setSubmitState({ status: 'success', message: 'Application submitted successfully.' });
    } catch (error) {
      setSubmitState({ status: 'error', message: 'Submission failed. Please try again.' });
      console.error('Lead submission failed:', error);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-background font-body overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className={`fixed inset-x-0 top-0 z-50 bg-white py-3 transition-all duration-500 ${scrolled ? 'shadow-lg backdrop-blur' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#home" className="flex items-center gap-3 group">
            <img src={logo} alt="AgentsConnect" className="h-12 w-auto transition-transform group-hover:scale-105" width={40} height={40} />
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="relative rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-accent hover:text-foreground">
                {link.label}
              </a>
            ))}
            <a href="#contact" className="ml-4 rounded-full bg-gradient-to-br from-[#2fbfcb] via-blue-700 to-[#213875] px-7 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-elevated">
              Join Now <ArrowRight className="inline h-4 w-4 ml-1" />
            </a>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg md:hidden" aria-label="Toggle menu">
            <div className="flex flex-col gap-1.5">
              <span className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-5 rounded-full bg-foreground transition-all duration-300 ${mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
              <div className="flex flex-col gap-2 px-6 py-6">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} onClick={closeMobile} className="rounded-lg px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-accent">{link.label}</a>
                ))}
                <a href="#contact" onClick={closeMobile} className="mt-3 rounded-full bg-gradient-to-br from-[#2fbfcb] via-blue-700 to-[#213875] px-6 py-3 text-center font-bold text-primary-foreground">Join Now <ArrowRight className="inline h-3 w-3 ml-1" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section ref={heroRef} id="home" className="relative min-h-screen overflow-hidden pt-28 pb-30 md:pt-36 md:pb-28 flex items-center">
          <FloatingOrb className="h-[500px] w-[500px] bg-primary/8 -right-40 -top-20 animate-blob" />
          <FloatingOrb className="h-[400px] w-[400px] bg-brand-gold/8 -left-20 top-1/3 animate-blob-delay" />
          <FloatingOrb className="h-[300px] w-[300px] bg-brand-blue-light/6 right-1/4 bottom-0 animate-blob-delay-2" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,162,255,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(30,78,140,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(201,162,39,0.10),transparent_45%)]" />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 md:grid-cols-2 md:px-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-accent/80 px-4 py-1.5 text-sm font-semibold text-slate-800 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-brand-emerald animate-pulse" />
                Trusted Partnership. Guaranteed Payout.
              </motion.span>
              <h1 className="mt-8 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                Connect. Earn.{' '}<br className="hidden sm:block" />
                Grow with{' '}<span className="bg-gradient-to-r from-[#2fbfcb] via-blue-700 to-[#213875] bg-clip-text text-transparent">AgentsConnect</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                India's trusted platform helping insurance agents increase earnings through better payouts, reliable partnerships, and strong backend support.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#contact" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#2fbdcb] to-[#213875] px-8 py-4 font-heading text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-elevated animate-pulse-glow">
                  <span className="relative z-10">Join as an Agent</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-[#213875] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </a>
                <a href="#benefits" className="rounded-full border-2 border-border bg-[#ffe07d] px-8 py-4 font-heading text-base font-bold text-foreground shadow-card backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-elevated">
                  Explore Benefits
                </a>
              </div>
              <div className="mt-12 flex items-center gap-6 text-muted-foreground">
                <div className="flex -space-x-2">
                  {['R', 'P', 'A', 'S'].map((l, i) => (
                    <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-[#2fbfcb] to-blue-800 text-xs font-bold text-white">{l}</div>
                  ))}
                </div>
                <p className="text-sm"><span className="font-bold text-foreground">500+</span> agents already growing</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85, x: 60 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative flex justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-75" />
              <img src={heroIllustration} alt="Insurance agents networking on digital platform" className="relative w-full max-w-xl drop-shadow-2xl motion-safe:animate-[float_4s_ease-in-out_infinite]" width={1024} height={1024} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="relative -mt-2 z-10">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <AnimatedSection className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#213875] via-primary to-[#213875] p-10 shadow-elevated md:p-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px] opacity-30" />
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-gold/15 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-primary-foreground/5 blur-3xl" />
              <motion.div variants={stagger} className="relative grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                {stats.map((s) => (
                  <CountUpStat key={s.label} value={s.value} label={s.label} icon={s.Icon} />
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Problems ── */}
        <section className="py-24 md:py-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/[0.02] to-background" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="The Problem" title="Challenges Agents Face Daily" subtext="Many insurance agents struggle with systemic issues that limit their potential and income." />
              <motion.div variants={stagger} className="grid gap-5 md:grid-cols-12">
                {problems.map((p, idx) => {
                  const isLarge = idx < 2;
                  return (
                    <motion.div
                      key={p.title}
                      variants={fadeUp}
                      className={`group relative overflow-hidden rounded-3xl border border-[#213875]/10 bg-card p-8 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated hover:border-[#213875]/20 ${isLarge ? 'md:col-span-6' : 'md:col-span-4'}`}
                    >
                      <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${p.color} opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-150`} />
                      <span className="absolute right-6 top-4 font-heading text-7xl font-black text-[#213875]/[0.04] transition-all duration-500 group-hover:text-[#213875]/[0.08] group-hover:scale-110">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className={`relative mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#213875]/8 ${p.accent} transition-all duration-300 group-hover:bg-[#213875]/12 group-hover:scale-110 group-hover:rotate-[-4deg] border-2 border-[#ffe07d]`}>
                        <p.Icon className="h-6 w-6" />
                      </div>
                      <h3 className="relative font-heading text-xl font-bold text-foreground">{p.title}</h3>
                      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground max-w-xs">{p.text}</p>
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#2fbfcb]/40 to-[#213875]/10 transition-all duration-500 group-hover:w-full rounded-full" />
                    </motion.div>
                  );
                })}
              </motion.div>
              <motion.div variants={fadeUp} className="mt-14 flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-primary/15 bg-accent/60 px-6 py-3 backdrop-blur-sm">
                  <span className="text-sm font-medium text-muted-foreground">Sound familiar?</span>
                  <a href="#contact" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">We have the solution <ArrowRight className="h-3.5 w-3.5" /></a>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Features / Solution ── */}
        <section className="relative overflow-hidden py-24 md:py-36">
          <div className="absolute inset-0 bg-gradient-to-br from-[#213875] via-primary to-[#213875]" />
          <FloatingOrb className="h-[600px] w-[600px] bg-brand-gold/10 -right-40 top-20 animate-blob" />
          <FloatingOrb className="h-[400px] w-[400px] bg-brand-blue-light/10 -left-20 bottom-0 animate-blob-delay" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="Our Solution" title="Why Choose AgentsConnect?" subtext="We solve real problems with real solutions built for agent success." light />
              <motion.div variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f, idx) => (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    className={`group relative overflow-hidden rounded-3xl border border-primary-foreground/8 bg-primary-foreground/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-primary-foreground/[0.08] hover:border-primary-foreground/15 ${idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    {/* Glow effect */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gold/10 opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100" />
                    
                    <div className="relative">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-secondary-foreground shadow-lg shadow-brand-gold/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:shadow-glow-gold">
                          <f.Icon className="h-6 w-6" />
                        </div>
                        <span className="font-heading text-5xl font-black text-primary-foreground/[0.06]">{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-primary-foreground">{f.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-primary-foreground/55">{f.text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── How it Works ── */}
        <section id="how-it-works" className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-accent/20" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-primary/[0.04]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full border border-primary/[0.03]" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="Process" title="How It Works" subtext="Get started in four simple steps and begin earning." />
              <div className="relative">
                {/* Animated connector */}
                <div className="absolute top-[5rem] left-[14%] right-[14%] hidden h-[3px] lg:block overflow-hidden rounded-full">
                  <div className="h-full w-full bg-gradient-to-r from-primary/10 via-primary/25 to-primary/10" />
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffe07d]/90 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
                </div>
                <motion.div variants={stagger} className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {steps.map((step, idx) => (
                    <motion.div key={step.label} variants={scaleUp} className="group relative text-center">
                      <div className="relative rounded-3xl border border-border bg-card p-8 pt-24 shadow-card transition-all duration-500 hover:shadow-elevated hover:border-primary/20 hover:-translate-y-3">
                        {/* Floating icon with ring */}
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2">
                          <div className="relative">
                            {/* Pulse ring */}
                            <div className="absolute inset-0 rounded-[1.25rem] bg-primary/20 blur-xl scale-[2] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="absolute -inset-2 rounded-[1.5rem] border-2 border-dashed border-primary/15 transition-all duration-700 group-hover:border-primary/30 group-hover:rotate-[30deg]" />
                            <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.25rem] bg-gradient-to-r from-[#2fbfcb] to-blue-800 text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_14px_30px_rgba(31,162,255,0.45)]">
                              <step.Icon className="h-7 w-7" />
                            </div>
                          </div>
                          <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold text-xs font-extrabold text-secondary-foreground shadow-lg ring-3 ring-card">
                            {idx + 1}
                          </div>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-foreground">{step.label}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                        
                        {/* Bottom gradient */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 rounded-full bg-gradient-warm transition-all duration-500 group-hover:w-2/3" />
                      </div>
                      
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section id="benefits" className="relative overflow-hidden py-24 md:py-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,162,255,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(30,78,140,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(201,162,39,0.10),transparent_45%)] opacity-40" />
          <FloatingOrb className="h-[500px] w-[500px] bg-primary/5 -right-40 top-20" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="Advantages" title="Benefits of Joining" subtext="Everything you need to grow your insurance business successfully." />

              <div className="grid gap-10 lg:grid-cols-5 lg:gap-14 items-start">
                {/* Left — Feature Spotlight Card */}
                <motion.div variants={fadeUp} className="lg:col-span-2 relative">
                  <div className="relative rounded-[2rem] bg-gradient-to-br from-[#213875] via-primary to-[#213875] p-8 md:p-10 text-primary-foreground overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-foreground/[0.06] blur-sm" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/[0.04]" />
                    <div className="relative z-10">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm">
                        <Rocket className="h-7 w-7" />
                      </div>
                      <h3 className="font-heading text-2xl font-extrabold mb-3 leading-tight">Grow Without Limits</h3>
                      <p className="text-primary-foreground/70 leading-relaxed text-sm mb-8">
                        Join a platform built for ambitious agents. Access top-tier products, earn higher commissions, and scale your business with dedicated support.
                      </p>
                      <div className="flex flex-col gap-3">
                        {['Top-tier commissions', 'Instant onboarding', 'Expert backend team'].map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold text-foreground">
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-medium text-primary-foreground/90">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right — Benefits List */}
                <motion.div variants={staggerFast} className="lg:col-span-3 grid gap-4 sm:grid-cols-2">
                  {benefits.map((item, idx) => {
                    return (
                      <motion.div
                        key={item.text}
                        variants={fadeUp}
                        className={`group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card/80 p-6 shadow-card backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated`}
                      >
                        <span className="absolute top-0 -right-0 font-heading text-4xl font-black text-foreground/[0.03] select-none">{String(idx + 1).padStart(2, '0')}</span>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                          <item.Icon className="h-5 w-5" />
                        </div>

                        <div className="flex flex-col gap-1.5 min-w-0">
                          <p className="font-heading text-[0.95rem] font-bold text-foreground leading-snug">{item.text}</p>
                          <div className="flex items-center gap-1.5 text-brand-emerald">
                            <Check className="h-3.5 w-3.5" />
                            <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em]">Included</span>
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-gradient-warm transition-all duration-500 group-hover:w-full" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Who Can Join ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-background to-accent/30" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="Eligibility" title="Who Can Join?" subtext="Our platform is open to professionals across industries." />
              <motion.div variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {whoCanJoin.map((item) => (
                  <motion.div
                    key={item.role}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-elevated"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />
                    
                    <div className="relative flex items-start gap-5">
                      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-primary-foreground shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]`}>
                        <item.Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-lg font-bold text-foreground">{item.role}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                        
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-warm transition-all duration-500 group-hover:w-full rounded-full" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,162,255,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(30,78,140,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(201,162,39,0.10),transparent_45%)] opacity-30" />
          <FloatingOrb className="h-[400px] w-[400px] bg-brand-gold/5 -left-20 top-20" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <SectionHeading badge="Testimonials" title="What Our Agents Say" subtext="Real stories from real agents growing with AgentsConnect." />
              <motion.div variants={fadeUp} className="mx-auto max-w-4xl">
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-10 shadow-elevated md:p-16">
                  {/* Decorative elements */}
                  <div className="absolute -left-6 -top-6">
                    <Quote className="h-24 w-24 text-primary/[0.06] rotate-180" />
                  </div>
                  <div className="absolute -right-6 -bottom-6">
                    <Quote className="h-24 w-24 text-primary/[0.06]" />
                  </div>
                  <div className="absolute right-10 top-10 h-20 w-20 rounded-full bg-brand-gold/5 blur-2xl" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, y: 30, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="relative"
                    >
                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-8">
                        {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>
                      
                      <p className="text-center text-xl italic leading-relaxed text-foreground md:text-2xl lg:text-[1.65rem] lg:leading-relaxed font-medium">
                        "{testimonials[activeTestimonial].text}"
                      </p>
                      
                      <div className="mt-10 flex flex-col items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-warm font-heading text-xl font-bold text-primary-foreground shadow-lg ring-4 ring-accent">
                          {testimonials[activeTestimonial].avatar}
                        </div>
                        <div className="text-center">
                          <p className="font-heading text-lg font-bold text-foreground">{testimonials[activeTestimonial].name}</p>
                          <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dots */}
                  <div className="mt-10 flex justify-center gap-3">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        className={`rounded-full transition-all duration-500 ${activeTestimonial === idx ? 'h-3 w-10 bg-gradient-to-r from-[#2fbfcb] to-blue-800 shadow-[0_10px_25px_rgba(31,162,255,0.45)]' : 'h-3 w-3 bg-border hover:bg-muted-foreground'}`}
                        aria-label={`Show testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden py-24 md:py-36">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-brand-blue to-[#213875]" />
          {/* <FloatingOrb className="h-[600px] w-[600px] bg-brand-gold/15 left-1/4 top-0 animate-blob" /> */}
          {/* <FloatingOrb className="h-[400px] w-[400px] bg-primary-foreground/5 right-0 bottom-0 animate-blob-delay" /> */}
          {/* Grid pattern */}
          {/* <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} /> */}
          
          <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground/80 border border-primary-foreground/10">
                  <Rocket className="h-3.5 w-3.5" />
                  Get Started Today
                </span>
                <h2 className="mt-8 font-heading text-3xl font-extrabold text-primary-foreground md:text-5xl lg:text-6xl leading-tight text-shadow-xl">
                  Start Growing Your<br className="hidden sm:block" /> <span className='text-[#ffe07d]'>Insurance Business</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-white leading-relaxed">
                  Join India's fastest growing insurance agent network and transform your career.
                </p>
                <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
                  <a href="#contact" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-gold px-10 py-4 font-heading text-lg font-bold text-secondary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-glow-gold">
                    <span>Join Now</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </a>
                  <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/40">
                    <Shield className="h-4 w-4" />
                    Free to join • No hidden charges
                  </span>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="relative py-24 md:py-36 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,162,255,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(30,78,140,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(201,162,39,0.10),transparent_45%)] opacity-30" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <AnimatedSection>
              <div variants={stagger}>
                <SectionHeading badge="Contact" title="Get in Touch" subtext="Have questions? We'd love to hear from you and help you get started." />
                <div id="contact" className="mx-auto grid max-w-5xl gap-10 md:grid-cols-5 pt-10">
                  <motion.div variants={slideInLeft} className="space-y-5 md:col-span-2">
                    {[
                      { label: 'Email', value: 'parvez@agentsconnect.in', Icon: Mail },
                      { label: 'Phone', value: '+91 77387 01551', Icon: Phone },
                      { label: 'Location', value: '169, 1st Floor Evershine Mall, Chincholi Bunder, Malad West Mumbai 400064', Icon: MapPin },
                    ].map((item) => (
                      <div key={item.label} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:border-primary/15 hover:-translate-y-1">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                          <item.Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-heading text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
                          <p className="mt-1.5 font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Trust indicators */}
                    <div className="rounded-2xl border border-brand-emerald/20 bg-brand-emerald/5 p-5">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-brand-emerald" />
                        <div>
                          <p className="text-sm font-bold text-foreground">100% Secure</p>
                          <p className="text-xs text-muted-foreground">Your data is safe with us</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeUp} className="md:col-span-3">
                    <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevated md:p-10">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
                      <h3 className="relative font-heading text-xl font-bold text-foreground">Send us a message</h3>
                      <p className="relative mt-2 text-sm text-muted-foreground">Fill in your details and we'll get back to you shortly.</p>
                      
                      <div className="relative mt-8 space-y-5">
                        {[
                          { type: 'text', placeholder: 'Your Full Name', name: 'name', icon: UserCheck },
                          { type: 'tel', placeholder: 'Phone Number', name: 'phone', icon: Phone },
                          { type: 'text', placeholder: 'Your City', name: 'city', icon: MapPin },
                        ].map((field) => (
                          <div key={field.name} className="group relative">
                            <field.icon className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                            <input
                              type={field.type}
                              name={field.name}
                              placeholder={field.placeholder}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              required
                              className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-5 text-foreground transition-all placeholder:text-muted-foreground/60 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                            />
                          </div>
                        ))}
                        <textarea
                          name="message"
                          placeholder="Tell us about your experience (optional)"
                          rows={3}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-5 py-4 text-foreground transition-all placeholder:text-muted-foreground/60 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-blue-200/60"
                        />
                        {submitState.message ? (
                          <p className={`text-sm font-medium ${submitState.status === 'success' ? 'text-brand-emerald' : 'text-red-600'}`}>
                            {submitState.message}
                          </p>
                        ) : null}
                        <button
                          type="submit"
                          disabled={submitState.status === 'loading'}
                          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-brand-blue-light px-6 py-4 font-heading text-base font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          {submitState.status === 'loading' ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative overflow-hidden border-t border-primary-foreground/5 bg-[#213875] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(31,162,255,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(30,78,140,0.12),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(201,162,39,0.10),transparent_45%)] opacity-10" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-3 md:px-8">
          <div className='bg-white p-4 rounded-2xl shadow-lg border-4 border-[#a07432]'>
            <img src={logo} alt="AgentsConnect" className="h-12 w-auto rounded-xl" loading="lazy" width={40} height={40} />
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              India's trusted platform helping insurance agents increase earnings through better partnerships and dedicated support.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70">Contact Info</h4>
            <div className="mt-5 space-y-3">
              <a href="mailto:parvez@agentsconnect.in" className="flex items-center gap-3 text-sm text-primary-foreground/40 transition-colors hover:text-primary-foreground/70">
                <div className='p-2 bg-[#a07432] rounded-full'><Mail className="text-white" size={18} /></div> parvez@agentsconnect.in
              </a>
              <a href="tel:+917738701551" className="flex items-center gap-3 text-sm text-primary-foreground/40 transition-colors hover:text-primary-foreground/70">
                <div className='p-2 bg-[#a07432] rounded-full'><Phone className="text-white" size={18} /></div> +91 77387 01551
              </a>
              <p className="flex items-center gap-3 text-sm text-primary-foreground/40">
                <div className='p-2 bg-[#a07432] rounded-full'><MapPin className="text-white" size={18} /></div> 169, 1st Floor Evershine Mall, Chincholi Bunder, Malad West Mumbai 400064
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground/70">Quick Links</h4>
            <div className="mt-5 flex flex-col gap-3">
              {['Home', 'How it Works', 'Benefits', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="group flex items-center gap-2 text-sm text-primary-foreground/40 transition-colors hover:text-primary-foreground/70">
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="relative mx-auto mt-14 max-w-7xl border-t border-primary-foreground/8 px-5 pt-8 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-primary-foreground/25">© 2026 Agents Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
