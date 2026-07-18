import { BadRequestException, PipeTransform } from '@nestjs/common';

export class FileSizeValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File | undefined) {
    if (!file) {
      return undefined;
    }
    const fiveMb = 5_000_000;

    if (file.size > fiveMb) {
      throw new BadRequestException('File size must be less than 5 MB');
    }

    return file;
  }
}
