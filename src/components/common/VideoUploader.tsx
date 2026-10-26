import React, { useState } from "react"
import { toast } from "sonner"
import { Video, X, UploadCloud, CheckCircle2 } from "lucide-react"
import { uploadService } from "@/services/uploadService"
import { Button } from "@/components/ui/button"
import { getMediaUrl } from "@/lib/utils"

interface VideoUploaderProps {
  value: string | null
  onChange: (url: string | null) => void
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ value, onChange }) => {
  const [progress, setProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file format. Please upload MP4 or WEBM video.")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file size exceeds 50MB limit.")
      return
    }

    try {
      setIsUploading(true)
      setProgress(5)
      const url = await uploadService.uploadVideo(file, (p) => setProgress(p))
      onChange(url)
      toast.success("Video uploaded")
    } catch (err: any) {
      toast.error(err.message || "Failed to upload video")
    } finally {
      setIsUploading(false)
      setProgress(null)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="space-y-2">
          <div className="relative rounded-2xl overflow-hidden border-2 border-pink/60 bg-black aspect-video max-h-56 flex items-center justify-center">
            <video src={getMediaUrl(value)} controls className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Video attached
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(null)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Remove Video
            </Button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-pink/60 hover:border-pink-deep rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-pink-light/30 dark:bg-secondary/30 hover:bg-pink-light/60 transition-all">
          <div className="h-12 w-12 rounded-full bg-pink-light dark:bg-card text-pink-deep flex items-center justify-center">
            {isUploading ? <UploadCloud className="h-6 w-6 animate-bounce" /> : <Video className="h-6 w-6" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {isUploading ? `Uploading video... ${progress}%` : "Click to select workshop video"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">MP4, WebM up to 50MB</p>
          </div>

          {progress !== null && (
            <div className="w-48 h-2 bg-pink/30 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-pink-deep transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  )
}
