import React from 'react'
import { ReactPhotoEditor } from 'react-photo-editor'
import 'react-photo-editor/dist/style.css'
import { toast } from "@/hooks/use-toast"

interface ImageEditorProps {
    file: File
    onClose: () => void
}

export default function ImageEditor({ file, onClose }: ImageEditorProps) {
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
            onClose();
        }
    }

    return (
        <div className="mt-4 h-[600px]">
            <ReactPhotoEditor
                open={true}
                onClose={onClose}
                file={file}
                allowColorEditing={true}
                allowFlip={true}
                allowRotate={true}
                allowZoom={true}
                onSaveImage={handleSaveEditedImage}
                downloadOnSave={false}
            />
        </div>
    )
}