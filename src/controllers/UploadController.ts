import express from "express";
import { User } from "./../models/SUser";
import { UploadModel } from "../models";
import cloudinary from "../core/cloudinary";

class UploadController {
  create = (req: express.Request, res: express.Response) => {
    const user = req.user as User;

    const file: any = req.file;

    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error: any, file: any) => {
        if (error) {
          throw new Error(error);
        } else {
          const fileData = {
            filename: file.original_filename,
            size: file.bytes,
            ext: file.format,
            url: file.url,
            user: {
              id: user.id,
              fullname: user.fullname,
            },
          };

          const uploadedFile = new UploadModel(fileData);

          uploadedFile
            .save()
            .then((fileObj: any) => {
              res.json({
                status: "success",
                file: fileObj,
              });
            })
            .catch((err) => {
              res.json({
                status: "error",
                message: err,
              });
            });
        }
      })
      .end(file.buffer);
  };
}

export default UploadController;
