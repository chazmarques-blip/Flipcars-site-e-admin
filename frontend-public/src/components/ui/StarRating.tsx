import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number // 0-5
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export default function StarRating({ 
  rating, 
  maxStars = 5, 
  size = 'md',
  showValue = false,
  className = '' 
}: StarRatingProps) {
  // Ensure rating is between 0 and maxStars
  const clampedRating = Math.max(0, Math.min(maxStars, rating))
  
  // Calculate the percentage of stars to fill
  const fillPercentage = (clampedRating / maxStars) * 100
  
  // Size classes
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const starSize = sizeClasses[size]
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex relative">
        {/* Background stars (empty/outline) */}
        <div className="flex">
          {[...Array(maxStars)].map((_, i) => (
            <Star 
              key={`bg-${i}`} 
              className={`${starSize} text-primary`}
              strokeWidth={2}
            />
          ))}
        </div>
        
        {/* Foreground stars (filled) with exact percentage */}
        <div 
          className="flex absolute top-0 left-0 overflow-hidden" 
          style={{ width: `${fillPercentage}%` }}
        >
          {[...Array(maxStars)].map((_, i) => (
            <Star 
              key={`fg-${i}`} 
              className={`${starSize} fill-primary text-primary`}
              strokeWidth={2}
            />
          ))}
        </div>
      </div>
      
      {showValue && (
        <span className="font-bold text-primary">
          {clampedRating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  )
}
