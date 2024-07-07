import express from 'express';
import userController from '../controllers/userController.js';
import passport from 'passport';
import { configureDocumentMulter } from '../utils.js';

const userRouter = express.Router();
const documentUpload = configureDocumentMulter();

userRouter.get("/login", userController.getLogin);
userRouter.post("/login", userController.login);
userRouter.get("/current", passport.authenticate('current', { session: false }), (req, res) => {
    res.json(req.user);
});
userRouter.get("/register", userController.getRegister);
userRouter.post("/register", userController.register); 
userRouter.get("/logout", userController.logOut);
userRouter.post("/logout", userController.logOut);
userRouter.get("/restore", (req, res) => {
    res.render("restore");
});
userRouter.post("/restore", userController.restore);

// Endpoint para subir documentos
userRouter.post('/:uid/documents', documentUpload.array('documents', 10), userController.uploadDocuments);

// Endpoint para actualizar a premium
userRouter.post('/premium/:uid', userController.upgradeToPremium);

// Recuperación de contraseña por correo 
userRouter.post('/request-password-reset', userController.requestPasswordReset);
userRouter.get('/reset-password/:token', userController.getResetPassword);
userRouter.post('/reset-password', userController.resetPassword);  

// Autenticación con GitHub
userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/chat");
});

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