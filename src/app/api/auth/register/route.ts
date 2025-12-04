import connectDb from "@/lib/DB";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return NextResponse.json(
        { message: "User registered successfully", user: safeUser },
        { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Register error", error: String(error) },
      { status: 500 }
    );
  }
}
