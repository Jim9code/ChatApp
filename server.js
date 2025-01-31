const express = require('express')
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require('./utils/messages')


const app = express()

// setting up socket io server
const server = http.createServer(app)
const io = socketio(server)

// run when clients connects
io.on('connection',socket =>{
    console.log('New connection 😁!');

    // welcome current user
    const botname = 'Jeth';
    socket.emit('message',formatMessage( botname,'Welcome to jethchat!'));

    // broadcast when a user connects
    socket.broadcast.emit('message',formatMessage(botname,'A user has joined the chat'));

    // runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botname,'A user has left the chat!'));
    })

    // listen for chatmessages
    socket.on('chatmessage',(msg)=>{
        console.log(msg)

        // send back to other romm members
        io.emit('message' ,formatMessage('User', msg))
    })
})


// setting all routes
const routes = require('./APIS/routes/all_routes')
app.get('/',routes)

// set static folder 
app.use(express.static(path.join(__dirname,"public")))







server.listen(port ,()=>{
    console.log(`Server running on port ${port} ...`)
})