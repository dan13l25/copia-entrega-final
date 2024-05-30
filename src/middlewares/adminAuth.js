import userRepository from "../dao/repositories/userRepositorie.js";

export const isAdmin = async (req, res, next) => {
    const userId = req.userId; 

    try {
        const user = await userRepository.findById(userId);
        if (user && user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado: Solo los administradores pueden realizar esta acción." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al verificar el rol del usuario." });
    }
};
