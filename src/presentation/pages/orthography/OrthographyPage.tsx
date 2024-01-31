import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage,  TextMessageBox, TypingLoader } from "../../components"
import {  orthographyUSeCase } from "../../../core/use-cases";

interface Message {
  text:string;
  isGpt:boolean;
  info?: {
    userScore :number;
    errors:string[];
    message:string;
  };
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost =async (text:string) => {
    setIsLoading(true);
    setMessages((prev)=> [...prev, {text:text,isGpt:false}]);    

   const data =await orthographyUSeCase(text);

   if (!data.ok) {
    setMessages((prev)=> [...prev,{text:"No se pudo realizar la correción",isGpt:true}]);
   } else {
    setMessages((prev)=> [...prev,{text:data.message,isGpt:true,
      info : {
        errors: data.errors,
        message:data.message,
        userScore:data.userScore
      }
    
    }]);
   }    

    setIsLoading(false);

    //todo : Añadir el mensaje de isGtp es true
  } 

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
            {/* Bienvenido*/}

            <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo"/>

            {
              messages.map( (message,index)=>(
                message.isGpt
                ? (
                  <GptOrthographyMessage key={index} 
                   {...message.info!} 

                    // errors={message.info!.errors}
                    // message={message.info!.message}
                    // userScore={message.info!.userScore}
                  />
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

      {/* <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escriba aqui lo que deseas"        
      /> */}

      {/* <TextMessageBoxSelect 
        onSendMessage={console.log}
        options={[
          {id:"1",text:"Hola"},
          {id:"2",text:"Mundo"}
        ]}
      /> */}

    </div>
  )
}
