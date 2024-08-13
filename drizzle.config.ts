import {defineConfig} from "drizzle-kit"

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    }
})

//database string should be given in the terminal with export command as the environment variables are not accessible .