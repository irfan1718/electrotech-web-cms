'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Download,
  Eye,
  Trash2,
  FileText,
  Phone,
  Mail,
  User,
  X,
} from "lucide-react";

import PageHeader from '@/components/admin/page-header'
import DataTable, { Column } from '@/components/admin/data-table'
import StatusBadge from '@/components/admin/status-badge'
import DeleteModal from '@/components/admin/delete-modal'
import { useApplicationStore, ApplicationData } from '@/store/application-store'
import { useAdminStore } from '@/store/adminStore'

export default function ApplicationsPage() {
  const { applications, fetching, fetchApplications, updateStatus, deleteApplication } =
    useApplicationStore()
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore()
  const [viewing, setViewing] = useState<ApplicationData | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  /* —— STATUS COLOR HELPER —— */
  const statusColor = (status: string) => {
    switch (status) {
      case 'new':         return 'bg-blue-50 text-blue-600'
      case 'reviewed':    return 'bg-yellow-50 text-yellow-600'
      case 'shortlisted': return 'bg-green-50 text-green-600'
      case 'rejected':    return 'bg-red-50 text-red-600'
      default:            return 'bg-neutral-100 text-neutral-500'
    }
  }

  /* —— FILTERS —— */
  const filters = [
    { label: 'All', value: 'all', count: applications.length },
    { label: 'New', value: 'new', count: applications.filter((a) => a.status === 'new').length },
    { label: 'Reviewed', value: 'reviewed', count: applications.filter((a) => a.status === 'reviewed').length },
    { label: 'Shortlisted', value: 'shortlisted', count: applications.filter((a) => a.status === 'shortlisted').length },
    { label: 'Rejected', value: 'rejected', count: applications.filter((a) => a.status === 'rejected').length },
  ]

  /* —— COLUMNS —— */
  const columns: Column<ApplicationData>[] = [
    {
      key: "name",
      label: "Applicant",
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-neutral-900">{row.name}</p>
          <p className="text-xs text-neutral-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <span className="text-sm text-neutral-500">{row.phone}</span>
      ),
    },
    {
      key: "position",
      label: "Position",
      render: (row) => (
        <span className="text-sm text-neutral-500">{row.position}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span className="text-sm text-neutral-400">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => {
            e.stopPropagation();
            updateStatus(row._id, e.target.value);
          }}
          className={`cursor-pointer rounded-full border-none px-3 py-1 text-[12px] font-semibold outline-none ${statusColor(row.status)}`}
        >
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      headerClass: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setViewing(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          <a
            href={row.cvUrl}
            download
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-blue-50 hover:text-blue-600"
            title="Download CV"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => openDeleteModal(row._id, row.name, "Application")}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c0152a]"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Applications"
        description={`${applications.length} total application${applications.length !== 1 ? "s" : ""}`}
      />

      <DataTable
        data={applications}
        columns={columns}
        loading={fetching}
        title="All Applications"
        searchable
        searchPlaceholder="Search by name, email, phone, or position..."
        searchKeys={["name", "email", "phone", "position"]}
        filters={filters}
        filterField="status"
        paginated
        pageSize={10}
        emptyTitle="No applications yet"
      />

      {/* —— VIEW MODAL —— */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setViewing(null)}
          />
          <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-1 bg-[#c0152a]" />

            <button
              onClick={() => setViewing(null)}
              className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[80vh] overflow-y-auto p-8">
              <h3 className="text-xl font-bold text-neutral-800">
                Application Details
              </h3>
              <p className="mt-1 text-sm text-neutral-400">
                Received{" "}
                {new Date(viewing.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <User className="h-4 w-4 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Name
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-700">
                      {viewing.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Mail className="h-4 w-4 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Email
                    </p>
                    <p className="mt-0.5 break-all text-sm font-medium text-neutral-700">
                      {viewing.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Phone className="h-4 w-4 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Phone
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-700">
                      {viewing.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <FileText className="h-4 w-4 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Position
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-700">
                      {viewing.position}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Status
                </p>
                <select
                  value={viewing.status}
                  onChange={(e) => {
                    updateStatus(viewing._id, e.target.value);
                    setViewing({ ...viewing, status: e.target.value });
                  }}
                  className={`mt-1 cursor-pointer rounded-full border-none px-4 py-1.5 text-[13px] font-semibold outline-none ${statusColor(viewing.status)}`}
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {viewing.coverNote && (
                <div className="mt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Cover Note
                  </p>
                  <p className="mt-2 max-h-[150px] overflow-y-auto whitespace-pre-wrap break-all rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">
                    {viewing.coverNote}
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <a
                  href={viewing.cvUrl}
                  download
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c0152a] py-3 text-sm font-semibold text-white transition hover:bg-[#a31224]"
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </a>

                <a
                  href={`mailto:${viewing.email}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* —— DELETE MODAL —— */}
      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title}
        module={deleteModal?.module}
        loading={fetching}
        onClose={closeDeleteModal}
        onConfirm={async () => {
          if (!deleteModal) return;
          const success = await deleteApplication(deleteModal.id);
          if (success) {
            toast.success("Application and CV deleted");
          } else {
            toast.error("Failed to delete application");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}