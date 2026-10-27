import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Injectable()
export class UploadsService {
  private readonly uploadPath = './uploads';

  async processImage(
    filename: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {}
  ): Promise<string> {
    const inputPath = join(this.uploadPath, filename);
    const { name, ext } = this.parseFilename(filename);

    const {
      width = 800,
      height,
      quality = 80,
      format = 'jpeg'
    } = options;

    const outputFilename = `${name}_processed.${format}`;
    const outputPath = join(this.uploadPath, outputFilename);

    try {
      
      let sharpInstance = sharp(inputPath);

      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      if (format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
      }

      await sharpInstance.toFile(outputPath);

      // Remove original file
      await fs.unlink(inputPath);

      return outputFilename;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image');
    }
  }

  async deleteImage(filename: string): Promise<void> {
    try {
      const filepath = join(this.uploadPath, filename);
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  private parseFilename(filename: string): { name: string; ext: string } {
    const lastDotIndex = filename.lastIndexOf('.');
    return {
      name: filename.substring(0, lastDotIndex),
      ext: filename.substring(lastDotIndex + 1),
    };
  }

  getImageUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}