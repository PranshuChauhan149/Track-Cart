import { auth } from "@/auth";
import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      );
    }

    await connectDb();

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Get me error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
