import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Job Radar",
  description: "Terms of service for Job Radar - AI-powered job matching",
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

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-slate-500 mb-8">Last updated: February 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Operator
              </h2>
              <p className="text-slate-600 leading-relaxed">
                This web application is operated as a private, non-commercial project
                under the name Job Radar. For inquiries, please contact:{" "}
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
                2. Scope
              </h2>
              <p className="text-slate-600 leading-relaxed">
                These terms of service govern the use of the Job Radar web application
                and all features provided through it. By using this application, you
                agree to these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Service Description
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Job Radar is a web application that uses AI to match users with
                relevant job opportunities based on their profile, skills, and
                preferences. Features may be modified, expanded, or discontinued at any
                time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Registration and Use
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Access to certain features requires registration. You may sign in using
                an external authentication service (e.g., Google OAuth).
              </p>
              <p className="text-slate-600 leading-relaxed mb-2">
                Users agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 mb-4 space-y-1">
                <li>Provide accurate information</li>
                <li>Not misuse the application</li>
                <li>Not store illegal or harmful content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. User Content
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                All content created by users remains the property of the respective
                users.
              </p>
              <p className="text-slate-600 leading-relaxed">
                By using the application, you grant the operator the technically
                necessary rights to store, process, and display your content in order
                to provide the application&apos;s functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Availability
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                There is no guarantee of permanent availability of the application.
              </p>
              <p className="text-slate-600 leading-relaxed mb-2">
                The operator strives for reliable operation but does not guarantee:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Uninterrupted access</li>
                <li>Error-free operation</li>
                <li>Data availability at all times</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Liability
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Use of the application is at your own risk.
              </p>
              <p className="text-slate-600 leading-relaxed">
                The operator is only liable for damages resulting from intentional or
                grossly negligent conduct. Liability for indirect damages, data loss,
                or lost profits is excluded to the extent permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                8. Service Discontinuation
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The operator reserves the right to discontinue operation of the
                application in whole or in part at any time. There is no entitlement to
                continued operation or data retention.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-slate-600 leading-relaxed">
                These terms of service may be updated at any time. The version in
                effect at the time of use applies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                10. Governing Law
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Swiss law applies exclusively, excluding conflict of law provisions.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
