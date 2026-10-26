import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Tag } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { categoryService } from "@/services/categoryService"
import { productService } from "@/services/productService"
import { Category } from "@/types"

const categorySchema = z.object({
  categories_name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be under 255 characters"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirm dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  })

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [cats, products] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ])
      setCategories(cats)

      const counts: Record<number, number> = {}
      products.forEach((p) => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1
      })
      setProductCounts(counts)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setEditingCategory(null)
    reset({ categories_name: "" })
    setDialogOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat)
    reset({ categories_name: cat.categories_name })
    setDialogOpen(true)
  }

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsSubmitting(true)
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values)
        toast.success("Category updated")
      } else {
        await categoryService.create(values)
        toast.success("Category created")
      }
      setDialogOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to save category")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!targetDeleteId) return
    try {
      await categoryService.remove(targetDeleteId)
      toast.success("Category deleted")
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Cannot delete category")
    }
  }

  return (
    <div className="space-y-6">
      {/* Top navigation tabs pill */}
      <div className="flex items-center gap-2 border-b border-pink/30 pb-3">
        <Link
          to="/products"
          className="px-5 py-2 rounded-full font-semibold text-xs sm:text-sm text-muted-foreground hover:bg-secondary transition-all"
        >
          List Products
        </Link>
        <Link
          to="/products/categories"
          className="px-5 py-2 rounded-full font-semibold text-xs sm:text-sm bg-pink-deep text-white shadow-xs"
        >
          Categories
        </Link>
      </div>

      <PageHeader
        title="Categories"
        description="Manage product categories for your catalog."
        actions={
          <Button onClick={handleOpenAdd} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Category
          </Button>
        }
      />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground font-medium">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Create your first category to organize products."
          actionLabel="Add Category"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#ID</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="w-32 text-center">Products</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{cat.id}
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-pink-deep" />
                        <span>{cat.categories_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-light dark:bg-pink-900/40 text-pink-deep">
                        {productCounts[cat.id] || 0} items
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-full text-muted-foreground hover:text-pink-deep hover:bg-secondary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setTargetDeleteId(cat.id)
                            setDeleteOpen(true)
                          }}
                          className="p-2 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
          <div className="sm:hidden space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl border-2 border-pink/40 bg-card shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-heading font-bold text-foreground text-base">
                    {cat.categories_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    #{cat.id} &bull; {productCounts[cat.id] || 0} associated products
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-full bg-secondary text-pink-deep cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setTargetDeleteId(cat.id)
                      setDeleteOpen(true)
                    }}
                    className="p-2 rounded-full bg-red-50 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="categories_name">Category Name</Label>
              <Input
                id="categories_name"
                placeholder="e.g. Bagcharm, Accessories..."
                {...register("categories_name")}
                disabled={isSubmitting}
              />
              {errors.categories_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.categories_name.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category?"
        description="Are you sure you want to delete this category? If products are linked to it, the action will be blocked to maintain catalog consistency."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
