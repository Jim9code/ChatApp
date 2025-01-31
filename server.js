const express = require('express')
const dotenv = require("dotenv").config()
const port = process.env.PORT || 5000
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const formatMessage = require('./utils/messages')
const {userJoin , getCurrentUser} = require('./utils/users')


const app = express()

// setting up socket io server
const server = http.createServer(app)
const io = socketio(server)

// run when clients connects
io.on('connection',socket =>{
    const botname = 'Jeth';
    console.log('New connection 😁!');

    // getting room and username to join room
    socket.on('joinRoom', ({username , room})=>{

        // making user join room
        const user = userJoin(socket.id ,username , room)
        socket.join(user.room)

     // welcome current user
    
    socket.emit('message',formatMessage( botname,'Welcome to jethchat!'));

    // broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined the chat`));

    })

    // listen for chatmessages
    socket.on('chatmessage',(msg)=>{
        console.log(msg)
        const user = getCurrentUser(socket.id)

        // send back to other romm members
        io.to(user.room).emit('message' ,formatMessage( user.username, msg))
    });


     // runs when client disconnects
     socket.on('disconnect',()=>{
        io.emit('message',formatMessage(botname,'A user has left the chat!'));
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