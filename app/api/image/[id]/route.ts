import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/folder.model";
import Image from "@/models/image.model";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    console.log(params.id);
    const image = await Image.findByIdAndDelete(params.id);
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(image.folder, {
      $pull: { images: image._id },
    });

    if (!updatedFolder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Image deleted successfully", image });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
