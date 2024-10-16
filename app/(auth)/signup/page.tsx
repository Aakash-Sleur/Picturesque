"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, User, Mail, Lock, ArrowRight, Phone, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { register } from "@/actions/register"
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."),
    bio: z.string().max(500, "Bio must not exceed 500 characters.").optional(),
    agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
})

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [error, setError] = useState('')
    const router = useRouter()
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            address: "",
            phone: "",
            bio: "",
            agreeTerms: false,
        },
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImage(event.target.files[0])
        }
    }

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData()
            let bannerUrl = ''
            if (profileImage) {
                formData.append('file', profileImage);
                const uploadResponse = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                bannerUrl = uploadResponse.data.imgUrl;
            }

            console.log({
                name: data.name,
                profile: bannerUrl,
                password: data.password,
                email: data.email,
                phone: data.phone,
                bio: data.bio
            })

            const response = await register({
                name: data.name,
                profile: bannerUrl,
                password: data.password,
                email: data.email,
                phone: data.phone,
                bio: data.bio
            })
            if (response?.error) {
                console.error(response.error)
                toast({
                    title: "Error",
                    description: error
                })
            } else {
                toast({
                    title: "Registered Successfully",
                })
                router.push('/signin')
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.')
            console.error(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto my-10 bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl text-white font-bold text-center">Create an Account</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Join Picturesque and start sharing your photos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-white" htmlFor="profile-image">Profile Image</Label>
                            <Input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Input placeholder="John Doe" {...field} className="pl-10 bg-gray-700 border-gray-600 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Input type="email" placeholder="m@example.com" {...field} className="pl-10 bg-gray-700 border-gray-600 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Input type="password" {...field} className="pl-10 bg-gray-700 border-gray-600 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Input placeholder="123 Main St, City, Country" {...field} className="pl-10 bg-gray-700 border-gray-600 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Phone Number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                            <Input type="tel" placeholder="+1234567890" {...field} className="pl-10 bg-gray-700 border-gray-600 text-white" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Bio (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little about yourself..."
                                            className="resize-none bg-gray-700 border-gray-600 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agreeTerms"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-sm text-gray-400">
                                            I agree to the{" "}
                                            <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                                Privacy Policy
                                            </Link>
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-center text-sm text-gray-400 w-full">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-medium">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}