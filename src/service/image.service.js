'use strict'

const { BadRequestError } = require("../core/error.response")
const ImageRepository = require("../models/repositories/image.repo")
const UploadService = require("./upload.service")
const cloudinary = require('cloudinary').v2

class ImageService {
    static async getImages(productId) {
        const images = await ImageRepository.getImages(productId)
        return images
    }
    static async getAllImages() {
        try {
            // Lấy danh sách tất cả tài nguyên (ảnh) từ Cloudinary
            const resources = await new Promise((resolve, reject) => {
                cloudinary.api.resources(
                    {
                        type: 'upload',
                        resource_type: 'image',
                        max_results: 500 // Lấy tối đa 500 tài nguyên trong một lần gọi
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.resources);
                        }
                    }
                );
            });
            return resources;
        } catch (error) {
            console.error('Error fetching resources from Cloudinary:', error);
            throw error;
        }
    }

    static async deleteImages(images) {
        if (images.length === 0) {
            throw new BadRequestError("Images not found")
        }
        const imagesId = images.map((image) => image.id)
        const image = await ImageRepository.deleteImages(imagesId)
        if (!image) {
            throw new BadRequestError("Delete images failed1")
        }
        const arrName = images.map((image) => image.name)
        console.log(arrName);
        const isDelete = await UploadService.deleteImages(arrName)
        // if (!isDelete) {
        //     throw new BadRequestError("Delete images failed2")
        // }
        console.log(isDelete);
        return true
    }
}
module.exports = ImageService