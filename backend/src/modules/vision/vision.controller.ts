import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { VisionService } from './vision.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Public()
  @Post('scan-vin')
  async scanVIN(@Body() body: { image: string }) {
    try {
      if (!body.image) {
        throw new HttpException(
          'Image data is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate base64 format (basic check)
      if (!body.image.match(/^[A-Za-z0-9+/=]+$/)) {
        throw new HttpException(
          'Invalid image format. Expected base64 encoded string.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.visionService.detectVIN(body.image);

      return {
        success: !!result.vin,
        vin: result.vin,
        confidence: result.confidence,
        message: result.vin 
          ? 'VIN detected successfully' 
          : 'No VIN found in image',
      };
    } catch (error) {
      console.error('[VisionController] Error scanning VIN:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to scan VIN. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
