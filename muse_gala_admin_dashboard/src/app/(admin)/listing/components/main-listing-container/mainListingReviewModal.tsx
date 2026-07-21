/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useEffect, useState, ChangeEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, X, ImageIcon, AlertCircle, Instagram, Phone, MapPin, User } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  open: boolean
  onClose: () => void
  dressId: string | null
}

interface ShippingDetails {
  isLocalPickup?: boolean
  isShippingAvailable?: boolean
}

interface Lender {
  _id: string
  fullName: string
  phoneNumber: string
  businessAddress: string
  instagramHandle: string
}

interface MasterDressData {
  _id: string
  masterDressId: string
  dressName: string
  lenderIds?: string[]
  listingIds?: string[]
  brand?: string
  sizes?: string[]
  colors?: string[]
  occasions?: string[]
  lenders?: Lender[]
  basePrice?: number
  insuranceFee?: number
  rrpPrice?: number
  thumbnail?: string
  media?: string[]
  shippingDetails?: ShippingDetails
  isActive?: boolean
  slug?: string
  createdAt?: string
  updatedAt?: string
}

interface MediaItem {
  url: string
  isNew: boolean
  file?: File
}

export default function MainListingReviewModal({
  open,
  onClose,
  dressId,
}: Props) {
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ''
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<MasterDressData | null>(null)

  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [isThumbnailChanged, setIsThumbnailChanged] = useState(false)

  // Media state
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  // Validation state
  const [showWarning, setShowWarning] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])

  // ---------------- FETCH DATA ----------------
  const {
    data: masterData,
    isLoading,
    isError,
  } = useQuery<MasterDressData>({
    queryKey: ['master-dress', dressId],
    enabled: !!dressId && open,
    queryFn: async (): Promise<MasterDressData> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master-dress/${dressId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (!res.ok) throw new Error('Failed to fetch master dress data')
      const json = await res.json()
      return json.data as MasterDressData
    },
    retry: false,
  })

  useEffect(() => {
    if (masterData) {
      setFormData(masterData)
      setThumbnailPreview(masterData.thumbnail || '')
      setThumbnailFile(null)
      setIsThumbnailChanged(false)

      // Initialize media items
      const existingMedia: MediaItem[] = (masterData.media || []).map(
        (url) => ({
          url,
          isNew: false,
        })
      )
      setMediaItems(existingMedia)
    }
  }, [masterData])

  const updateMutation = useMutation({
    mutationFn: async (updatedData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/master/${formData?.masterDressId}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: updatedData,
        }
      )
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update master dress')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-dress', dressId] })
      queryClient.invalidateQueries({ queryKey: ['main-listing'] })
      toast.success('Master Dress updated successfully')
      onClose()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Update failed')
    },
  })

  const handleChange = (field: keyof MasterDressData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  // ---------------- THUMBNAIL ----------------
  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }

    const preview = URL.createObjectURL(file)
    setThumbnailPreview(preview)
    setThumbnailFile(file)
    setIsThumbnailChanged(true)
  }

  // ---------------- MEDIA ----------------
  // Component-এর বাইরে বা উপরে define করো না, function-এর ভিতরে রাখো
  let lastUploadTime = 0

  const handleMediaUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const now = Date.now()
    // 🧠 যদি 500ms এর মধ্যে আবার trigger হয়, তাহলে ignore করো
    if (now - lastUploadTime < 500) return
    lastUploadTime = now

    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0) return

    if (mediaItems.length + files.length > 10) {
      toast.error('Maximum 10 images allowed')
      e.target.value = ''
      return
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`)
        e.target.value = ''
        return
      }
    }

    const newItems: MediaItem[] = files.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }))

    setMediaItems((prev) => [...prev, ...newItems])
    e.target.value = ''
  }

  const handleRemoveMedia = (index: number) => {
    const item = mediaItems[index]
    if (item.isNew && item.url.startsWith('blob:')) {
      URL.revokeObjectURL(item.url)
    }
    setMediaItems((prev) => prev.filter((_, i) => i !== index))
  }

  // ---------------- SAVE ----------------
  const handleSave = () => {
    if (!formData) return

    const fd = new FormData()

    // --- BASIC INFO ---
    fd.append('masterDressId', formData.masterDressId)
    fd.append('dressName', formData.dressName)

    if (formData.brand) fd.append('brand', formData.brand)

    // Handle number fields carefully to avoid "null" string conversion
    const basePrice = formData.basePrice ?? 0
    const insuranceFee = formData.insuranceFee ?? 0
    const rrpPrice = formData.rrpPrice ?? 0

    fd.append('basePrice', String(basePrice))
    fd.append('insuranceFee', String(insuranceFee))
    fd.append('rrpPrice', String(rrpPrice))

    if (formData.shippingDetails) {
      fd.append(
        'shippingDetails[isLocalPickup]',
        String(formData.shippingDetails.isLocalPickup || false)
      )
      fd.append(
        'shippingDetails[isShippingAvailable]',
        String(formData.shippingDetails.isShippingAvailable || false)
      )
    }

    if (formData.isActive !== undefined)
      fd.append('isActive', String(formData.isActive))

    // --- THUMBNAIL ---
    if (isThumbnailChanged && thumbnailFile) {
      fd.append('thumbnail', thumbnailFile)
    }

    // --- MEDIA HANDLING (Fixed ✅) ---
    const existingMediaUrls = mediaItems
      .filter((item) => !item.isNew) // শুধু পুরনোগুলো
      .map((item) => item.url)

    const newMediaFiles = mediaItems
      .filter((item) => item.isNew && item.file) // শুধু নতুন ফাইল
      .map((item) => item.file as File)

    // ✅ শুধুমাত্র পুরনো মিডিয়া URL গুলো stringify করে পাঠানো হবে
    fd.append('media', JSON.stringify(existingMediaUrls))

    // ✅ নতুন আপলোড করা ফাইলগুলো mediaUpload নামে পাঠানো হবে
    newMediaFiles.forEach((file) => {
      fd.append('mediaUpload', file)
    })

    // --- SUBMIT ---
    updateMutation.mutate(fd)
  }

  const handleSaveAttempt = () => {
    if (!formData) return

    const emptyFields: string[] = []
    if (formData.basePrice === null || formData.basePrice === undefined)
      emptyFields.push('Base Price')
    if (formData.rrpPrice === null || formData.rrpPrice === undefined)
      emptyFields.push('RRP Price')
    if (
      formData.insuranceFee === null ||
      formData.insuranceFee === undefined
    )
      emptyFields.push('Insurance Fee')

    // If active and fields are missing, warn
    if (formData.isActive && emptyFields.length > 0) {
      setMissingFields(emptyFields)
      setShowWarning(true)
    } else {
      handleSave()
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 pt-8 pb-2 pr-2 overflow-hidden font-sans font-light text-gray-700">
        <ScrollArea className="h-[90vh] px-6 space-y-6 pb-20">
          <DialogHeader>
            <div className="flex justify-center my-6">
              <Image src="/logo.png" alt="logo" width={60} height={60} />
            </div>
            <DialogTitle className="text-2xl font-light text-start mb-4 pb-5">
              Listings Review
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">Failed to load data.</p>
              <Button
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ['master-dress', dressId],
                  })
                }
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : formData ? (
            <div className="space-y-8">
              {/* Active Status */}
              <div className="flex items-center justify-between py-5 border-b">
                <span className="font-medium text-base">Active Status</span>
                <Switch
                  checked={!!formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange('isActive', Boolean(checked))
                  }
                />
              </div>

              {/* IDs Section */}
              <div className="grid grid-cols-1 gap-4 border-b pb-6">
                <div>
                  <label className="font-medium block mb-2">
                    Master Dress ID
                  </label>
                  <Input
                    value={formData.masterDressId}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Slug</label>
                  <Input
                    value={formData.slug || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">Listing IDs</label>
                  <Input
                    value={formData.listingIds?.join(', ') || 'No listings'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-lg text-black block mb-4">Lenders Information</label>
                  {formData.lenders && formData.lenders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.lenders.map((lender: Lender) => (
                        <div key={lender._id} className="border rounded-xl p-4 bg-gray-50/50 shadow-sm hover:shadow-md transition-shadow duration-200 border-gray-200">
                          <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                            <div className="bg-black/5 p-2 rounded-full">
                              <User className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-bold text-gray-900">{lender.fullName}</span>
                          </div>
                          
                          <div className="space-y-2.5 text-sm">
                            <div className="flex items-center gap-3 text-gray-600">
                              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="hover:text-black transition-colors">{lender.phoneNumber}</span>
                            </div>
                            
                            {lender.instagramHandle && (
                              <div className="flex items-center gap-3 text-gray-600">
                                <Instagram className="w-4 h-4 text-gray-400 shrink-0" />
                                <span className="hover:text-black transition-colors">@{lender.instagramHandle.replace('@', '')}</span>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-3 text-gray-600 leading-tight">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              <span>{lender.businessAddress}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : formData.lenderIds && formData.lenderIds.length > 0 ? (
                    <div className="space-y-2">
                       {formData.lenderIds.map((item: string | Lender, idx) => (
                         <div key={idx} className="bg-gray-50 p-2 rounded border text-sm text-gray-800">
                           {typeof item === 'object' ? item.fullName || item._id : item}
                         </div>
                       ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No lenders available</p>
                  )}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <label className="font-medium block mb-2">Occasions</label>
                <Input
                  value={formData.occasions?.join(', ') || 'Not specified'}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Sizes - READ ONLY */}
              <div>
                <label className="font-medium block mb-2">Sizes</label>
                <Input
                  value={
                    Array.isArray(formData.sizes)
                      ? formData.sizes
                        .map(
                          (s) =>
                            s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
                        )
                        .join(', ')
                      : 'Not specified'
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Colors - READ ONLY */}
              <div>
                <label className="font-medium block mb-2">Colors</label>
                <Input
                  value={
                    Array.isArray(formData.colors)
                      ? formData.colors
                        .map(
                          (c) =>
                            c.charAt(0).toUpperCase() + c.slice(1).toLowerCase()
                        )
                        .join(', ')
                      : 'Not specified'
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <label className="font-medium block mb-2">
                    Base Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.basePrice ?? ''}
                    onChange={(e) =>
                      handleChange('basePrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    Insurance Fee ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.insuranceFee ?? ''}
                    onChange={(e) =>
                      handleChange(
                        'insuranceFee',
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div>
                  <label className="font-medium block mb-2">
                    RRP Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.rrpPrice ?? ''}
                    onChange={(e) =>
                      handleChange('rrpPrice', parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="border-t pt-6">
                <label className="font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Thumbnail
                </label>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {isThumbnailChanged
                        ? 'Change Thumbnail'
                        : 'Upload Thumbnail'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleThumbnailUpload}
                    />
                  </label>
                  {thumbnailPreview && (
                    <div className="relative w-40 h-40 group">
                      <Image
                        src={thumbnailPreview}
                        alt="thumbnail"
                        fill
                        className="rounded-md border object-cover"
                      />
                      {isThumbnailChanged && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Media Gallery */}
              <div className="border-t pt-6">
                <label className="font-medium mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Media Gallery (
                  {mediaItems.length}/10)
                </label>
                <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Upload New Images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleMediaUpload}
                    disabled={mediaItems.length >= 10}
                  />
                </label>
                {mediaItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {mediaItems.map((item, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <Image
                          src={item.url}
                          alt={`media-${idx}`}
                          fill
                          className="rounded-md border object-cover"
                        />
                        <button
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {idx + 1}
                        </div>
                        {item.isNew && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Details */}
              <div className="flex flex-col gap-4 border-t pt-6">
                <label className="font-medium mb-2">Shipping Options</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!formData.shippingDetails?.isLocalPickup}
                    onChange={(e) =>
                      handleChange('shippingDetails', {
                        ...formData.shippingDetails,
                        isLocalPickup: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Local Pickup Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={!!formData.shippingDetails?.isShippingAvailable}
                    onChange={(e) =>
                      handleChange('shippingDetails', {
                        ...formData.shippingDetails,
                        isShippingAvailable: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm">Shipping Available</span>
                </label>
              </div>

              {/* Save Buttons */}
              <div className="flex justify-start gap-4 mt-8 mb-5 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={updateMutation.isPending}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAttempt}
                  disabled={updateMutation.isPending}
                  className="min-w-[100px]"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {/* Warning Alert Dialog */}
              <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="w-5 h-5" />
                      Missing Fields Warning
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      The following fields are not set:{' '}
                      <span className="font-semibold">
                        {missingFields.join(', ')}
                      </span>
                      . {`If you continue, these will be set to 0 as default.`} Are
                      you sure you want to proceed without filling these up?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setShowWarning(false)
                        handleSave()
                      }}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      Continue Anyway
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500">No data found.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
