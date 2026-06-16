import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres.ftezdnrmjrznvjzgvftj:Delgermurun0731@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
  },
});
