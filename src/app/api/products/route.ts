import { productSchema } from "@/lib/validators/productSchema";
import { unlink, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const data = await req.formData();

    let validatedData;

    try {
        validatedData = productSchema.parse({
            name: data.get("name"),
            image: data.get("image"),
            description: data.get("description"),
            price: Number(data.get("price")),
        });
    } catch (error) {
        return NextResponse.json({status: 400, message: error});
    }

    const filename = `${Date.now()}.${validatedData.image.name.split(".").slice(-1)}`;

    try {
        const buffer = Buffer.from(await validatedData.image.arrayBuffer());
        await writeFile(path.join(process.cwd(), "public/assets", filename), buffer);
    } catch (error) {
        return NextResponse.json({status: 500, message: "Failed to save the file to filesystem"})
    }

    try {
        await db.insert(products).values({...validatedData, image: filename});
    } catch (error) {
        try {
            await unlink(path.join(process.cwd(), "public/assets", filename));
        } catch (unlinkError) {
            console.error("Failed to delete the file after a database error:", unlinkError);
        }
        return NextResponse.json({status: 500, message: "Failed to store product into the database"});
    }

    return NextResponse.json({status: 201, message: "OK! everything went well"});
};

export async function GET() { 
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        return NextResponse.json(allProducts);
    } catch (error) {
        return NextResponse.json({status: 500, message: "Error while fetching product data"});
    }
};