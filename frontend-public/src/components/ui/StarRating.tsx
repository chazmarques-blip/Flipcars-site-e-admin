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
  
  // Size classes
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  
  const starSize = sizeClasses[size]
  
  // Generate individual stars with their fill state
  const stars = []
  for (let i = 0; i < maxStars; i++) {
    const starValue = i + 1
    
    if (clampedRating >= starValue) {
      // Full star
      stars.push(
        <div key={i} className="relative inline-block">
          <Star 
            className={`${starSize} fill-primary text-primary`}
            strokeWidth={2}
          />
        </div>
      )
    } else if (clampedRating > i) {
      // Partial star
      const fillPercent = ((clampedRating - i) * 100)
      stars.push(
        <div key={i} className="relative inline-block">
          {/* Empty star background */}
          <Star 
            className={`${starSize} text-primary`}
            strokeWidth={2}
            fill="none"
          />
          {/* Filled portion overlay */}
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${fillPercent}%` }}
          >
            <Star 
              className={`${starSize} fill-primary text-primary`}
              strokeWidth={2}
            />
          </div>
        </div>
      )
    } else {
      // Empty star
      stars.push(
        <div key={i} className="relative inline-block">
          <Star 
            className={`${starSize} text-primary`}
            strokeWidth={2}
            fill="none"
          />
        </div>
      )
    }
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-0" style={{ gap: '1px' }}>
        {stars}
      </div>
      
      {showValue && (
        <span className="font-bold text-primary">
          {clampedRating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  )
}
