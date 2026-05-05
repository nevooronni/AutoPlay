import Link from "next/link";
import {
  Zap,
  FileText,
  Mail,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AutoApply
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-6">
          <Zap className="h-3.5 w-3.5" />
          AI-Powered Job Applications
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
          Apply to jobs{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            automatically
          </span>
        </h2>
        <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
          Upload your resume, paste a job description, and let AutoApply
          generate tailored cover letters, fill out forms, and send
          applications — all in one click.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            Start Applying
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="text-slate-300 hover:text-white px-6 py-3 border border-slate-700 hover:border-slate-600 rounded-xl transition-all"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold">Everything you need to land jobs faster</h3>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            From resume tailoring to automated submissions, AutoApply handles
            the grunt work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Smart Resume Tailoring"
            description="Automatically adjust your resume to match each job description and pass ATS filters."
          />
          <FeatureCard
            icon={<Mail className="h-6 w-6" />}
            title="Cover Letter Generation"
            description="AI-written cover letters and emails that match the job requirements and your experience."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Auto-Fill & Submit"
            description="Automatically fill web forms or send application emails with a single click."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Application Tracking"
            description="Track every application from draft to interview with a Kanban-style board."
          />
          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="Review Before Sending"
            description="Preview your tailored resume, cover letter, and application before it goes out."
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Multiple Resumes"
            description="Store and manage multiple resumes for different roles and industries."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} AutoApply. Built by Neville Oronni.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
