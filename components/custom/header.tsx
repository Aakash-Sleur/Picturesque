"use client"

import { useState, useEffect } from 'react'
import { Camera, User, LogIn, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Explore', href: '/explore' },
        { name: 'Edit', href: '/edit' },
        ...(status === "authenticated" ? [{ name: 'Profile', href: '/profile' }] : []),
    ]

    const showSession = () => {
        if (status === "authenticated" && session?.user) {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full text-black">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                                <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='text-black'>
                        <DropdownMenuItem onSelect={() => router.push('/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => signOut()} className="text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        } else if (status === "loading" || !mounted) {
            return (
                <Button variant="ghost" disabled>
                    <span className="text-sm text-black">Loading...</span>
                </Button>
            )
        } else {
            return (
                <div className="flex items-center space-x-2 text-black">
                    <Button variant="ghost" asChild>
                        <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            )
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link className="flex items-center space-x-2 text-primary" href="/">
                            <Camera className="h-6 w-6" />
                            <span className="text-xl font-bold">Picturesque</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        {showSession()}
                    </div>

                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-muted">
                        <div className="px-2 space-y-1">
                            {showSession()}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}