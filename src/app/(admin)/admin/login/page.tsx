'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  CircleAlert,
} from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Login successful')

      setTimeout(() => {
        router.push('/admin/dashboard')
        router.refresh()
      }, 1000)
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ═══════════════════════════════
          LEFT PANEL — ENGINEERING VISUAL
          ═══════════════════════════════ */}
      <div className="relative hidden overflow-hidden bg-[#0A0A0A] lg:flex lg:flex-col lg:justify-end lg:p-14">
        {/* Background image */}
        <img
          src="/images/login-bg.png"
          alt="Engineering infrastructure"
          className="absolute inset-0 h-full w-full object-cover animate-[slowZoom_25s_ease-in-out_infinite_alternate]"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/70 via-55% to-[#0A0A0A]/30" />

        {/* Engineering grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(192,21,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(192,21,42,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 40%, black 70%, transparent 100%)",
          }}
        />

        {/* Red accent line */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#C0152A] to-transparent opacity-50" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(192,21,42,0.15)_0%,transparent_70%)] animate-[float_8s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute -left-20 bottom-[20%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(192,21,42,0.1)_0%,transparent_70%)] animate-[float_10s_ease-in-out_2s_infinite]" />

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-8 lg:px-14">
          <div className="flex items-center gap-3.5">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-xl">
              <Image
                src="/images/logo-electrotech.png"
                alt="Electrotech"
                width={28}
                height={28}
                className="h-auto w-[28px] object-contain"
              />
            </div>
            <span className="text-[16px] font-extrabold tracking-[0.04em] text-white/85">
              ELECTRO<span className="text-[#C0152A]">TECH</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
              Secure Admin Portal
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-[600px]">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-[2px] w-12 bg-[#C0152A]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C0152A]">
              Administration Portal
            </span>
          </div>

          <h1 className="mb-5 text-[52px] font-black leading-[1.05] tracking-tight text-white">
            Engineering <span className="text-[#C0152A]">Excellence,</span>
            <span
              className="mt-1 block text-[56px]"
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                color: "transparent",
              }}
            >
              Powering the Future.
            </span>
          </h1>

          <p className="mb-12 max-w-[480px] text-[16px] leading-[1.75] text-white/50">
            Access the Electrotech command center. Manage projects, teams, and
            infrastructure across the UAE from a single unified dashboard.
          </p>

          {/* Trust cards */}
          <div className="flex gap-1.5">
            {[
              { val: "500", sup: "+", label: "Projects" },
              { val: "20", sup: "+", label: "Years" },
              { val: "200", sup: "+", label: "Engineers" },
              { val: "7", sup: "", label: "Emirates" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-5 text-center backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[#C0152A]/20 hover:bg-white/[0.07]"
              >
                <p className="text-[28px] font-black leading-none tracking-tight text-white">
                  {item.val}
                  {item.sup && (
                    <sup className="text-[16px] font-bold text-[#C0152A]">
                      {item.sup}
                    </sup>
                  )}
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════
          RIGHT PANEL — LOGIN FORM
          ═══════════════════════════════ */}
      <div className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-10 sm:px-12">
        {/* Background textures */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            maskImage:
              "radial-gradient(circle at center, black 0%, transparent 80%)",
          }}
        />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(192,21,42,0.04)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-36 -left-36 h-[400px] w-[400px] bg-[radial-gradient(circle,rgba(192,21,42,0.03)_0%,transparent_65%)]" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-9 flex flex-col items-center lg:hidden">
            <Image
              src="/images/logo-electrotech.png"
              alt="Electrotech"
              width={56}
              height={56}
              className="mb-3 h-auto w-[56px] object-contain"
            />
            <p className="text-xl font-extrabold tracking-[0.04em] text-[#1A1D23]">
              ELECTRO<span className="text-[#C0152A]">TECH</span>
            </p>
          </div>

          {/* Back */}

          <a
            href="/"
            className="group mb-12 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 transition hover:text-[#C0152A]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Website
          </a>

          {/* Header */}
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-6 bg-[#C0152A]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C0152A]">
                Secure Access
              </span>
            </div>
            <h2 className="mb-2.5 text-[34px] font-black leading-tight tracking-tight text-[#1A1D23]">
              Welcome Back
            </h2>
            <p className="text-[14px] leading-[1.7] text-neutral-400">
              Sign in to access the Electrotech administration dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 border-l-[3px] border-l-[#C0152A] bg-[#FFF5F6] px-4 py-3.5 animate-[shake_0.4s_ease]">
              <CircleAlert className="h-[18px] w-[18px] shrink-0 text-[#C0152A]" />
              <span className="text-[13px] font-medium text-[#960F20]">
                {error}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-300 transition peer-focus:text-[#C0152A]" />
                <input
                  type="email"
                  placeholder="admin@electrotech-uae.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || success}
                  className="peer h-14 w-full rounded-2xl border-[1.5px] border-neutral-100 bg-white pl-[52px] pr-5 text-[14px] text-[#1A1D23] shadow-[0_1px_3px_rgba(0,0,0,0.02)] outline-none transition placeholder:text-neutral-300 hover:border-neutral-200 focus:border-[#C0152A] focus:shadow-[0_0_0_4px_rgba(192,21,42,0.06)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-[18px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-300 transition peer-focus:text-[#C0152A]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  className="peer h-14 w-full rounded-2xl border-[1.5px] border-neutral-100 bg-white pl-[52px] pr-14 text-[14px] text-[#1A1D23] shadow-[0_1px_3px_rgba(0,0,0,0.02)] outline-none transition placeholder:text-neutral-300 hover:border-neutral-200 focus:border-[#C0152A] focus:shadow-[0_0_0_4px_rgba(192,21,42,0.06)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-300 transition hover:text-neutral-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`group relative mt-2 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-all ${
                success
                  ? "bg-green-600 shadow-[0_4px_24px_rgba(22,163,74,0.25)]"
                  : "bg-[#C0152A] shadow-[0_4px_24px_rgba(192,21,42,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(192,21,42,0.35)]"
              }`}
            >
              {!success && (
                <span className="absolute inset-0 origin-left scale-x-0 bg-[#960F20] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              )}

              {loading ? (
                <span className="relative z-10 h-5 w-5 animate-spin rounded-full border-[2.5px] border-white/30 border-t-white" />
              ) : success ? (
                <span className="relative z-10 flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5" />
                  Access Granted
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-3">
                  Sign In to Dashboard
                  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-neutral-100 bg-neutral-50 px-5 py-2">
              <Shield className="h-3.5 w-3.5 text-neutral-300" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
                256-Bit Encrypted
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              © 2025 Electrotech Electromechanical LLC · UAE
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}