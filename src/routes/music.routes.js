import express from 'express';
import musicController from '../controllers/music.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
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
router.get('/stream/:musicId', /*authMiddleware.authUser,*/ musicController.streamMusic);

export default router;