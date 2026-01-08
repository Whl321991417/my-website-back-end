import { Controller, Get, Post, Body, Put, Delete, Param, Res, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiNotFoundResponse, ApiConsumes, ApiBody as ApiBodyDoc } from '@nestjs/swagger';

@ApiTags('files')
@Controller('api/files')
export class FilesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Get all files' })
  @Get()
  async getAllFiles(@Res() res) {
    const files = await this.imagesService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Files retrieved successfully',
      files,
    });
  }

  @ApiOperation({ summary: 'Get file by ID' })
  @ApiOkResponse({ description: 'File retrieved successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @Get(':id')
  async getFileById(@Param('id') id: number, @Res() res) {
    const file = await this.imagesService.findById(id);
    if (file) {
      return res.status(HttpStatus.OK).json({
        message: 'File retrieved successfully',
        file,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not found',
      });
    }
  }

  @ApiOperation({ summary: 'Upload file' })
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
  async uploadFile(@UploadedFile() file, @Res() res) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded',
      });
    }

    // 保存文件信息到数据库
    const fileData = {
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
      url: `/uploads/${file.filename}`,
    };

    const savedFile = await this.imagesService.create(fileData);
    return res.status(HttpStatus.CREATED).json({
      message: 'File uploaded successfully',
      file: savedFile,
    });
  }

  @ApiOperation({ summary: 'Update file' })
  @ApiBody({
    description: 'File data to update',
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
  async updateFile(@Param('id') id: number, @Body() body, @Res() res) {
    const file = await this.imagesService.update(id, body);
    if (file) {
      return res.status(HttpStatus.OK).json({
        message: 'File updated successfully',
        file,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete file' })
  @ApiOkResponse({ description: 'File deleted successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
  @Delete(':id')
  async deleteFile(@Param('id') id: number, @Res() res) {
    const success = await this.imagesService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'File deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'File not found',
      });
    }
  }
}