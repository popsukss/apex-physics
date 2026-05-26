import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createClient();

  try {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
