import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Slide List */}
        <div className="bg-[#161616] rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>

        {/* Right Column - Formatted Text */}
        <div className="bg-[#161616] rounded-lg shadow p-4">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="w-full h-[calc(100vh-200px)]" />
        </div>
      </div>
    </div>
  )
}

