"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Globe, Shield, Code2, Menu, X } from "lucide-react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── Components ─── */

function Badge({ children, color = "#146ef5" }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold leading-4 rounded text-white tracking-wide" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

function BadgeSoft({ children }) {
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold leading-4 rounded text-blue-600 bg-white border border-gray-300">
      {children}
    </span>
  );
}

function BtnPrimary({ children, href = "/login" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 px-5 py-3 text-base font-medium leading-6 bg-black text-white rounded transition-opacity hover:opacity-85"
    >
      {children}
    </Link>
  );
}

function BtnSecondary({ children, href = "/login" }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 px-5 py-3 text-base font-medium leading-6 bg-white text-black rounded border border-gray-300 transition-colors hover:border-gray-800"
    >
      {children}
    </Link>
  );
}

function TextArrow({ children, href = "#" }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-base font-medium text-black no-underline py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <span className={`inline-block transition-transform ${isHovered ? 'translate-x-1' : ''}`}>
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}

/* ─── Nav ─── */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`sticky top-0 z-100 bg-white transition-all ${scrolled ? 'border-b border-gray-300' : 'border-b border-transparent'}`}>
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="no-underline flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="36" height="36" rx="6" fill="#080808" />
            <rect x="2.5" y="2.5" width="31" height="31" rx="4" fill="none" stroke="#3b89ff" strokeWidth="1" />
            <rect x="5" y="5" width="5" height="5" rx="1" fill="#3b89ff" opacity="0.9" />
            <rect x="26" y="26" width="5" height="5" rx="1" fill="#3b89ff" opacity="0.35" />
            <text x="18" y="25" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="16" fill="white">i</text>
          </svg>
          <span className="font-bold text-lg text-black" style={{ letterSpacing: "-0.5px" }}>
            imagix<span className="font-normal text-gray-500">.io</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {["Docs", "Pricing", "Changelog", "Blog"].map(l => (
            <Link key={l} href="#" className="text-sm font-medium text-black no-underline hover:text-gray-600 transition-colors">{l}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <BtnSecondary href="/login">Log in</BtnSecondary>
          <BtnPrimary href="/login">Get started free</BtnPrimary>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-transparent border-0 cursor-pointer text-black">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-300 px-8 py-4 flex flex-col gap-4 bg-white md:hidden">
          {["Docs", "Pricing", "Changelog", "Blog"].map(l => (
            <Link key={l} href="#" className="text-base font-medium text-black no-underline">{l}</Link>
          ))}
          <div className="flex gap-3 pt-2">
            <BtnSecondary href="/login">Log in</BtnSecondary>
            <BtnPrimary href="/login">Get started</BtnPrimary>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ─── */
/* ─── Hero (Animated Reveal) ─── */
function Hero() {
  const containerRef = useRef(null);

  // Track scroll progress across the 250vh tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0 to 0.4) to scale and style changes
  const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.65]);
  const contentRadius = useTransform(scrollYProgress, [0, 0.4], ["0px", "16px"]);
  const contentShadow = useTransform(scrollYProgress, [0, 0.4], ["none", "0 25px 50px -12px rgba(0, 0, 0, 0.25)"]);
  const contentBorder = useTransform(scrollYProgress, [0, 0.4], ["1px solid transparent", "1px solid #e5e7eb"]);
  
  // Dashboard UI animations
  const uiOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const leftPanelX = useTransform(scrollYProgress, [0.1, 0.4], ["-100%", "0%"]);
  const rightPanelX = useTransform(scrollYProgress, [0.1, 0.4], ["100%", "0%"]);

  return (
    // The outer container gives us room to scroll while the inner content sticks
    <section ref={containerRef} className="h-[250vh] bg-gray-50 relative">
      
      {/* Sticky wrapper locks to the screen */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* MOCK UI: Left Sidebar (Media Library) */}
        <motion.div 
          style={{ opacity: uiOpacity, x: leftPanelX }}
          className="absolute top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-0 p-5 flex flex-col gap-4 hidden md:flex"
        >
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Media Library</div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
              <div className="w-full h-3 rounded bg-gray-100" />
            </div>
          ))}
        </motion.div>

        {/* MOCK UI: Right Sidebar (Transform Settings) */}
        <motion.div 
          style={{ opacity: uiOpacity, x: rightPanelX }}
          className="absolute top-0 bottom-0 right-0 w-72 bg-white border-l border-gray-200 z-0 p-5 flex flex-col gap-4 hidden lg:flex"
        >
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Transform Params</div>
          <div className="w-full h-24 rounded border border-gray-200 bg-gray-50" />
          <div className="w-full h-10 rounded border border-gray-200 bg-gray-50" />
          <div className="w-full h-10 rounded border border-gray-200 bg-gray-50" />
          <div className="w-full h-10 rounded border border-gray-200 bg-gray-50" />
        </motion.div>

        {/* MOCK UI: Background pattern to make the canvas pop */}
        <motion.div 
          style={{ opacity: uiOpacity }}
          className="absolute inset-0 z-0"
          style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: uiOpacity }}
        />

        {/* MAIN CONTENT: The "Canvas" that scales down */}
        <motion.div 
          style={{ 
            scale: contentScale, 
            borderRadius: contentRadius,
            boxShadow: contentShadow,
            border: contentBorder,
          }}
          className="w-full h-full bg-white z-10 flex flex-col items-center pt-20 overflow-hidden relative origin-center"
        >
          {/* --- YOUR ORIGINAL HERO CODE --- */}
          <div className="max-w-4xl mx-auto px-8 w-full">
            <div className="mb-6 flex justify-center">
              <Badge>Now in public beta</Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold leading-tight text-black text-center mb-7" style={{ letterSpacing: "-0.8px" }}>
              The image CDN built<br />
              <span className="text-blue-600">for developers</span>
            </h1>

            <p className="text-lg md:text-2xl font-normal leading-relaxed text-gray-600 text-center mx-auto mb-10 max-w-2xl" style={{ letterSpacing: "-0.288px" }}>
              Upload once. Serve globally. Transform images on the fly via a single URL parameter — resize, convert, compress, and cache at the edge.
            </p>

            <div className="flex gap-3 justify-center flex-wrap mb-16">
              <BtnPrimary href="/login">Start for free <ArrowRight size={16} /></BtnPrimary>
              <BtnSecondary href="/quickstart">Read the docs</BtnSecondary>
            </div>

            {/* Code snippet */}
            <div className="rounded-lg border border-gray-800 overflow-hidden bg-gray-900" style={{ boxShadow: "0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.01), 0 30px 18px rgba(0,0,0,0.04), 0 13px 13px rgba(0,0,0,0.08), 0 3px 7px rgba(0,0,0,0.09)" }}>
              <div className="px-4 py-3 border-b border-gray-800 flex gap-2 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 ml-2 font-mono">imagix · transform</span>
              </div>
              <pre className="px-6 py-6 m-0 overflow-x-auto text-sm leading-7 font-mono text-gray-300">
                <span className="text-gray-500">{`// Original image — 2.4 MB PNG\n`}</span>
                <span className="text-red-400">const </span>
                <span className="text-gray-300">url</span>
                <span className="text-cyan-400"> = </span>
                <span className="text-green-400">{`"https://cdn.imagix.io/photo.png"`}</span>
                <span className="text-gray-300">;</span>
                {"\n\n"}
                <span className="text-gray-500">{`// Transformed — 300 × auto, WebP, 80% quality\n`}</span>
                <span className="text-red-400">const </span>
                <span className="text-gray-300">optimized</span>
                <span className="text-cyan-400"> = </span>
                <span className="text-green-400">{`\`\${url}?w=300&format=webp&quality=80\``}</span>
                <span className="text-gray-300">;</span>
                {"\n\n"}
                <span className="text-gray-500">{`// Result: 18 KB · 94% smaller · served from edge\n`}</span>
              </pre>
            </div>
          </div>
          {/* --- END ORIGINAL HERO CODE --- */}
          
        </motion.div>
      </div>
    </section>
  );
}
/* ─── Logos band ─── */
function LogosBand() {
  const logos = ["Vercel", "Supabase", "Railway", "PlanetScale", "Render", "Fly.io"];
  return (
    <section className="bg-white px-8 py-8 border-t border-b border-gray-300">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-5">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-500">
          Trusted by teams shipping on
        </p>
        <div className="flex gap-12 flex-wrap justify-center items-center">
          {logos.map(l => (
            <span key={l} className="text-sm font-semibold text-gray-500" style={{ letterSpacing: "-0.3px" }}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Category cards ─── */
function CategoryCards() {
  const cards = [
    { label: "Upload", title: "Drop files. Get a URL.", desc: "Multipart upload via REST API. Any format, any size. Files land in S3 in milliseconds.", color: "#7a3dff" },
    { label: "Transform", title: "One URL. Infinite variants.", desc: "Resize, convert, compress, and crop via query params. No pre-processing needed.", color: "#3b89ff" },
    { label: "Deliver", title: "Edge-cached globally.", desc: "CloudFront CDN puts your images in 400+ edge locations. First request transforms. Every request after: instant.", color: "#ff6b00" },
    { label: "Manage", title: "A dashboard that respects your time.", desc: "Media library, folder organisation, API key management, and a transformation URL builder — all in one place.", color: "#ed52cb" },
  ];

  return (
    <section className="bg-white px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">What you get</p>
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-black mb-12 max-w-2xl" style={{ letterSpacing: "-0.5px" }}>
          Everything a modern image pipeline needs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-lg p-8 text-white flex flex-col gap-3 min-h-56" style={{ backgroundColor: c.color }}>
              <span className="text-xs font-medium tracking-widest uppercase opacity-70">{c.label}</span>
              <h3 className="text-2xl font-medium leading-snug" style={{ letterSpacing: "-0.3px" }}>{c.title}</h3>
              <p className="text-sm font-normal leading-relaxed opacity-85">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature band (dark) ─── */
function FeatureDark() {
  const features = [
    { icon: <Zap size={20} />, title: "Sub-30ms cache hits", body: "CloudFront serves cached transforms faster than your server can wake up." },
    { icon: <Code2 size={20} />, title: "Pure REST API", body: "No SDK required. Any language, any framework. An API key and a URL is all you need." },
    { icon: <Globe size={20} />, title: "Global edge network", body: "400+ CloudFront POPs. Your images are already close to your users." },
    { icon: <Shield size={20} />, title: "Secure by default", body: "API key auth for uploads. httpOnly JWT cookies for the dashboard. Keys are hashed, never stored raw." },
  ];

  return (
    <section className="bg-black px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">Why imagix</p>
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-white mb-14 max-w-2xl" style={{ letterSpacing: "-0.5px" }}>
          Built on infrastructure you already trust
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-900 rounded-lg overflow-hidden">
          {features.map((f) => (
            <div key={f.title} className="bg-black px-8 py-8 flex flex-col gap-4">
              <div className="text-blue-500">{f.icon}</div>
              <h3 className="text-xl font-medium leading-relaxed text-white" style={{ letterSpacing: "-0.2px" }}>{f.title}</h3>
              <p className="text-sm font-normal leading-relaxed text-gray-400">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Transform demo ─── */
function TransformDemo() {
  const params = [
    { param: "w", desc: "Width in px", ex: "w=300" },
    { param: "h", desc: "Height in px", ex: "h=200" },
    { param: "format", desc: "Output format", ex: "format=webp" },
    { param: "quality", desc: "Compression (1–100)", ex: "quality=80" },
    { param: "fit", desc: "Resize strategy", ex: "fit=cover" },
  ];

  return (
    <section className="bg-white px-8 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Transform API</p>
          <h2 className="text-2xl md:text-4xl font-semibold leading-tight text-black mb-5" style={{ letterSpacing: "-0.5px" }}>
            Query params are the API
          </h2>
          <p className="text-base leading-relaxed text-gray-600 mb-8">
            Append parameters to any image URL. Imagix transforms in real time, then caches the result at the edge forever.
          </p>
          <TextArrow href="/quickstart">Read the full docs</TextArrow>
        </div>

        <div className="rounded-lg border border-gray-300 overflow-hidden" style={{ boxShadow: "0 84px 24px rgba(0,0,0,0), 0 54px 22px rgba(0,0,0,0.01), 0 30px 18px rgba(0,0,0,0.04), 0 13px 13px rgba(0,0,0,0.08), 0 3px 7px rgba(0,0,0,0.09)" }}>
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <span className="text-xs font-medium text-gray-500 font-mono">Transform parameters</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["Param", "Description", "Example"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium tracking-wider uppercase text-gray-500 border-b border-gray-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {params.map((p, i) => (
                <tr key={p.param} className={i < params.length - 1 ? "border-b border-gray-300" : ""}>
                  <td className="px-4 py-3">
                    <code className="text-sm font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">{p.param}</code>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.desc}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */
function Pricing() {
  const tiers = [
    {
      name: "Hobby",
      price: "Free",
      sub: "forever",
      featured: false,
      features: ["5 GB storage", "10 GB bandwidth/mo", "Unlimited transforms", "1 API key", "Community support"],
      cta: "Start for free",
    },
    {
      name: "Pro",
      price: "$19",
      sub: "per month",
      featured: true,
      features: ["100 GB storage", "500 GB bandwidth/mo", "Unlimited transforms", "10 API keys", "Priority support", "Usage analytics"],
      cta: "Get started",
    },
    {
      name: "Team",
      price: "$79",
      sub: "per month",
      featured: false,
      features: ["1 TB storage", "2 TB bandwidth/mo", "Unlimited transforms", "Unlimited API keys", "Dedicated support", "SLA guarantee"],
      cta: "Contact us",
    },
  ];

  return (
    <section className="bg-gray-100 px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-black" style={{ letterSpacing: "-0.5px" }}>
            Simple, transparent pricing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-lg px-8 py-8 flex flex-col gap-6 ${t.featured ? 'bg-black text-white shadow-lg' : 'bg-white text-black border border-gray-300'}`}>
              <div>
                <p className={`text-xs font-medium tracking-widest uppercase mb-2 ${t.featured ? 'text-gray-400' : 'text-gray-500'}`}>{t.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-semibold" style={{ letterSpacing: "-0.5px" }}>{t.price}</span>
                  <span className={`text-sm ${t.featured ? 'text-gray-400' : 'text-gray-500'}`}>{t.sub}</span>
                </div>
              </div>

              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {t.features.map(f => (
                  <li key={f} className={`flex items-center gap-2.5 text-sm leading-relaxed ${t.featured ? 'text-gray-200' : 'text-gray-700'}`}>
                    <Check size={14} className={t.featured ? 'text-green-500' : 'text-blue-600'} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/login" className={`text-base font-medium text-center rounded py-3 px-5 no-underline transition-opacity hover:opacity-85 ${t.featured ? 'bg-white text-black' : 'bg-black text-white'}`} style={{ letterSpacing: "-0.16px" }}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA band ─── */
function CTABand() {
  return (
    <section className="bg-white px-8 py-24 text-center border-t border-gray-300">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-black mb-5" style={{ letterSpacing: "-0.8px" }}>
          Ship faster.<br />Pay less for bandwidth.
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-10">
          Get started in 5 minutes. No credit card required.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <BtnPrimary href="/login">Create free account <ArrowRight size={16} /></BtnPrimary>
          <BtnSecondary href="/quickstart">Read the docs</BtnSecondary>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const cols = [
    { heading: "Product", links: ["Quickstart", "Docs", "Changelog", "Status"] },
    { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
    { heading: "Legal", links: ["Privacy", "Terms", "Security", "GDPR"] },
  ];

  return (
    <footer className="bg-white border-t border-gray-300 px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="22" height="22" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="6" fill="#080808" />
                <rect x="2.5" y="2.5" width="31" height="31" rx="4" fill="none" stroke="#3b89ff" strokeWidth="1" />
                <rect x="5" y="5" width="5" height="5" rx="1" fill="#3b89ff" opacity="0.9" />
                <text x="18" y="25" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="16" fill="white">i</text>
              </svg>
              <span className="font-bold text-base text-black" style={{ letterSpacing: "-0.3px" }}>imagix.io</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs m-0">
              The image CDN built for developers. Upload, transform, and deliver at the edge.
            </p>
          </div>

          {cols.map(col => (
            <div key={col.heading}>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-500 mb-4">{col.heading}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <Link key={l} href="#" className="text-sm text-gray-600 no-underline hover:text-black transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-6 flex justify-between items-center flex-wrap gap-3">
          <p className="text-sm text-gray-500 m-0">© 2026 Imagix. All rights reserved.</p>
          <p className="text-sm text-gray-500 m-0">Built with S3, CloudFront, and Sharp.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function LandingPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <LogosBand />
      <CategoryCards />
      <FeatureDark />
      <TransformDemo />
      <Pricing />
      <CTABand />
      <Footer />
    </main>
  );
}