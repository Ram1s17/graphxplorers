require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/routes');
const errorMiddleware = require('./middlewares/error_middleware');

const PORT = process.env.PORT || 8080;
const server = express();

server.use(express.json({limit: '500mb'}));
server.use(cookieParser());
server.use(cors({
   credentials: true, 
   origin: process.env.CLIENT_URL
}));
server.use('/api', router);
server.use(errorMiddleware);

const start = () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch(e) {
        console.log(e);
    }
};

start();