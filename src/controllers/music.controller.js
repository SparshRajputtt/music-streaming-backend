import musicModel from "../models/music.model.js";
import albumModel from '../models/album.model.js';
import uploadFile from "../services/storage.service.js";
import axios from 'axios';
import dotenv from 'dotenv';
import userModel from "../models/user.model.js";

import jwt from 'jsonwebtoken';
dotenv.config();

const uploadMusic = async (req, res) => {
    try {

        const { title } = req.body;
        const musicFile = req.file;

        const result = await uploadFile(musicFile);

        const newMusic = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id
        });

        res.status(201).json({
            message: "Music uploaded successfully.",
            music: {
                id: newMusic._id,
                uri: newMusic.uri,
                title: newMusic.title,
                artist: newMusic.artist
            }
        });

    } catch (error) {
        console.log("Error uploading music:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const uploadAlbum = async (req, res) => {
    try {

        const { title, musics } = req.body;

        const newAlbum = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics
        });

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: newAlbum._id,
                title: newAlbum.title,
                artist: newAlbum.artist,
                musics: newAlbum.musics
            }
        })

    } catch (error) {
        console.log("Error uploading album:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


const getAllMusics = async (req, res) => {
    try {

        const musics = await musicModel
            .find()
            .skip(1) //pagiation me use hota h skip aur limit ka.
            .limit(2)
            .populate('artist', 'username email');

        res.status(200).json({
            message: "Music fetched successfully.",
            musics: musics
        });
    } catch (error) {
        console.log("Error fetching musics:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const getAllAlbums = async (req, res) => {
    try {
        const albums = await albumModel.find().select('title artist').populate('artist', 'username email');

        res.status(200).json({
            message: "Albums fetched successfully.",
            albums
        });

    } catch (error) {
        console.log("Error fetching albums:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

const getAlbumById = async (req, res) => {
    const albumId = req.params.albumId;

    try {
        const album = await albumModel.findById(albumId).populate('artist', 'username email').populate('musics');

        res.status(200).json({
            message: "Album fetched successfully.",
            album
        });

    } catch (error) {
        console.log("Error fetching album:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


/* GET /api/music/stream/:musicId  

This endpoint allows users to stream a music track by its ID. It retrieves the music information from the database, checks if the music exists, and then streams the music file from the storage service (e.g., ImageKit) to the client. The endpoint also handles range requests for streaming and increments the play count of the music when it is streamed for the first time. Additionally, it updates the user's recently played list with the streamed music.

*/
const streamMusic = async (req, res) => {
    try {
        const musicId = req.params.musicId;

        /* 
        For testing in browser without authentication we used commented code below:- 

        1- For recentlyPlayed feature and playCount feature we need decoded otherwise through authentication middleware we will have access to used id through REQ.USER.ID ex:-

        WITHOUT AUTHENTICATION:-
        await userModel.findByIdAndUpdate(decoded.id,
                {
                    $pull: { recentlyPlayed: musicId } // Remove the music from the recently played list if it already exists (to avoid duplicates)
                }
            );
        

        WITH AUTHENTICATION:-
        await userModel.findByIdAndUpdate(req.user.id,
                {
                    $pull: { recentlyPlayed: musicId } // Remove the music from the recently played list if it already exists (to avoid duplicates)
                }
            );

        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        */

        const music = await musicModel.findById(musicId);

        if (!music) {
            return res.status(404).json({ message: "Music not found." });
        }

        const range = req.headers.range;

        const axiosHeaders = {}

        if (range) {
            axiosHeaders.Range = range;
        }

        if (range && range.startsWith('bytes=0-')) {

            // Increment play count only for the first request of the music (when range starts with bytes=0-)
            await musicModel.findByIdAndUpdate(musicId,
                {
                    $inc: { playCount: 1 }
                }
            );

            // Also, we can add this music to the user's recently played list. We can limit the recently played list to a certain number of items (e.g., 20) to prevent it from growing indefinitely.

            await userModel.findByIdAndUpdate(req.user.id,
                {
                    $pull: { recentlyPlayed: musicId } // Remove the music from the recently played list if it already exists (to avoid duplicates)
                }
            );

            await userModel.findByIdAndUpdate(req.user.id,
                {
                    $push: {
                        recentlyPlayed: {
                            $each: [musicId], // Add the music to the recently played list
                            $position: 0, // Add the music to the beginning of the recently played list
                            $slice: 20 // Limit the recently played list to 20 items
                        }
                    }
                }
            );


        }

        // Make a request to Imagekit to stream the music file in chunks. We use axios to make the request and set the responseType to 'stream' to receive the response as a stream.
        const response = await axios.get(music.uri, {
            headers: axiosHeaders,
            responseType: 'stream'
        });

        //Forwading headers from the imagekit cloud service to the client.
        if (response.status === 206 && response.headers['content-range']) {

            res.writeHead(206, {
                'Content-Type': response.headers['content-type'],
                'Content-Length': response.headers['content-length'],
                'Content-Range': response.headers['content-range'],
                'Accept-Ranges': 'bytes'
            });

        } else {
            // fallback for first browser request
            res.writeHead(200, {
                'Content-Type': response.headers['content-type'],
                'Content-Length': response.headers['content-length']
            });
        }

        //Pipe the response data from the music streaming service to the client.
        response.data.pipe(res);

    } catch (error) {
        console.log("Error streaming music:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


/* GET /api/music/recently-played 
   Fetches the recently played music tracks of the user. 
*/
const getRecentlyPlayed = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('recentlyPlayed');
        res.status(200).json({
            recentlyPlayed: user.recentlyPlayed.map(music => ({
                _id: music._id,
                title: music.title,
            }))
        })

    } catch (error) {
        console.log("Error fetching recently played musics:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}


/* POST /api/music/like/:musicId 
   Api for liking and unliking songs and storing for the user.
*/
const toggleLike = async (req, res) => {
    try {
        const musicId = req.params.musicId;

        console.log("User:", req.user.id);
        console.log("Music:", musicId);

        const user = await userModel.findById(req.user.id);

        const isLiked = (user.likedSongs || []).some(
            id => id.toString() === musicId
        );

        let updatedUser;

        if (isLiked) {
            updatedUser = await userModel.findByIdAndUpdate(
                req.user.id,
                { $pull: { likedSongs: musicId } },
                { new: true }
            );
        } else {
            updatedUser = await userModel.findByIdAndUpdate(
                req.user.id,
                { $addToSet: { likedSongs: musicId } },
                { new: true }
            );
        }

        console.log("Updated likedSongs:", updatedUser.likedSongs);

        res.json({
            message: isLiked ? "Song unliked" : "Song liked"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error toggling like" });
    }
};


const getLikedSongs = async (req, res) => {
    try {

        const user = await userModel.findById(req.user.id).populate('likedSongs');

        res.json({
            likedSongs: user.likedSongs.map(music => ({
                _id: music._id,
                title: music.title,
            }))
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
}


export default {
    uploadMusic,
    uploadAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById,
    streamMusic,
    getRecentlyPlayed,
    toggleLike,
    getLikedSongs
}