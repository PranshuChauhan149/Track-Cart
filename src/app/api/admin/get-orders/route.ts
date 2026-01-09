import connectDb from "@/lib/DB";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDb();
        const orders = await orderModel.find({}).populate("user")
        return NextResponse.json(orders, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `get manage order error ${error}` })
    }
}