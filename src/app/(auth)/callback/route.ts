// app/api/auth/callback/route.ts
import { createSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url),
    );
  }

  const payload = JSON.parse(atob(accessToken.split(".")[1]));
  const userId = payload.userId || payload.sub;

  await createSession(userId, accessToken);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
