const clientOnly = (req, res, next) => {
    if (req.user.role !== "CLIENT") {
        return res.status(403).json({
            message: "Access denied. Client access only."
        });
    }

    next();
};

const photographerOnly = (req, res, next) => {
    if (req.user.role !== "PHOTOGRAPHER") {
        return res.status(403).json({
            message: "Access denied. Photographer access only."
        });
    }

    next();
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Access denied. Admin access only."
        });
    }

    next();
};

module.exports = {
    clientOnly,
    photographerOnly,
    adminOnly
};