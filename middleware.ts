import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const isUpload = url.pathname.startsWith("/api/upload")
  const isDocuments = url.pathname.startsWith("/api/documents")

  if (isUpload || (isDocuments && req.method !== "GET")) {
    const token = req.headers.get("x-admin-token") || url.searchParams.get("token")
    if (!token || token !== process.env.ADMIN_UPLOAD_TOKEN) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/upload", "/api/documents/:path*"],
}
