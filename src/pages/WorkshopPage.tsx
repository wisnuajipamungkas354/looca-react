import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Video, PlayCircle } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageUploader } from "@/components/common/ImageUploader"
import { VideoUploader } from "@/components/common/VideoUploader"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { workshopService } from "@/services/workshopService"
import { Workshop } from "@/types"

const workshopSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be ≤ 50 chars"),
  sub_title: z.string().max(50, "Sub title must be ≤ 50 chars").nullable().optional(),
  description: z.string().min(1, "Description is required").max(150, "Description must be ≤ 150 chars"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  video: z.string().nullable().optional(),
})

type WorkshopFormValues = z.infer<typeof workshopSchema>

export const WorkshopPage: React.FC = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirm
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema),
  })

  const titleVal = watch("title") || ""
  const subTitleVal = watch("sub_title") || ""
  const descVal = watch("description") || ""

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await workshopService.getAll()
      setWorkshops(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setEditingWorkshop(null)
    reset({
      title: "",
      sub_title: "",
      description: "",
      thumbnail: "",
      video: null,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (w: Workshop) => {
    setEditingWorkshop(w)
    reset({
      title: w.title,
      sub_title: w.sub_title || "",
      description: w.description,
      thumbnail: w.thumbnail,
      video: w.video || null,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (values: WorkshopFormValues) => {
    try {
      setIsSubmitting(true)
      if (editingWorkshop) {
        await workshopService.update(editingWorkshop.id, {
          ...values,
          sub_title: values.sub_title || null,
          video: values.video || null,
        })
        toast.success("Workshop updated")
      } else {
        await workshopService.create({
          ...values,
          sub_title: values.sub_title || null,
          video: values.video || null,
        })
        toast.success("Workshop created")
      }
      setDialogOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to save workshop")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!targetDeleteId) return
    try {
      await workshopService.remove(targetDeleteId)
      toast.success("Workshop deleted")
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete workshop")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="DIY & Workshop"
        description="Manage workshop classes and view video plays."
        actions={
          <Button onClick={handleOpenAdd} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Workshop
          </Button>
        }
      />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground font-medium">
          Loading workshops...
        </div>
      ) : workshops.length === 0 ? (
        <EmptyState
          title="No workshops found"
          description="Add your first workshop class with a thumbnail and video."
          actionLabel="Add Workshop"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Thumbnail</TableHead>
                  <TableHead>Workshop Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-28 text-center">Video</TableHead>
                  <TableHead className="w-28 text-center">Total Plays</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workshops.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      <div className="h-14 w-14 rounded-2xl overflow-hidden bg-secondary border border-pink/40 shrink-0">
                        <img
                          src={w.thumbnail || "/mock/diy1.jpeg"}
                          alt={w.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-heading font-bold text-foreground text-sm">
                        {w.title}
                      </p>
                      {w.sub_title && (
                        <p className="text-xs text-muted-foreground">{w.sub_title}</p>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {w.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {w.video ? (
                        <Badge variant="default" className="gap-1 text-[10px]">
                          <Video className="h-3 w-3" /> Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          No Video
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <PlayCircle className="h-3.5 w-3.5" /> {w.total_play}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(w)}
                          className="p-2 rounded-full text-muted-foreground hover:text-pink-deep hover:bg-secondary cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTargetDeleteId(w.id)
                            setDeleteOpen(true)
                          }}
                          className="p-2 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {workshops.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-3xl border-2 border-pink/40 bg-card shadow-xs flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-secondary border border-pink/40 shrink-0">
                    <img
                      src={w.thumbnail || "/mock/diy1.jpeg"}
                      alt={w.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-heading font-bold text-foreground text-sm line-clamp-1">
                      {w.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{w.sub_title || "DIY Class"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <PlayCircle className="h-3 w-3" /> {w.total_play} plays
                      </span>
                      {w.video && (
                        <span className="text-[10px] text-pink-deep bg-pink-light dark:bg-pink-900/30 px-2 py-0.5 rounded-full font-bold">
                          Video Included
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {w.description}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-pink/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(w)}
                    className="h-8 text-xs text-pink-deep"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTargetDeleteId(w.id)
                      setDeleteOpen(true)
                    }}
                    className="h-8 text-xs text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkshop ? "Edit Workshop" : "Add Workshop"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title with counter (max 50) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="title">Workshop Title *</Label>
                <span className="text-[11px] text-muted-foreground">{titleVal.length}/50</span>
              </div>
              <Input
                id="title"
                maxLength={50}
                placeholder="e.g. Princess Birthday Crown"
                {...register("title")}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
              )}
            </div>

            {/* Sub Title with counter (max 50) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="sub_title">Subtitle (optional)</Label>
                <span className="text-[11px] text-muted-foreground">{subTitleVal.length}/50</span>
              </div>
              <Input
                id="sub_title"
                maxLength={50}
                placeholder="e.g. Princess Craft, Botanical Craft"
                {...register("sub_title")}
                disabled={isSubmitting}
              />
            </div>

            {/* Description with counter (max 150) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Short Description *</Label>
                <span className="text-[11px] text-muted-foreground">{descVal.length}/150</span>
              </div>
              <Textarea
                id="description"
                maxLength={150}
                placeholder="Brief summary of what students will craft in this workshop..."
                {...register("description")}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
              )}
            </div>

            {/* Thumbnail upload & crop 1:1 square */}
            <div className="space-y-1.5">
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    label="Square Thumbnail * (Locked 1:1 ratio, max 1MB)"
                    value={field.value}
                    onChange={field.onChange}
                    aspect={1}
                    maxFiles={1}
                  />
                )}
              />
              {errors.thumbnail && (
                <p className="text-xs text-red-500 font-medium">{errors.thumbnail.message}</p>
              )}
            </div>

            {/* Video File Uploader */}
            <div className="space-y-1.5">
              <Label>Tutorial Preview Video (optional, max 50MB MP4/WebM)</Label>
              <Controller
                name="video"
                control={control}
                render={({ field }) => (
                  <VideoUploader
                    value={field.value || null}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingWorkshop ? "Save Changes" : "Save Workshop"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Workshop Class?"
        description="Are you sure you want to delete this DIY workshop? The thumbnail and video links will be removed."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
