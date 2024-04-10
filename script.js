import {nameHead} from "./talkHead.js";


const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="#fff" width="25" height="25" viewBox="0 0 50 50">
<path d="M 25 2 C 20.5 2 17 4.101563 17 6.898438 C 17 8.199219 17.800781 8.902344 19 9.300781 L 25 5.898438 L 31 9.300781 C 32.300781 8.902344 33 8.101563 33 6.800781 C 33 4.101563 29.5 2 25 2 Z M 25 7.800781 C 25 7.800781 22 9.5 21 10.097656 L 21 13.800781 L 21.402344 14 L 25 15.800781 L 28.597656 14 L 29 13.800781 L 29 10.097656 C 28 9.601563 25 7.902344 25 7.800781 Z M 17.699219 14.300781 C 10.097656 15.699219 5 19 5 22.699219 C 5 27 13.199219 27 13.199219 27 C 19.300781 27 22.800781 24.800781 25.800781 22.800781 C 26.199219 22.5 26.699219 22.199219 27.097656 22 L 16 22 L 16 20 L 33 20 L 33 22 C 30.800781 22 29.101563 23.101563 26.902344 24.5 C 26.601563 24.699219 26.398438 24.800781 26.097656 25 C 28.597656 26.398438 31.300781 27 35 27 C 35 27 45 26.898438 45 22.699219 C 45 19 39.902344 15.699219 32.300781 14.300781 L 25 18 Z M 24.097656 26.199219 C 21.398438 27.699219 18 29 13.097656 29 L 13 29 C 13.601563 32.800781 15.097656 38.398438 19.597656 43 L 22 43 C 25.101563 43 29.199219 42.199219 31.300781 40.300781 C 31.5 40.101563 31.800781 39.898438 32 39.597656 C 32 35.898438 34.800781 32 36 30.199219 L 36.097656 30 C 36.300781 29.601563 36.5 29.300781 36.699219 29 L 35 29 C 30.699219 29 27.199219 28.097656 24.097656 26.199219 Z M 32.402344 41.902344 C 29.800781 44.199219 25.199219 45 22 45 L 21.902344 45 C 24.5 46.800781 27.800781 48 32 48 C 35.5 48 38.699219 46.902344 40.5 45.902344 L 43.800781 44 L 38.097656 44 C 36.5 44 35 44.097656 33.5 43.199219 C 33 42.800781 32.699219 42.402344 32.402344 41.902344 Z"></path>
</svg></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
   
    const messageElement = chatElement.querySelector("p");

   
	
	
	 const apiKey = 'AIzaSyCSdN9AeZo9qRJsKl5X5flEGjDgPHN1-pg';
            const url = `http://52.86.222.221:3000/message`;
            
            const data = {
                document: {
                    type: 'PLAIN_TEXT',
                    content: userMessage,
                },
                encodingType: 'UTF8',
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            })
            .then(response => response.json())
            .then(json => {
				console.log(json)
				
				try {
				let theMessageToSend = null;
			if(json["answers"] !=null){
				let theIndexer = getRandomIntInclusive(0, json["answers"].length-1);
				if(json["answers"][theIndexer] !=null){
					if(json["answers"][theIndexer]["answer"] !=null){
						theMessageToSend = json["answers"][theIndexer]["answer"]
						messageElement.innerHTML = theMessageToSend;
						if(json["answers"][theIndexer]["nonhtmlAnswer"] !=null){
						nameHead.speakText(json["answers"][theIndexer]["nonhtmlAnswer"]);
						}else{
						nameHead.speakText(theMessageToSend);
						}
					}
				}
			}
			if(theMessageToSend == null){
				messageElement.classList.add("error");
				console.log("error no message to send")
			messageElement.textContent = "Oops! Something went wrong. Please try again.";
			nameHead.speakText("Oops! Something went wrong. Please try again.");
			}
        } catch (error) {
          console.log(error);
        }
				})
            .catch(error => 
			
			{console.error('Error:', error)
			messageElement.classList.add("error");
			messageElement.textContent = "Oops! Something went wrong. Please try again.";
			
			}
			);
       
	
	
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
document.querySelector(".chatbot-toggler-switch").addEventListener("click", () => document.body.classList.toggle("switch-chatbot"));





function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}