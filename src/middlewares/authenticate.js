import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils.js';

export const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido." });
    }
};
