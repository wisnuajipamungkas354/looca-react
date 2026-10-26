import React, { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getCroppedImg, PixelCrop } from "@/lib/cropImage"

interface ImageCropperDialogProps {
  open: boolean
  imageSrc: string | null
  aspect?: number
  onClose: () => void
  onCropComplete: (croppedDataUrl: string) => void
}

export const ImageCropperDialog: React.FC<ImageCropperDialogProps> = ({
  open,
  imageSrc,
  aspect = 3 / 4,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    try {
      setIsProcessing(true)
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      onCropComplete(croppedImage)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!imageSrc) return null

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Crop Image</span>
            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
              Locked {aspect === 1 ? "1:1 Square" : "3:4 Portrait"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-80 bg-neutral-900 rounded-2xl overflow-hidden mt-2">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
          />
        </div>

        <div className="flex items-center gap-3 py-2 px-1">
          <span className="text-xs font-medium text-muted-foreground">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-pink-deep h-1.5 bg-pink/30 rounded-lg cursor-pointer"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleApplyCrop} disabled={isProcessing}>
            {isProcessing ? "Cropping..." : "Save Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
