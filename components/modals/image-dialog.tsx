import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { IImage } from "@/lib/types"
import ImageActions from './image-actions'
import ImageEditor from './image-editor'


interface ImageDialogProps {
    isOpen: boolean
    onClose: () => void
    images: IImage[]
    currentIndex: number | null
    isOwner: boolean
    onDelete: (imageId: string) => void
}

export default function ImageDialog({ isOpen, onClose, images, currentIndex, isOwner, onDelete }: ImageDialogProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editingFile, setEditingFile] = useState<File | null>(null)

    const handlePrevImage = () => {
        if (currentIndex !== null) {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
            onImageChange(newIndex)
        }
    }

    const handleNextImage = () => {
        if (currentIndex !== null) {
            const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
            onImageChange(newIndex)
        }
    }

    const onImageChange = (newIndex: number) => {
        // You might want to update the parent component's state here
        // For now, we'll just log the new index
        console.log("New image index:", newIndex)
    }

    const handleEdit = async () => {
        if (currentIndex !== null) {
            try {
                const response = await fetch(images[currentIndex].url);
                const blob = await response.blob();
                const file = new File([blob], images[currentIndex].filename, { type: blob.type });
                setEditingFile(file);
                setIsEditing(true);
            } catch (error) {
                console.error('Error preparing image for editing:', error);
                // Handle error (e.g., show toast notification)
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">
                        {currentIndex !== null ? images[currentIndex]?.filename : ""}
                    </DialogTitle>
                    <DialogDescription>
                        <ImageActions
                            image={currentIndex !== null ? images[currentIndex] : null}
                            isOwner={isOwner}
                            onEdit={handleEdit}
                            onDelete={() => currentIndex !== null && onDelete(images[currentIndex]._id)}
                        />
                    </DialogDescription>
                </DialogHeader>
                {currentIndex !== null && !isEditing && (
                    <div className="mt-4 relative">
                        <Image
                            src={images[currentIndex].url}
                            alt={images[currentIndex].filename}
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
                {isEditing && editingFile && (
                    <ImageEditor
                        file={editingFile}
                        onClose={() => {
                            setIsEditing(false);
                            setEditingFile(null);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}