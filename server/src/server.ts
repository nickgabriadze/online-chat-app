import {Queue} from "./queue";
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ['GET', 'POST']
    }
})


const q = new Queue();


io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    q.joinedTheWebsite(socket);

    setInterval( () => {
        q.shareLiveUsersCounter();

        
    }, 3000);

   
    socket.on("join-queue", (username) => {
        q.push({socket: socket, username: username});
        q.startChat();
       
    })


   socket.on("send-msg", (data) => {
    q.sendMessage(data);

   });

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        q.endChat(socket);
        q.leftTheWebsite(socket.id);
    })

    
})

server.listen(5001, () => {
    console.log('Up and running!');
})


