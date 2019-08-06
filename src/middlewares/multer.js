const moment = require('moment');
function setupMulter(multer) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./uploads/profile_imgs");
        },
        filename: function (req, file, cb) {
            cb(null, moment().format("YYYY-MM-DD") + "-" + file.originalname);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Unacceptable Image Format"), false);
        }
    };

    const multerInit = multer({
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    });

    return {
        // storage,
        // fileFilter,
        multerInit
    }
}
module.exports = setupMulter;