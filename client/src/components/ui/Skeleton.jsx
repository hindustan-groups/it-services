/**
 * Skeleton — animated loading placeholder.
 * Usage: <Skeleton className="h-6 w-40" />
 */
export default function Skeleton({ className = '' }) {
  return <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} aria-hidden="true" />
}

/** Pre-built skeleton for a service card */
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-[0_2px_8px_0_rgba(26,62,140,0.08)]">
      <Skeleton className="h-12 w-12 rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}
