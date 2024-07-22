import UserService from "../dao/services/userService.js"
import { devLogger as logger } from "../utils/loggers.js"

const userService = new UserService();

const userController = {
    getLogin: async (req, res) => {
        try {
            const result = await userService.getLogin();
            res.render(result);
        } catch (error) {
            logger.error("Error al obtener la vista de login:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const { user, access_token } = await userService.login(email, password);
            res.cookie("jwtToken", access_token, { httpOnly: true });
            res.status(200).json({ message: "Login successful", user });
        } catch (error) {
            logger.error("Error al iniciar sesión:", error.message);
            res.status(401).json({ error: "Credenciales inválidas" });
        }
    },

    getRegister: async (req, res) => {
        try {
            const result = await userService.getRegister();
            res.render(result);
        } catch (error) {
            logger.error("Error al obtener la vista de registro:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    register: async (req, res) => {
        try {
            const profileImagePath = req.file ? req.file.path : null;
            const { body: userData } = req;
            const { newUser, access_token } = await userService.register(userData, profileImagePath);
            res.cookie("jwtToken", access_token, { httpOnly: true });
            res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser });
        } catch (error) {
            logger.error("Error al registrar usuario:", error.message);
            res.status(400).json({ error: error.message });
        }
    },

    restorePassword: async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await userService.restorePassword(email, password);
            res.status(200).json({ message: result });
        } catch (error) {
            logger.error("Error al restaurar la contraseña:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    logOut: async (req, res) => {
        try {
            await userService.logOut(req, res);
        } catch (error) {
            logger.error("Error al cerrar sesión:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    requestPasswordReset: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await userService.requestPasswordReset(email);
            res.status(200).json({ message: result });
        } catch (error) {
            logger.error("Error al solicitar restablecimiento de contraseña:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
        try {
            const result = await userService.resetPassword(token, newPassword);
            res.status(200).json({ message: result });
        } catch (error) {
            logger.error("Error al restablecer la contraseña:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    uploadDocuments: async (req, res) => {
        const userId = req.params.userId;
        const documents = req.files.map(file => ({ name: file.originalname, path: file.path }));

        try {
            const updatedUser = await userService.uploadDocuments(userId, documents);
            res.status(200).json({ message: "Documentos subidos con éxito", user: updatedUser });
        } catch (error) {
            logger.error("Error al subir documentos:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    upgradeToPremium: async (req, res) => {
        const userId = req.params.userId;
        try {
            const updatedUser = await userService.upgradeToPremium(userId);
            res.status(200).json({ message: "Usuario promovido a premium", user: updatedUser });
        } catch (error) {
            logger.error("Error al promover usuario a premium:", error.message);
            res.status(400).json({ error: error.message });
        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            logger.error("Error al obtener usuarios:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    deleteInactiveUsers: async (req, res) => {
        try {
            const result = await userService.deleteInactiveUsers();
            res.status(200).json(result);
        } catch (error) {
            logger.error("Error al eliminar usuarios inactivos:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    findById: async (req, res) => {
        const userId = req.params.userId;
        try {
            const user = await userService.findById(userId);
            res.status(200).json(user);
        } catch (error) {
            logger.error("Error al buscar usuario por ID:", error.message);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    async updateUserRole(req, res, next) {
        const { userId } = req.params;
        const { role } = req.body;
        try {
            const user = await this.userService.updateUserRole(userId, role);
            res.json({ user });
        } catch (error) {
            req.logger.error("Error al actualizar rol de usuario:", error.message);
            next(CustomError.createError({
                name: "UpdateUserRoleError",
                message: "Error al actualizar rol de usuario",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    }
};

export default userController;
