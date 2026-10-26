import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Plus, Search, Pencil, Trash2, ExternalLink, MousePointerClick } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { EmptyState } from "@/components/common/EmptyState"
import { getMediaUrl } from "@/lib/utils"
import { ProductFormDialog } from "./ProductFormDialog"
import { productService } from "@/services/productService"
import { categoryService } from "@/services/categoryService"
import { Category, Product } from "@/types"

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCatId, setSelectedCatId] = useState<number | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Dialogs
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState<number | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [prods, cats] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])
      setProducts(prods)
      setCategories(cats)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!targetDeleteId) return
    try {
      await productService.remove(targetDeleteId)
      toast.success("Product deleted")
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product")
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCatId === "all" ? true : p.category_id === Number(selectedCatId)
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryName = (catId: number) => {
    return (
      categories.find((c) => c.id === catId)?.categories_name || "Uncategorized"
    )
  }

  return (
    <div className="space-y-6">
      {/* Top tabs navigation */}
      <div className="flex items-center gap-2 border-b border-pink/30 pb-3">
        <Link
          to="/products"
          className="px-5 py-2 rounded-full font-semibold text-xs sm:text-sm bg-pink-deep text-white shadow-xs"
        >
          List Products
        </Link>
        <Link
          to="/products/categories"
          className="px-5 py-2 rounded-full font-semibold text-xs sm:text-sm text-muted-foreground hover:bg-secondary transition-all"
        >
          Categories
        </Link>
      </div>

      <PageHeader
        title="Products"
        description="Manage product listings and track clicks."
        actions={
          <Button onClick={handleOpenAdd} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" /> Add Product
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCatId("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all cursor-pointer ${
              selectedCatId === "all"
                ? "bg-pink-deep text-white border-pink-deep shadow-xs"
                : "border-pink/50 text-foreground hover:bg-secondary"
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCatId(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all cursor-pointer ${
                  selectedCatId === c.id
                    ? "bg-pink-deep text-white border-pink-deep shadow-xs"
                    : "border-pink/50 text-foreground hover:bg-secondary"
                }`}
              >
                {c.categories_name} ({count})
              </button>
            )
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs rounded-full"
          />
        </div>
      </div>

      {/* Grid of Product Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground font-medium">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            searchQuery || selectedCatId !== "all"
              ? "Try adjusting your search query or filter tags."
              : "Add your first product to showcase in the catalog."
          }
          actionLabel="Add Product"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col justify-between group rounded-2xl sm:rounded-3xl border border-pink/40 dark:border-white/10"
            >
              <div>
                {/* Image container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                  <img
                    src={getMediaUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                    <Badge variant="secondary" className="shadow-xs font-semibold text-[9px] sm:text-[10px] px-2 py-0.5">
                      {getCategoryName(product.category_id)}
                    </Badge>
                  </div>
                </div>

                <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
                  <h4 className="font-heading font-bold text-xs sm:text-base text-foreground line-clamp-1">
                    {product.name}
                  </h4>

                  {/* Description hidden on mobile to avoid cramped card */}
                  {product.description && (
                    <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground pt-0.5 sm:pt-1">
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="h-3 w-3 text-pink-deep" />
                      <strong className="text-foreground">{product.total_click}</strong>
                    </span>
                    <a
                      href={product.action_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-deep hover:underline flex items-center gap-0.5 font-medium text-[10px] sm:text-[11px] truncate max-w-[80px] sm:max-w-none"
                    >
                      <span className="truncate">{product.action_label}</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-2 py-1.5 sm:px-4 sm:pb-4 sm:pt-0 flex items-center justify-end gap-0.5 sm:gap-1 border-t border-pink/15 dark:border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(product)}
                  className="h-7 px-2 text-[11px] sm:h-8 sm:px-2.5 sm:text-xs text-muted-foreground hover:text-pink-deep"
                >
                  <Pencil className="h-3 w-3 sm:mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTargetDeleteId(product.id)
                    setDeleteOpen(true)
                  }}
                  className="h-7 px-2 text-[11px] sm:h-8 sm:px-2 sm:text-xs text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <ProductFormDialog
        open={formOpen}
        editingProduct={editingProduct}
        onClose={() => setFormOpen(false)}
        onSuccess={loadData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Product?"
        description="Are you sure you want to remove this product from your shop list? This cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
