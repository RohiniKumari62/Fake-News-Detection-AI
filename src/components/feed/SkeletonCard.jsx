// src/components/feed/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="news-card rounded-3xl overflow-hidden border border-white/5">
      {/* Image skeleton */}
      <div className="w-full h-52 animate-card-shimmer" />

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-3.5 bg-white/5 rounded-full w-full" />
          <div className="h-3.5 bg-white/5 rounded-full w-3/4" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-2.5 bg-white/5 rounded-full w-full" />
          <div className="h-2.5 bg-white/5 rounded-full w-5/6" />
          <div className="h-2.5 bg-white/5 rounded-full w-4/6" />
        </div>

        {/* Confidence */}
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-2.5 bg-white/5 rounded-full w-24" />
            <div className="h-2.5 bg-white/5 rounded-full w-10" />
          </div>
          <div className="h-1.5 bg-white/5 rounded-full w-full" />
        </div>

        {/* Actions */}
        <div className="border-t border-white/5 pt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-7 w-16 bg-white/5 rounded-xl" />
            <div className="h-7 w-16 bg-white/5 rounded-xl" />
          </div>
          <div className="flex gap-1">
            <div className="h-7 w-7 bg-white/5 rounded-xl" />
            <div className="h-7 w-7 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}