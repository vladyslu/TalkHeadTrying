import { TalkingHead } from "talkinghead";

     let nameHead;

    document.addEventListener('DOMContentLoaded', async function(e) {

      // Instantiate the class
      // NOTE: Never put your API key in a client-side code unless you know
      //       that you are the only one to have access to that code!
      const nodeAvatar = document.getElementById('avatar');
      nameHead = new TalkingHead( nodeAvatar, {
        ttsEndpoint: "https://texttospeech.googleapis.com/v1beta1/text:synthesize",
        ttsApikey: "AIzaSyCSdN9AeZo9qRJsKl5X5flEGjDgPHN1-pg", // <- Change this
        cameraView: "upper"
      });

      // Load and show the avatar
      const nodeLoading = document.getElementById('loading');
      try {
        nodeLoading.textContent = "Loading...";
        await nameHead.showAvatar( {
          url: 'https://models.readyplayer.me/65f8a38f97e3a356389f7ddc.glb?morphTargets=ARKit,Oculus+Visemes,mouthOpen,mouthSmile,eyesClosed,eyesLookUp,eyesLookDown&textureSizeLimit=1024&textureFormat=png',
          body: 'F',
          avatarMood: 'neutral',
          ttsLang: "en-GB",
          ttsVoice: "en-IN-Standard-C",
          lipsyncLang: 'en'
        }, (ev) => {
          if ( ev.lengthComputable ) {
            let val = Math.min(100,Math.round(ev.loaded/ev.total * 100 ));
            nodeLoading.textContent = "Loading " + val + "%";
          }
        });
        nodeLoading.style.display = 'none';
      } catch (error) {
        console.log(error);
        nodeLoading.textContent = error.toString();
      }

      // Speak when clicked
      const nodeSpeak = document.getElementById('speak');
      nodeSpeak.addEventListener('click', function () {
        try {
          const text = document.getElementById('text').value;
          if ( text ) {
            nameHead.speakText( text );
          }
        } catch (error) {
          console.log(error);
        }
      });

    });
	
	
export { nameHead};



window.addEventListener('df-response-received', (event) => {
  // Remove all non-text messages.
  console.log(event)
  let messageList = event.detail.data.messages;
  console.log( messageList)
  
	if(messageList != null){
		if(messageList[0] != null){
			if(messageList[0]["type"] == "text"){
				nameHead.speakText( messageList[0]["text"] );
			}
		}
	}
});


