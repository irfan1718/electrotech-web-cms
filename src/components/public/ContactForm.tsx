'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle, X } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setShowSuccess(true)
      } else {
        toast.error(data.error || 'Failed to send message')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-[#C0152A] focus:ring-4 focus:ring-red-50'

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Full Name *</label>
            <input
              type="text" required placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading} className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Email *</label>
            <input
              type="email" required placeholder="john@company.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading} className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Phone</label>
            <input
              type="tel" placeholder="+971 50 000 0000"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading} className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Subject *</label>
            <input
              type="text" required placeholder="Project Inquiry"
              value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              disabled={loading} className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Message *</label>
          <textarea
            required rows={5} placeholder="Tell us about your project requirements..."
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={loading} className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#C0152A] py-4 text-[13px] font-bold uppercase tracking-wider text-white transition hover:bg-[#960F20] disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Sending...</>
          ) : (
            <><Send className="h-5 w-5" /> Send Message</>
          )}
        </button>
      </form>

      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl animate-in">
            {/* Red top bar */}
            <div className="h-1 bg-[#C0152A]" />

            {/* Close */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute right-4 top-5 text-neutral-400 transition hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="px-8 pb-8 pt-8 text-center">
              {/* Success icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>

              <h3 className="text-xl font-extrabold text-[#080808]">
                Message Sent Successfully!
              </h3>

              <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-relaxed text-neutral-600">
                Thank you for reaching out. We&apos;ll review your inquiry and contact you shortly.
              </p>

              {/* Divider */}
              <div className="mx-auto my-6 h-px w-16 bg-neutral-100" />

              {/* Contact info */}
              <p className="text-xs text-neutral-400">
                For urgent inquiries, call us directly
              </p>
              
                <a href="tel:+97165445300"
                className="mt-1 inline-block text-sm font-bold text-[#C0152A] transition hover:underline"
              >
                +971 6 544 5300
              </a>

              {/* Close button */}
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-6 w-full rounded-xl bg-[#080808] py-3.5 text-[13px] font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800"
              >
                Close
              </button>
            </div>

            <style jsx>{`
              @keyframes animateIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              .animate-in {
                animation: animateIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  )
}