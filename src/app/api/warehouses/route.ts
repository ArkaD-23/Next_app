import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";
import { warehouseSchema } from "@/lib/validators/warehouseSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const reqData = await req.json();
    let validatedData;

    try {
        validatedData = await warehouseSchema.parse(reqData);
    } catch (error) {
        return NextResponse.json({status: 400, message: error});
    }

    try {
        await db.insert(warehouses).values(validatedData);
        return NextResponse.json({status: 201, message: "OK warehouse inserted"});
    } catch (error) {
        return NextResponse.json({status: 500, message:"Failed to insert in db"});
    }
};

export async function GET() {
    try {
        const allWarehouses = await db.select().from(warehouses);
        return NextResponse.json(allWarehouses);
    } catch (error) {
        return NextResponse.json({status: 500, message: "Cannot fetch any warehouse"})
    }
};