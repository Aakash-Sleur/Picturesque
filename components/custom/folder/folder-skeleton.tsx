import { Skeleton } from "@/components/ui/skeleton";

export function FolderSkeleton() {
    return (
        <div className="flex-1 py-12 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div>
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-full mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-full" />

                        ))}
                    </div>
                </div>
                <div>
                    <Skeleton className="h-[300px] w-full" />
                </div>
            </div>
        </div>
    )
}