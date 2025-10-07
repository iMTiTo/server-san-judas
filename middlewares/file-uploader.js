import multer from "multer";
import { dirname, extname, join, basename } from 'path';
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIMETYPES = ["image/jpg", "image/jpeg", "image/png", "image/gif"]
const MAX_FILE_SIZE = 5 * 1024 *1024

const createMulterConfing = (destinationPath, subFolder) => {
    return multer({
        storage: multer.diskStorage({
            destination: join(CURRENT_DIR, destinationPath),
            filename: (req, file, cb) => {
                const fileExtencion = extname(file.originalname)
                const filename = file.originalname.split(fileExtencion)[0]
                const shortUuid = uuidv4().substring(0, 8)
                const generatedName = `${fileName}-${shortUuid}-${fileExtencion}`
                cb(null, generatedName)
            }
        }),
        fileFilter: (req, file, cb) => {
            if(MIMETYPES.includes(file.mimetype)) cb(null, true)
            else cb(new Error('Tipo de archivo no permitido'))
        },
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    })
}

export const uploadProfilePicture = createMulterConfing("../assets/img/profiles, profiles") 