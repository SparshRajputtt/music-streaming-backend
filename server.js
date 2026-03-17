import app from './src/app.js';
import connectDb from './src/db/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDb();

app.listen(process.env.PORT, () => {
    console.log('Server running on port '+ process.env.PORT);
})