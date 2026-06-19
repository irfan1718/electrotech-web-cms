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
import ImageUpload from "@/components/admin/image-upload";
import { useTeamStore } from "@/store/team-store";

export default function TeamFormPage() {
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
    fetchMemberById,
    createMember,
    updateMember,
  } = useTeamStore();

  useEffect(() => {
    if (isNew) {
      resetCurrent();
    } else {
      fetchMemberById(id);
    }
    return () => resetCurrent();
  }, [id, isNew, fetchMemberById, resetCurrent]);

  /* ── SUBMIT ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success: boolean;

    if (isNew) {
      success = await createMember();
      if (success) {
        toast.success("Team member added successfully");
        router.push("/admin/team");
      } else {
        toast.error(error || "Failed to add team member");
      }
    } else {
      success = await updateMember(id);
      if (success) {
        toast.success("Team member updated successfully");
        router.push("/admin/team");
      } else {
        toast.error(error || "Failed to update team member");
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

  /* ── INITIALS PREVIEW ── */
  const initials = current.name
    ? current.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="space-y-8">
      <PageHeader
        title={isNew ? "Add Team Member" : "Edit Team Member"}
        description={
          isNew
            ? "Add a new member to the leadership team."
            : `Editing: ${current.name}`
        }
      >
        <button
          onClick={() => router.push("/admin/team")}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Team
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── PROFILE PHOTO ── */}
        <SectionCard title="Profile Photo">
          <div className="flex items-start gap-8">
            {/* Preview */}
            <div className="flex flex-col items-center gap-2">
              {current.profileImage ? (
                <img
                  src={current.profileImage}
                  alt={current.name || "Profile"}
                  className="h-24 w-24 rounded-full border-2 border-neutral-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-[#c0152a]">
                  {initials}
                </div>
              )}
              <p className="text-[11px] text-neutral-400">Preview</p>
            </div>

            {/* Upload */}
            <div className="flex-1">
              <ImageUpload
                value={current.profileImage}
                onChange={(url) => setCurrent({ profileImage: url })}
                label="Upload Photo"
                description="Square photo recommended — 400×400px — JPG, PNG, WebP"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── MEMBER INFO ── */}
        <SectionCard title="Member Information">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="e.g. Ahmed Al Mansouri"
                value={current.name}
                onChange={(e) => setCurrent({ name: e.target.value })}
                required
              />
              <FormInput
                label="Designation"
                name="designation"
                placeholder="e.g. Managing Director"
                value={current.designation}
                onChange={(e) => setCurrent({ designation: e.target.value })}
                required
              />
            </div>

            <FormTextarea
              label="Bio / Caption"
              name="caption"
              placeholder="Brief professional bio — experience, expertise, certifications..."
              value={current.caption}
              onChange={(e) => setCurrent({ caption: e.target.value })}
              required
              rows={4}
            />

            <FormInput
              label="Display Order"
              name="order"
              type="number"
              placeholder="0"
              value={String(current.order)}
              onChange={(e) =>
                setCurrent({ order: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-neutral-400">
              Lower numbers appear first. Use 1 for CEO, 2 for CTO, etc.
            </p>
          </div>
        </SectionCard>

        {/* ── ACTIONS ── */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <button
            type="button"
            onClick={() => router.push("/admin/team")}
            className="text-[15px] font-bold text-neutral-600 hover:text-neutral-700"
          >
            Cancel
          </button>
          <SubmitButton type="submit" loading={loading}>
            {isNew ? "Add Member" : "Save Changes"}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
