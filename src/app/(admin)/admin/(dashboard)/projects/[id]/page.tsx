"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, X } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import SectionCard from "@/components/admin/section-card";
import FormInput from "@/components/admin/form-input";
import FormTextarea from "@/components/admin/form-textarea";
import SubmitButton from "@/components/admin/submit-button";
import ImageUpload from "@/components/admin/image-upload";
import MultiImageUpload from "@/components/admin/multi-image-upload";
import { useProjectsStore, ProjectData } from "@/store/projects-store";

const CATEGORIES = [
  "Commercial",
  "Residential",
  "Hospitality",
  "Healthcare",
  "Industrial",
  "Infrastructure",
  "Government",
  "Education",
];

const PROJECT_STATUSES = [
  { value: "awarded", label: "Awarded", color: "bg-blue-500" },
  { value: "in-progress", label: "In Progress", color: "bg-amber-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
];

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [tagInput, setTagInput] = useState("");

  const {
    current,
    loading,
    fetching,
    error,
    setCurrent,
    resetCurrent,
    fetchProjectById,
    createProject,
    updateProject,
  } = useProjectsStore();

  useEffect(() => {
    if (isNew) {
      resetCurrent();
    } else {
      fetchProjectById(id);
    }
    return () => resetCurrent();
  }, [id, isNew, fetchProjectById, resetCurrent]);

  /* ── AUTO SLUG ── */
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setCurrent({ title: value, slug });
  };

  /* ── TAGS ── */
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !(current.tags || []).includes(tag)) {
      setCurrent({
        tags: [...(current.tags || []), tag],
      });
    }
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setCurrent({ tags: (current.tags || []).filter((_, i) => i !== index) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && tagInput === "" && (current.tags || []).length > 0) {
      removeTag((current.tags || []).length - 1);
    }
  };

  /* ── SUBMIT ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success: boolean;

    if (isNew) {
      success = await createProject();
      if (success) {
        toast.success("Project created successfully");
        router.push("/admin/projects");
      } else {
        toast.error(error || "Failed to create project");
      }
    } else {
      success = await updateProject(id);
      if (success) {
        toast.success("Project updated successfully");
        router.push("/admin/projects");
      } else {
        toast.error(error || "Failed to update project");
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
        title={isNew ? "Add New Project" : "Edit Project"}
        description={
          isNew
            ? "Create a new MEP project entry."
            : `Editing: ${current.title}`
        }
      >
        <button
          onClick={() => router.push("/admin/projects")}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── PROJECT INFO ── */}
        <SectionCard title="Project Information">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Title"
                name="title"
                placeholder="e.g. Al Barsha Commercial Complex"
                value={current.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
              <FormInput
                label="Slug"
                name="slug"
                placeholder="auto-generated-from-title"
                value={current.slug}
                onChange={(e) => setCurrent({ slug: e.target.value })}
                required
                disabled
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Category select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Category
                </label>
                <select
                  value={current.category}
                  onChange={(e) => setCurrent({ category: e.target.value })}
                  className="h-12 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none transition focus:border-[#c0152a] focus:ring-4 focus:ring-red-100"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <FormInput
                label="Location"
                name="location"
                placeholder="e.g. Dubai, UAE"
                value={current.location}
                onChange={(e) => setCurrent({ location: e.target.value })}
              />
            </div>

            <FormInput
              label="Caption"
              name="caption"
              placeholder="Brief one-line project description"
              value={current.caption}
              onChange={(e) => setCurrent({ caption: e.target.value })}
              required
            />

            <FormTextarea
              label="Body Content"
              name="body"
              placeholder="Overview — scope, systems installed, key highlights..."
              value={current.body}
              onChange={(e) => setCurrent({ body: e.target.value })}
              required
            />
          </div>
        </SectionCard>

        {/* ── TAGS ── */}
        <SectionCard title="Tags">
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Project Tags
            </label>

            {/* Tag chips */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3">
              {(current.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-neutral-400 transition hover:text-[#c0152a]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder={
                  (current.tags || []).length === 0
                    ? "Type a tag and press Enter..."
                    : "Add more..."
                }
                className="min-w-[150px] flex-1 border-none bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>

            <p className="text-xs text-neutral-400">
              Press Enter to add. Examples: HVAC, Electrical, Fire Fighting,
              BMS, Full MEP
            </p>

            {/* Quick-add common tags */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "HVAC",
                "Electrical",
                "Plumbing",
                "Fire Fighting",
                "ELV",
                "BMS",
                "Full MEP",
                "Testing & Commissioning",
              ]
                .filter((t) => !(current.tags || []).includes(t))
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCurrent({ tags: [...(current.tags || []), tag] })}
                    className="rounded-lg border border-dashed border-neutral-200 px-2.5 py-1 text-[13px] font-semibold text-neutral-500 transition hover:border-[#c0152a] hover:bg-red-50 hover:text-[#c0152a]"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>
        </SectionCard>

        {/* ── STATUS ── */}
        <SectionCard title="Status">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Project Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Project Status
              </label>
              <div className="flex gap-2">
                {PROJECT_STATUSES.map((ps) => (
                  <button
                    key={ps.value}
                    type="button"
                    onClick={() =>
                      setCurrent({
                        projectStatus: ps.value as ProjectData["projectStatus"],
                      })
                    }
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      current.projectStatus === ps.value
                        ? "bg-neutral-900 text-white"
                        : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        current.projectStatus === ps.value
                          ? "bg-white"
                          : ps.color
                      }`}
                    />
                    {ps.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Publish Visibility */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Website Visibility
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrent({ status: "draft" })}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    current.status === "draft"
                      ? "bg-neutral-900 text-white"
                      : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setCurrent({ status: "published" })}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    current.status === "published"
                      ? "bg-green-600 text-white"
                      : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Published
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Draft = admin only. Published = visible on website.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── DETAIL PAGE ── */}
        <SectionCard title="Detail Page Content">
          <FormTextarea
            label="Detail Body"
            name="detailBody"
            placeholder="Extended content — technical specs, challenges, outcomes..."
            value={current.detailBody || ""}
            onChange={(e) => setCurrent({ detailBody: e.target.value })}
            rows={8}
          />
        </SectionCard>

        {/* ── THUMBNAIL ── */}
        <SectionCard title="Thumbnail Image">
          <ImageUpload
            value={current.thumbnail}
            onChange={(url) => setCurrent({ thumbnail: url })}
            label="Project Thumbnail"
            description="Main image shown in project cards — Recommended: 800×600px"
          />
        </SectionCard>

        {/* ── GALLERY ── */}
        <SectionCard title="Project Gallery">
          <MultiImageUpload
            value={current.images}
            onChange={(urls) => setCurrent({ images: urls })}
            max={4}
            label="Gallery Images"
          />
          <p className="mt-3 text-xs text-neutral-400">
            Upload up to 4 images. These appear on the project detail page.
          </p>
        </SectionCard>

        {/* ── ACTIONS ── */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            className="text-[15px] font-bold text-neutral-600 hover:text-neutral-700"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {isNew && (
              <button
                type="button"
                onClick={async () => {
                  setCurrent({ status: "draft" });
                  const success = await createProject();
                  if (success) {
                    toast.success("Project saved as draft");
                    router.push("/admin/projects");
                  } else {
                    toast.error(error || "Failed to save");
                  }
                }}
                className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
              >
                Save as Draft
              </button>
            )}

            <SubmitButton type="submit" loading={loading}>
              {isNew ? "Create Project" : "Save Changes"}
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
