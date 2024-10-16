import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { IImage } from "@/lib/types"

interface UploadDialogProps {
    isOpen: boolean
    onClose: () => void
    folderId: string
    onUpload: (newImage: IImage) => void
}

export default function UploadDialog({ isOpen, onClose, folderId, onUpload }: UploadDialogProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const { data: session } = useSession()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadedFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) return

        const formData = new FormData()
        formData.append('folderId', folderId)
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

            const newImageResponse = await axios.post(`/api/folder/${folderId}`, {
                url: response.data.imgUrl,
                filename: uploadedFiles[0].name,
                user: session?.user.id,
            })

            onUpload(newImageResponse.data)
            onClose()
            setUploadedFiles([])
        } catch (err) {
            console.error('Error uploading image:', err)
            toast({
                title: "Error",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
    )
}