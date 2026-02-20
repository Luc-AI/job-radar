import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ============================================================================
// Navigation
// ============================================================================
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="lg" linkTo="/" />

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-1 text-sm text-foreground">
              <span className="font-medium">EN</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">DE</span>
            </div>

            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>

            <Button asChild className="hidden sm:inline-flex">
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
    <section className="pt-20 pb-24 sm:pt-32 sm:pb-36">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight">
          Stop scrolling job boards.<br />
          <span className="text-muted-foreground">We&apos;ll find the good ones for you.</span>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Upload your CV once. Our AI scans thousands of jobs daily and sends you only the ones that actually fit — scored, ranked, and delivered to your inbox.
        </p>
        <div className="mt-12">
          <Button size="lg" asChild className="text-lg px-8 py-6 h-auto">
            <Link href="/signup">Get Your First Matches Free</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Takes 3 minutes to set up. No credit card needed.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// How It Works Section
// ============================================================================
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Tell us what you're looking for",
      description:
        "Upload your CV and share your ideal roles, locations, and what matters to you. It only takes a few minutes.",
    },
    {
      number: "2",
      title: "We do the searching for you",
      description:
        "Our AI scans job boards every day and scores each opportunity against your profile across 5 key dimensions.",
    },
    {
      number: "3",
      title: "Get matches in your inbox",
      description:
        "Wake up to a curated list of high-scoring jobs. Only the relevant ones — no spam, no noise.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-muted/50">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Set it up once, then let us handle the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-card rounded-xl p-8 h-full border">
                <span className="text-5xl font-semibold text-muted-foreground/30">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
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
  );
}

// ============================================================================
// What Makes Us Different Section
// ============================================================================
function DifferentiatorsSection() {
  const features = [
    {
      title: "Jobs come to you",
      subtitle: "No more hunting",
      description:
        "Stop refreshing job boards. Set up your profile once, and let the right opportunities find their way to you.",
    },
    {
      title: "Truly personalized",
      subtitle: "AI that gets you",
      description:
        "We don't just match keywords. Our AI understands your experience, your goals, and scores every job across 5 dimensions.",
    },
    {
      title: "Quality over quantity",
      subtitle: "Respect for your time",
      description:
        "No spam, no irrelevant listings. You only hear from us when something genuinely matches what you're looking for.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Why Jobfishing?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center md:text-left">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {feature.subtitle}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Testimonials Section
// ============================================================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Product Manager",
      quote:
        "I haven't opened LinkedIn in 3 weeks. Jobfishing found me 4 roles I would have missed — one led to an interview.",
    },
    {
      name: "Marco T.",
      role: "VC Associate",
      quote:
        "I wasn't even actively looking. Then one morning, a 92% match appeared in my inbox. Sometimes the best opportunities find you.",
    },
    {
      name: "Nina K.",
      role: "Business Developer",
      quote:
        "Finally something that respects my time. No noise, no spam — just the jobs that actually matter.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-muted/50">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            People seem to like it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 border"
            >
              <p className="text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      question: "What job boards do you scan?",
      answer:
        "We currently scan LinkedIn, Jobs.ch, and select company career pages. We're continuously adding new sources.",
    },
    {
      question: "Can I pause notifications?",
      answer:
        "Absolutely. You can pause, adjust your score threshold, or change your delivery time anytime in your settings.",
    },
    {
      question: "How is this different from LinkedIn alerts?",
      answer:
        "LinkedIn optimizes for engagement — keeping you scrolling. We optimize for your time — only reaching out when something genuinely matches your profile. No sponsored posts, no noise.",
    },
    {
      question: "How long does setup take?",
      answer:
        "About 3 minutes. Upload your CV, set your preferred roles and locations, choose your notification threshold — done.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            Questions?
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
  );
}

// ============================================================================
// Final CTA Section
// ============================================================================
function FinalCTASection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/50">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
          Ready to stop searching?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Set up your profile in 3 minutes and let us do the work.
        </p>
        <div className="mt-10">
          <Button size="lg" asChild className="text-lg px-8 py-6 h-auto">
            <Link href="/signup">Start Getting Matches</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    </section>
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
            <Link href="/privacy" className="hover:opacity-80 transition-opacity">
              Privacy
            </Link>
            <Link href="/terms" className="hover:opacity-80 transition-opacity">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Jobfishing. All rights reserved.</p>
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
        <HowItWorksSection />
        <DifferentiatorsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
