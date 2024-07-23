import express from 'express';
import UserController from "../controllers/userController.js"
import passport from 'passport';
import { configureDocumentMulter, configureProfileMulter  } from '../utils.js';

const userRouter = express.Router();
const documentUpload = configureDocumentMulter();
const profileUpload = configureProfileMulter();
const userController = new UserController(); 


userRouter.get("/login", userController.getLogin.bind(userController));
userRouter.post("/login", userController.login.bind(userController));
userRouter.get("/current", passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user);
});
userRouter.get("/register", userController.getRegister.bind(userController));
userRouter.post("/register", profileUpload.single('profileImage'), userController.register.bind(userController)); 
userRouter.get("/logout", userController.logOut.bind(userController));
userRouter.post("/logout", userController.logOut.bind(userController));
userRouter.get("/restore", (req, res) => {
    res.render("restore");
});

userRouter.post("/restore", userController.restorePassword.bind(userController));

userRouter.post('/:uid/profile', profileUpload.single('profileImage'), userController.uploadDocuments.bind(userController));

// Endpoint para subir documentos
userRouter.post('/:uid/documents', documentUpload.array('documents', 10), userController.uploadDocuments.bind(userController));

// endpoint para renderizar subida de documentos
userRouter.get('/:uid/upload', (req, res) => {
    const userId = req.params.uid;
    res.render('uploadDocuments', { userId });
});

// Endpoint para actualizar a premium
userRouter.post('/premium/:uid', userController.upgradeToPremium.bind(userController));

// Recuperación de contraseña por correo 
userRouter.post('/request-password-reset', userController.requestPasswordReset.bind(userController));
userRouter.get('/reset-password/:token', userController.resetPassword.bind(userController));
userRouter.post('/reset-password', userController.resetPassword.bind(userController));  

// Autenticación con GitHub
userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/chat");
});

// Endpoints de entrega final

userRouter.get("/", userController.getAllUsers.bind(userController));
userRouter.delete("/", userController.deleteInactiveUsers.bind(userController));
userRouter.patch("/update-role", userController.updateUserRole.bind(userController));

//metodo passport

/*userRouter.get("/faillogin", async (req, res) => {
    console.log("error");
    res.send({ error: "Fallo" });
});
userRouter.post('/login', passport.authenticate('login',{failureRedirect:"/faillogin"}),
async(req,res)=>{
if(!req.user)return res.status(400).send('error')
req.session.user = {
  first_name: req.user.first_name,
  last_name: req.user.last_name,
  email: req.user.email,
  age: req.user.age,
};
 res.status(200).send({ status: "success", payload: req.user });
})*/

//metodo con passport
/*userRouter.post("/register", userController.register); 
userRouter.get("/failregister", async (req, res) => {
    console.log("error");
    res.send({ error: "Falló" });
  });*/ 


export default userRouter;