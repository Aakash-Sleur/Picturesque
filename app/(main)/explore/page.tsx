"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Search, FolderPlus, Globe, Lock, Folder, Tag } from "lucide-react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface IFolder {
    _id: string
    name: string
    user: string
    isPublic: boolean
    createdAt: string
    images: string[]
    tags: string[]
    description: string
    __v: number
}

const FolderCard = ({ folder }: { folder: IFolder }) => (
    <Link href={`/folder/${folder._id}`} className="block">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <Folder className="h-5 w-5 mr-2 text-purple-500" />
                        <h3 className="font-semibold text-white">{folder.name}</h3>
                    </div>
                    {folder.isPublic ? (
                        <Globe className="h-4 w-4 text-green-500" />
                    ) : (
                        <Lock className="h-4 w-4 text-yellow-500" />
                    )}
                </div>
                <p className="text-sm text-gray-400 mb-2">
                    Created: {new Date(folder.createdAt).toLocaleDateString()}
                </p>
                {folder.description && (
                    <p className="text-sm text-gray-300 mb-2">{folder.description}</p>
                )}
                {folder?.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {folder.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <p className="text-sm text-gray-400 mt-2">
                    Images: {folder?.images.length}
                </p>
            </CardContent>
        </Card>
    </Link>
)

export default function ExplorePage() {
    const searchParams = useSearchParams();
    const search = searchParams.get('search');
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [folderDescription, setFolderDescription] = useState("")
    const [folderTags, setFolderTags] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(true)
    const [folders, setFolders] = useState<IFolder[]>([])
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState(search || "")

    const { data: session } = useSession()
    const { toast } = useToast()
    console.log(folders)

    const fetchFolders = useCallback(async () => {
        try {
            const response = await axios.get("/api/folder")
            setFolders(response.data)
            setError(null)
        } catch (error) {
            console.error(error)
            setError("Failed to fetch folders. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFolders()
    }, [fetchFolders])

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session?.user?.id) {
            toast({
                title: "Error",
                description: "You must be logged in to create a folder.",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await axios.post("/api/folder", {
                name: folderName,
                description: folderDescription,
                tags: folderTags.split(',').map(tag => tag.trim()),
                isPublic,
                user: session.user.id,
            })
            toast({
                title: "Folder Created",
                description: response.data.message,
            })
            setIsDialogOpen(false)
            setFolderName("")
            setFolderDescription("")
            setFolderTags("")
            setIsPublic(false)
            fetchFolders() // Refresh the folder list
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create folder. Please try again.",
                variant: "destructive",
            })
            console.error(error)
        }
    }

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        folder.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        folder.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div className="text-center text-blue-600 text-xl font-semibold">Loading folders...</div>
    }

    if (error) {
        return <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
    }

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex-1 max-w-md">
                    <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            placeholder="Search folders..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 text-white hover:bg-green-700">
                            <FolderPlus className="h-4 w-4 mr-2" />
                            Add Folder
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Create New Folder</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateFolder} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="folderName">Folder Name</Label>
                                <Input
                                    id="folderName"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="Enter folder name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="folderDescription">Description</Label>
                                <Textarea
                                    id="folderDescription"
                                    value={folderDescription}
                                    onChange={(e) => setFolderDescription(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="Enter folder description"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="folderTags">Tags (comma-separated)</Label>
                                <Input
                                    id="folderTags"
                                    value={folderTags}
                                    onChange={(e) => setFolderTags(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="Enter tags, separated by commas"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isPublic"
                                    checked={isPublic}
                                    onCheckedChange={setIsPublic}
                                />
                                <Label htmlFor="isPublic">Make folder public</Label>
                            </div>
                            <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700">
                                Create Folder
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">Your Folders</h2>
                {filteredFolders.length === 0 ? (
                    <p className="text-center text-gray-400">No folders found. Create a new folder to get started!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFolders.map((folder) => (
                            <FolderCard key={folder._id} folder={folder} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}