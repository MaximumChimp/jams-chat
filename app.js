const express = require('express');
const app = express()
const path = require('path')
require('dotenv').config();
app.use(express.static(path.join(__dirname, 'public')))


const server = app.listen(3001, ()=>{
    console.log(`running on port ${process.env.PORT}`)
})

let socketsConnected = new Set()

const io = require('socket.io')(server)

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketsConnected.add(socket.id)

    io.emit('clients-total',socketsConnected.size)

    socket.on('disconnect',()=>{
        console.log('Disconnected!', socket.id)
        socketsConnected.delete(socket.id)
        io.emit('clients-total',socketsConnected.size)
    })
    
    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })
}