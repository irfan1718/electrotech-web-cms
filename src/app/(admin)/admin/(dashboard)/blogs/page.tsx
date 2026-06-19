"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, ImageIcon, Calendar } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import DataTable, { Column } from "@/components/admin/data-table";
import ActionButtons from "@/components/admin/action-buttons";
import StatusBadge from "@/components/admin/status-badge";
import DeleteModal from "@/components/admin/delete-modal";
import { useBlogsStore, BlogData } from "@/store/blogs-store";
import { useAdminStore } from "@/store/adminStore";

export default function BlogsPage() {
  const router = useRouter();
  const { blogs, fetching, fetchBlogs, deleteBlog } = useBlogsStore();
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* ── FILTERS ── */
  const filters = [
    { label: "All", value: "all", count: blogs.length },
    {
      label: "Published",
      value: "published",
      count: blogs.filter((b) => b.status === "published").length,
    },
    {
      label: "Draft",
      value: "draft",
      count: blogs.filter((b) => b.status === "draft").length,
    },
  ];

  /* ── FORMAT DATE ── */
  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* ── COLUMNS ── */
  const columns: Column<BlogData>[] = [
    {
      key: "title",
      label: "Article",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
              className="h-10 w-14 shrink-0 rounded-lg border border-neutral-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50">
              <ImageIcon className="h-5 w-5 text-neutral-300" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {row.title}
            </p>
            <p className="text-xs text-neutral-400">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "caption",
      label: "Caption",
      className: "max-w-[200px]",
      render: (row) => (
        <p className="truncate text-sm text-neutral-500">{row.caption}</p>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "publishDate",
      label: "Publish Date",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
          {row.status === "published" ? formatDate(row.publishDate) : "—"}
        </div>
      ),
    },
    {
      key: "images",
      label: "Images",
      headerClass: "text-center",
      className: "text-center",
      render: (row) => (
        <span className="text-sm text-neutral-500">
          <span
            className={
              row.images?.length > 0 ? "font-semibold text-neutral-700" : ""
            }
          >
            {row.images?.length || 0}
          </span>
          <span className="text-neutral-300"> / 4</span>
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headerClass: "text-right",
      className: "text-right",
      render: (row) => (
        <ActionButtons
          onView={() => window.open(`/blogs/${row.slug}`, "_blank")}
          onEdit={() => router.push(`/admin/blogs/${row._id}`)}
          onDelete={() => openDeleteModal(row._id!, row.title, "Blog")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Blogs"
        description="Manage engineering insight articles and company news."
      >
        <button
          onClick={() => router.push("/admin/blogs/new")}
          className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a31224]"
        >
          <Plus className="h-5 w-5" />
          Write New Blog
        </button>
      </PageHeader>

      <DataTable
        data={blogs}
        columns={columns}
        loading={fetching}
        title="All Articles"
        searchable
        searchPlaceholder="Search articles..."
        searchKeys={["title", "caption"]}
        filters={filters}
        filterField="status"
        paginated
        pageSize={10}
        emptyTitle="No blog articles yet"
        emptyAction={
          <button
            onClick={() => router.push("/admin/blogs/new")}
            className="mt-2 text-sm font-medium text-[#c0152a] hover:underline"
          >
            + Write your first article
          </button>
        }
      />

      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title}
        module={deleteModal?.module}
        loading={fetching}
        onClose={closeDeleteModal}
        onConfirm={async () => {
          if (!deleteModal) return;
          const success = await deleteBlog(deleteModal.id);
          if (success) {
            toast.success(`"${deleteModal.title}" deleted successfully`);
          } else {
            toast.error("Failed to delete article");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}
