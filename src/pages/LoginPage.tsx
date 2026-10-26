import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input, Label } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast.success("Login successful")
      navigate("/dashboard", { replace: true })
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-background overflow-hidden select-none">
      {/* Subtle brand decorations from Astro */}
      <img
        src="/decorations/flower-looca.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-12 left-12 w-16 sm:w-24 opacity-35 dark:opacity-15 animate-float pointer-events-none"
      />
      <img
        src="/decorations/star.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-20 right-16 w-10 sm:w-14 opacity-30 dark:opacity-10 animate-spin-slow pointer-events-none"
      />
      <img
        src="/decorations/heart.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-14 left-16 w-10 sm:w-14 opacity-30 dark:opacity-10 pointer-events-none"
      />
      <img
        src="/decorations/cherry.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-16 right-16 w-12 sm:w-16 opacity-35 dark:opacity-15 animate-float pointer-events-none"
      />

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ModeToggle />
      </div>

      <div className="w-full max-w-sm sm:max-w-md z-10">
        {/* Logo and clean Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="relative mb-3">
            <img
              src="/logo.png"
              alt="Looca ID"
              className="h-20 w-20 rounded-full object-cover border-2 border-pink-deep/50 shadow-md"
            />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Looca Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your admin dashboard
          </p>
        </div>

        {/* Card Form */}
        <Card className="border border-pink/40 dark:border-white/10 shadow-lg bg-card">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-pink-deep" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <Lock className="h-3.5 w-3.5 text-pink-deep" /> Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-sm font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
