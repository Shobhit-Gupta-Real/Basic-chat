const express = require('express')
const app = express()
const { createServer } = require('http');
const path = require('path')
const { Server, Socket } = require('socket.io')
const httpServer = createServer(app);

app.use(express())
app.use(express.static(path.join(__dirname, 'public'), {index:'home.html'})) // configures Express.js to serve static files
const io = new Server(httpServer, { /* options */ });

let socketConnected = new Set() //here we have used set as we want to get the unique id value of the users
io.on("connection", onConnected) //whenever the socketserver gets reload then all the user connected to the server are reconnected

function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id)
    io.emit('clients-total', socketConnected.size)
    socket.on('disconnect', ()=>{
        console.log('Socket Disconnected', socket.id)
        socketConnected.delete(socket.id)
        io.emit('clients-total', socketConnected.size)
    })

    socket.on('message', (data)=>{
        socket.broadcast.emit('chat-message', data)
    })
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
      })
}


httpServer.listen(4000, ()=>{
    console.log('I am Here!')
});
