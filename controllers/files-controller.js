import path from "path";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { File, fileJoiSchema } from "../models/files.js";
import { supabase } from "../utils/supabase.js";

const addFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const { file } = req.files;

  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const fileName = `${uniquePrefix}_${file.name}`;

  try {
    const { data, error } = await supabase.storage
      .from("files-bucket")
      .upload(fileName, file.data, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData, error: urlError } = await supabase.storage
      .from("files-bucket")
      .createSignedUrl(fileName, 3600);

    if (urlError) throw urlError;

    const dataToSave = {
      fileName: fileName,
      supabasePath: data.path,
      fileURL: urlData.signedUrl,
      size: file.size,
      mimetype: file.mimetype,
    };

    const { error: joiError } = fileJoiSchema.validate(dataToSave);

    if (joiError) {
      throw HttpError(400, joiError.message);
    }

    const result = await File.create(dataToSave);

    res.status(201).json({
      message: "File uploaded successfully",
      result,
    });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: e.message });
  }
};

const deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const fileRecord = await File.findById(id);

    if (!fileRecord) {
      return res.status(404).json({ message: "File not found in database" });
    }

    const { data, error } = await supabase.storage
      .from("files-bucket")
      .remove([fileRecord.supabasePath]);

    if (error) {
      console.error("Supabase deletion error:", error);
      throw new Error("Failed to delete file from storage");
    }

    await File.findByIdAndDelete(id);

    res.status(200).json({
      message: "File and database record deleted successfully",
      deletedPath: fileRecord.supabasePath,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default {
  addFile: ctrlWrapper(addFile),
  deleteFile: ctrlWrapper(deleteFile),
};
