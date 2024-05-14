import {MulterModule} from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import {Module} from "@nestjs/common";

@Module({
    imports: [MulterModule.register({
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                callback(null, `${file.originalname}`);
            }
        })
    })],
    exports: [
        MulterModule
    ]
})
export class Multer {}