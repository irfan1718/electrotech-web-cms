"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, GripVertical, User } from "lucide-react";

import PageHeader from "@/components/admin/page-header";
import DataTable, { Column } from "@/components/admin/data-table";
import ActionButtons from "@/components/admin/action-buttons";
import StatusBadge from "@/components/admin/status-badge";
import DeleteModal from "@/components/admin/delete-modal";
import { useTeamStore, TeamData } from "@/store/team-store";
import { useAdminStore } from "@/store/adminStore";

export default function TeamPage() {
  const router = useRouter();
  const { members, fetching, fetchMembers, deleteMember } = useTeamStore();
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /* ── INITIALS HELPER ── */
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  /* ── COLUMNS ── */
  const columns: Column<TeamData>[] = [
    {
      key: "name",
      label: "Member",
      render: (row) => (
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 cursor-grab text-neutral-300" />
          {row.profileImage ? (
            <img
              src={row.profileImage}
              alt={row.name}
              className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#c0152a]">
              {getInitials(row.name)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-900">{row.name}</p>
            <p className="text-xs text-neutral-400">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      key: "caption",
      label: "Bio",
      className: "max-w-[280px]",
      render: (row) => (
        <p className="truncate text-sm text-neutral-500">{row.caption}</p>
      ),
    },
    {
      key: "profileImage",
      label: "Photo",
      headerClass: "text-center",
      className: "text-center",
      render: (row) => (
        <StatusBadge
          status={row.profileImage ? "active" : "draft"}
          label={row.profileImage ? "Uploaded" : "Missing"}
        />
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
          onEdit={() => router.push(`/admin/team/${row._id}`)}
          onDelete={() => openDeleteModal(row._id!, row.name, "Team Member")}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Management Team"
        description="Manage leadership profiles displayed on the website."
      >
        <button
          onClick={() => router.push("/admin/team/new")}
          className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a31224]"
        >
          <Plus className="h-5 w-5" />
          Add Member
        </button>
      </PageHeader>

      <DataTable
        data={members}
        columns={columns}
        loading={fetching}
        title="Team Members"
        searchable
        searchPlaceholder="Search team members..."
        searchKeys={["name", "designation", "caption"]}
        emptyTitle="No team members yet"
        emptyAction={
          <button
            onClick={() => router.push("/admin/team/new")}
            className="mt-2 text-sm font-medium text-[#c0152a] hover:underline"
          >
            + Add your first team member
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
          const success = await deleteMember(deleteModal.id);
          if (success) {
            toast.success(`"${deleteModal.title}" removed successfully`);
          } else {
            toast.error("Failed to remove team member");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}
