import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/folder.model";
import Image from "@/models/image.model";
import User from "@/models/user.model";

export async function GET(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    await connectDB();
    const folder = await Folder.findById(params.folderId)
      .populate({
        path: "images",
        model: Image,
      })
      .populate({
        path: "user",
        model: User,
      });

    if (!folder) {
      return NextResponse.json("Folder not found", { status: 404 });
    }
    return NextResponse.json(folder);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    await connectDB();
    const { filename, url, user } = await req.json();
    console.log(filename, url, user);

    if (!filename || !url || !user) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

    const newImage = await Image.create({
      filename,
      url,
      user,
      folder: params.folderId,
    });

    if (!newImage) {
      return NextResponse.json("Failed to create image", { status: 500 });
    }

    const folder = await Folder.findByIdAndUpdate(
      params.folderId,
      { $push: { images: newImage._id } },
      { new: true }
    );

    if (!folder) {
      return NextResponse.json("Failed to update folder", { status: 500 });
    }

    return NextResponse.json(newImage);
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
