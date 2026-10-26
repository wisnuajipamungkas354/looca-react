import React, { useState } from "react"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"
import { ImageCropperDialog } from "./ImageCropperDialog"
import { uploadService } from "@/services/uploadService"
import { getMediaUrl } from "@/lib/utils"

interface ImageUploaderProps {
  value: string | string[]
  onChange: (val: any) => void
  aspect?: number // 3/4 or 1
  maxFiles?: number
  label?: string
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  aspect = 3 / 4,
  maxFiles = 1,
  label,
}) => {
  const images = Array.isArray(value) ? value : value ? [value] : []
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImgSrc, setSelectedImgSrc] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP).")
      return
    }

    // Validate size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Image file size exceeds 1MB limit.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImgSrc(reader.result as string)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleCropComplete = async (croppedDataUrl: string) => {
    try {
      setIsUploading(true)
      // Upload via mock upload service
      const uploadedUrl = await uploadService.uploadImage(croppedDataUrl)
      if (maxFiles === 1) {
        onChange(uploadedUrl)
      } else {
        onChange([...images, uploadedUrl])
      }
      toast.success("Image uploaded")
    } catch (err: any) {
      toast.error(err.message || "Failed to process image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    if (maxFiles === 1) {
      onChange("")
    } else {
      const next = images.filter((_, i) => i !== index)
      onChange(next)
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-semibold text-foreground">{label}</p>}

      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl overflow-hidden border-2 border-pink/60 bg-secondary group shadow-sm ${
              aspect === 1 ? "w-24 h-24" : "w-24 h-32"
            }`}
          >
            <img
              src={getMediaUrl(img)}
              alt="preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {images.length < maxFiles && (
          <label
            className={`border-2 border-dashed border-pink/60 hover:border-pink-deep rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-pink-light/30 dark:bg-secondary/40 hover:bg-pink-light/60 transition-all ${
              aspect === 1 ? "w-24 h-24" : "w-24 h-32"
            } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-light dark:bg-card text-pink-deep">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground text-center px-1">
              {isUploading ? "Processing" : "Add Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Max {maxFiles} image(s), ≤ 1MB per image. Locked {aspect === 1 ? "1:1" : "3:4"} portrait.
      </p>

      <ImageCropperDialog
        open={cropperOpen}
        imageSrc={selectedImgSrc}
        aspect={aspect}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}
