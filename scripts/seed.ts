import dotenv from "dotenv";
import path from "path";

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "electro-tech-dev" });
    console.log("✅ Connected to MongoDB");

    const AdminUserSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
      },
      { timestamps: true },
    );

    const AdminUser =
      mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

    await AdminUser.deleteMany({});
    console.log("🗑️  Cleared existing admin users");

    const hashedPassword = await bcrypt.hash("Admin@2025", 12);

    await AdminUser.create({
      email: "admin@electrotech-uae.com",
      password: hashedPassword,
      name: "Electrotech Admin",
    });

    console.log("✅ Admin user created:");
    console.log("   Email:    admin@electrotech-uae.com");
    console.log("   Password: Admin@2025");
    console.log("");
    console.log("⚠️  Change this password after first login!");

    await mongoose.disconnect();
    console.log("✅ Done");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
