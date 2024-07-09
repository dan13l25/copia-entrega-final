import userService from "../dao/services/userService.js";
import { errorTypes } from "../utils/errorTypes.js";
import { CustomError } from "../utils/customError.js";
import { devLogger as logger } from "../utils/loggers.js";
import userModel from "../dao/models/users.js";

const userController = {
    getLogin: async (req, res, next) => {
        try {
            const loginView = await userService.getLogin();
            res.render(loginView);
        } catch (error) {
            req.logger.error("Error al obtener la vista de inicio de sesión:", error.message);
            next(CustomError.createError({
                name: "GetLoginError",
                message: "Error al obtener la vista de inicio de sesión",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    login: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const { user, access_token } = await userService.login(email, password);
            req.session.token = access_token;
            req.session.userId = user._id;
            req.session.user = user;
            req.session.isAuthenticated = true;
            res.cookie("jwtToken", access_token, { httpOnly: true })
               .send({ status: "Success", message: user, access_token, userId: user._id });
        } catch (error) {
            req.logger.error("Error al iniciar sesión:", error.message);
            next(CustomError.createError({
                name: "LoginError",
                message: "Error al iniciar sesión",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    getRegister: async (req, res, next) => {
        try {
            const registerView = await userService.getRegister();
            res.render(registerView);
        } catch (error) {
            req.ogger.error("Error al obtener la vista de registro:", error.message);
            next(CustomError.createError({
                name: "GetRegisterError",
                message: "Error al obtener la vista de registro",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    register: async (req, res, next) => {
        const userData = req.body;
        try {
            const profileImagePath = req.file ? req.file.path : null; 
            const { newUser, access_token } = await userService.register(userData, profileImagePath); 
            req.session.userId = newUser._id;
            req.session.user = newUser;
            req.session.isAuthenticated = true;
            res.cookie("jwtToken", access_token, { httpOnly: true })
               .send({ status: "Success", message: newUser, access_token, userId: newUser._id });
        } catch (error) {
            req.logger.error("Error al obtener la vista de registro:", error.message);
            next(CustomError.createError({
                name: "RegisterError",
                message: "Error al registrar usuario",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    getGitHub: async (req, res, next) => {
        try {
            const githubAuth = await userService.getGitHub();
            res.redirect(githubAuth);
        } catch (error) {
            req.logger.error("Error al obtener la autenticación de GitHub:", error.message);
            next(CustomError.createError({
                name: "GitHubAuthError",
                message: "Error al obtener la autenticación de GitHub",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    gitHubCallback: async (req, res, next) => {
        try {
            await userService.gitHubCallback(req, res, next);
        } catch (error) {
            req.logger.error("Error en el callback de GitHub:", error.message);
            next(CustomError.createError({
                name: "GitHubCallbackError",
                message: "Error en el callback de GitHub",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    handleGitHubCallback: async (req, res, next) => {
        try {
            const { user, access_token } = await userService.handleGitHubCallback(req);
            req.session.token = access_token;
            req.session.userId = user._id;
            req.session.user = user;
            req.session.isAuthenticated = true;
            res.cookie("jwtToken", access_token, { httpOnly: true })
               .send({ status: "Success", message: user, access_token, userId: user._id });
        } catch (error) {
            req.logger.error("Error en el callback de GitHub:", error.message);
            next(CustomError.createError({
                name: "GitHubHandleCallbackError",
                message: "Error en el callback de GitHub",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    logOut: async (req, res, next) => {
        try {
            await userService.logOut(req, res);
        } catch (error) {
            req.logger.error("Error al cerrar sesión:", error.message);
            next(CustomError.createError({
                name: "LogOutError",
                message: "Error al cerrar sesión",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    restore: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const message = await userService.restorePassword(email, password);
            res.send({ message });
        } catch (error) {
            req.logger.error("Error al restaurar la contraseña:", error.message);
            next(CustomError.createError({
                name: "RestorePasswordError",
                message: "Error al restaurar la contraseña",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    requestPasswordReset: async (req, res, next) => {
        const { email } = req.body;
        try {
            const message = await userService.requestPasswordReset(email);
            res.send({ message });
        } catch (error) {
            req.logger.error("Error al solicitar restablecimiento de contraseña:", error.message);
            next(CustomError.createError({
                name: "RequestPasswordResetError",
                message: "Error al solicitar restablecimiento de contraseña",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    getResetPassword: async (req, res, next) => {
        const { token } = req.params;
        try {
            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.render('expiredToken', { message: "El enlace de restablecimiento ha expirado." });
            }

            res.render('resetPassword', { token });
        } catch (error) {
            req.logger.error("Error al obtener la vista de restablecimiento de contraseña:", error.message);
            next(CustomError.createError({
                name: "GetResetPasswordError",
                message: "Error al obtener la vista de restablecimiento de contraseña",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    resetPassword: async (req, res, next) => {
        const { token, newPassword } = req.body;
        try {
            const message = await userService.resetPassword(token, newPassword);
            res.send({ message });
        } catch (error) {
            req.logger.error("Error al restablecer la contraseña:", error.message);
            next(CustomError.createError({
                name: "ResetPasswordError",
                message: "Error al restablecer la contraseña",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    uploadDocuments: async (req, res, next) => {
        try {
            const userId = req.params.uid;
            const user = await userRepository.findById(userId);
            if (!user) {
                req.Logger.error("Error al buscar usuario:", "Usuario no encontrado");
                return next(new Error("Usuario no encontrado"));
            }

            const documents = req.files.map((file) => ({
                name: file.originalname,
                reference: file.path,
            }));

            user.documents = [...user.documents, ...documents];
            await user.save();

            res.send({ message: "Documents uploaded successfully" });
        } catch (error) {
            req.logger.error("Error al subir documentos:", error.message);
            next(error);
        }
    },

    upgradeToPremium: async (req, res, next) => {
        const userId = req.params.uid;
        try {
            const user = await userService.upgradeToPremium(userId);
            res.send({ status: "Success", message: "Usuario actualizado a premium", user });
        } catch (error) {
            req.logger.error("Error al actualizar usuario a premium:", error.message);
            next(CustomError.createError({
                name: "UpgradeToPremiumError",
                message: "Error al actualizar usuario a premium",
                code: errorTypes.ERROR_INTERNAL_ERROR,
                description: error.message
            }));
        }
    },

    uploadProfileImage: async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findById(uid);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.profileImage = req.file.path; 
            await user.save();

            res.status(200).json({ message: 'Profile image uploaded successfully' });
        } catch (error) {
            console.error('Error uploading profile image:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

};

export default userController;
