import React from 'react'
import { Button } from "@/components/ui/button"
import { Share2, Download, Edit, Trash2 } from "lucide-react"
import { IImage } from "@/lib/types"
import { useDownload } from "@/hooks/use-download"
import { useImageShare } from "@/hooks/use-image-share"
import { toast } from "@/hooks/use-toast"

interface ImageActionsProps {
    image: IImage | null
    isOwner: boolean
    onEdit: () => void
    onDelete: () => void
}

export default function ImageActions({ image, isOwner, onEdit, onDelete }: ImageActionsProps) {
    const handleShare = async (url: string) => {
        await useImageShare(url)
        toast({
            title: "Link Copied",
            description: "Image link has been copied to clipboard.",
        });
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

    if (!image) return null

    return (

        <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">By {image.user}</span>
            <div className="space-x-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-white bg-gray-800"
                    onClick={() => handleShare(image.url)}
                >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-white bg-gray-800"
                    onClick={() => handleDownload(image.url, image.filename)}
                >
                    <Download className="h-4 w-4 mr-2" /> Download
                </Button>
                {isOwner && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-700 text-white bg-gray-800"
                            onClick={onEdit}
                        >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-700 text-white bg-gray-800"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}