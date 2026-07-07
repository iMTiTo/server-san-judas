import multer from "multer";
import { dirname, extname, join, basename } from 'path';
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIMETYPES = ["image/jpg", "image/jpeg", "image/png"]
const MAX_FILE_SIZE = 5 * 1024 * 1024

const createMulterConfig = (destinationPath, subFolder) => {
    return multer({
        storage: multer.diskStorage({
            destination: join(CURRENT_DIR, destinationPath),
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname)
                const fileName = file.originalname.split(fileExtension)[0]
                const shortUuid = uuidv4().substring(0, 8)
                const generatedName = `${fileName}-${shortUuid}-${fileExtension}`
                cb(null, generatedName)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (MIMETYPES.includes(file.mimetype)) cb(null, true)
            else cb(new Error('Tipo de archivo no permitido'))
        },
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    })
}

export const uploadProfilePicture = createMulterConfig("../assets/img/profiles", "profiles")
export const uploadPostImage = createMulterConfig("../assets/img/posts", "posts")