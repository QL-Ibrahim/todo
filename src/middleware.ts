import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("authToken"); // Retrieve the auth token
  const isPublicPath = path === "/login" || path === "/signup";

  // Redirect logged-in users away from public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-logged-in users to login if they access protected paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request if it doesn't match the above conditions
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/:path*", // Include dashboard paths
    "/tasks/:path*", // Include tasks paths
    "/profile", // Include profile path
    "/", // Include the home/root path
  ],
};
