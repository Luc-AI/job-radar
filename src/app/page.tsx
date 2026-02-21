import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { ScoringDemo } from "@/app/ScoringDemo";
import { Clock, XCircle, Meh, Upload, Cpu, Mail } from "react-feather";

// ============================================================================
// Navigation
// ============================================================================
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="lg" linkTo="/" />

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>

            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ============================================================================
// Hero Section
// ============================================================================
function HeroSection() {
  return (
    <section className="relative pt-24 pb-28 sm:pt-40 sm:pb-44 overflow-hidden">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.08] tracking-[-0.02em]">
          Stop scrolling job boards.
          <br />
          <span className="text-muted-foreground">
            We&apos;ll find the good ones for you.
          </span>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Upload your CV once. Our AI scans thousands of jobs daily and sends
          you only the ones that actually fit — scored, ranked, and delivered to
          your inbox.
        </p>
        <div className="mt-12">
          <Button
            size="lg"
            asChild
            className="text-lg px-8 py-6 h-auto transition-transform hover:scale-[1.02]"
          >
            <Link href="/signup">Get Your First Matches Free</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Takes 3 minutes to set up. No credit card needed.
          </p>
        </div>
      </div>

      {/* Doodle accent */}
      <Image
        src="/clumsy.svg"
        alt=""
        width={144}
        height={108}
        className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-36 opacity-[0.12] dark:opacity-[0.18] dark:invert pointer-events-none select-none"
        aria-hidden="true"
      />
    </section>
  );
}

// ============================================================================
// Problem Section
// ============================================================================
function ProblemSection() {
  const painPoints = [
    {
      icon: Clock,
      text: "You spend hours scrolling through job boards, only to find the same irrelevant listings.",
    },
    {
      icon: XCircle,
      text: "Alerts flood your inbox with noise — sponsored posts, bad matches, and roles you\u2019d never consider.",
    },
    {
      icon: Meh,
      text: "By the time you find something good, you\u2019re too drained to actually apply.",
    },
  ];

  return (
    <AnimateOnScroll>
      <section className="py-20 sm:py-28">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Sound familiar?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Job searching hasn&apos;t changed in 20 years. It&apos;s still
              broken.
            </p>
          </div>

          <div className="space-y-6">
            {painPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-4 sm:gap-5"
              >
                <div className="mt-1 shrink-0">
                  <point.icon className="size-5 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}

// ============================================================================
// How It Works Section
// ============================================================================
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      icon: Upload,
      title: "Tell us what you\u2019re looking for",
      description:
        "Upload your CV and share your ideal roles, locations, and what matters to you. It only takes a few minutes.",
    },
    {
      number: "2",
      icon: Cpu,
      title: "We do the searching for you",
      description:
        "Our AI scans job boards every day and scores each opportunity against your profile across 5 key dimensions.",
    },
    {
      number: "3",
      icon: Mail,
      title: "Get matches in your inbox",
      description:
        "Wake up to a curated list of high-scoring jobs. Only the relevant ones — no spam, no noise.",
    },
  ];

  return (
    <AnimateOnScroll>
      <section className="py-20 sm:py-28 bg-muted/50">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Set it up once, then let us handle the rest.
            </p>

            {/* Doodle accent */}
            <Image
              src="/plant.svg"
              alt=""
              width={96}
              height={72}
              className="hidden md:block mx-auto mt-6 w-24 opacity-[0.12] dark:opacity-[0.18] dark:invert pointer-events-none select-none"
              aria-hidden="true"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-card rounded-xl p-8 h-full border">
                  <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}

// ============================================================================
// AI Scoring Section
// ============================================================================
function AIScoringSection() {
  return (
    <AnimateOnScroll>
      <section className="py-20 sm:py-28">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text side */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                AI that actually understands your career
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We don&apos;t just match keywords. Every job is scored across 5
                dimensions tailored to your profile — so you see at a glance why
                a role fits and where it falls short.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Role Fit — does the job match your skills and experience?",
                  "Company — culture, size, and stage you prefer",
                  "Location — city, remote, and commute preferences",
                  "Industry — sectors you want (or want to avoid)",
                  "Growth — career trajectory and development potential",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock scoring card */}
            <div>
              <ScoringDemo />
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}

// ============================================================================
// FAQ Section
// ============================================================================
function FAQSection() {
  const faqs = [
    {
      question: "Is it really free?",
      answer:
        "Yes, completely. Jobfishing is a passion project built to solve a real problem. No hidden costs, no premium tier, no credit card needed.",
    },
    {
      question: "How does the AI matching work?",
      answer:
        "You upload your CV and set your preferences. Our AI evaluates every new job posting across 5 dimensions: role fit, company fit, location, industry match, and growth potential. You only see jobs that score above your personal threshold.",
    },
    {
      question: "How long does setup take?",
      answer:
        "About 3 minutes. Upload your CV, set your preferred roles and locations, choose your notification threshold — done.",
    },
    {
      question: "How is this different from LinkedIn alerts?",
      answer:
        "LinkedIn optimizes for engagement — keeping you scrolling. We optimize for your time — only reaching out when something genuinely matches your profile. No sponsored posts, no noise.",
    },
    {
      question: "What job boards do you scan?",
      answer:
        "We currently scan LinkedIn, Jobs.ch, and select company career pages. We\u2019re continuously adding new sources.",
    },
    {
      question: "Can I pause notifications?",
      answer:
        "Absolutely. You can pause, adjust your score threshold, or change your delivery time anytime in your settings.",
    },
  ];

  return (
    <AnimateOnScroll>
      <section className="py-20 sm:py-28 bg-muted/50">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </AnimateOnScroll>
  );
}

// ============================================================================
// Final CTA Section
// ============================================================================
function FinalCTASection() {
  return (
    <AnimateOnScroll>
      <section className="py-24 sm:py-32">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
            Ready to stop searching?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Set up your profile in 3 minutes and let us do the work.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 h-auto transition-transform hover:scale-[1.02]"
            >
              <Link href="/signup">Start Getting Matches</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Doodle accent */}
          <Image
            src="/Doggie.svg"
            alt=""
            width={80}
            height={60}
            className="hidden sm:block mx-auto mt-8 w-20 opacity-[0.12] dark:opacity-[0.18] dark:invert pointer-events-none select-none"
            aria-hidden="true"
          />
        </div>
      </section>
    </AnimateOnScroll>
  );
}

// ============================================================================
// Footer
// ============================================================================
function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="md" linkTo="/" variant="light" />

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="hover:opacity-80 transition-opacity"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:opacity-80 transition-opacity"
            >
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Jobfishing. All rights reserved.
          </p>
          <p className="opacity-60">Made with care in Zurich</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================
export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if onboarding is completed
    const { data: userData } = await supabase
      .from("users")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    if (userData?.onboarding_completed) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding/step-1");
    }
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <AIScoringSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
