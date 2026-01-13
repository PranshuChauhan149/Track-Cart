import connectDb from "@/lib/DB";
import orderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params} : {params :{orderId:stirng}}) {
    try {
        await connectDb();
        const {orderId} = await params;
        const {status}  = await req.json();
        const order = await orderModel.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message:"Order onot found"},{status:400})
        }
        order.status = status
        let availableDeliveryBoy:any[]
        if(status==="out of delivery" && !order.assignment){
            
        }

    } catch (error) {
        
    }
}