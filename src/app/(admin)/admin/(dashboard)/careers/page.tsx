"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, MapPin } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import DataTable, { Column } from "@/components/admin/data-table";
import ActionButtons from "@/components/admin/action-buttons";
import StatusBadge from "@/components/admin/status-badge";
import DeleteModal from "@/components/admin/delete-modal";
import { useCareersStore, CareerData } from "@/store/careers-store";
import { useAdminStore } from "@/store/adminStore";

export default function CareersPage() {
  const router = useRouter();
  const { careers, fetching, fetchCareers, deleteCareer } = useCareersStore();
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore();

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  /* ── FILTERS ── */
  const filters = [
    { label: "All", value: "all", count: careers.length },
    {
      label: "Open",
      value: "open",
      count: careers.filter((c) => c.status === "open").length,
    },
    {
      label: "Closed",
      value: "closed",
      count: careers.filter((c) => c.status === "closed").length,
    },
  ];

  /* ── COLUMNS ── */
  const columns: Column<CareerData>[] = [
    {
      key: "title",
      label: "Job Title",
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-neutral-900">{row.title}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{row.caption}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-neutral-500">
          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
          {row.location}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status as "open" | "closed"} />,
    },
    {
      key: "createdAt",
      label: "Posted",
      render: (row) => (
        <span className="text-sm text-neutral-400">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
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
          onEdit={() => router.push(`/admin/careers/${row._id}`)}
          onDelete={() => openDeleteModal(row._id!, row.title, "Job Post")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Careers"
        description="Manage job listings displayed on the website."
      >
        <button
          onClick={() => router.push("/admin/careers/new")}
          className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a31224]"
        >
          <Plus className="h-5 w-5" />
          Post New Job
        </button>
      </PageHeader>

      <DataTable
        data={careers}
        columns={columns}
        loading={fetching}
        title="Job Listings"
        searchable
        searchPlaceholder="Search jobs..."
        searchKeys={["title", "location", "caption"]}
        filters={filters}
        filterField="status"
        paginated
        pageSize={10}
        emptyTitle="No job listings yet"
        emptyAction={
          <button
            onClick={() => router.push("/admin/careers/new")}
            className="mt-2 text-sm font-medium text-[#c0152a] hover:underline"
          >
            + Post your first job
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
          const success = await deleteCareer(deleteModal.id);
          if (success) {
            toast.success(`"${deleteModal.title}" deleted successfully`);
          } else {
            toast.error("Failed to delete job post");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}
