"use client"

import { Building2, FileText, Languages, LayoutDashboard, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { DocumentUpload } from "@/components/document-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

export function Header() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-card-foreground">KMRL DocuMind</h1>
                <p className="text-sm text-muted-foreground">Kochi Metro Rail Limited</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </Link>

            <Link href="/departments">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <LayoutDashboard className="h-4 w-4" />
                Departments
              </Button>
            </Link>

            <Link href="/summarize">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                AI Summarize
              </Button>
            </Link>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Languages className="h-4 w-4" />
              English
            </Button>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>
                    Upload documents for AI-powered processing and automatic routing
                  </DialogDescription>
                </DialogHeader>
                <DocumentUpload />
              </DialogContent>
            </Dialog>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
