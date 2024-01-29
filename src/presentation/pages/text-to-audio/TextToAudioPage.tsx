
import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from "../../components";
import { textToAudioUSeCase } from "../../../core/use-cases";


interface TextMessage {
  text:string;
  isGpt:boolean;
  type:'text';
}

interface AudioMessage {
  text:string;
  isGpt:boolean;
  audio:string;
  type:'audio';
}

type Message =TextMessage | AudioMessage;


const textoIni = `##Que texto quieres generar
*Todo el audio es generado por AI
`;

const voices = [
  { id:"nova", text:'nova'},
  { id:"alloy", text:'alloy'},
  { id:"echo", text :'echo'},
  { id:"fable", text:'fable'},
  { id:"onyx", text:'onyx'},
  { id:"shimmer", text:'shimmer'}
];

export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost =async (text:string, selectedVoice:string) => {
    setIsLoading(true);
    setMessages((prev)=> [...prev, {text:text,isGpt:false,type:'text'}]);    


    const {ok,message, audioUrl} = await textToAudioUSeCase(text,selectedVoice);

    setIsLoading(false);

    if (!ok) return;

    setMessages((prev)=> [...prev, {text:`${ selectedVoice} - ${message}`,isGpt:true,type:'audio',audio:audioUrl!}]);    

  } 

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenido*/}

            <GptMessage text={textoIni}/>

            {
              messages.map( (message,index)=>(
                message.isGpt ? ( 
                  message.type ==='audio'
                  ? (
                    <GptMessageAudio key={index} 
                    text={message.text}
                    audio={message.audio}/>
                  ):(
                    <GptMessage key={index} text={ message.text} />
                  )
                  ):(
                    <MyMessage key={index} text={ message.text} />
                    )                  
              ))
            }

            {isLoading && (
                <div className="col-start-1 col-end-12 fadein">
                  <TypingLoader className="fade-in"/>
              </div>              
              )
            }                      

        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escriba aqui lo que deseas"
        options={voices}
      />

    </div>
  )
}
