import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/folder.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const folders = await Folder.find({ isPublic: true });
    console.log(folders);
    return NextResponse.json(folders);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, user, isPublic, description, tags } = await req.json();

    await connectDB();
    const newFolder = await Folder.create({
      name,
      user,
      isPublic,
      description,
      tags,
    });

    return NextResponse.json(newFolder);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
