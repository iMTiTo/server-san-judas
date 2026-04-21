export const processFileUpload = (req, res, next) => {
    if (req.file) {
        // Handle both forward and backward slashes for cross-platform compatibility
        const normalizedPath = req.file.destination.replace(/\\/g, '/');
        const subFolder = normalizedPath.split('/').pop();
        req.fileRelativePath = `${subFolder}/${req.file.filename}`
    }
    next()
}
