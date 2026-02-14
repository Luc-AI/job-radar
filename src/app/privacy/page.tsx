import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Job Radar",
  description: "Privacy policy for Job Radar - AI-powered job matching",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo size="md" linkTo="/" />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="font-semibold text-white">Job Radar</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Job Radar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-8">Last updated: February 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Data Controller
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Job Radar is a private, non-commercial web project. For privacy-related
                inquiries, please contact us at:{" "}
                <a
                  href="mailto:privacy@job-radar.app"
                  className="text-slate-900 underline"
                >
                  privacy@job-radar.app
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Purpose of Data Processing
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Job Radar is a web application that helps users discover relevant job
                opportunities through AI-powered matching. To provide personalized job
                recommendations, certain user data is collected and processed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Google OAuth Authentication
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Users may optionally sign in using Google OAuth. When using Google
                authentication, the following personal data is transmitted from Google
                to our application:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                <li>Email address</li>
                <li>Display name</li>
                <li>Unique Google User ID</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-2">
                This data is used exclusively for:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                <li>Authenticating users</li>
                <li>Providing a personalized user account</li>
                <li>Associating stored content with user accounts</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Your data is never shared with third parties or used for advertising
                purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Data We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The following data may be stored during your use of the application:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                <li>User account information (email address, user ID)</li>
                <li>Profile data (job preferences, skills, target roles)</li>
                <li>Uploaded documents (CV/resume)</li>
                <li>User-generated content (saved jobs, preferences)</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                All data is used solely to provide and improve the application&apos;s
                functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Hosting and Infrastructure
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The application is hosted using cloud infrastructure services. This may
                involve processing personal data on servers located outside of your
                country of residence. Our infrastructure providers adhere to recognized
                data protection and security standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Cookies
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This application uses only technically necessary cookies required for
                the authentication process and application operation. We do not use
                analytics, tracking, or marketing cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                <li>Request information about your stored personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@job-radar.app"
                  className="text-slate-900 underline"
                >
                  privacy@job-radar.app
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This privacy policy may be updated to reflect changes in app
                functionality or legal requirements. The current version will always be
                available on this page.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
