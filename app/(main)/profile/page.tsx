'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, MessageSquare, MapPin, Mail, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface IImage {
    _id: string
    url: string
    filename: string
    folder: string
    user: string
    uploadedAt: string
}

interface IFolder {
    _id: string
    name: string
    user: string
    images: IImage[]
    isPublic: boolean
    tags: string[]
    description: string
    createdAt: string
}

interface IUser {
    _id: string
    email: string
    name: string
    phone: string
    profile: string
    createdAt: string
    updatedAt: string
}

interface UserData {
    user: IUser
    folders: IFolder[]
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("photos")
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        const fetchUserData = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/users/${session.user.id}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data')
                    }
                    const data = await response.json()
                    setUserData(data)
                } catch (err) {
                    setError('Failed to load user data. Please try again later.')
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchUserData()
    }, [session])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error || !userData) {
        return <div>{error || 'User not found'}</div>
    }

    const totalImages = userData.folders.reduce((total, folder) => total + folder.images.length, 0)

    return (
        <main className="flex-1 py-12 bg-gray-900 text-white">
            <div className="px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_3fr]">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-32 w-32 mb-4">
                                    <AvatarImage src={userData.user.profile} alt={userData.user.name} />
                                    <AvatarFallback>{userData.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-2xl font-bold">{userData.user.name}</h1>
                                <p className="text-purple-400">@{userData.user.name.toLowerCase().replace(' ', '')}</p>
                                <Button className="mt-6 w-full bg-purple-600 hover:bg-purple-700">Edit Profile</Button>
                            </div>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center text-gray-400">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>{userData.user.phone}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Mail className="h-5 w-5 mr-2" />
                                    <a href={`mailto:${userData.user.email}`} className="hover:text-purple-400">
                                        {userData.user.email}
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    <span>Joined {new Date(userData.user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg">
                                        <Camera className="h-6 w-6 mb-2 text-purple-400" />
                                        <span className="text-2xl font-bold">{totalImages}</span>
                                        <span className="text-sm text-gray-400">Photos</span>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg">
                                        <MessageSquare className="h-6 w-6 mb-2 text-purple-400" />
                                        <span className="text-2xl font-bold">{userData.folders.length}</span>
                                        <span className="text-sm text-gray-400">Folders</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                                <TabsTrigger value="photos">Photos</TabsTrigger>
                                <TabsTrigger value="folders">Folders</TabsTrigger>
                            </TabsList>
                            <TabsContent value="photos" className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {userData.folders.flatMap(folder => folder.images).map((image: IImage) => (
                                        <Card key={image._id} className="bg-gray-800 border-gray-700">
                                            <CardContent className="p-0">
                                                <Image
                                                    src={image.url}
                                                    alt={image.filename}
                                                    width={400}
                                                    height={300}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold mb-2">{image.filename}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="folders" className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {userData.folders.map((folder) => (
                                        <Link key={folder._id} href={`/folder/${folder._id}`}>

                                            <Card key={folder._id} className="bg-gray-800 border-gray-700">
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold mb-2">{folder.name}</h3>
                                                    <p className="text-sm text-gray-400 mb-2">{folder.images.length} photos</p>
                                                    <p className="text-sm text-gray-400 mb-2">{folder.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {folder.tags.map((tag, index) => (
                                                            <span key={index} className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-1">
                                                        {folder.images.slice(0, 3).map((image) => (
                                                            <Image
                                                                key={image._id}
                                                                src={image.url}
                                                                alt={image.filename}
                                                                width={100}
                                                                height={100}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </main>
    )
}