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
import MultiImageUpload from "@/components/admin/multi-image-upload";
import { useBlogsStore } from "@/store/blogs-store";

export default function BlogFormPage() {
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
    fetchBlogById,
    createBlog,
    updateBlog,
  } = useBlogsStore();

  useEffect(() => {
    if (isNew) {
      resetCurrent();
    } else {
      fetchBlogById(id);
    }
    return () => resetCurrent();
  }, [id, isNew, fetchBlogById, resetCurrent]);

  /* ── AUTO SLUG ── */
  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setCurrent({ title: value, slug });
  };

  /* ── SUBMIT ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success: boolean;

    if (isNew) {
      success = await createBlog();
      if (success) {
        toast.success("Blog created successfully");
        router.push("/admin/blogs");
      } else {
        toast.error(error || "Failed to create blog");
      }
    } else {
      success = await updateBlog(id);
      if (success) {
        toast.success("Blog updated successfully");
        router.push("/admin/blogs");
      } else {
        toast.error(error || "Failed to update blog");
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
        title={isNew ? "Write New Blog" : "Edit Blog"}
        description={
          isNew
            ? "Create a new engineering insight article."
            : `Editing: ${current.title}`
        }
      >
        <button
          onClick={() => router.push("/admin/blogs")}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Blogs
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── BLOG INFO ── */}
        <SectionCard title="Article Information">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Title"
                name="title"
                placeholder="e.g. District Cooling vs Centralized HVAC"
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

            <FormInput
              label="Caption"
              name="caption"
              placeholder="Brief subtitle or excerpt"
              value={current.caption}
              onChange={(e) => setCurrent({ caption: e.target.value })}
              required
            />

            <FormTextarea
              label="Body Content"
              name="body"
              placeholder="Article introduction and summary content..."
              value={current.body}
              onChange={(e) => setCurrent({ body: e.target.value })}
              required
            />
          </div>
        </SectionCard>

        {/* ── STATUS & DATE ── */}
        <SectionCard title="Publishing">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Publish Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrent({ status: "draft" })}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
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
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                    current.status === "published"
                      ? "bg-green-600 text-white"
                      : "border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  Published
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Draft articles are only visible in the admin panel.
              </p>
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Publish Date
              </label>
              <input
                type="date"
                value={current.publishDate}
                onChange={(e) => setCurrent({ publishDate: e.target.value })}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-700 outline-none transition focus:border-[#c0152a] focus:ring-4 focus:ring-red-100"
              />
              <p className="text-xs text-neutral-400">
                When this article should appear as published.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── DETAIL CONTENT ── */}
        <SectionCard title="Full Article Content">
          <FormTextarea
            label="Detail Body"
            name="detailBody"
            placeholder="Full article content shown on the blog detail page. Write the complete article here..."
            value={current.detailBody || ""}
            onChange={(e) => setCurrent({ detailBody: e.target.value })}
            rows={12}
          />
        </SectionCard>

        {/* ── THUMBNAIL ── */}
        <SectionCard title="Featured Image">
          <ImageUpload
            value={current.thumbnail}
            onChange={(url) => setCurrent({ thumbnail: url })}
            label="Blog Thumbnail"
            description="Featured image shown in blog cards — Recommended: 1200×630px"
          />
        </SectionCard>

        {/* ── GALLERY ── */}
        <SectionCard title="Article Images">
          <MultiImageUpload
            value={current.images}
            onChange={(urls) => setCurrent({ images: urls })}
            max={4}
            label="Supporting Images"
          />
          <p className="mt-3 text-xs text-neutral-400">
            Upload up to 4 images to accompany the article. These appear on the
            blog detail page.
          </p>
        </SectionCard>

        {/* ── ACTIONS ── */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
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
                  const success = await createBlog();
                  if (success) {
                    toast.success("Blog saved as draft");
                    router.push("/admin/blogs");
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
              {isNew ? "Publish Blog" : "Save Changes"}
            </SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
