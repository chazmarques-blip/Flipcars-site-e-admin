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
  
  // Size mapping for consistent sizing
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20
  }
  
  const starSizePx = sizeMap[size]
  
  // Generate individual stars with their fill state
  const stars = []
  for (let i = 0; i < maxStars; i++) {
    const starValue = i + 1
    
    if (clampedRating >= starValue) {
      // Full star
      stars.push(
        <div key={i} className="relative" style={{ width: starSizePx, height: starSizePx, display: 'inline-block' }}>
          <Star 
            width={starSizePx}
            height={starSizePx}
            className="fill-primary text-primary"
            strokeWidth={2}
          />
        </div>
      )
    } else if (clampedRating > i) {
      // Partial star - calculate fill percentage
      const fillPercent = (clampedRating - i) * 100
      
      stars.push(
        <div key={i} className="relative" style={{ width: starSizePx, height: starSizePx, display: 'inline-block' }}>
          {/* Empty star background */}
          <Star 
            width={starSizePx}
            height={starSizePx}
            className="absolute top-0 left-0 text-primary"
            strokeWidth={2}
            fill="none"
          />
          {/* Filled portion with clip-path */}
          <div 
            className="absolute top-0 left-0"
            style={{ 
              width: `${fillPercent}%`,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Star 
              width={starSizePx}
              height={starSizePx}
              className="fill-primary text-primary"
              strokeWidth={2}
            />
          </div>
        </div>
      )
    } else {
      // Empty star
      stars.push(
        <div key={i} className="relative" style={{ width: starSizePx, height: starSizePx, display: 'inline-block' }}>
          <Star 
            width={starSizePx}
            height={starSizePx}
            className="text-primary"
            strokeWidth={2}
            fill="none"
          />
        </div>
      )
    }
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex" style={{ gap: '2px' }}>
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
