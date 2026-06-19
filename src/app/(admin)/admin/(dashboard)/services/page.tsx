"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, GripVertical } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import DataTable, { Column } from "@/components/admin/data-table";
import ActionButtons from "@/components/admin/action-buttons";
import DeleteModal from "@/components/admin/delete-modal";
import { useServicesStore, ServiceData } from "@/store/services-store";
import { useAdminStore } from "@/store/adminStore";

export default function ServicesPage() {
  const router = useRouter();
  const { services, fetching, fetchServices, deleteService } =
    useServicesStore();
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /* ── COLUMNS ── */
  const columns: Column<ServiceData>[] = [
    {
      key: "title",
      label: "Service",
      render: (row) => (
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 cursor-grab text-neutral-300" />
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
      className: "max-w-[250px]",
      render: (row) => (
        <p className="truncate text-sm text-neutral-500">{row.caption}</p>
      ),
    },
    {
      key: "thumbnail",
      label: "Image",
      render: (row) =>
        row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={row.title}
            className="h-9 w-14 rounded-lg border border-neutral-200 object-cover"
          />
        ) : (
          <span className="text-xs text-neutral-300">No image</span>
        ),
    },
    {
      key: "order",
      label: "Order",
      headerClass: "text-center",
      className: "text-center",
      render: (row) => (
        <span className="inline-flex min-w-[32px] items-center justify-center rounded-lg bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-600">
          {row.order}
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
          onEdit={() => router.push(`/admin/services/${row._id}`)}
          onDelete={() => openDeleteModal(row._id!, row.title, "Service")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        description="Manage MEP service listings displayed on the website."
      >
        <button
          onClick={() => router.push("/admin/services/new")}
          className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a31224]"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </PageHeader>

      <DataTable
        data={services}
        columns={columns}
        loading={fetching}
        title="All Services"
        searchable
        searchPlaceholder="Search services..."
        searchKeys={["title", "caption"]}
        paginated
        pageSize={8}
        emptyTitle="No services yet"
        emptyAction={
          <button
            onClick={() => router.push("/admin/services/new")}
            className="mt-2 text-sm font-medium text-[#c0152a] hover:underline"
          >
            + Add your first service
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
          const success = await deleteService(deleteModal.id);
          if (success) {
            toast.success(`"${deleteModal.title}" deleted successfully`);
          } else {
            toast.error("Failed to delete service");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}
