const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector('.chat-messages') 

const socket  = io();

// gets any text emited as message from the backend 
socket.on('message', message =>{
   console.log(message)
   outputMessage(message)

  //  scroll down 
  chatMessages.scrollTop = chatMessages.scrollHeight;

})

// submit chat form / texting form
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  // getting message text 
  const msg = e.target.elements.msgInput.value;

  // eminting message to server
   socket.emit("chatmessage", msg)  

  //  clear input
  e.target.elements.msgInput.value = '';
  e.target.elements.msgInput.value.focus(); 

})

// output message to dom 
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}