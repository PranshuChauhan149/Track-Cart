import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }
    

    return NextResponse.json({ user: session.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Get me error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
