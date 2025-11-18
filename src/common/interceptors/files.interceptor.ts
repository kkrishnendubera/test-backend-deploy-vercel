import { normalizeFilename } from '@helpers/utils.helper';
import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { existsSync, mkdirSync, unlink } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';


export const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/csv'];
const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.pdf'];

/**
 * File optimization implemented using sharp
 * @link https://medium.com/@tahaharbouch1/toward-secure-code-how-to-secure-file-upload-on-expressjs-using-multer-6598b1715bb4
 * @link https://stackoverflow.com/questions/67686442/how-upload-files-and-optimize-them-before-upload-using-multer-nodejs
 * import sharp from 'sharp';
 */

/**
 * @description Interceptor for handling single field fiel uploads with custom directories.
 * @description Use type example { Express.Multer.File[] }
 */
export const SingleFileInterceptor = (directory: string, fieldName: string) => FilesInterceptor(fieldName, 25, {
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    storage: diskStorage({
        destination(_req: Request, _file: Express.Multer.File, callback) {
            if (!existsSync('./public')) mkdirSync('./public');
            if (!existsSync('./public/uploads')) mkdirSync('./public/uploads');
            if (!existsSync(`./public/uploads/${directory}`)) mkdirSync(`./public/uploads/${directory}`);

            callback(null, `./public/uploads/${directory}`);
        },
        filename(_req, file, callback) {
            callback(null, normalizeFilename(file.originalname));
        },
    }),
    fileFilter(_req, file, callback) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
        }

        const ext = extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return callback(new Error('Invalid file extension!'), false);
        }

        callback(null, true);
    },
})

/**
 * @description Interceptor for handling multiple field file uploads with custom directories.
 * @description Use type example { fieldname: Express.Multer.Files[] }
 */
export const MultiFileInterceptor = (fileFields: { name: string, directory: string, maxCount?: number }[]) => FileFieldsInterceptor(
    fileFields,
    {
        storage: diskStorage({
            destination(_req: Request, file: Express.Multer.File, callback) {
                const currField = fileFields.find(field => file.fieldname === field.name);

                if (!existsSync('./public')) mkdirSync('./public');
                if (!existsSync('./public/uploads')) mkdirSync('./public/uploads');
                if (!existsSync(`./public/uploads/${currField.directory}`)) mkdirSync(`./public/uploads/${currField.directory}`);

                if (currField) { return callback(null, `./public/uploads/${currField.directory}`); }

                unlink(file.destination, (_err) => {
                    if(_err) callback(_err, null);
                    return callback(new BadRequestException(`Image fieldname not allowed: ${file.fieldname}. Please ensure the fieldname matches one of the specified fields.`), null);
                })
            },
            filename(_req, file, callback) {
                return callback(null, normalizeFilename(file.originalname));
            }
        }),
        fileFilter(_req, file, callback) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return callback(new BadRequestException(`Unsupported file type: ${file.mimetype}.`), false);
            }

            const ext = extname(file.originalname).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return callback(new Error('Invalid file extension!'), false);
            }

            return callback(null, true);
        }
    });