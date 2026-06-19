"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, ImageIcon, MapPin } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import DataTable, { Column } from "@/components/admin/data-table";
import ActionButtons from "@/components/admin/action-buttons";
import StatusBadge from "@/components/admin/status-badge";
import DeleteModal from "@/components/admin/delete-modal";
import { useProjectsStore, ProjectData } from "@/store/projects-store";
import { useAdminStore } from "@/store/adminStore";

const PROJECT_CATEGORIES = [
  "Commercial",
  "Residential",
  "Hospitality",
  "Healthcare",
  "Industrial",
  "Infrastructure",
  "Government",
  "Education",
];

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, fetching, fetchProjects, deleteProject } =
    useProjectsStore();
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /* ── FILTERS — by category ── */
  const filters = [
    { label: "All", value: "all", count: projects.length },
    ...PROJECT_CATEGORIES.map((cat) => ({
      label: cat,
      value: cat.toLowerCase(),
      count: projects.filter(
        (p) => (p.category || "").toLowerCase() === cat.toLowerCase(),
      ).length,
    })).filter((f) => f.count > 0),
  ];

  /* ── COLUMNS ── */
  const columns: Column<ProjectData>[] = [
    {
      key: "title",
      label: "Project",
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
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>/{row.slug}</span>
              {row.location && (
                <>
                  <span className="text-neutral-200">·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {row.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row) =>
        row.category ? (
          <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-[#c0152a]">
            {row.category}
          </span>
        ) : (
          <span className="text-xs text-neutral-300">—</span>
        ),
    },
    {
      key: "projectStatus",
      label: "Progress",
      render: (row) => (
        <StatusBadge status={row.projectStatus || "in-progress"} />
      ),
    },
    {
      key: "status",
      label: "Visibility",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "images",
      label: "Gallery",
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
          onView={() => window.open(`/projects/${row.slug}`, "_blank")}
          onEdit={() => router.push(`/admin/projects/${row._id}`)}
          onDelete={() => openDeleteModal(row._id!, row.title, "Project")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Manage MEP project portfolio displayed on the website."
      >
        <button
          onClick={() => router.push("/admin/projects/new")}
          className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a31224]"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </button>
      </PageHeader>

      <DataTable
        data={projects}
        columns={columns}
        loading={fetching}
        title="All Projects"
        searchable
        searchPlaceholder="Search projects..."
        searchKeys={["title", "caption", "category", "location"]}
        filters={filters}
        filterField="category"
        paginated
        pageSize={10}
        emptyTitle="No projects yet"
        emptyAction={
          <button
            onClick={() => router.push("/admin/projects/new")}
            className="mt-2 text-sm font-medium text-[#c0152a] hover:underline"
          >
            + Add your first project
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
          const success = await deleteProject(deleteModal.id);
          if (success) {
            toast.success(`"${deleteModal.title}" deleted successfully`);
          } else {
            toast.error("Failed to delete project");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}
