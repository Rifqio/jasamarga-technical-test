import { RequestHandler } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

import { BusinessException } from '../exception';

const assetsPath = path.join(__dirname, '../../assets');
if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
}


const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, assetsPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),    
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        try {
            if (!whitelist.includes(file.mimetype)) {
                cb(new BusinessException(`Current file type is not allowed. Allowed types: ${whitelist.join(', ')}`));
                return;
            }

            cb(null, true);
        } catch (error) {
            cb(new BusinessException('Error processing file'));
        }
    }
});

export const FileUpload = {
    single: (fieldName: string): RequestHandler => {
        return (req, res, next) => {
            multerUpload.single(fieldName)(req, res, (error) => {
                if (error) {
                    return res.buildErrorResponse(error);
                }
                next();
            });
        };
    },
    fields: (fields: multer.Field[]): RequestHandler => {
        return (req, res, next) => {
            multerUpload.fields(fields)(req, res, (error) => {
                if (error) {
                    return res.buildErrorResponse(error);
                }
                next();
            });
        };
    },
    array: (fieldName: string, maxCount?: number): RequestHandler => {
        return (req, res, next) => {
            multerUpload.array(fieldName, maxCount)(req, res, (error) => {
                if (error) {
                    return res.buildErrorResponse(error);
                }
                next();
            });
        };
    }
};
