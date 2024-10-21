'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, RotateCw, RotateCcw, ZoomIn, ZoomOut, Save, Contrast, Sun, Image as ImageIcon, Palette } from 'lucide-react'

type Filter = 'none' | 'grayscale' | 'sepia' | 'invert'

export default function ImageEditor() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [contrast, setContrast] = useState(100)
    const [brightness, setBrightness] = useState(100)
    const [saturation, setSaturation] = useState(100)
    const [filter, setFilter] = useState<Filter>('none')
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setSelectedImage(e.target?.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleCropComplete = (crop: PixelCrop) => {
        console.log('Crop complete:', crop)
    }

    const handleRotateLeft = () => {
        setRotation((prev) => (prev - 90 + 360) % 360)
    }

    const handleRotateRight = () => {
        setRotation((prev) => (prev + 90) % 360)
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.1))
    }

    const applyFilters = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.filter = `contrast(${contrast}%) brightness(${brightness}%) saturate(${saturation}%)`

        switch (filter) {
            case 'grayscale':
                ctx.filter += ' grayscale(100%)'
                break
            case 'sepia':
                ctx.filter += ' sepia(100%)'
                break
            case 'invert':
                ctx.filter += ' invert(100%)'
                break
        }
    }, [contrast, brightness, saturation, filter])

    const handleSave = useCallback(() => {
        if (!selectedImage || !canvasRef.current) return

        const image = new Image()
        image.src = selectedImage
        image.crossOrigin = "anonymous"

        image.onload = () => {
            const canvas = canvasRef.current!
            const ctx = canvas.getContext('2d')

            if (!ctx) return

            canvas.width = image.width
            canvas.height = image.height

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.scale(zoom, zoom)
            ctx.translate(-canvas.width / 2, -canvas.height / 2)

            applyFilters(ctx)

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

            ctx.setTransform(1, 0, 0, 1, 0, 0)

            if (crop) {
                const croppedCanvas = document.createElement('canvas')
                const croppedCtx = croppedCanvas.getContext('2d')

                if (!croppedCtx) return

                croppedCanvas.width = crop.width
                croppedCanvas.height = crop.height

                croppedCtx.drawImage(
                    canvas,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                )

                croppedCanvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'edited-image.png'
                        a.click()
                        URL.revokeObjectURL(url)
                    }
                })
            } else {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'edited-image.png'
                        a.click()
                        URL.revokeObjectURL(url)
                    }
                })
            }
        }
    }, [selectedImage, crop, rotation, zoom, applyFilters])

    useEffect(() => {
        if (selectedImage && canvasRef.current) {
            const image = new Image()
            image.src = selectedImage
            image.crossOrigin = "anonymous"
            image.onload = () => {
                const canvas = canvasRef.current!
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    canvas.width = image.width
                    canvas.height = image.height
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.translate(canvas.width / 2, canvas.height / 2)
                    ctx.rotate((rotation * Math.PI) / 180)
                    ctx.scale(zoom, zoom)
                    ctx.translate(-canvas.width / 2, -canvas.height / 2)
                    applyFilters(ctx)
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                }
            }
        }
    }, [selectedImage, rotation, zoom, contrast, brightness, saturation, filter, applyFilters])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Polished Image Editor</h1>
            <div className="mb-6">
                <Label htmlFor="image-upload" className="cursor-pointer">
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors">
                        <CardContent className="flex items-center justify-center h-40">
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
                            </div>
                        </CardContent>
                    </Card>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </Label>
            </div>
            {selectedImage && (
                <div className="space-y-6">
                    <div className="w-full h-96 object-contain overflow-auto bg-gray-100 rounded-lg p-4">
                        <ReactCrop
                            crop={crop}
                            className='w-[600px] h-[500px] object-cover mx-auto'
                            onChange={(c) => setCrop(c)}
                            onComplete={handleCropComplete}
                        >
                            <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
                        </ReactCrop>
                    </div>
                    <Tabs defaultValue="transform" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="transform">Transform</TabsTrigger>
                            <TabsTrigger value="adjust">Adjust</TabsTrigger>
                            <TabsTrigger value="filter">Filter</TabsTrigger>
                        </TabsList>
                        <TabsContent value="transform" className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={handleRotateLeft}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Rotate Left
                                </Button>
                                <Button onClick={handleRotateRight}>
                                    <RotateCw className="mr-2 h-4 w-4" /> Rotate Right
                                </Button>
                                <Button onClick={handleZoomIn}>
                                    <ZoomIn className="mr-2 h-4 w-4" /> Zoom In
                                </Button>
                                <Button onClick={handleZoomOut}>
                                    <ZoomOut className="mr-2 h-4 w-4" /> Zoom Out
                                </Button>
                            </div>
                            <div>
                                <Label htmlFor="zoom-slider" className="mb-2 block">Zoom</Label>
                                <Slider
                                    id="zoom-slider"
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    value={[zoom]}
                                    onValueChange={(value) => setZoom(value[0])}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="adjust" className="space-y-4">
                            <div>
                                <Label htmlFor="contrast-slider" className="mb-2 block">Contrast</Label>
                                <Slider
                                    id="contrast-slider"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[contrast]}
                                    onValueChange={(value) => setContrast(value[0])}
                                />
                            </div>
                            <div>
                                <Label htmlFor="brightness-slider" className="mb-2 block">Brightness</Label>
                                <Slider
                                    id="brightness-slider"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[brightness]}
                                    onValueChange={(value) => setBrightness(value[0])}
                                />
                            </div>
                            <div>
                                <Label htmlFor="saturation-slider" className="mb-2 block">Saturation</Label>
                                <Slider
                                    id="saturation-slider"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[saturation]}
                                    onValueChange={(value) => setSaturation(value[0])}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="filter" className="space-y-4">
                            <div>
                                <Label htmlFor="filter-select" className="mb-2 block">Filter</Label>
                                <Select value={filter} onValueChange={(value: Filter) => setFilter(value)}>
                                    <SelectTrigger id="filter-select">
                                        <SelectValue placeholder="Select a filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="grayscale">Grayscale</SelectItem>
                                        <SelectItem value="sepia">Sepia</SelectItem>
                                        <SelectItem value="invert">Invert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <Button onClick={handleSave} className="w-full">
                        <Save className="mr-2 h-4 w-4" /> Save Edited Image
                    </Button>
                </div>
            )}
        </div>
    )
}