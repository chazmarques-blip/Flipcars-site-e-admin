import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VisionService {
  private readonly apiKey: string | undefined;
  private readonly apiUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_VISION_API_KEY');
    
    if (!this.apiKey) {
      console.warn('[VisionService] WARNING: GOOGLE_VISION_API_KEY not configured');
    }
  }

  async detectVIN(base64Image: string): Promise<{ vin: string | null; confidence: number }> {
    if (!this.apiKey) {
      throw new HttpException(
        'Google Vision API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    try {
      console.log('[VisionService] Calling Google Vision API...');
      
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 10,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[VisionService] API Error:', errorData);
        throw new HttpException(
          `Google Vision API error: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();
      console.log('[VisionService] API Response received');

      // Extract text from response
      const annotations = data.responses?.[0]?.textAnnotations || [];
      
      if (annotations.length === 0) {
        console.log('[VisionService] No text detected in image');
        return { vin: null, confidence: 0 };
      }

      // Full text is in the first annotation
      const fullText = annotations[0]?.description || '';
      console.log('[VisionService] Detected text:', fullText.substring(0, 100));

      // Extract VIN from text
      const vin = this.extractVIN(fullText);

      if (vin) {
        console.log('[VisionService] VIN found:', vin);
        // Estimate confidence based on text detection
        const confidence = annotations[0]?.score || 0.85;
        return { vin, confidence };
      }

      console.log('[VisionService] No valid VIN found in detected text');
      return { vin: null, confidence: 0 };

    } catch (error) {
      console.error('[VisionService] Error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to process image with Google Vision API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private extractVIN(text: string): string | null {
    // Remove spaces, newlines, and convert to uppercase
    const cleaned = text.replace(/[\s\n\r\-]/g, '').toUpperCase();

    // VIN regex: 17 characters, excluding I, O, Q
    const vinRegex = /[A-HJ-NPR-Z0-9]{17}/g;
    const matches = cleaned.match(vinRegex);

    if (!matches || matches.length === 0) {
      return null;
    }

    // Return first match (most likely to be the VIN)
    // Could add additional validation here (check digit algorithm)
    return matches[0];
  }

  /**
   * Validates VIN using check digit algorithm (ISO 3779)
   * Currently not used, but available for future enhancement
   */
  private validateCheckDigit(vin: string): boolean {
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    const transliteration: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
      J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
      S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
      '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    };

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = transliteration[char];
      
      if (value === undefined) {
        return false; // Invalid character
      }
      
      sum += value * weights[i];
    }

    const checkDigit = sum % 11;
    const expectedChar = checkDigit === 10 ? 'X' : checkDigit.toString();

    return vin[8] === expectedChar;
  }
}
