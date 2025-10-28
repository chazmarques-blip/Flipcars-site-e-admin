import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  getInfo(): object {
    return {
      name: 'FlipCars 2.0 Backend API',
      version: '1.0.0',
      description: 'Auto Body Shop Management Platform with AI Integration',
      phase: 'Phase 1 - Backend Core Development',
      documentation: '/api/docs',
      health: '/api/health',
    };
  }
}
