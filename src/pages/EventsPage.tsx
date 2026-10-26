import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { eventService } from "@/services/eventService"
import { UpcomingEvent } from "@/types"
import { getMediaUrl } from "@/lib/utils"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title must be ≤ 50 chars"),
  sub_title: z.string().max(50, "Subtitle must be ≤ 50 chars").nullable().optional(),
  description: z.string().nullable().optional(),
  poster: z.string().min(1, "Poster image is required"),
  start_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  place: z.string().min(1, "Event venue/place is required").max(255),
  admission_fee: z.number().nullable().optional(),
  origin_link: z.string().nullable().optional(),
  short_link: z.string().nullable().optional(),
  is_coming_soon: z.boolean(),
  is_active: z.boolean(),
})

type EventFormValues = z.infer<typeof eventSchema>

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<UpcomingEvent | null>(null)
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
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  })

  const titleVal = watch("title") || ""
  const subTitleVal = watch("sub_title") || ""

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await eventService.getAll()
      setEvents(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setEditingEvent(null)
    reset({
      title: "",
      sub_title: "",
      description: "",
      poster: "",
      start_date: "",
      start_time: "",
      place: "",
      admission_fee: null,
      origin_link: "",
      short_link: "",
      is_coming_soon: false,
      is_active: true,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (evt: UpcomingEvent) => {
    setEditingEvent(evt)
    reset({
      title: evt.title,
      sub_title: evt.sub_title || "",
      description: evt.description || "",
      poster: evt.poster,
      start_date: evt.start_date || "",
      start_time: evt.start_time || "",
      place: evt.place,
      admission_fee: evt.admission_fee,
      origin_link: evt.origin_link || "",
      short_link: evt.short_link || "",
      is_coming_soon: evt.is_coming_soon,
      is_active: evt.is_active,
    })
    setDialogOpen(true)
  }

  const handleToggleActive = async (id: number) => {
    try {
      const updated = await eventService.toggleActive(id)
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_active: updated.is_active } : e))
      )
      toast.success(
        `Event set to ${updated.is_active ? "Active" : "Inactive"}`
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status")
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    try {
      setIsSubmitting(true)
      const sanitized = {
        ...values,
        sub_title: values.sub_title || null,
        description: values.description || null,
        start_date: values.start_date || null,
        start_time: values.start_time || null,
        admission_fee:
          values.admission_fee !== undefined &&
          values.admission_fee !== null &&
          !isNaN(values.admission_fee)
            ? Number(values.admission_fee)
            : null,
        origin_link: values.origin_link || null,
        short_link: values.short_link || null,
      }

      if (editingEvent) {
        await eventService.update(editingEvent.id, sanitized)
        toast.success("Event updated")
      } else {
        await eventService.create(sanitized)
        toast.success("Event created")
      }
      setDialogOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to save event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!targetDeleteId) return
    try {
      await eventService.remove(targetDeleteId)
      toast.success("Event deleted")
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event")
    }
  }

  const formatFee = (fee: number | null) => {
    if (fee === null || fee === undefined || fee === 0) return "Free"
    return `Rp ${new Intl.NumberFormat("id-ID").format(fee)}`
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Events"
        description="Schedule and manage upcoming events and workshops."
        actions={
          <Button onClick={handleOpenAdd} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Event
          </Button>
        }
      />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground font-medium">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events scheduled"
          description="Create your first event schedule."
          actionLabel="Add Event"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Poster</TableHead>
                  <TableHead>Event Info</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-28">Fee</TableHead>
                  <TableHead className="w-28 text-center">Status</TableHead>
                  <TableHead className="w-24 text-center">Active</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell>
                      <div className="h-16 w-12 rounded-xl overflow-hidden bg-secondary border border-pink/40 shrink-0">
                        <img
                          src={getMediaUrl(evt.poster) || "/mock/fashion1.jpeg"}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-heading font-bold text-foreground text-sm">
                        {evt.title}
                      </p>
                      {evt.sub_title && (
                        <p className="text-xs text-muted-foreground">{evt.sub_title}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-pink-deep" />
                          {evt.start_date || "TBA"}
                        </span>
                        <span>{evt.start_time ? `${evt.start_time} WIB` : ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-pink-deep shrink-0" />
                        <span className="truncate">{evt.place}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-heading font-bold text-xs text-pink-deep">
                        {formatFee(evt.admission_fee)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {evt.is_coming_soon ? (
                        <Badge variant="outline" className="text-[10px] bg-yellow-light text-yellow-800 border-yellow-300">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Open
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={evt.is_active}
                        onCheckedChange={() => handleToggleActive(evt.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-2 rounded-full text-muted-foreground hover:text-pink-deep hover:bg-secondary cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTargetDeleteId(evt.id)
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
          <div className="lg:hidden space-y-2.5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-2xl border border-pink/40 dark:border-white/10 bg-card shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <div className="h-16 w-12 rounded-xl overflow-hidden bg-secondary border border-pink/30 shrink-0">
                    <img
                      src={getMediaUrl(evt.poster) || "/mock/fashion1.jpeg"}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden min-w-0 space-y-0.5">
                    <p className="font-heading font-bold text-foreground text-sm truncate">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span>{evt.start_date || "TBA"}</span>
                      &bull;
                      <span className="font-semibold text-pink-deep">
                        {formatFee(evt.admission_fee)}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-pink-deep shrink-0" />
                      <span className="truncate">{evt.place}</span>
                    </p>
                  </div>
                </div>

                {/* Right controls: quick toggle & actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Switch
                    checked={evt.is_active}
                    onCheckedChange={() => handleToggleActive(evt.id)}
                    aria-label="Toggle active status"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1.5 rounded-full text-muted-foreground hover:text-pink-deep hover:bg-secondary cursor-pointer transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setTargetDeleteId(evt.id)
                        setDeleteOpen(true)
                      }}
                      className="p-1.5 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Add Event"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title with counter (max 50) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="title">Event Title *</Label>
                  <span className="text-[11px] text-muted-foreground">{titleVal.length}/50</span>
                </div>
                <Input
                  id="title"
                  maxLength={50}
                  placeholder="e.g. Weekend Beads & Blooms"
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
                  placeholder="e.g. Creative Gathering"
                  {...register("sub_title")}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Poster Upload & Crop 3:4 portrait */}
            <div className="space-y-1.5">
              <Controller
                name="poster"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    label="Event Poster * (Locked 3:4 Portrait, max 1MB)"
                    value={field.value}
                    onChange={field.onChange}
                    aspect={3 / 4}
                    maxFiles={1}
                  />
                )}
              />
              {errors.poster && (
                <p className="text-xs text-red-500 font-medium">{errors.poster.message}</p>
              )}
            </div>

            {/* Date, Time, Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Date</Label>
                <Input id="start_date" type="date" {...register("start_date")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="start_time">Time</Label>
                <Input id="start_time" type="time" {...register("start_time")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admission_fee">Admission Fee (Rp)</Label>
                <Input
                  id="admission_fee"
                  type="number"
                  placeholder="Empty = Free"
                  {...register("admission_fee", {
                    setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? null : Number(v)),
                  })}
                />
              </div>
            </div>

            {/* Place */}
            <div className="space-y-1.5">
              <Label htmlFor="place">Venue / Place *</Label>
              <Input
                id="place"
                placeholder="e.g. One Ten Cafe, Galuh Mas Karawang"
                {...register("place")}
                disabled={isSubmitting}
              />
              {errors.place && (
                <p className="text-xs text-red-500 font-medium">{errors.place.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Event Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Details regarding event activities, registration notes, or attire..."
                {...register("description")}
                disabled={isSubmitting}
              />
            </div>

            {/* External Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="origin_link">Original Link (Instagram / RSVP)</Label>
                <Input
                  id="origin_link"
                  placeholder="https://instagram.com/p/..."
                  {...register("origin_link")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="short_link">Short Link (optional)</Label>
                <Input
                  id="short_link"
                  placeholder="https://looca.id/event/..."
                  {...register("short_link")}
                />
              </div>
            </div>

            {/* Switches */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-pink/30 gap-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="is_coming_soon"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_coming_soon"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_coming_soon" className="cursor-pointer">
                  Mark as Coming Soon
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Publish Active on Website
                </Label>
              </div>
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
                {isSubmitting ? "Saving..." : editingEvent ? "Save Changes" : "Save Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Upcoming Event?"
        description="Are you sure you want to delete this event schedule? It will no longer show on the calendar."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
