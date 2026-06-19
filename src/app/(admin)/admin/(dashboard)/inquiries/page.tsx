'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Eye,
  X,
  Mail,
  Phone,
  User,
  Clock,
  CheckCheck,
  MailOpen,
  MailWarning,
} from 'lucide-react'

import PageHeader from '@/components/admin/page-header'
import DataTable, { Column } from '@/components/admin/data-table'
import StatusBadge from '@/components/admin/status-badge'
import DeleteModal from '@/components/admin/delete-modal'
import { useInquiriesStore, InquiryData } from '@/store/inquiries-store'
import { useAdminStore } from '@/store/adminStore'

export default function InquiriesPage() {
  const {
    inquiries,
    fetching,
    fetchInquiries,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteInquiry,
  } = useInquiriesStore()
  const { openDeleteModal, deleteModal, closeDeleteModal } = useAdminStore()
  const [viewing, setViewing] = useState<InquiryData | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  /* ── HELPERS ── */
  const unreadCount = inquiries.filter((i) => i.status === 'unread').length

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return formatDate(date)
  }

  /* ── VIEW INQUIRY ── */
  const handleView = async (inq: InquiryData) => {
    setViewing(inq)
    if (inq.status === 'unread') {
      await markAsRead(inq._id!)
    }
  }

  /* ── TOGGLE STATUS ── */
  const toggleStatus = async (inq: InquiryData) => {
    if (inq.status === 'unread') {
      const success = await markAsRead(inq._id!)
      if (success) toast.success('Marked as read')
    } else {
      const success = await markAsUnread(inq._id!)
      if (success) toast.success('Marked as unread')
    }
  }

  /* ── MARK ALL READ ── */
  const handleMarkAllRead = async () => {
    const success = await markAllRead()
    if (success) {
      toast.success(`${unreadCount} inquiries marked as read`)
    } else {
      toast.error('Failed to update')
    }
  }

  /* ── FILTERS ── */
  const filters = [
    { label: 'All', value: 'all', count: inquiries.length },
    { label: 'Unread', value: 'unread', count: unreadCount },
    {
      label: 'Read',
      value: 'read',
      count: inquiries.filter((i) => i.status === 'read').length,
    },
  ]

  /* ── COLUMNS ── */
  const columns: Column<InquiryData>[] = [
    {
      key: 'name',
      label: 'Contact',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              row.status === 'unread'
                ? 'bg-[#c0152a] text-white'
                : 'bg-red-50 text-[#c0152a]'
            }`}
          >
            {getInitials(row.name)}
          </div>
          <div>
            <p
              className={`text-sm ${
                row.status === 'unread'
                  ? 'font-bold text-neutral-900'
                  : 'font-medium text-neutral-700'
              }`}
            >
              {row.name}
              {row.status === 'unread' && (
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-[#c0152a]" />
              )}
            </p>
            <p className="text-xs text-neutral-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => (
        <span className="text-sm text-neutral-500">
          {row.phone || '—'}
        </span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      className: 'max-w-[220px]',
      render: (row) => (
        <p
          className={`truncate text-sm ${
            row.status === 'unread'
              ? 'font-semibold text-neutral-800'
              : 'text-neutral-500'
          }`}
        >
          {row.subject}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-neutral-400">
          <Clock className="h-3.5 w-3.5" />
          {row.createdAt ? timeAgo(row.createdAt) : '—'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      headerClass: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View */}
          <button
            onClick={() => handleView(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            title="View inquiry"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>

          {/* Toggle read/unread */}
          <button
            onClick={() => toggleStatus(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            title={row.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
          >
            {row.status === 'unread' ? (
              <MailOpen className="h-3.5 w-3.5" />
            ) : (
              <MailWarning className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Delete */}
          <button
            onClick={() => openDeleteModal(row._id!, row.name, 'Inquiry')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c0152a]"
            title="Delete"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Inquiries"
        description={
          unreadCount > 0
            ? `${unreadCount} unread ${unreadCount === 1 ? "inquiry needs" : "inquiries need"} attention`
            : "All inquiries have been reviewed"
        }
      >
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <CheckCheck className="h-5 w-5" />
            Mark All Read
          </button>
        )}
      </PageHeader>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Total
          </p>
          <p className="mt-1 text-2xl font-black text-neutral-900">
            {inquiries.length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">
            Unread
          </p>
          <p className="mt-1 text-2xl font-black text-amber-700">
            {unreadCount}
          </p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Read
          </p>
          <p className="mt-1 text-2xl font-black text-green-700">
            {inquiries.filter((i) => i.status === "read").length}
          </p>
        </div>
      </div>

      {/* ── TABLE ── */}
      <DataTable
        data={inquiries}
        columns={columns}
        loading={fetching}
        title="All Inquiries"
        searchable
        searchPlaceholder="Search by name, email, subject..."
        searchKeys={["name", "email", "subject", "phone"]}
        filters={filters}
        filterField="status"
        paginated
        pageSize={10}
        emptyTitle="No inquiries yet"
      />

      {/* ── VIEW MODAL ── */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setViewing(null)}
          />

          {/* Modal */}
          <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Inquiry Details
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Received{" "}
                  {viewing.createdAt ? formatDateTime(viewing.createdAt) : "—"}
                </p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {/* Contact Info */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <User className="h-5 w-5 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Name
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-800">
                      {viewing.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Mail className="h-5 w-5 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Email
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-800">
                      {viewing.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Phone className="h-5 w-5 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Phone
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-neutral-800">
                      {viewing.phone || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <Clock className="h-5 w-5 text-[#c0152a]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={viewing.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Subject
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-900">
                  {viewing.subject}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Message
                </p>
                <div className="mt-2 max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
                  {viewing.message}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
              <div className="flex gap-2">
                {/* Toggle read/unread */}
                <button
                  onClick={async () => {
                    if (viewing.status === "read") {
                      await markAsUnread(viewing._id!);
                      setViewing({ ...viewing, status: "unread" });
                      toast.success("Marked as unread");
                    } else {
                      await markAsRead(viewing._id!);
                      setViewing({ ...viewing, status: "read" });
                      toast.success("Marked as read");
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  {viewing.status === "read" ? (
                    <>
                      <MailWarning className="h-5 w-5" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-5 w-5" />
                      Mark Read
                    </>
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    setViewing(null);
                    openDeleteModal(viewing._id!, viewing.name, "Inquiry");
                  }}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-[#c0152a] transition hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                  Delete
                </button>
              </div>

              {/* Reply */}
              <a
                href={`mailto:${viewing.email}?subject=Re: ${encodeURIComponent(viewing.subject)}`}
                className="flex items-center gap-2 rounded-xl bg-[#c0152a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a31224]"
              >
                <Mail className="h-5 w-5" />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      <DeleteModal
        open={!!deleteModal}
        title={deleteModal?.title}
        module={deleteModal?.module}
        loading={false}
        onClose={closeDeleteModal}
        onConfirm={async () => {
          if (!deleteModal) return;
          const success = await deleteInquiry(deleteModal.id);
          if (success) {
            toast.success("Inquiry deleted");
          } else {
            toast.error("Failed to delete");
          }
          closeDeleteModal();
        }}
      />
    </div>
  );
}