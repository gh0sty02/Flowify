import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    // check if user is authenticated and is on the landing page
    if (auth.userId && auth.isPublicRoute) {
      // if user already has a organization, redirect him/her to that org page, else redirect him/her to select-org page
      let path = "/select-org";

      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }

      const orgSelection = new URL(path, req.url);

      return NextResponse.redirect(orgSelection);
    }

    // if unauthenticated, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Check if the user is authenticated, does not have an organization (org) assigned,
    // and is not currently on the "/select-org" page.
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);

      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
