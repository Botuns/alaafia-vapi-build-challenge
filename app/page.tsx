"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PhoneCall,
  Bell,
  Shield,
  BookOpen,
  ArrowRight,
  Twitter,
  Facebook,
  Instagram,
  Sparkles,
  Heart,
  Clock,
  Users,
  Zap,
  MessageCircle,
  Phone,
  PlayCircle,
} from "lucide-react";

// Add type definitions at the top of the file
type MouseEvent = {
  clientX: number;
  clientY: number;
};

type FloatingCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: string;
};

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  bgGradient: string;
  index: number;
};

type StepCardProps = {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
};

type TestimonialCardProps = {
  quote: string;
  author: string;
  role: string;
  rating: number;
  index: number;
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 overflow-x-hidden ">
      {/* Animated cursor follower */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-20 pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${isLoaded ? 1 : 0})`,
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-black/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                <PhoneCall size={28} className="text-white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Alafia
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  AI Companion
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {["About", "Features", "Pricing", "Company"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="relative text-slate-600 hover:text-emerald-600 transition-all duration-300 font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <div className="flex items-center gap-4 ml-6">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="font-medium hover:bg-emerald-50/80 hover:text-emerald-600 transition-all duration-300 rounded-xl"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 rounded-xl px-6">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="h-20" />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-8 px-6 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* Floating feature cards with enhanced animations */}
            <div className="hidden xl:block">
              <FloatingCard
                className="absolute left-0 top-20 animate-float"
                delay="0s"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
                    <Bell size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Medication Reminder
                  </span>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 rounded-xl text-sm text-slate-600 mb-4 border border-emerald-100">
                  🕒 Time to take your blood pressure medicine
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/25 rounded-xl"
                >
                  <Bell size={14} className="mr-2" />
                  Remind Me
                </Button>
              </FloatingCard>

              <FloatingCard
                className="absolute right-0 top-40 animate-float"
                delay="1s"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                    <Shield size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Emergency Detection
                  </span>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl text-sm text-slate-600 mb-4 border border-red-100">
                  🚨 AI detects distress signals in voice
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25 rounded-xl"
                >
                  <Shield size={14} className="mr-2" />
                  Alert Family
                </Button>
              </FloatingCard>

              <FloatingCard
                className="absolute left-20 bottom-0 animate-float"
                delay="2s"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                    <PhoneCall size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Voice Assistant
                  </span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl text-sm mb-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4 animate-pulse" />
                      <div className="bg-slate-200 h-2 rounded-full mt-1" />
                    </div>
                    <span className="text-xs font-mono">00:45</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25 rounded-xl"
                >
                  <Phone size={14} className="mr-2" />
                  Call Now
                </Button>
              </FloatingCard>

              <FloatingCard
                className="absolute right-20 bottom-20 animate-float"
                delay="3s"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 shadow-lg">
                    <BookOpen size={18} className="text-white" />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Entertainment
                  </span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-pink-50 p-4 rounded-xl text-sm text-slate-600 mb-4 border border-amber-100">
                  🎵 Your favorite stories and music await
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 shadow-lg shadow-amber-500/25 rounded-xl"
                >
                  <PlayCircle size={14} className="mr-2" />
                  Play Content
                </Button>
              </FloatingCard>
            </div>

            {/* Main hero content */}
            <div className="text-center max-w-5xl mx-auto pt-0 pb-32">
              <div
                className={`transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full text-emerald-700 font-medium mb-8 border border-emerald-200">
                  <Sparkles size={16} className="animate-pulse" />
                  AI-Powered Elderly Care Revolution
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                  <span className="block text-slate-900">Revolutionize</span>
                  <span className="block text-slate-900">
                    Your Elderly Care
                  </span>
                  <span className="block bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                    With Alafia
                  </span>
                </h1>

                <p className="text-2xl md:text-3xl text-slate-500 font-light mb-12 max-w-4xl mx-auto leading-relaxed">
                  AI Voice Companion that provides{" "}
                  <span className="text-emerald-600 font-semibold">
                    unmatched support
                  </span>{" "}
                  for your loved ones
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-16">
                  {[
                    {
                      label: "Medication Reminders",
                      color: "from-emerald-500 to-cyan-500",
                      icon: Bell,
                    },
                    {
                      label: "Voice Assistant",
                      color: "from-blue-500 to-purple-500",
                      icon: MessageCircle,
                    },
                    {
                      label: "Emergency Detection",
                      color: "from-red-500 to-orange-500",
                      icon: Shield,
                    },
                    {
                      label: "Entertainment",
                      color: "from-amber-500 to-pink-500",
                      icon: Heart,
                    },
                  ].map((tag, index) => (
                    <div
                      key={tag.label}
                      className={`px-6 py-3 bg-gradient-to-r ${tag.color} text-white rounded-full font-medium shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <tag.icon size={16} />
                      {tag.label}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105"
                    >
                      Get Started For Free
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-600 px-12 py-6 text-xl font-semibold rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-emerald-50/80 transition-all duration-300"
                  >
                    <PlayCircle className="mr-3 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>

                <p className="text-slate-400 mt-8 text-lg">
                  Powered by advanced AI technology • Trusted by 1000+ families
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)] opacity-50" />

          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full text-emerald-700 font-medium mb-6">
                <Zap size={16} />
                Powerful Features
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">
                Everything You Need for{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Complete Care
                </span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Our AI companion provides comprehensive support with
                cutting-edge features designed for modern elderly care
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {[
                {
                  icon: Bell,
                  title: "Smart Medication Reminders",
                  description:
                    "Personalized medication schedules with gentle voice reminders and caregiver notifications",
                  gradient: "from-emerald-500 to-cyan-500",
                  bgGradient: "from-emerald-50 to-cyan-50",
                },
                {
                  icon: PhoneCall,
                  title: "Wellness Check-ins",
                  description:
                    "Daily mood assessments and health monitoring with automatic alerts to family members",
                  gradient: "from-blue-500 to-purple-500",
                  bgGradient: "from-blue-50 to-purple-50",
                },
                {
                  icon: Shield,
                  title: "Emergency Detection",
                  description:
                    "Advanced AI analyzes voice patterns to detect distress and automatically contacts emergency services",
                  gradient: "from-red-500 to-orange-500",
                  bgGradient: "from-red-50 to-orange-50",
                },
                {
                  icon: BookOpen,
                  title: "Entertainment & Stories",
                  description:
                    "Access to thousands of stories, music, and radio stations through simple voice commands",
                  gradient: "from-amber-500 to-pink-500",
                  bgGradient: "from-amber-50 to-pink-50",
                },
              ].map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-slate-900">
                Simple Setup,{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Powerful Results
                </span>
              </h2>
              <p className="text-xl text-slate-600">
                Get started with Alafia in just three easy steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  number: "01",
                  title: "Caregiver Setup",
                  description:
                    "Create your account and set up profiles for your elderly loved ones, including medication schedules, emergency contacts, and preferences.",
                  icon: Users,
                },
                {
                  number: "02",
                  title: "AI Activation",
                  description:
                    "Our AI companion begins making scheduled calls to provide medication reminders, wellness checks, and entertainment based on your settings.",
                  icon: Zap,
                },
                {
                  number: "03",
                  title: "Ongoing Support",
                  description:
                    "The AI learns and adapts over time, detects emergencies, and keeps you informed about your loved one's wellbeing with detailed reports.",
                  icon: Heart,
                },
              ].map((step, index) => (
                <StepCard key={step.number} {...step} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-gradient-to-br from-slate-900 to-emerald-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.2),transparent)]" />

          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Families Love{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Alafia
                </span>
              </h2>
              <p className="text-xl text-slate-300">
                Hear from families who have experienced the difference Alafia
                makes in their lives
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  quote:
                    "Alafia has given me peace of mind knowing my mother is getting her medication reminders even when I can't call her myself. It's like having a caring family member always there.",
                  author: "Sarah Johnson",
                  role: "Daughter & Caregiver",
                  rating: 5,
                },
                {
                  quote:
                    "The emergency detection feature alerted me when my father fell. The quick response time made all the difference. This technology literally saved his life.",
                  author: "Michael Thompson",
                  role: "Son & Healthcare Worker",
                  rating: 5,
                },
                {
                  quote:
                    "My grandmother loves the storytelling feature. It's become part of her daily routine and keeps her engaged. She actually looks forward to her calls now!",
                  author: "Lisa Martinez",
                  role: "Granddaughter",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.author}
                  {...testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />

          <div className="container mx-auto px-6 relative">
            <div className="max-w-5xl mx-auto text-center text-white">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Ready to Transform
                <br />
                <span className="text-white/90">Elderly Care?</span>
              </h2>
              <p className="text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
                Join hundreds of families using Alafia to ensure their elderly
                loved ones are safe, healthy, and connected with cutting-edge AI
                technology.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-slate-50 px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
                  >
                    Get Started Today
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 bg-primary hover:border-white text-white hover:bg-white/10 px-12 py-6 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300"
                >
                  Schedule Demo
                </Button>
              </div>

              <p className="text-white/70 mt-8 text-lg">
                Free 14-day trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                  <PhoneCall size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Alafia</h3>
                  <p className="text-sm text-slate-400">AI Companion</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                AI-powered voice companion for elderly care, providing peace of
                mind for families worldwide.
              </p>
              <div className="flex gap-4">
                {[Twitter, Facebook, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-3 rounded-xl bg-slate-800 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:scale-110"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Quick Links",
                links: ["About Us", "Features", "Pricing", "Contact"],
              },
              {
                title: "Resources",
                links: ["Blog", "FAQ", "Support", "Privacy Policy"],
              },
              {
                title: "Contact",
                content: (
                  <div className="space-y-4">
                    <p className="text-slate-400">Email: info@alafia.com</p>
                    <p className="text-slate-400">Phone: +234 123 456 7890</p>
                    <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-sm text-emerald-400 font-medium">
                        24/7 Support Available
                      </p>
                    </div>
                  </div>
                ),
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
                {section.links ? (
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link
                          href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  section.content
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-16 pt-8 text-center text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Alafia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

// Update the handleMouseMove function with proper typing
const handleMouseMove = (e: MouseEvent) => {
  setMousePosition({ x: e.clientX, y: e.clientY });
};

// Add the missing TestimonialCard component
function TestimonialCard({
  quote,
  author,
  role,
  rating,
  index,
}: TestimonialCardProps) {
  return (
    <div
      className="relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {rating}
      </div>
      <div className="mb-6">
        <p className="text-lg text-white/90 leading-relaxed mb-6">&quot;{quote}&quot;</p>
        <div>
          <h4 className="text-white font-semibold">{author}</h4>
          <p className="text-emerald-400/80 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Update component props with proper typing
function FloatingCard({ children, className, delay }: FloatingCardProps) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 w-80 hover:scale-105 transition-all duration-500 ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  bgGradient,
  index,
}: FeatureCardProps) {
  return (
    <div
      className={`group p-8 rounded-3xl bg-gradient-to-br ${bgGradient} border border-white/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon: Icon,
  index,
}: StepCardProps) {
  return (
    <div
      className="relative p-8 rounded-3xl bg-white shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {number}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
