import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { createReadStream, readFileSync, readSync, statSync } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): string {
    return readFileSync(join(__dirname, '../src/view/index.html')).toString();
  }

  @Get('/video')
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  getVideo(@Res() response: Response, @Req() request: Request): void {
    const path = this.appService.getVideoPath();
    const stats = statSync(path);
    const fileSize = stats.size;

    if (request.headers.range) {
      const parts = request.headers.range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = createReadStream(path, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      response.writeHead(206, head);
      file.pipe(response);
    } else {
      const head = { 'Content-Length': fileSize, 'Content-Type': 'video/mp4' };
      response.writeHead(206, head);
      createReadStream(path).pipe(response);
    }
  }
}
