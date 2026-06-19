"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import PageHeader from "@/components/admin/page-header";
import SectionCard from "@/components/admin/section-card";
import FormInput from "@/components/admin/form-input";
import FormTextarea from "@/components/admin/form-textarea";
import SubmitButton from "@/components/admin/submit-button";

import { useAboutStore } from "@/store/about-store";

export default function AboutPage() {
  const {
    about,
    loading,
    fetching,
    error,

    setAbout,
    fetchAbout,
    updateAbout,
  } = useAboutStore();

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateAbout();

    if (success) {
      toast.success("About content updated successfully");
    } else {
      toast.error(error || "Failed to update content");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      <PageHeader
        title="About Us"
        description="Manage company introduction and corporate information."
      />

      <SectionCard title="Company Information">
        {fetching ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#c0152a]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <FormInput
              label="Title"
              name="title"
              placeholder="Enter title"
              value={about.title}
              onChange={(e) =>
                setAbout({
                  title: e.target.value,
                })
              }
            />

            {/* CAPTION */}
            <FormInput
              label="Caption"
              name="caption"
              placeholder="Enter caption"
              value={about.caption}
              onChange={(e) =>
                setAbout({
                  caption: e.target.value,
                })
              }
            />

            {/* BODY */}
            <FormTextarea
              label="Body Content"
              name="body"
              placeholder="Enter detailed company description..."
              value={about.body}
              onChange={(e) =>
                setAbout({
                  body: e.target.value,
                })
              }
            />

            {/* ACTION */}
            <div className="flex justify-end">
              <SubmitButton type="submit" loading={loading}>Save Changes</SubmitButton>
            </div>
          </form>
        )}
      </SectionCard>
    </div>
  );
}
