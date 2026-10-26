import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Save, LogOut } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { settingsService } from "@/services/settingsService"
import { useAuth } from "@/context/AuthContext"
import { SiteSettings } from "@/types"

const settingsSchema = z.object({
  whatsapp_number: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9]+$/, "Digits only, without + or spaces"),
  instagram_url: z.string().url("Must be a valid URL with https://"),
  tiktok_url: z.string().url("Must be a valid URL with https://"),
  shopee_url: z.string().url("Must be a valid URL with https://"),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export const SettingsPage: React.FC = () => {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const data = await settingsService.get()
        reset(data)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [reset])

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsSaving(true)
      await settingsService.save(values as SiteSettings)
      reset(values)
      toast.success("Settings saved")
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Configure contact channels, social media, and shop links."
      />

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground font-medium">
              Loading settings...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section 1: Customer Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-pink/30">
                  <img src="/icons/icon-whatsapp.svg" alt="WA" className="h-5 w-5" />
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Direct Customer Support
                  </h3>
                </div>

                <div className="space-y-1.5 max-w-md">
                  <Label htmlFor="whatsapp_number">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp_number"
                    placeholder="e.g. 6281215312939"
                    {...register("whatsapp_number")}
                    disabled={isSaving}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use international format with country code (e.g. 62 for Indonesia), without '+' or spaces.
                  </p>
                  {errors.whatsapp_number && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.whatsapp_number.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section 2: Social Media Links */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-pink/30">
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Social Media Profiles
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <Label htmlFor="instagram_url" className="flex items-center gap-1.5">
                      <img src="/icons/icon-instagram.svg" alt="IG" className="h-4 w-4" /> Instagram URL *
                    </Label>
                    <Input
                      id="instagram_url"
                      placeholder="https://instagram.com/looca_id"
                      {...register("instagram_url")}
                      disabled={isSaving}
                    />
                    {errors.instagram_url && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.instagram_url.message}
                      </p>
                    )}
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1.5">
                    <Label htmlFor="tiktok_url" className="flex items-center gap-1.5">
                      <img src="/icons/icon-tiktok.svg" alt="TikTok" className="h-4 w-4" /> TikTok URL *
                    </Label>
                    <Input
                      id="tiktok_url"
                      placeholder="https://tiktok.com/@looca_id"
                      {...register("tiktok_url")}
                      disabled={isSaving}
                    />
                    {errors.tiktok_url && (
                      <p className="text-xs text-red-500 font-medium">
                        {errors.tiktok_url.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Marketplace */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-pink/30">
                  <img src="/icons/icon-shopee.svg" alt="Shopee" className="h-5 w-5" />
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Online Marketplace
                  </h3>
                </div>

                <div className="space-y-1.5 max-w-md">
                  <Label htmlFor="shopee_url">Shopee Store Link *</Label>
                  <Input
                    id="shopee_url"
                    placeholder="https://shopee.co.id/looca_id"
                    {...register("shopee_url")}
                    disabled={isSaving}
                  />
                  {errors.shopee_url && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.shopee_url.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-between border-t border-pink/30">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isDirty || isSaving}
                  className="font-bold shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {isDirty && (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    You have unsaved changes
                  </span>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Mobile Logout Button (Visible only on mobile devices) */}
      <div className="lg:hidden pt-4">
        <Button
          variant="outline"
          onClick={() => setLogoutOpen(true)}
          className="w-full text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold h-12 rounded-2xl"
        >
          <LogOut className="h-4 w-4 mr-2" /> Log Out of Admin
        </Button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out from Looca Admin?"
        description="You will need to sign in again to modify site configuration."
        confirmLabel="Log Out"
        onConfirm={logout}
      />
    </div>
  )
}
