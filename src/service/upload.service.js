'use strict'

const excelToJson = require('convert-excel-to-json');
const { BadRequestError } = require('../core/error.response');
const xlsx = require('xlsx');
const cloudinary = require('cloudinary').v2
class UploadService {

    static async uploadImages(images) {
        try {
            const uploadPromises = images.map(async (image) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        {
                            folder: 'products',
                            public_id: Date.now() + '-' + Math.round(Math.random() * 1E9),
                            resource_type: 'image',
                        },
                        (error, result) => {
                            if (error) {
                                console.error(error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(image.buffer);
                });
            });
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    };
    static async uploads(files) {
        try {
            if (files) {
                const uploadResults = await UploadService.uploadImages(files);
                const urls = uploadResults.map(item => ({ url: item.secure_url, name: item.public_id }))
                return urls
            }
            else {
                throw new BadRequestError('No files were uploaded');
            }
        } catch (error) {
            throw new BadRequestError('ERROR: uploaded');

        }
    };
    static async deleteImages(images) {
        try {
            const deletePromises = await cloudinary.api.delete_resources(images, { type: 'upload', resource_type: 'image' }).then((result) => {
                console.log(result);
                return true
            }).catch((e) => {
                console.log(e);
            });
            return false
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

}
module.exports = UploadService;