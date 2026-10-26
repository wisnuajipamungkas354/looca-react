import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-3">
      <h1 className="font-heading text-4xl font-extrabold text-foreground">
        404
      </h1>
      <h2 className="text-lg font-semibold text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-2">
        <Link to="/dashboard">
          <Button>
            <Home className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
