import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { prosConsUSeCase } from "../../../core/use-cases";




interface Message {
  text:string;
  isGpt:boolean;
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost =async (text:string) => {
    setIsLoading(true);
    setMessages((prev)=> [...prev, {text:text,isGpt:false}]);    


    const {ok, content} =await prosConsUSeCase(text);
    console.log(content);
    setIsLoading(false);
    if ( !ok ) return;      

    setMessages((prev)=> [...prev,{text:content,isGpt:true}]);
     
    console.log(content);

    //todo : Añadir el mensaje de isGtp es true
  } 

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenido*/}

            <GptMessage text="Hola, te puedo ayudar comparando varias cosas si deseas"/>

            {
              messages.map( (message,index)=>(
                message.isGpt
                ? (
                  <GptMessage key={index} text={message.text}/>
                  )
                : (
                    <MyMessage key={index} text={ message.text} />
                  )
              ))
            }

            {
              isLoading && (
                <div className="col-start-1 col-end-12 fadein">
                  <TypingLoader className="fade-in"/>
              </div>              
              )
            }
            
          

        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escriba aqui lo que deseas"
        disableCorrections
      />

    </div>
  )
}

