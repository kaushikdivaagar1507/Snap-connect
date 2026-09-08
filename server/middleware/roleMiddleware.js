const photographerOnly = (req, res, next) => {
    if (req.user.role !== "PHOTOGRAPHER") {
        return res.status(403).json({
            message: "Access denied. Photographer only."
        });
    }

    next();
};


const clientOnly = (req, res, next) => {
    if (req.user.role !== "CLIENT") {
        return res.status(403).json({
            message: "Access denied. Client only."
        });
    }

    next();
};


const adminOnly = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
};


module.exports = {
    photographerOnly,
    clientOnly,
    adminOnly
};