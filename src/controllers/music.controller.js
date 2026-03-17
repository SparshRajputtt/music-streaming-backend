import musicModel from "../models/music.model.js";
import albumModel from '../models/album.model.js';
import uploadFile from "../services/storage.service.js";
import dotenv from 'dotenv';

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


export default {
    uploadMusic,
    uploadAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById
}