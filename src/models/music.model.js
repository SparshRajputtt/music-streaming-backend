import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
    uri: {type: String, required: true},
    title: {type: String, requied: true},
    artist: {type: mongoose.Schema.Types.ObjectId, ref: 'user' , required: true},
    playCount: {type: Number, default: 0}
})

const musicModel = mongoose.model('music', musicSchema);

export default musicModel;