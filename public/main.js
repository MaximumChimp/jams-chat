const socket = io()

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/cute_sound.mp3');

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total',(data)=>{
   clientsTotal.innerText = `Total clients:${data}`
});

function sendMessage(){
if(messageInput.value === '')return
// Create a new Date object from the ISO date
const date = new Date();

// Extract components
const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
const day = date.getUTCDate().toString().padStart(2, '0');
const year = date.getUTCFullYear();

const hours = date.getUTCHours().toString().padStart(2, '0') -4 ;
const minutes = date.getUTCMinutes().toString().padStart(2, '0');
const seconds = date.getUTCSeconds().toString().padStart(2, '0');

// Format the date and time

const formattedDate = `${hours > 12 ? `${hours}:${minutes}AM` : `${hours}:${minutes}PM`}`;

    // console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: formattedDate
    }
    socket.emit('message',data)
    addMessageToUI(true,data)
    messageInput.value =''
}

socket.on('chat-message',(data)=>{
    messageTone.play();
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage,data){
    clearFeedback();
    const element = `<li class="${isOwnMessage ? "message-right" : "message-left"} ">
    <p class="message">
        ${data.message}
        <span>${isOwnMessage ? "" : `${data.name}` }  ${data.dateTime}</span>
    </p>
    </li>  `
    messageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameInput.value} is typing a message...`
    })
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback: `${nameInput.value} is typing a message...`
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback: ''
    })
})

socket.on('feedback',(data)=>{
    clearFeedback();
    const element = `
        <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
    `
    messageContainer.innerHTML += element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}