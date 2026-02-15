import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Accordion } from "@/components/ui/Accordion";

// ============================================================================
// Navigation
// ============================================================================
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-sm">
      <nav className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="lg" linkTo="/" />

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-1 text-sm text-charcoal">
              <span className="font-medium">EN</span>
              <span className="text-sand">/</span>
              <span className="text-charcoal/60 hover:text-charcoal cursor-pointer transition-colors">DE</span>
            </div>

            <Link
              href="/login"
              className="text-charcoal hover:text-walnut transition-colors text-sm font-medium"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="hidden sm:inline-flex bg-terracotta text-cream px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors"
            >
              Get Started
            </Link>
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
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-walnut leading-tight">
          Stop scrolling job boards.<br />
          <span className="text-terracotta">We&apos;ll find the good ones for you.</span>
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-charcoal leading-relaxed max-w-2xl mx-auto">
          Upload your CV once. Our AI scans thousands of jobs daily and sends you only the ones that actually fit — scored, ranked, and delivered to your inbox.
        </p>
        <div className="mt-12">
          <Link
            href="/signup"
            className="inline-flex bg-terracotta text-cream px-8 py-4 rounded-xl text-lg font-medium hover:bg-terracotta-dark transition-colors"
          >
            Get Your First Matches Free
          </Link>
          <p className="mt-4 text-sm text-charcoal/60">
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
    <section id="how-it-works" className="py-20 sm:py-28 bg-beige">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-walnut">
            How It Works
          </h2>
          <p className="mt-4 text-charcoal/80 max-w-xl mx-auto">
            Set it up once, then let us handle the rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-cream rounded-2xl p-8 h-full">
                <span className="font-serif text-5xl text-terracotta/30">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-walnut">
                  {step.title}
                </h3>
                <p className="mt-3 text-charcoal leading-relaxed">
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
          <h2 className="font-serif text-3xl sm:text-4xl text-walnut">
            Why Jobfishing?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center md:text-left">
              <p className="text-sm font-medium text-terracotta uppercase tracking-wide">
                {feature.subtitle}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-walnut">
                {feature.title}
              </h3>
              <p className="mt-3 text-charcoal leading-relaxed">
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
    <section className="py-20 sm:py-28 bg-beige">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-walnut">
            People seem to like it
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-cream rounded-2xl p-8"
            >
              <p className="text-charcoal leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-sand">
                <p className="font-medium text-walnut">{testimonial.name}</p>
                <p className="text-sm text-charcoal/60">{testimonial.role}</p>
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
          <h2 className="font-serif text-3xl sm:text-4xl text-walnut">
            Questions?
          </h2>
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}

// ============================================================================
// Final CTA Section
// ============================================================================
function FinalCTASection() {
  return (
    <section className="py-24 sm:py-32 bg-beige">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-walnut">
          Ready to stop searching?
        </h2>
        <p className="mt-6 text-lg text-charcoal">
          Set up your profile in 3 minutes and let us do the work.
        </p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-flex bg-terracotta text-cream px-8 py-4 rounded-xl text-lg font-medium hover:bg-terracotta-dark transition-colors"
          >
            Start Getting Matches
          </Link>
          <p className="mt-4 text-sm text-charcoal/60">
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
    <footer className="bg-walnut text-cream/80">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="md" linkTo="/" variant="light" />

          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-cream transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-cream transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-cream/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Jobfishing. All rights reserved.</p>
          <p className="text-cream/60">Made with care in Zurich</p>
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
    <div className="min-h-screen flex flex-col bg-cream">
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
