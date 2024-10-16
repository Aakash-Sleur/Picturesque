import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/folder.model";

export async function POST(req: Request) {
  try {
    const { url, filename, folder, user } = await req.json();

    await connectDB();
    const image = await Folder.create({
      url,
      filename,
      folder,
      user,
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
