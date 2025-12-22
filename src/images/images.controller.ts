import { Controller, Get, Post, Body, Put, Delete, Param, Res, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiConsumes, ApiBody as ApiBodyDoc } from '@nestjs/swagger';

@ApiTags('images')
@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Get all images' })
  @Get()
  async getAllImages(@Res() res) {
    const images = await this.imagesService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Images retrieved successfully',
      images,
    });
  }

  @ApiOperation({ summary: 'Get image by ID' })
  @ApiOkResponse({ description: 'Image retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @Get(':id')
  async getImageById(@Param('id') id: number, @Res() res) {
    const image = await this.imagesService.findById(id);
    if (image) {
      return res.status(HttpStatus.OK).json({
        message: 'Image retrieved successfully',
        image,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Image not found',
      });
    }
  }

  @ApiOperation({ summary: 'Upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBodyDoc({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadImage(@UploadedFile() file, @Res() res) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded',
      });
    }

    // 保存图片信息到数据库
    const imageData = {
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
      url: `/uploads/${file.filename}`,
    };

    const savedImage = await this.imagesService.create(imageData);
    return res.status(HttpStatus.CREATED).json({
      message: 'Image uploaded successfully',
      image: savedImage,
    });
  }

  @ApiOperation({ summary: 'Update image' })
  @ApiBody({
    description: 'Image data to update',
    schema: {
      type: 'object',
      properties: {
        fileName: { type: 'string' },
        filePath: { type: 'string' },
        fileSize: { type: 'number' },
        fileType: { type: 'string' },
        url: { type: 'string' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateImage(@Param('id') id: number, @Body() body, @Res() res) {
    const image = await this.imagesService.update(id, body);
    if (image) {
      return res.status(HttpStatus.OK).json({
        message: 'Image updated successfully',
        image,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Image not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete image' })
  @ApiOkResponse({ description: 'Image deleted successfully' })
  @ApiNotFoundResponse({ description: 'Image not found' })
  @Delete(':id')
  async deleteImage(@Param('id') id: number, @Res() res) {
    const success = await this.imagesService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Image deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Image not found',
      });
    }
  }
}