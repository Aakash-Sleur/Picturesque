import User from "@/models/user.model";
import Folder from "@/models/folder.model"; // Ensure you import the Folder model
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Image from "@/models/image.model";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // Fetch the user by ID and populate the related folders
    const user = await User.findById(params.id); // Fetch user details
    console.log(params.id, "d");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch folders created by the user
    const folders = await Folder.find({ user: params.id })
      .populate({
        path: "images",
        model: Image,
      })
      .lean();
    console.log(folders);

    // Include the folders in the user object
    const userWithFolders = {
      user: user,
      folders: folders, // Add folders to the user object
    };

    return NextResponse.json(userWithFolders);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
