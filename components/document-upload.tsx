"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useCompletion } from "@ai-sdk/react"
import dynamic from "next/dynamic"
const Streamdown = dynamic(async () => (await import("streamdown")).Streamdown, { ssr: false })
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, ImageIcon, File, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  summary?: string
  department?: string
  priority?: "low" | "medium" | "high" | "urgent"
  category?: string
  error?: string
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon
  if (type.includes("pdf") || type.includes("document")) return FileText
  return File
}

const getFileTypeColor = (type: string) => {
  if (type.startsWith("image/")) return "bg-green-100 text-green-800"
  if (type.includes("pdf")) return "bg-red-100 text-red-800"
  if (type.includes("document")) return "bg-blue-100 text-blue-800"
  return "bg-gray-100 text-gray-800"
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  const { completion, complete, error: completionError } = useCompletion({
    api: "/api/summarize",
    onFinish: (_prompt, completion) => {
      console.log("/api/summarize: stream finished, length=", completion.length)
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId
            ? {
                ...f,
                status: "completed",
                summary: completion,
              }
            : f,
        ),
      )
      setActiveFileId(null)
    },
  })

  const processFile = async (file: File): Promise<void> => {
    const fileId = Math.random().toString(36).substr(2, 9)
    setActiveFileId(fileId)

    // Add file to state with uploading status
    setUploadedFiles((prev) => [
      ...prev,
      {
        id: fileId,
        file,
        status: "uploading",
        progress: 0,
      },
    ])

    try {
      // Simulate file upload progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }

      // Update status to processing
      setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))

      // Extract text content (simplified - in real app would use proper text extraction)
      const content = `Sample document content for ${file.name}. This would contain the actual extracted text from the uploaded document for processing by the AI system.`

      // Call AI summarization API via useCompletion hook
      console.log("/api/summarize: sending request for file", file.name)
      await complete("", { body: { content, language: "english" } })
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Processing failed",
              }
            : f,
        ),
      )
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)

    // Process files sequentially
    for (const file of acceptedFiles) {
      await processFile(file)
    }

    setIsUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload documents for AI-powered processing and automatic routing to relevant departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Drag and drop files here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <Button disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Select Files"
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX, TXT, Images (PNG, JPG, GIF) • Max size: 10MB per file
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              {uploadedFiles.filter((f) => f.status === "completed").length} of {uploadedFiles.length} files processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.type)

              return (
                <div key={uploadedFile.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{uploadedFile.file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getFileTypeColor(uploadedFile.file.type)}>
                        {uploadedFile.file.type.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>

                      {uploadedFile.status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {uploadedFile.status === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      )}

                      <Button variant="ghost" size="sm" onClick={() => removeFile(uploadedFile.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{uploadedFile.status === "uploading" ? "Uploading..." : "Processing with AI..."}</span>
                        <span>{uploadedFile.progress}%</span>
                      </div>
                      <Progress value={uploadedFile.progress} className="h-2" />
                    </div>
                  )}

                  {/* Results */}
                  {(uploadedFile.status === "completed" || (uploadedFile.id === activeFileId && completion)) && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant="outline">{uploadedFile.department}</Badge>
                        <Badge className={getPriorityColor(uploadedFile.priority || "medium")}>
                          {uploadedFile.priority?.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary">{uploadedFile.category}</Badge>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <h5 className="font-medium text-sm mb-2">AI Summary:</h5>
                        <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                          <Streamdown>{uploadedFile.id === activeFileId ? completion : uploadedFile.summary}</Streamdown>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {uploadedFile.status === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{uploadedFile.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
