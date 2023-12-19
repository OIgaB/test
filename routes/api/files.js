import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileJoiSchema, File } from '../../models/files.js'; 
import { validateBody } from '../../decorators/index.js';

const assetsFolder = path.resolve('assets');
const router = express.Router();
router.use(fileUpload({
    limits: { fileSize: 16 * 1024 * 1024 }, // 16 Mb - максимальний розмір документа (об'єкта колекції БД)
}));


router.post('/', validateBody(fileJoiSchema), async(req, res) => {
    // console.log('req.body:', req.body); // {}
    console.log('req.files:', req.files);
    const { file } = req.files; // req.files надає ліба express-fileupload;  назва 'file' - це ключ, який ми придумали в Postman
    // console.log('file:', file);
    // file: {
    //     name: 'drink.jpg',
    //     data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 03 02 02 02 02 02 03 02 02 02 03 03 03 03 04 06 04 04 04 04 04 08 06 06 05 ... 58825 more bytes>,
    //     size: 58875, // 57,4 КБ (58 875 байтів)
    //     encoding: '7bit',
    //     tempFilePath: '',
    //     truncated: false,
    //     mimetype: 'image/jpeg',
    //     md5: '4a7ace1ab6b79dec05574046ceec8993',
    //     mv: [Function: mv]

    // file: {
    //     name: 'Agreement.pdf',
    //     data: <Buffer 25 50 44 46 2d 31 2e 34 0a 25 f6 e4 fc df 0a 31 20 30 20 6f 62 6a 0a 3c 3c 0a 2f 54 79 70 65 20 2f 43 61 74 61 6c 6f 67 0a 2f 56 65 72 73 69 6f 6e 20 ... 155237 more bytes>,
    //     size: 155287, // 151 КБ (155 207 байтів)
    //     encoding: '7bit',
    //     tempFilePath: '',
    //     truncated: false,
    //     mimetype: 'application/pdf',
    //     md5: '91cfbb96c31f50ffb8dea86a2761b0c1',
    //     mv: [Function: mv]
    //   }

    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileName = `${uniquePrefix}_${file.name}`; // 1700918443661-922862645_Agreement.pdf
    try{
        file.mv(path.join(assetsFolder, fileName)) 

        const result = await File.create({ 
            file: {
                name: fileName,
                data: file.data, 
                size: file.size,
                encoding: file.encoding,
                mimetype: file.mimetype,
            }
        });
        // res.status(200).json({ message: 'ok' })        
        res.status(200).json({ result });  
    } catch(e) {
        res.status(500).json({ message: e.message })
    }
}); 

export default router;