import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authArtist = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });

    }

}

const authUser = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {

        const allowedRoles = ['user', 'artist'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!allowedRoles.includes(decoded.role)){
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = decoded;
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default {
    authArtist,
    authUser
};