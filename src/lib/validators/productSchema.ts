import { z } from "zod";

export const productSchema = z.object({
    name: z.string({message: "Product name should be a String"}),
    image: z.instanceof(File, {message: "Product image should be a file or image"}),
    description: z.string({message: "Product description should be a string"}),
    price: z.number({message: "Price should be a number"}),
})