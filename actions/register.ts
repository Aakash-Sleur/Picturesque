"use server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/user.model";
import bcrypt from "bcrypt";

export const register = async (values: any) => {
  const { email, password, name, ...rest } = values;

  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      ...rest,
    });
    const savedUser = await user.save();
  } catch (e) {
    console.log(e);
  }
};
