"use client";

import { useState, useRef } from "react";
import { Upload, Send, Loader2, CheckCircle, X, FileText } from "lucide-react";

interface Props {
  positions: string[];
}

export default function CareerApplyForm({ positions }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    coverNote: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB");
      return;
    }

    setError("");
    setCv(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cv) {
      setError("Please upload your CV");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("position", form.position || "General Application");
      formData.append("coverNote", form.coverNote);
      formData.append("cv", cv);

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setForm({
          name: "",
          email: "",
          phone: "",
          position: "",
          coverNote: "",
        });
        setCv(null);
        if (fileRef.current) fileRef.current.value = "";
        setShowSuccess(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-neutral-700 outline-none transition placeholder:text-neutral-400 focus:border-[#C0152A] focus:ring-4 focus:ring-red-50";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
              Email *
            </label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
              Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="+971 50 000 0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
              Position
            </label>
            <select
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              disabled={loading}
              className={inputClass}
            >
              <option value="">General Application</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
            Cover Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Brief introduction about yourself..."
            value={form.coverNote}
            onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
            disabled={loading}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* CV Upload */}
        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
            Upload CV (PDF only) *
          </label>

          {cv ? (
            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-[14px] font-semibold text-neutral-700">
                    {cv.name}
                  </p>
                  <p className="text-[12px] text-neutral-400">
                    {(cv.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCv(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-neutral-400 transition hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-200 py-8 text-[14px] font-medium text-neutral-400 transition hover:border-[#C0152A]/30 hover:bg-red-50/30 hover:text-neutral-600"
            >
              <Upload className="h-5 w-5" />
              Click to upload your CV (PDF, max 10MB)
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#C0152A] py-4 text-[15px] font-bold uppercase tracking-wider text-white transition hover:bg-[#960F20] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" /> Submit Application
            </>
          )}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-1 bg-[#C0152A]" />
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute right-4 top-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="px-8 pb-8 pt-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#080808]">
                Application Submitted!
              </h3>
              <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-relaxed text-neutral-500">
                Thank you for your interest in joining Electrotech. We&apos;ll
                review your application and get back to you soon.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-6 w-full rounded-xl bg-[#080808] py-3.5 text-[14px] font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
