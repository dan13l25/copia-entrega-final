export const isAdmin = (req, res, next) => {
    const user = req.session.user; 

    if (user && user.role === "admin") {
        return next();
    }

    res.status(403).json({ message: "Acceso denegado: Solo los administradores pueden realizar esta acción." });
};

export const isPremium = (req, res, next) => {
    const user = req.session.user; 

    if (user && user.role === "premium") {
        return next();
    }

    res.status(403).json({ message: "Acceso denegado: Solo los usuarios premium pueden realizar esta acción." });
};