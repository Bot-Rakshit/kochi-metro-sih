import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileWarning } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <FileWarning className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-4xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/documents">View All Documents</Link>
        </Button>
      </div>
    </div>
  )
}
