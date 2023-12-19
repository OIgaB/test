import { Schema, model } from 'mongoose';
import Joi from 'joi';
// import { validateAtUpdate} from '../middlewares/validateAtUpdate.js'
// import { handleMongooseError } from '../middlewares/handleMongooseError.js';


const fileMongooseSchema = new Schema({  //mongoose-схема - перевіряє те, що передбачається внести до БД
    file: {
        name: String,
        data: Buffer,
        size: Number,
        encoding: String,
        mimetype: String,
    },
}, { versionKey: false, timestamps: true });

// bulkSchema.pre("findOneAndUpdate", validateAtUpdate);
// bulkSchema.post('save', handleMongooseError);
// bulkSchema.post('findOneAndUpdate', handleMongooseError);

console.log('in fileSchema');

export const fileJoiSchema = Joi.object({
    file: {
        name: Joi.string().required(),
        data: Joi.binary().required(),
        size: Joi.number().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),        
    }
});

export const File = model('files', fileMongooseSchema); // створення нової колекції (назва 'files' з'явиться в БД)