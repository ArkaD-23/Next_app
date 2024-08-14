import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params } : { params: { id: string } }
) {
  const id = params.id;

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);
    if (!product.length) {
      return NextResponse.json({
        status: 400,
        message: `Product with id ${id} not found`,
      });
    }
    return NextResponse.json(product[0]);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: `Failed the product with id ${id}`,
    });
  }
}
