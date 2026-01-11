import Joi from "joi";
import { Schema, model } from "mongoose";

import { validateAtUpdate} from '../middlewares/validateAtUpdate.js'
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const fileMongooseSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    supabasePath: {
      type: String,
      required: true,
    },
    fileURL: {
      type: String,
    },
    size: Number,
    mimetype: String,
  },
  { versionKey: false, timestamps: true }
);

fileMongooseSchema.pre("findOneAndUpdate", validateAtUpdate); // if update will be added 
fileMongooseSchema.post('save', handleMongooseError);
fileMongooseSchema.post('findOneAndUpdate', handleMongooseError); // if update will be added 

export const File = model("files", fileMongooseSchema);

export const fileJoiSchema = Joi.object({
  fileName: Joi.string().required(),
  supabasePath: Joi.string().required(),
  fileURL: Joi.string().uri(),
  size: Joi.number(),
  mimetype: Joi.string(),
});
