import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

const uploadFile = async (file) => {

    const base64File = file.buffer.toString("base64");

    const result = await client.files.upload({
        file: base64File,
        fileName: file.originalname,
        folder: 'spotify_music_backend/music'
    });
    return result;
}

export default uploadFile