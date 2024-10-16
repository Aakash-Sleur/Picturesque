'use client'

import React, { useState, useCallback, useEffect } from "react"
import { useParams } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Share2, Download, Calendar, ChevronLeft, ChevronRight, Plus, Upload, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { useSession } from "next-auth/react"
import { IUser } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { useDownload } from "@/hooks/use-download"
import { useImageShare } from "@/hooks/use-image-share"
import { FolderSkeleton } from "@/components/custom//folder/folder-skeleton"
import { ReactPhotoEditor } from 'react-photo-editor'
import 'react-photo-editor/dist/style.css'

interface IFolder {
    name: string;
    user: IUser;
    isPublic: boolean;
    description: string;
    images: IImage[];
    tags: string[];
    createdAt: Date;
    _id: string;
}

interface IImage {
    url: string;
    filename: string;
    folder: string;
    user: string;
    uploadedAt: Date;
    _id: string;
}

export default function FolderPage() {
    const { id } = useParams()
    const [folder, setFolder] = useState<IFolder | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [isEditingImage, setIsEditingImage] = useState(false)
    const [editingImageFile, setEditingImageFile] = useState<File | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const response = await fetch(`/api/folder/${id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch folder data')
                }
                const data = await response.json()
                setFolder({
                    ...data,
                    createdAt: new Date(data.createdAt),
                    images: data.images.map((img: any) => ({
                        ...img,
                        uploadedAt: new Date(img.uploadedAt)
                    }))
                })
            } catch (err) {
                setError('Failed to load folder data. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchFolder()
    }, [id])

    const handlePrevImage = () => {
        setSelectedImageIndex((prevIndex) =>
            prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : (folder?.images.length ?? 1) - 1
        );
    }

    const handleNextImage = () => {
        setSelectedImageIndex((prevIndex) =>
            prevIndex !== null && prevIndex < (folder?.images.length ?? 1) - 1 ? prevIndex + 1 : 0
        );
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleUpload = async () => {
        if (!folder || uploadedFiles.length === 0) return

        const formData = new FormData()
        formData.append('folderId', folder._id)
        formData.append('file', uploadedFiles[0])

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response) {
                throw new Error('Failed to upload image')
            }

            await axios.post(`/api/folder/${id}`, {
                url: response.data.imgUrl,
                filename: uploadedFiles[0].name,
                user: session?.user.id,
            })

            setIsUploadDialogOpen(false)
            setUploadedFiles([])
            window.location.reload();
        } catch (err) {
            console.error('Error uploading image:', err)
            toast({
                title: "Error",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDownload = async (imageUrl: string, filename: string) => {
        try {
            await useDownload(imageUrl, filename);
        } catch (error) {
            console.error('Error downloading image:', error)
            toast({
                title: "Error",
                description: "Failed to download image. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleShare = async (url: string) => {
        await useImageShare(url)
        toast({
            title: "Link Copied",
            description: "Image link has been copied to clipboard.",
        });
    }

    const handleEditImage = async () => {
        if (selectedImageIndex !== null && folder) {
            try {
                const response = await fetch(folder.images[selectedImageIndex].url);
                const blob = await response.blob();
                const file = new File([blob], folder.images[selectedImageIndex].filename, { type: blob.type });
                setEditingImageFile(file);
                setIsEditingImage(true);
            } catch (error) {
                console.error('Error preparing image for editing:', error);
                toast({
                    title: "Error",
                    description: "Failed to prepare image for editing. Please try again.",
                    variant: "destructive",
                });
            }
        }
    }

    const handleSaveEditedImage = async (editedFile: File) => {
        try {
            // Create a download link for the edited image
            const url = URL.createObjectURL(editedFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = editedFile.name || 'edited_image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Success",
                description: "Edited image downloaded successfully.",
            });
        } catch (error) {
            console.error('Error downloading edited image:', error);
            toast({
                title: "Error",
                description: "Failed to download edited image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsEditingImage(false);
            setEditingImageFile(null);
        }
    }

    const handleDeleteImage = async (imageId: string) => {
        if (!folder) return

        try {
            await axios.delete(`/api/image/${imageId}`)

            // Update the folder state to remove the deleted image
            setFolder(prevFolder => ({
                ...prevFolder!,
                images: prevFolder!.images.filter(img => img._id !== imageId)
            }))

            setSelectedImageIndex(null)
            toast({
                title: "Success",
                description: "Image deleted successfully.",
            })
        } catch (err) {
            console.error('Error deleting image:', err)
            toast({
                title: "Error",
                description: "Failed to delete image. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <FolderSkeleton />
    }

    if (error || !folder) {
        return <div className="text-center py-12 text-red-500">{error || 'Folder not found'}</div>
    }

    return (
        <>
            <main className="flex-1 py-12">
                <div className="px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{folder.name}</h1>
                            <p className="text-gray-400 mb-6">{folder.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {folder.images.map((image, index) => (
                                    <Card key={image._id} className="bg-gray-800 border-gray-700 cursor-pointer" onClick={() => setSelectedImageIndex(index)}>
                                        <CardContent className="p-0">
                                            <Image
                                                src={image.url}
                                                alt={image.filename}
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover"
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                                {
                                    folder.user._id === session?.user.id &&
                                    <Card className="bg-gray-800 border-gray-700 cursor-pointer" onClick={() => setIsUploadDialogOpen(true)}>
                                        <CardContent className="p-0 flex items-center justify-center h-48">
                                            <div className="text-center">
                                                <Plus className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                                <span className="text-gray-400">Add Picture</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                }
                            </div>
                        </div>
                        <div>
                            <Card className="bg-gray-800 border-gray-700 p-6">
                                <div className="flex items-center mb-4">
                                    <Avatar className="h-10 w-10 mr-4">
                                        <AvatarFallback>
                                            <Image src={folder.user.profile} alt={folder.user.name} width={32} height={32} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold">{folder.user.name}</h2>
                                        <p className="text-sm text-gray-400">Folder Owner</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                                    <span>Created on {folder.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {folder.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-200">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button className="w-full mb-2 bg-purple-600 hover:bg-purple-700" onClick={() => handleShare(window.location.href)}>
                                    <Share2 className="h-4 w-4 mr-2" /> Share Folder
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog open={selectedImageIndex !== null} onOpenChange={() => {
                setSelectedImageIndex(null);
                setIsEditingImage(false);
                setEditingImageFile(null);
            }}>
                <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                    <DialogHeader>
                        <span className="text-xl font-semibold text-white">
                            {selectedImageIndex !== null ? folder.images[selectedImageIndex]?.filename : ""}
                        </span>
                        <DialogDescription>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-400">By {folder.user.name}</span>
                                <div className="space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-700 text-white bg-gray-800"
                                        onClick={() => selectedImageIndex !== null && handleShare(folder.images[selectedImageIndex].url)}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" /> Share
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-700 text-white bg-gray-800"
                                        onClick={() => selectedImageIndex !== null && handleDownload(folder.images[selectedImageIndex].url, folder.images[selectedImageIndex].filename)}
                                    >
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </Button>
                                    {folder.user._id === session?.user.id && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-gray-700 text-white bg-gray-800"
                                                onClick={handleEditImage}
                                            >
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-gray-700 text-white bg-gray-800"
                                                onClick={() => selectedImageIndex !== null && handleDeleteImage(folder.images[selectedImageIndex]._id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    {selectedImageIndex !== null && !isEditingImage && (
                        <div className="mt-4 relative">
                            <Image
                                src={folder.images[selectedImageIndex].url}
                                alt={folder.images[selectedImageIndex].filename}
                                width={800}
                                height={600}
                                className="w-full h-auto object-contain"
                            />
                            <Button
                                variant="default"
                                size="icon"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2"

                                onClick={handlePrevImage}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="default"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={handleNextImage}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    )}
                    {isEditingImage && editingImageFile && (
                        <div className="mt-4 h-[600px]">
                            <ReactPhotoEditor
                                open={isEditingImage}
                                onClose={() => {
                                    setIsEditingImage(false);
                                    setEditingImageFile(null);
                                }}
                                file={editingImageFile}
                                allowColorEditing={true}
                                allowFlip={true}
                                allowRotate={true}
                                allowZoom={true}
                                onSaveImage={handleSaveEditedImage}
                                downloadOnSave={false}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-gray-900  border-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white">Upload New Picture</DialogTitle>
                        <DialogDescription>
                            Drag and drop your image or click to select a file.
                        </DialogDescription>
                    </DialogHeader>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${isDragActive ? "border-purple-500" : "border-gray-600"}`}
                    >
                        <input {...getInputProps()} />
                        {uploadedFiles.length > 0 ? (
                            <p className="text-gray-300">{uploadedFiles[0].name}</p>
                        ) : isDragActive ? (
                            <p className="text-purple-400">Drop the file here ...</p>
                        ) : (
                            <div>
                                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-400">Drag 'n' drop an image here, or click to select a file</p>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleUpload} className="w-full bg-purple-600 hover:bg-purple-700 mt-4" disabled={uploadedFiles.length === 0}>
                        Upload Picture
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}