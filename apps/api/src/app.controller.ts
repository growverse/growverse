import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root endpoint' })
  @ApiResponse({ status: 200, description: 'API information' })
  getRoot() {
    return {
      message: 'Growverse API',
      version: '0.2.0',
      documentation: '/docs',
      health: '/health',
      endpoints: {
        users: '/users',
        health: '/health',
        documentation: '/docs',
      },
    };
  }
}
