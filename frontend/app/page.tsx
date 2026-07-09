"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Code,
  Layers,
  ShieldCheck,
  Users,
  Zap,
  CheckCircle2,
  Server,
  Braces,
  Terminal,
  RefreshCw,
  Database,
  Check,
  HelpCircle,
  CreditCard,
  Calendar,
  AlertCircle,
  ArrowUpCircle,
  Clock,
  Gift,
  Tag,
  Shuffle,
  FileText,
  Cpu,
  Lock,
  Globe,
  Box,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useAuth } from "@/lib/api/auth/authContext";
import { SmartAvatar } from "@/components/ui/SmartAvatar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Link GSAP ScrollTrigger to Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  // GSAP Animations
  useGSAP(
    () => {
      // Scroll animations temporarily disabled per user request
    },
    { scope: container },
  );

  return (
    <main
      ref={container}
      className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary-soft selection:text-primary font-sans"
    >
      {/* 1. Announcement Banner */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-border py-2 px-4 flex items-center justify-between md:justify-center min-h-[3.5rem] gap-2 md:gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 justify-start">
          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-300 px-2 py-0.5 rounded-sm tracking-wider uppercase flex-shrink-0">
            Announcement
          </span>
          <span className="text-slate-700 font-medium text-xs sm:text-sm leading-tight">
            <span className="hidden sm:inline">
              Meet PayPlan — automate split bills, family allowances, and group
              contributions without awkward reminder texts.
            </span>
            <span className="sm:hidden">
              Meet PayPlan — automate split bills.
            </span>
          </span>
        </div>
        <div className="flex-shrink-0 flex justify-end">
          <Link
            href="#payplan"
            className="bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold border border-[#b0d938] transition-colors whitespace-nowrap"
          >
            Learn more →
          </Link>
        </div>
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-5xl">
        <div className="bg-white/80 backdrop-blur-lg border border-border rounded-full flex items-center justify-between px-6 py-3 transition-all">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-[#c5f045] flex items-center justify-center">
              <span className="text-slate-900 text-sm font-black logo-font">
                S
              </span>
            </div>
            <span className="font-bold text-base tracking-tight logo-font text-slate-900">
              Sub
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="/docs"
              className="hover:text-slate-900 transition-colors"
            >
              API Reference
            </Link>
            <Link
              href="#payplan"
              className="hover:text-slate-900 transition-colors"
            >
              PayPlan App
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-2 py-1.5 rounded-full text-sm font-bold border border-[#b0d938] transition-all"
              >
                <SmartAvatar useSignedInUser size={24} />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-5 py-2 rounded-full text-sm font-bold border border-[#b0d938] transition-all"
              >
                Launch Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-40 pb-20 px-6 bg-[#f8f7f5] min-h-[90vh] flex flex-col justify-center border-b border-border">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center gsap-reveal">
          <div className="text-left">
            <h1 className="text-5xl  font-bold tracking-tight text-slate-900 leading-[1.05] mb-6">
              You don't have to build your subscription{" "}
              <br className="hidden lg:block" />
              <span className="italic font-normal text-slate-700">
                infrastructure from scratch
              </span>
            </h1>

            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium max-w-lg">
              One-stop API for receiving subscription payments without the
              engineering overhead. Accept recurring payments. Manage
              subscriptions. Handle billing edge cases. Stay in sync with your
              app. All from one API built on Nomba.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full mb-12">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-5 py-3 rounded-full font-bold border border-[#b0d938] transition-colors text-center text-sm"
                >
                  <SmartAvatar useSignedInUser size={26} />
                  Open Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-8 py-3.5 rounded-full font-bold border border-[#b0d938] transition-colors text-center text-sm"
                >
                  Start Building Free
                </Link>
              )}
              <Link
                href="/docs"
                className="w-full sm:w-auto bg-transparent hover:bg-white text-slate-900 px-8 py-3.5 rounded-full font-bold border border-slate-300 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                View API Docs <ArrowRight size={16} />
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={14} /> Trusted Infrastructure for Modern
                Products
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-700 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#c5f045]" /> Built for SaaS.
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#c5f045]" /> Built for
                  memberships.
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#c5f045]" /> Built for
                  subscriptions.
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-[#c5f045]" /> Built for
                  developers.
                </span>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden border border-slate-200 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
              layout="fill"
              objectFit="cover"
              alt="Code interface abstract"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 text-white rounded-lg font-mono text-sm w-full overflow-hidden flex flex-col">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-white/10 flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[#c5f045]">{"// Initialize Sub"}</p>
                  <p>const sub = new Sub(process.env.SUB_KEY);</p>
                  <p className="mt-2 text-slate-400">
                    {"// Create subscription automatically"}
                  </p>
                  <p>
                    await sub.subscriptions.create({"{"} plan: 'pro' {"}"});
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architecture Preview */}
      <section className="py-24 px-6 bg-white border-b border-border text-center">
        <div className="max-w-5xl mx-auto gsap-reveal">
          <h2 className="text-3xl font-bold mb-12 text-slate-900">
            Your Product → Sub → Nomba
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-12">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg w-full md:w-64 flex flex-col items-center">
              <CreditCard size={24} className="text-slate-400 mb-3" />
              <p className="font-bold text-slate-700 text-sm">
                Customer pays once.
              </p>
            </div>
            <ArrowRight className="hidden md:block text-slate-300" size={20} />
            <ArrowRight
              className="md:hidden text-slate-300 rotate-90"
              size={20}
            />

            <div className="bg-[#c5f045]/20 border border-[#c5f045] p-6 rounded-lg w-full md:w-64 flex flex-col items-center">
              <Cpu size={24} className="text-[#8cae29] mb-3" />
              <p className="font-bold text-slate-900 text-sm">
                Sub manages billing.
              </p>
            </div>
            <ArrowRight className="hidden md:block text-slate-300" size={20} />
            <ArrowRight
              className="md:hidden text-slate-300 rotate-90"
              size={20}
            />

            <div className="bg-slate-900 text-white p-6 rounded-lg w-full md:w-64 flex flex-col items-center">
              <Zap size={24} className="text-yellow-400 mb-3" />
              <p className="font-bold text-sm">Your app receives webhooks.</p>
            </div>
          </div>

          <div className="bg-slate-50 inline-block px-8 py-4 rounded-full border border-slate-200">
            <p className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Terminal size={18} className="text-slate-500" /> You keep
              building your product.
            </p>
            <p className="text-slate-500 font-medium text-xs mt-1">
              No billing infrastructure. No recurring payment headaches.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Problem: Meet Tunde */}
      <section className="py-24 px-6 bg-[#faf9f6] border-b border-border">
        <div className="max-w-6xl mx-auto gsap-reveal">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                Meet Tunde.
              </h2>
              <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
                Tunde is building a SaaS product. He integrates a payment
                gateway. Recurring payments work. He thinks he's done.
              </p>
              <p className="text-base text-slate-900 font-bold mb-2">
                He's just getting started.
              </p>
              <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">
                Because subscriptions aren't just recurring payments. Subscriptions
                are infrastructure.
              </p>

              <div className="relative h-64 rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src="/images/tunde_laptop_incomplete.png"
                  layout="fill"
                  objectFit="cover"
                  alt="Developer working late on incomplete subscription system"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 relative overflow-hidden">
              {/* Subtle decorative background blur to give the card more depth */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

              <h3 className="text-xl font-bold mb-8 text-slate-900 flex items-center gap-2 relative z-10">
                <HelpCircle size={20} className="text-red-500" /> Soon, Tunde
                starts asking questions:
              </h3>

              <div className="flex flex-wrap gap-3 text-slate-600 font-medium text-xs md:text-sm relative z-10">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Users size={14} className="text-blue-500" /> Who subscribed?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Box size={14} className="text-purple-500" /> Which plan did
                  they buy?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Calendar size={14} className="text-orange-500" /> When does
                  it expire?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <CheckCircle2 size={14} className="text-green-500" /> Did
                  payment succeed?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <AlertCircle size={14} className="text-red-500" /> What
                  happens if the card fails?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <ArrowUpCircle size={14} className="text-teal-500" /> What if
                  they upgrade halfway?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Shuffle size={14} className="text-indigo-500" /> What if
                  pricing changes?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <CreditCard size={14} className="text-slate-700" /> What if
                  their card expires?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Clock size={14} className="text-yellow-600" /> What if they
                  want a trial?
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-full border border-slate-200 hover:-translate-y-0.5 transition-transform cursor-default">
                  <Tag size={14} className="text-pink-500" /> What if they want
                  a coupon?
                </div>
              </div>

              <div className="mt-10 p-5 bg-red-50 border border-red-100 rounded-xl text-center relative z-10">
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Instead of shipping his product...
                </p>
                <p className="text-sm font-bold text-red-600">
                  Tunde is building a billing system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Building subscriptions is harder */}
      <section className="py-24 px-6 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto gsap-reveal">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Building subscriptions is harder than it looks.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <Layers className="text-blue-500 mb-4" size={28} />
              <h3 className="text-base font-bold text-slate-900 mb-3">
                You're building much more than payments.
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Recurring payments are only one part of the equation.
                Subscriptions need billing logic, state management, retries,
                customer records, proration, webhooks, and security.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <AlertCircle className="text-red-500 mb-4" size={28} />
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Every edge case becomes production code.
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">
                Failed cards. Bank downtime. Expired cards. Plan upgrades. Plan
                downgrades. Billing credits. Renewals. Cancellations.
              </p>
              <p className="text-slate-900 text-sm font-bold">
                Every one needs logic. Every one needs testing.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <Terminal className="text-slate-700 mb-4" size={28} />
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Your billing system becomes your product.
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Weeks become months. Engineering time disappears. Roadmaps slow
                down. Your customers wait.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Solution */}
      <section className="py-24 px-6 bg-[#09090b] text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto gsap-reveal">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                We know that accepting recurring payments is just one part of
                the equation.
              </h2>
              <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">
                Managing your customer's subscriptions and recurring payments is
                a different thing entirely.
              </p>

              <Link href="/dashboard" className="inline-flex items-center gap-3 bg-[#c5f045] hover:bg-[#b0d938] transition-colors text-slate-900 px-6 py-3 rounded-full font-bold text-lg mb-8">
                <Database size={20} /> Sub does both.
              </Link>

              <div className="flex flex-wrap gap-3 text-slate-300 font-medium text-xs">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Server size={12} /> Production-ready
                </span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Code size={12} /> Developer-first
                </span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Globe size={12} /> Nigerian businesses
                </span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap size={12} /> Powered by Nomba
                </span>
              </div>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-800 hidden md:flex items-center justify-center bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop"
                layout="fill"
                objectFit="cover"
                alt="API Code"
                className="opacity-30"
              />
              {/* Decorative API Docs Overlay */}
              <div className="absolute inset-0 flex flex-col p-6 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                  <Code size={14} className="text-slate-500" />
                  <span className="text-white font-bold">API Reference</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-[#c5f045]">Subscriptions</span>
                </div>
                <p className="text-purple-400 mb-2 mt-2">
                  POST{" "}
                  <span className="text-white ml-2">/v1/subscriptions</span>
                </p>
                <div className="bg-slate-900/80 backdrop-blur rounded-lg border border-slate-700 flex-1 flex flex-col overflow-hidden">
                  <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col justify-center flex-1">
                    <p>{"{"}</p>
                    <p className="ml-4 text-slate-400">
                      "customer_id":{" "}
                      <span className="text-green-300">"cus_12345"</span>,
                    </p>
                    <p className="ml-4 text-slate-400">
                      "plan_id":{" "}
                      <span className="text-green-300">"plan_premium"</span>,
                    </p>
                    <p className="ml-4 text-slate-400">
                      "billing_cycle":{" "}
                      <span className="text-green-300">"monthly"</span>
                    </p>
                    <p>{"}"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-800 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="md:w-1/2">
              <p className="text-lg font-bold text-white mb-1">
                Existing payment solutions treat subscriptions <br className="hidden md:block" /> as an
                afterthought.
              </p>
              <p className="text-lg font-bold text-[#c5f045]">
                Sub puts you first.
              </p>
            </div>
            <div className="md:w-1/2 md:text-right">
              <p className="text-lg font-bold text-slate-400">
                Most payment gateways help you collect money.
                <br />
                Sub helps you run a subscription business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. What We Offer */}
      <section className="py-24 px-6 bg-[#f8f7f5] border-b border-border">
        <div className="max-w-6xl mx-auto gsap-reveal">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">What We Offer</h2>
          </div>

          <div className="space-y-16">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Need billing plans that fit your
                  business?
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Flexible Plan Management
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                  Create plans with any billing interval. Daily. Weekly.
                  Monthly. Yearly. Even every 14 or 45 days. Manage everything
                  from one dashboard or API.
                </p>
                <Link
                  href="/auth/register"
                  className="font-bold text-slate-900 text-sm hover:text-slate-600 flex items-center gap-2 underline underline-offset-4"
                >
                  Create Your First Plan <ArrowRight size={14} />
                </Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Pro Plan
                      </p>
                      <p className="text-xs text-slate-500">Billed monthly</p>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      ₦15,000 / mo
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Enterprise
                      </p>
                      <p className="text-xs text-slate-500">
                        Billed every 45 days
                      </p>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      ₦250,000 / 45d
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-900 text-white border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-6 font-mono text-xs overflow-x-auto">
                  <p className="text-slate-400">{"// Upgrade action"}</p>
                  <p>
                    <span className="text-pink-400">const</span>{" "}
                    <span className="text-blue-300">proration</span> ={" "}
                    <span className="text-yellow-200">await</span>{" "}
                    sub.subscriptions.upgrade({"{"}
                  </p>
                  <p className="ml-4">
                    subscriptionId:{" "}
                    <span className="text-green-300">'sub_123'</span>,
                  </p>
                  <p className="ml-4">
                    newPlanId:{" "}
                    <span className="text-green-300">'plan_pro'</span>,
                  </p>
                  <p className="ml-4">
                    prorationBehavior:{" "}
                    <span className="text-green-300">'charge_difference'</span>
                  </p>
                  <p>{"}"});</p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowUpCircle size={14} /> Customer upgrading halfway through
                  the month?
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Automated Proration Engine
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                  Sub calculates everything automatically. No spreadsheets. No
                  custom formulas. No billing mistakes. Charge the difference.
                  Or save it as customer credit. Your choice.
                </p>
                <Link
                  href="/auth/register"
                  className="font-bold text-slate-900 text-sm hover:text-slate-600 flex items-center gap-2 underline underline-offset-4"
                >
                  Try the API <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw size={14} /> What happens when a payment fails?
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Smart Dunning & Recovery
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                  Most gateways retry blindly. Sub retries intelligently. Retry
                  after bank downtime. Retry when customers are more likely to
                  have funds. Still unsuccessful? Automatically generate a Nomba
                  Virtual Account. Keep subscriptions alive. Recover revenue.
                </p>
                <Link
                  href="/auth/register"
                  className="font-bold text-slate-900 text-sm hover:text-slate-600 flex items-center gap-2 underline underline-offset-4"
                >
                  Start Recovering Revenue <ArrowRight size={14} />
                </Link>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-6 flex items-center gap-6">
                <div className="p-4 bg-[#c5f045]/20 rounded-full flex-shrink-0">
                  <RefreshCw size={32} className="text-[#8cae29]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Smart Retries Active
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Attempt 1: Failed (Insufficient Funds)
                    <br />
                    Attempt 2: Scheduled for 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 text-sm mb-4">
                    Billing Portal
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      Pro Plan{" "}
                      <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold border border-green-200">
                        Active
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Renews on Oct 15, 2026
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-1.5 rounded text-xs font-bold transition-colors">
                      Update Card
                    </button>
                    <button className="flex-1 bg-white border border-red-200 hover:bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe size={14} /> Don't want to build a billing dashboard?
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Hosted Customer Portal
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                  Ship one instantly. Customers can update cards, pause/resume
                  subscriptions, cancel plans, download receipts, and view
                  billing history. Brand it with your logo and colours. No
                  frontend engineering required.
                </p>
                <Link
                  href="/auth/register"
                  className="font-bold text-slate-900 text-sm hover:text-slate-600 flex items-center gap-2 underline underline-offset-4"
                >
                  Launch Your Portal <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} /> Want your app to react automatically?
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Real-Time Webhooks
                </h3>
                <p className="text-slate-600 text-sm mb-6 font-medium leading-relaxed">
                  Receive signed events the moment something changes. No
                  polling. No cron jobs. Always in sync.
                </p>
                <ul className="space-y-1 mb-6 font-mono text-xs text-slate-700 bg-white p-4 rounded-lg border border-slate-200 inline-block w-full">
                  <li>• subscription.created</li>
                  <li>• subscription.activated</li>
                  <li>• subscription.past_due</li>
                  <li>• subscription.cancelled</li>
                </ul>
                <Link
                  href="/auth/register"
                  className="font-bold text-slate-900 text-sm hover:text-slate-600 flex items-center gap-2 underline underline-offset-4"
                >
                  Explore Webhooks <ArrowRight size={14} />
                </Link>
              </div>
              <div className="bg-slate-900 text-white border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-800 flex items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-6 font-mono text-xs overflow-x-auto">
                  <p className="text-slate-400">{"// Webhook payload"}</p>
                  <p>{"{"}</p>
                  <p className="ml-4">
                    "type":{" "}
                    <span className="text-green-300">
                      "subscription.activated"
                    </span>
                    ,
                  </p>
                  <p className="ml-4">"data": {"{"}</p>
                  <p className="ml-8">
                    "id": <span className="text-green-300">"sub_123"</span>,
                  </p>
                  <p className="ml-8">
                    "status": <span className="text-green-300">"active"</span>,
                  </p>
                  <p className="ml-8">
                    "customer_id":{" "}
                    <span className="text-green-300">"cus_456"</span>
                  </p>
                  <p className="ml-4">{"}"}</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Built for Production */}
      <section className="py-24 px-6 bg-white border-b border-border text-center">
        <div className="max-w-4xl mx-auto gsap-reveal">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Built for Production
          </h2>
          <p className="text-sm text-slate-500 mb-12 font-medium">
            Not demos. Not prototypes. Production.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-[#f8f7f5] p-6 rounded-xl border border-slate-200 flex flex-col h-full">
              <div className="bg-white w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center mb-4">
                <Layers size={20} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Bulletproof State Machine
              </h3>
              <p className="text-slate-600 text-sm mb-6 font-medium">
                Every subscription has one clear state. No ambiguity. No
                inconsistent data.
              </p>
              <ul className="space-y-2 text-sm font-bold text-slate-700 mt-auto">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Pending
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Active
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Past Due
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Grace Period
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Cancelled
                </li>
              </ul>
            </div>

            <div className="bg-[#f8f7f5] p-6 rounded-xl border border-slate-200 flex flex-col h-full">
              <div className="bg-white w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center mb-4">
                <Lock size={20} className="text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Secure by Default
              </h3>
              <p className="text-slate-600 text-sm mb-6 font-medium">
                Your billing stays reliable. Your customers stay protected.
              </p>
              <ul className="space-y-2 text-sm font-bold text-slate-700 mt-auto">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c5f045] flex items-center justify-center border border-[#b0d938]">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Idempotency keys
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c5f045] flex items-center justify-center border border-[#b0d938]">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Signed webhooks
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c5f045] flex items-center justify-center border border-[#b0d938]">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Multi-tenant isolation
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#c5f045] flex items-center justify-center border border-[#b0d938]">
                    <Check size={12} className="text-slate-900" />
                  </div>{" "}
                  Tokenized payment methods
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Why Developers Choose Sub & Powered by Nomba */}
      <section className="py-24 px-6 bg-[#09090b] text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 gsap-reveal">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Why Developers Choose Sub
            </h2>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                REST APIs designed for developers
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Production-ready subscription engine
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Automated billing workflows
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Intelligent retry logic
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Mid-cycle proration
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Hosted customer portal
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Secure webhook delivery
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Multi-tenant architecture
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[#c5f045] shrink-0" />{" "}
                Built for Nigerian payment realities
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-6">
              <Image 
                src="/images/nomba_logo.png" 
                alt="Nomba Logo" 
                width={140} 
                height={32} 
                className="h-8 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Powered by Nomba
            </h2>
            <h3 className="text-sm text-[#c5f045] font-bold mb-4">
              Built on infrastructure you can trust.
            </h3>
            <p className="text-slate-400 text-sm mb-4 font-medium leading-relaxed">
              Sub is an intelligent subscription layer built directly on top of
              Nomba's payment primitives. We don't replace Nomba. We amplify it.
            </p>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
              Using Nomba's Tokenised Cards, Charge API, Virtual Accounts, and
              Webhooks, Sub gives developers everything they need to build
              subscription products without rebuilding billing from scratch.
            </p>

            <h3 className="text-sm font-bold text-white mb-4 border-t border-slate-800 pt-6">
              Built around Nomba's values.
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Zap size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">
                    Simplicity
                  </h4>
                  <p className="text-slate-400 text-xs font-medium">
                    Simple APIs. Clear documentation. Fast onboarding.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck
                  size={16}
                  className="text-green-400 shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">
                    Reliability
                  </h4>
                  <p className="text-slate-400 text-xs font-medium">
                    Secure payments. Reliable retries. Bulletproof billing
                    states. Financial integrity by design.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ArrowUpCircle
                  size={16}
                  className="text-blue-400 shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">
                    Business Growth
                  </h4>
                  <p className="text-slate-400 text-xs font-medium">
                    Recover failed payments. Reduce involuntary churn. Help
                    merchants keep more customers. When Nomba grows, businesses
                    grow. When businesses grow, developers win.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Developer Experience */}
      <section className="py-24 px-6 bg-[#f8f7f5] border-b border-border text-center">
        <div className="max-w-4xl mx-auto gsap-reveal">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Developer Experience
          </h2>
          <h3 className="text-lg font-bold text-[#c5f045] bg-slate-900 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg mb-4">
            <Code size={18} /> Four API calls.
          </h3>
          <p className="text-sm text-slate-600 mb-12 font-medium">
            That's enough to launch subscriptions.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto mt-8">
            {/* Step 1 */}
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-800/50 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 font-bold">
                <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[#c5f045]">1.</span> Create a plan
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <p>
                  <span className="text-pink-400">await</span> sub.plans.
                  <span className="text-blue-300">create</span>({"{"}
                </p>
                <p className="ml-4">
                  name: <span className="text-green-300">'Pro'</span>,
                </p>
                <p className="ml-4">
                  amount: <span className="text-purple-300">15000</span>,
                </p>
                <p className="ml-4">
                  interval: <span className="text-green-300">'monthly'</span>
                </p>
                <p>{"}"});</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-800/50 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 font-bold">
                <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[#c5f045]">2.</span> Create a customer
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <p>
                  <span className="text-pink-400">await</span> sub.customers.
                  <span className="text-blue-300">create</span>({"{"}
                </p>
                <p className="ml-4">
                  email:{" "}
                  <span className="text-green-300">'tunde@example.com'</span>,
                </p>
                <p className="ml-4">
                  name: <span className="text-green-300">'Tunde'</span>
                </p>
                <p>{"}"});</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-800/50 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 font-bold">
                <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[#c5f045]">3.</span> Create subscription
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <p>
                  <span className="text-pink-400">await</span>{" "}
                  sub.subscriptions.
                  <span className="text-blue-300">create</span>({"{"}
                </p>
                <p className="ml-4">
                  customerId: <span className="text-green-300">'cus_987'</span>,
                </p>
                <p className="ml-4">
                  planId: <span className="text-green-300">'plan_pro'</span>
                </p>
                <p>{"}"});</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-800/50 px-4 py-2.5 border-b border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-300 font-bold">
                <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-[#c5f045]">4.</span> Listen for webhooks
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                <p>
                  app.<span className="text-blue-300">post</span>(
                  <span className="text-green-300">'/webhook'</span>, (req, res)
                  ={">"} {"{"}
                </p>
                <p className="ml-4">
                  <span className="text-pink-400">const</span> event =
                  sub.webhooks.<span className="text-blue-300">verify</span>
                  (req);
                </p>
                <p className="ml-4">
                  <span className="text-pink-400">if</span> (event.type ==={" "}
                  <span className="text-green-300">'active'</span>) {"{"}
                </p>
                <p className="ml-8 text-slate-500">{"// grant access"}</p>
                <p className="ml-4">{"}"}</p>
                <p>{"}"});</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-900 mt-12 font-bold flex items-center justify-center gap-2">
            <PlayCircle size={16} className="text-[#8cae29]" /> Everything else
            runs automatically.
          </p>
        </div>
      </section>

      {/* 11. Stop Building Billing */}
      <section className="py-24 px-6 bg-white border-b border-border text-center">
        <div className="max-w-2xl mx-auto gsap-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Stop Building Billing.
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-slate-500 mb-8">
            Start Building Your Product.
          </h3>

          <p className="text-sm text-slate-600 mb-8 font-medium leading-relaxed">
            Big Tech companies like Microsoft, LinkedIn, Salesforce, and
            Netflix, with some of the best developers in the world, don't build
            recurring billing infrastructure themselves. They outsource it.
          </p>
          <p className="text-lg font-bold text-slate-900 mb-10">
            Why shouldn't you?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-6 py-3 rounded-full font-bold border border-[#b0d938] transition-colors text-center text-sm"
            >
              Start Building with Sub
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto bg-transparent hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-full font-bold border border-slate-300 transition-colors text-center text-sm flex items-center justify-center gap-2"
            >
              <FileText size={16} /> Read the Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Built on Sub: PayPlan */}
      <section
        id="payplan"
        className="py-24 px-6 bg-[#f8f7f5] border-y border-border"
      >
        <div className="max-w-6xl mx-auto text-center gsap-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white text-slate-800 text-[10px] font-bold mb-6 tracking-widest border border-slate-200">
            Built on Sub
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Meet PayPlan
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed font-medium">
            PayPlan is built on top of Sub. It helps everyday people automate
            split bills, family allowances, and group contributions. No awkward
            reminders. No forgotten payments. Money moves automatically.
          </p>

          <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden border border-slate-200 group cursor-pointer h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10"></div>
            <Image
              src="/images/payplan_nigerian.png"
              alt="PayPlan Interface"
              layout="fill"
              objectFit="cover"
              className="w-full transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-8 text-center z-20">
              <div className="transform scale-95 group-hover:scale-100 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Consumer app, developer infra.
                </h3>
                <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed font-medium">
                  PayPlan uses Sub's underlying API to manage complex
                  multi-party recurring billing without building any core
                  billing logic itself.
                </p>
                <div className="w-full sm:w-auto px-4 sm:px-0">
                  <Link
                    href="#"
                    className="w-full sm:w-auto justify-center bg-white hover:bg-[#c5f045] text-slate-900 px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 border border-white transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Final CTA & Footer */}
      <section className="pt-24 pb-12 px-6 bg-white border-t border-border text-center">
        <div className="max-w-3xl mx-auto mb-24 gsap-reveal">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 leading-tight text-slate-900">
            Why waste time building a subscription infrastructure for your
            product when you can just plug into Sub?
          </h2>
          <p className="text-sm text-slate-500 mb-10 font-medium">
            Start today. Ship sooner. Scale confidently.
          </p>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-[#c5f045] hover:bg-[#b0d938] text-slate-900 px-8 py-3.5 rounded-full font-bold border border-[#b0d938] transition-all text-sm inline-block text-center"
          >
            Create Free Account
          </Link>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 pt-16 flex flex-col md:flex-row justify-between items-start gap-12 text-left">
          <div className="flex items-center gap-2 md:w-1/4">
            <div className="w-8 h-8 rounded-sm bg-[#c5f045] flex items-center justify-center border border-[#a8cf38]">
              <span className="text-slate-900 text-sm font-black logo-font">
                S
              </span>
            </div>
            <span className="font-bold text-base tracking-tight logo-font text-slate-900">
              Sub
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full md:w-3/4">
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Developer Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-wider">
                Developers
              </h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Quick Start
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    SDKs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Webhooks
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Status
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-5 text-[11px] uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    About Team X
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-slate-900 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-slate-200 mt-16 pt-8 text-center text-xs text-slate-500 font-medium">
          Built by Team X. Powered by Nomba APIs.
        </div>
      </section>
    </main>
  );
}
