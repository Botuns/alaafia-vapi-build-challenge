"use client";
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
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                <PhoneCall size={24} className="text-emerald-600" />
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Alafia
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/about"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/features"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/company"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Company
              </Link>
              <div className="flex items-center gap-4 ml-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm hover:shadow-md transition-all rounded-lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <div className="h-16"></div> {/* Spacer for fixed header */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-10 mx-auto ">
          {/* Background pattern */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Floating feature cards */}
            <div className="hidden md:block">
              {/* Medication Reminder Card */}
              <div className="absolute left-0 top-20 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium">
                    Medication Reminder
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  Time to take your blood pressure medicine
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                >
                  Remind
                </Button>
              </div>

              {/* Emergency Alert Card */}
              <div className="absolute right-0 top-40 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium">
                    Emergency Detection
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  Voice analysis detects distress signals
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                >
                  Alert Family
                </Button>
              </div>

              {/* Voice Assistant Card */}
              <div className="absolute left-20 bottom-0 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneCall size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium">Voice Assistant</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm flex items-center gap-2">
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-3/4"></div>
                  </div>
                  <span className="text-xs">00:45</span>
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                >
                  Call Now
                </Button>
              </div>

              {/* Entertainment Card */}
              <div className="absolute right-20 bottom-20 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium">Entertainment</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  Listen to your favorite stories and music
                </div>
                <Button
                  size="sm"
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
                >
                  Play Content
                </Button>
              </div>
            </div>

            {/* Main hero content */}
            <div className="text-center max-w-4xl mx-auto pt-10 pb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Revolutionize Your Elderly Care With{" "}
                <span className="text-emerald-600">Alafia</span>
              </h2>
              <h3 className="text-3xl md:text-4xl text-gray-400 font-medium mb-8">
                AI Voice Companion, Unmatched Support!
              </h3>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                  Medication Reminders
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Voice Assistant
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Emergency Detection
                </span>
                <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm">
                  Entertainment
                </span>
              </div>

              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-md px-8 py-6 text-lg"
                >
                  Get Started For Free
                </Button>
              </Link>

              <p className="text-gray-500 mt-4 text-sm">
                Powered by advanced AI technology
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Key Features
              </h2>
              <p className="text-gray-600">
                Our AI companion provides comprehensive support for elderly care
                with these powerful features
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Bell className="h-8 w-8 text-emerald-600" />}
                title="Medication Reminders"
                description="Scheduled calls to remind users of specific medications with personalized messages."
              />
              <FeatureCard
                icon={<PhoneCall className="h-8 w-8 text-emerald-600" />}
                title="Wellness Check-ins"
                description="Automated calls to gauge mood and well-being, with alerts to caregivers if needed."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-emerald-600" />}
                title="Emergency Detection"
                description="Natural language detection of distress signals with automatic alerts to emergency contacts."
              />
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-emerald-600" />}
                title="Storytelling & Entertainment"
                description="Access to stories, folktales, music, and radio stations through simple voice commands."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How It Works
              </h2>
              <p className="text-gray-600">
                Simple setup process to get started with Alafia
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number="01"
                title="Caregiver Setup"
                description="Caregivers create an account and set up profiles for their elderly loved ones, including medication schedules and emergency contacts."
              />
              <StepCard
                number="02"
                title="AI Activation"
                description="The AI companion is activated and begins making scheduled calls to check in, remind about medications, and provide entertainment."
              />
              <StepCard
                number="03"
                title="Ongoing Support"
                description="The AI learns preferences over time, detects emergencies, and keeps caregivers informed about their loved one's well-being."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What Our Users Say
              </h2>
              <p className="text-gray-600">
                Hear from families who have experienced the difference Alafia
                makes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <TestimonialCard
                quote="Alafia has given me peace of mind knowing my mother is getting her medication reminders even when I can't call her myself."
                author="Sarah J."
                role="Daughter"
              />
              <TestimonialCard
                quote="The emergency detection feature alerted me when my father fell. The quick response time made all the difference."
                author="Michael T."
                role="Son"
              />
              <TestimonialCard
                quote="My grandmother loves the storytelling feature. It's become part of her daily routine and keeps her engaged."
                author="Lisa M."
                role="Granddaughter"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-emerald-600 rounded-lg overflow-hidden shadow-xl">
              <div className="p-12 md:p-16 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to provide better care for your loved ones?
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Join hundreds of families using Alafia to ensure their elderly
                  loved ones are safe, healthy, and connected.
                </p>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-gray-100 px-8 rounded-md"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <PhoneCall size={24} className="text-emerald-400" />
                <h3 className="text-xl font-medium">Alafia</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered voice companion for elderly care, providing peace of
                mind for families.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6">Contact Us</h4>
              <p className="text-gray-400 mb-2">Email: info@alafia.com</p>
              <p className="text-gray-400 mb-6">Phone: +234 123 456 7890</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Alafia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3 mt-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-100">
      <div className="mb-4 text-emerald-600">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.3 6.2H16.7L13.2 12.8V17.8H6.8V12.8L10.3 6.2H11.3Z"
            fill="currentColor"
          />
          <path
            d="M18.7 6.2H24.1L20.6 12.8V17.8H14.2V12.8L17.7 6.2H18.7Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="text-gray-700 mb-4 italic">{quote}</p>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
}
