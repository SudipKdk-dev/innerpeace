import { Controller } from '@nestjs/common';
import { UploadsService } from '../service/uploads.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
}
