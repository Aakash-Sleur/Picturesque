import React from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Share2, Calendar } from "lucide-react"
import Image from "next/image"
import { IFolder } from "@/lib/types"
import { useImageShare } from "@/hooks/use-image-share"
import { toast } from "@/hooks/use-toast"

interface FolderSidebarProps {
    folder: IFolder
}

export default function FolderSidebar({ folder }: FolderSidebarProps) {
    const handleShare = async (url: string) => {
        await useImageShare(url)
        toast({
            title: "Link Copied",
            description: "Folder link has been copied to clipboard.",
        });
    }

    return (
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
    )
}