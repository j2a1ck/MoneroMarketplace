import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import 'multer';
import { fileTypeFromBuffer } from 'file-type';

//FIXME change file name
@Injectable()
export class ImageValidationPipe implements PipeTransform {
  async transform(files?: Express.Multer.File | Express.Multer.File[]) {
    if (!files) {
      return files;
    }

    const fileArray = Array.isArray(files) ? files : [files];

    const fiveMb = 5 * 1024 * 1024;

    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

    for (const file of fileArray) {
      if (file.size > fiveMb) {
        throw new BadRequestException('File size must be less than 5 MB');
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Only PNG, JPEG, and WEBP images are allowed',
        );
      }

      const type = await fileTypeFromBuffer(file.buffer);

      if (!type || !allowedMimeTypes.includes(type.mime)) {
        throw new BadRequestException('Invalid image file');
      }
    }

    return files;
  }
}
