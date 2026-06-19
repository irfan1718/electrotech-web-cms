"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import SectionCard from "@/components/admin/section-card";
import FormInput from "@/components/admin/form-input";
import FormTextarea from "@/components/admin/form-textarea";
import SubmitButton from "@/components/admin/submit-button";
import { useCareersStore } from "@/store/careers-store";

const LOCATIONS = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
  "Remote",
];

export default function CareerFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const {
    current,
    loading,
    fetching,
    error,
    setCurrent,
    resetCurrent,
    fetchCareerById,
    createCareer,
    updateCareer,
  } = useCareersStore();

  useEffect(() => {
    if (isNew) {
      resetCurrent();
    } else {
      fetchCareerById(id);
    }
    return () => resetCurrent();
  }, [id, isNew, fetchCareerById, resetCurrent]);

  /* ── SUBMIT ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success: boolean;

    if (isNew) {
      success = await createCareer();
      if (success) {
        toast.success("Job posted successfully");
        router.push("/admin/careers");
      } else {
        toast.error(error || "Failed to post job");
      }
    } else {
      success = await updateCareer(id);
      if (success) {
        toast.success("Job updated successfully");
        router.push("/admin/careers");
      } else {
        toast.error(error || "Failed to update job");
      }
    }
  };

  if (!isNew && fetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#c0152a]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={isNew ? "Post New Job" : "Edit Job Listing"}
        description={
          isNew
            ? "Create a new career opportunity listing."
            : `Editing: ${current.title}`
        }
      >
        <button
          onClick={() => router.push("/admin/careers")}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Careers
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── JOB INFO ── */}
        <SectionCard title="Job Information">
          <div className="space-y-5">
            <FormInput
              label="Job Title"
              name="title"
              placeholder="e.g. Senior HVAC Design Engineer"
              value={current.title}
              onChange={(e) => setCurrent({ title: e.target.value })}
              required
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Location select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Location
                </label>
                <select
                  value={current.location}
                  onChange={(e) => setCurrent({ location: e.target.value })}
                  required
                  className="h-12 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none transition focus:border-[#c0152a] focus:ring-4 focus:ring-red-100"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrent({ status: "open" })}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                      current.status === "open"
                        ? "bg-green-600 text-white"
                        : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        current.status === "open" ? "bg-white" : "bg-green-500"
                      }`}
                    />
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrent({ status: "closed" })}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                      current.status === "closed"
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        current.status === "closed" ? "bg-white" : "bg-red-500"
                      }`}
                    />
                    Closed
                  </button>
                </div>
              </div>
            </div>

            <FormInput
              label="Caption"
              name="caption"
              placeholder="Brief summary — e.g. 8+ years experience, full-time position"
              value={current.caption}
              onChange={(e) => setCurrent({ caption: e.target.value })}
              required
            />
          </div>
        </SectionCard>

        {/* ── JOB DESCRIPTION ── */}
        <SectionCard title="Job Description">
          <FormTextarea
            label="Full Description"
            name="description"
            placeholder="Detailed job description — responsibilities, requirements, qualifications, benefits..."
            value={current.description}
            onChange={(e) => setCurrent({ description: e.target.value })}
            required
            rows={10}
          />
          <p className="mt-3 text-xs text-neutral-400">
            This content appears on the careers page when candidates view the
            full job listing.
          </p>
        </SectionCard>

        {/* ── ACTIONS ── */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <button
            type="button"
            onClick={() => router.push("/admin/careers")}
            className="text-[15px] font-bold text-neutral-600 hover:text-neutral-700"
          >
            Cancel
          </button>
          <SubmitButton type="submit" loading={loading}>
            {isNew ? "Post Job" : "Save Changes"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
