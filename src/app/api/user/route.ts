import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Check if the user already exists
    let user = await prisma.user.findUnique({
      where: { name: userId },
    });

    if (user) {
      // If user already exists, return the existing user
      return NextResponse.json(
        { message: "User already exists", user },
        { status: 200 }
      );
    }

    // If user does not exist, create a new one
    user = await prisma.user.create({
      data: { name: userId },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
   const user = await prisma.user.findMany({
     orderBy: {
       score: "desc", 
     },
   });

    return NextResponse.json({ data: "Success", user }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 200 });
  }
}
