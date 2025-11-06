// Google Places API service for fetching reviews
// Documentation: https://developers.google.com/maps/documentation/places/web-service/details

export interface GoogleReview {
  author_name: string
  author_url?: string
  language?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

export interface PlaceDetails {
  name: string
  rating: number
  user_ratings_total: number
  reviews: GoogleReview[]
}

/**
 * Fetch place details including reviews from Google Places API
 * Note: Google Places API only returns maximum 5 most helpful reviews
 * 
 * @param placeId - Google Place ID
 * @param apiKey - Google Places API Key
 * @returns Place details with reviews or null if error
 */
export async function fetchGoogleReviews(
  placeId: string,
  apiKey: string
): Promise<PlaceDetails | null> {
  try {
    // Using CORS proxy for client-side requests
    // Alternative: Move this to API route in /app/api/reviews/route.ts for security
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Google Places API error:', response.status)
      return null
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Places API status:', data.status)
      return null
    }

    return data.result
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return null
  }
}

/**
 * Transform Google Review to our Testimonial format
 */
export function transformGoogleReview(review: GoogleReview) {
  return {
    id: review.time,
    name: review.author_name,
    location: 'Orlando, FL', // Default location
    rating: review.rating,
    date: review.relative_time_description,
    image: review.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author_name)}&background=FF6B00&color=fff&size=200`,
    text: review.text,
    service: 'Google Review'
  }
}
