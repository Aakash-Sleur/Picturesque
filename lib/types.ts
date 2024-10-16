export interface IFolder {
  name: string;
  user: IUser;
  isPublic: boolean;
  description: string;
  images: IImage[];
  tags: string[];
  createdAt: Date;
  _id: string;
}

export interface IImage {
  url: string;
  filename: string;
  folder: string;
  user: string;
  uploadedAt: Date;
  _id: string;
}

export interface IUser {
  email: string;
  password: string;
  name: string;
  phone: string;
  profile: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
