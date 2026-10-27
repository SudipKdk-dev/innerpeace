import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const bucketName =
      this.configService.get<string>('AWS_BUCKET');
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET or AWS_BUCKET is not set');
    }
    this.bucketName = bucketName;

    const region = this.configService.getOrThrow<string>('AWS_REGION');
    const accessKeyId = this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');

    this.publicBaseUrl =
      this.configService.get<string>('AWS_S3_PUBLIC_BASE_URL');

    this.s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadPublicFile(file: Express.Multer.File, prefix: string): Promise<string> {
    const safeName = this.safeFilename(file.originalname);
    const key = `${prefix.replace(/\/+$/, '')}/${randomUUID()}-${safeName}`;

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const acl = this.configService.get<string>('AWS_S3_ACL');
    if (acl) {
      params.ACL = acl as any;
    }

    await this.s3.send(new PutObjectCommand(params));
    return key;
  }

  async deletePublicFile(key?: string | null): Promise<void> {
    if (!key) return;

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key.replace(/^\/+/, ''),
      }),
    );
  }

  fileUrl(key?: string | null): string | null {
    if (!key) return null;
    console.log(key)

    // If key is already a full URL, return as-is
    if (/^https?:\/\//i.test(key)) return key;

    // If public base URL is configured, use it
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;
    }

    // Fallback to S3 standard URL format
    return `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key.replace(/^\/+/, '')}`;
  }




  async presignPutObject(key: string, mimeType: string, expiresInSec = 60 * 5): Promise<string> {
    const cmd = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3, cmd, { expiresIn: expiresInSec });
  }

  /**
   * NEW:
   * Create a presigned GET URL for secure playback/download.
   */
  async presignGetObject(key: string, expiresInSec = 60 * 10): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3, cmd, { expiresIn: expiresInSec });
  }

  private safeFilename(name: string): string {
    const cleaned = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9._-]/g, '');

    return cleaned || 'file';
  }
}

