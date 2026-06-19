import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectDB } from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import About from "@/models/About";

import { aboutSchema } from "@/validations/about";

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    await connectDB();

    const about = await About.findOne();

    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch about content" },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                   PATCH                                    */
/* -------------------------------------------------------------------------- */

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const payload = await req.json();

    const validation = aboutSchema.safeParse(payload);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0].message,
        },
        {
          status: 400,
        },
      );
    }

    const { title, caption, body } = validation.data;

    let about = await About.findOne();

    if (about) {
      about.title = title;
      about.caption = caption;
      about.body = body;

      await about.save();
    } else {
      about = await About.create({
        title,
        caption,
        body,
      });
    }

    return NextResponse.json({
      success: true,
      message: "About content updated successfully",
      data: about,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
