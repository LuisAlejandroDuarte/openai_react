import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage } from "../../components";
import { imageGenerationUSeCase } from "../../../core/use-cases";




interface Message {
  text:string;
  isGpt:boolean;
  info?:{
    imageUrl:string;
    alt:string;
  }
}

export const ImageGenerationPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost =async (text:string) => {
    setIsLoading(true);
    setMessages((prev)=> [...prev, {text:text,isGpt:false}]);    

    const imageInfo = await imageGenerationUSeCase(text);

    setIsLoading(false);

    if (!imageInfo) {
      return  setMessages((prev)=> [...prev, {text:'No se pudo generar la imagen',isGpt:true}]);    
    }


 setMessages((prev)=> [...prev, {
    text:text,
    isGpt:true,
    info:{
      imageUrl:imageInfo.url,
      alt:imageInfo.alt
    }
  }]);    
    
  } 

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenido*/}

            <GptMessage text="Que imagen deseas generar hoy?"/>

            {
              messages.map( (message,index)=>(
                message.isGpt
                ? (
                  <GptMessageImage key={index}                     
                    imageUrl={message.info?.imageUrl!}
                    alt={message.info?.alt!} />
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

