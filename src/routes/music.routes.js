import express from 'express';
import musicController from '../controllers/music.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import userModel from '../models/user.model.js';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post('/upload', authMiddleware.authArtist , upload.single('music'), musicController.uploadMusic);
router.post('/album', authMiddleware.authArtist , musicController.uploadAlbum);
router.get('/', authMiddleware.authUser , musicController.getAllMusics);
router.get('/albums', authMiddleware.authUser , musicController.getAllAlbums);
router.get('/albums/:albumId', authMiddleware.authUser , musicController.getAlbumById);
router.get('/stream/:musicId', authMiddleware.authUser, musicController.streamMusic);
router.get('/recently-played', authMiddleware.authUser, musicController.getRecentlyPlayed);
router.post('/like/:musicId', authMiddleware.authUser, musicController.toggleLike);
router.get('/liked-songs', authMiddleware.authUser, musicController.getLikedSongs);
// router.get('/fix-liked', authMiddleware.authUser, async (req, res) => {
//     try {
//         const updatedUser = await userModel.findByIdAndUpdate(
//             req.user.id,
//             {
//                 $set: { likedSongs: [] ,
//                     recentlyPlayed: []
//                 }
//             },
//             { new: true } // returns updated document
//         );

//         res.json(updatedUser);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Error fixing user" });
//     }
// });

export default router;