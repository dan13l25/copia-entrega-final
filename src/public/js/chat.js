const socket = io();

const chatbox = document.getElementById("chatbox");
const log = document.getElementById("log");
const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById("usernameInput");
const profileImageInput = document.getElementById("profileImageInput");
const chatSection = document.getElementById("chatSection");
const usernameDisplay = document.getElementById("usernameDisplay");
const profileImage = document.getElementById("profileImage");

let user = null; 
let profileImageUrl = null;

usernameForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    profileImageUrl = profileImageInput.value.trim();
    if (username && profileImageUrl) {
        user = username; 
        usernameDisplay.textContent = username;
        profileImage.src = profileImageUrl;
        profileImage.style.display = "block";
        usernameForm.style.display = "none"; 
        chatSection.style.display = "block"; 
        socket.emit('login', { username: user, profileImage: profileImageUrl });
    }
});

chatbox.addEventListener('keyup', e => {
    if(e.key === "Enter" && user){
        const now = new Date();
        const time = now.toLocaleTimeString(); 
        socket.emit('message', { user: user, message: chatbox.value, time: time });
        chatbox.value = ""; 
    }
});

socket.on('messageLogs', data => {
    let messages = "";
    data.forEach(msg => {
        messages += `<div>
                        <img src="${msg.profileImage}" alt="Imagen de perfil" style="width: 30px; height: 30px; border-radius: 50%;">
                        ${msg.user} dice ${msg.message} enviado a las (${msg.time}) <br/>
                     </div>`;
    });
    log.innerHTML = messages;
});