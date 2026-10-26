import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, Label, Textarea } from "@/components/ui/input"
import { ImageUploader } from "@/components/common/ImageUploader"
import { categoryService } from "@/services/categoryService"
import { productService } from "@/services/productService"
import { Category, Product } from "@/types"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Name must be ≤ 255 chars"),
  category_id: z.number({ message: "Please select a category" }).min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "Please upload at least 1 image").max(3, "Maximum 3 images allowed"),
  description: z.string().nullable().optional(),
  action_link: z.string().url("Please enter a valid URL (https://...)"),
  action_label: z.string().min(1, "Action label is required").max(30, "Action label must be ≤ 30 chars"),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormDialogProps {
  open: boolean
  editingProduct: Product | null
  onClose: () => void
  onSuccess: () => void
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  editingProduct,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  })

  const actionLabelValue = watch("action_label") || ""

  useEffect(() => {
    categoryService.getAll().then(setCategories)
  }, [])

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        category_id: editingProduct.category_id,
        images: editingProduct.images,
        description: editingProduct.description || "",
        action_link: editingProduct.action_link,
        action_label: editingProduct.action_label,
      })
    } else {
      reset({
        name: "",
        category_id: categories[0]?.id || 1,
        images: [],
        description: "",
        action_link: "https://",
        action_label: "Shop Now",
      })
    }
  }, [editingProduct, reset, categories])

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true)
      if (editingProduct) {
        await productService.update(editingProduct.id, {
          ...values,
          description: values.description || null,
        })
        toast.success("Product updated")
      } else {
        await productService.create({
          ...values,
          description: values.description || null,
        })
        toast.success("Product created")
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err.message || "Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingProduct ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Polca-Looca Scraft Hat"
              {...register("name")}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="category_id">Category *</Label>
            <select
              id="category_id"
              value={watch("category_id")}
              onChange={(e) => reset({ ...watch(), category_id: Number(e.target.value) })}
              disabled={isSubmitting}
              className="flex h-11 w-full rounded-2xl border-2 border-pink/50 bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-pink-deep focus-visible:ring-2 focus-visible:ring-pink/40"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categories_name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-500 font-medium">{errors.category_id.message}</p>
            )}
          </div>

          {/* Images Upload & Crop (3:4 Portrait, Max 3) */}
          <div className="space-y-1.5">
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  label="Product Images * (Up to 3, locked 3:4 portrait)"
                  value={field.value || []}
                  onChange={field.onChange}
                  aspect={3 / 4}
                  maxFiles={3}
                />
              )}
            />
            {errors.images && (
              <p className="text-xs text-red-500 font-medium">{errors.images.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description about handcrafted materials, dimensions, or usage..."
              {...register("description")}
              disabled={isSubmitting}
            />
          </div>

          {/* Action Link & Action Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="action_link">Action Link URL *</Label>
              <Input
                id="action_link"
                placeholder="https://shopee.co.id/..."
                {...register("action_link")}
                disabled={isSubmitting}
              />
              {errors.action_link && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.action_link.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="action_label">Action Button Label *</Label>
                <span className="text-[11px] text-muted-foreground">
                  {actionLabelValue.length}/30
                </span>
              </div>
              <Input
                id="action_label"
                maxLength={30}
                placeholder="e.g. Shop Now, Inquire"
                {...register("action_label")}
                disabled={isSubmitting}
              />
              {errors.action_label && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.action_label.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
