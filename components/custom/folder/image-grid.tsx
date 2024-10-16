import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Image from "next/image"
import { IImage } from "@/lib/types"

interface ImageGridProps {
    images: IImage[]
    onImageClick: (index: number) => void
    onAddClick: () => void
    isOwner: boolean
}

export default function ImageGrid({ images, onImageClick, onAddClick, isOwner }: ImageGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
                <Card key={image._id} className="bg-gray-800 border-gray-700 cursor-pointer" onClick={() => onImageClick(index)}>
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
            {isOwner && (
                <Card className="bg-gray-800 border-gray-700 cursor-pointer" onClick={onAddClick}>
                    <CardContent className="p-0 flex items-center justify-center h-48">
                        <div className="text-center">
                            <Plus className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                            <span className="text-gray-400">Add Picture</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}