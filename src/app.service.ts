import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * @returns videoPath - Caminho para o vídeo.
   */
  getVideoPath(): string {
    return join(__dirname, '../src/resources/video.mp4');
  }
}
