import { Skeleton } from './skeleton'
import { cn } from '@/utils/tw-merge'

interface SkeletonCardProps {
  className?: string
  avatar?: boolean
  lines?: number
  button?: boolean
}

export function SkeletonCard({
  className,
  avatar = true,
  lines = 3,
  button = true,
}: SkeletonCardProps) {
  return (
    <div className={cn('p-6 border rounded-lg bg-white', className)}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4',
              i === lines - 1 && 'w-[80%]' // Last line shorter
            )}
          />
        ))}
      </div>

      {button && (
        <div className="mt-4 flex justify-end space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </div>
  )
}

export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex space-x-4 p-4 border-b">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-20 ml-auto" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4">
          <Skeleton className="h-8 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2 ml-auto">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonForm({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn('space-y-6 max-w-md mx-auto p-6', className)}>
      <div className="text-center space-y-2 mb-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      <Skeleton className="h-10 w-full" />
    </div>
  )
}
