'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import PageHeader from '@/components/admin/page-header'
import SectionCard from '@/components/admin/section-card'
import FormInput from '@/components/admin/form-input'
import FormTextarea from '@/components/admin/form-textarea'
import SubmitButton from '@/components/admin/submit-button'
import ImageUpload from '@/components/admin/image-upload'
import { useServicesStore } from '@/store/services-store'

export default function ServiceFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const {
    current,
    loading,
    fetching,
    error,
    setCurrent,
    resetCurrent,
    fetchServiceById,
    createService,
    updateService,
  } = useServicesStore()

  useEffect(() => {
    if (isNew) {
      resetCurrent()
    } else {
      fetchServiceById(id)
    }
    return () => resetCurrent()
  }, [id, isNew, fetchServiceById, resetCurrent])

  const handleTitleChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setCurrent({ title: value, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success: boolean

    if (isNew) {
      success = await createService()
      if (success) {
        toast.success('Service created successfully')
        router.push('/admin/services')
      } else {
        toast.error(error || 'Failed to create service')
      }
    } else {
      success = await updateService(id)
      if (success) {
        toast.success('Service updated successfully')
        router.push('/admin/services')
      } else {
        toast.error(error || 'Failed to update service')
      }
    }
  }

  if (!isNew && fetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#c0152a]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={isNew ? 'Add New Service' : 'Edit Service'}
        description={
          isNew ? 'Create a new MEP service listing.' : `Editing: ${current.title}`
        }
      >
        <button
          onClick={() => router.push('/admin/services')}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Services
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SERVICE INFO */}
        <SectionCard title="Service Information">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Title"
                name="title"
                placeholder="e.g. HVAC & Smoke Management"
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
              placeholder="Brief one-line description"
              value={current.caption}
              onChange={(e) => setCurrent({ caption: e.target.value })}
              required
            />

            <FormTextarea
              label="Body Content"
              name="body"
              placeholder="Detailed service description..."
              value={current.body}
              onChange={(e) => setCurrent({ body: e.target.value })}
              required
            />

            <FormInput
              label="Display Order"
              name="order"
              type="number"
              placeholder="0"
              value={String(current.order)}
              onChange={(e) => setCurrent({ order: parseInt(e.target.value) || 0 })}
            />
          </div>
        </SectionCard>

        {/* DETAIL PAGE */}
        <SectionCard title="Detail Page Content">
          <FormTextarea
            label="Detail Body"
            name="detailBody"
            placeholder="Extended content shown on the individual service detail page..."
            value={current.detailBody || ''}
            onChange={(e) => setCurrent({ detailBody: e.target.value })}
            rows={8}
          />
        </SectionCard>

        {/* THUMBNAIL — NOW USING ImageUpload */}
        <SectionCard title="Thumbnail Image">
          <ImageUpload
            value={current.thumbnail}
            onChange={(url) => setCurrent({ thumbnail: url })}
            label="Service Thumbnail"
            description="Recommended: 800×600px — JPG, PNG, WebP — Max 5MB"
          />
        </SectionCard>

        {/* ACTIONS */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="text-[15px] font-bold text-neutral-600 hover:text-neutral-700"
          >
            Cancel
          </button>
          <SubmitButton type="submit" loading={loading}>
            {isNew ? 'Create Service' : 'Save Changes'}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}