import messagingStyles from "./styles/messaging.module.css";
import { returnCurrentTime } from "./api/returnTime";
import { useEffect, useRef, useState } from 'react';
import { v4 } from "uuid";
import { useAppSelector } from "./redux-store/hooks";
import {Socket} from "socket.io-client";

interface Message {
    from: string,
    text: string,
    timeSent: string
}

export const MessagingPage = ({ socket }:{socket: Socket}) => {
    const username = useAppSelector(state => state.uReducer.username);
    const [messages, setMessages] = useState([{
        from: 'FROM',
        text: 'MSG',
        timeSent: 'TIME'
    }]);

    const actives:number = useAppSelector(state => state.uReducer.activeUsers);
    const [writtenMessage, setWrittenMessage] = useState("");
    const msgBoxRef = useRef<HTMLDivElement>(null);
    const [newOne, setNewOne] = useState(false);
    const [isChattingWith, setIsChattingWith] = useState<string>("");
    const [inChat, setInChat] = useState(false);

    const sendMessage = async () => {
        const msg = {
            from: username,
            text: writtenMessage,
            fromSocketId: socket.id,
            timeSent: returnCurrentTime()
        }

        await socket.emit("send-msg", msg);
    }

    socket.on("receive-message", (data: Message) => {
        setMessages([...messages, data])
    })

    socket.on("left-the-chat", () => {
        window.location.reload();
    })

    socket.on("open-chat", () => {
        setInChat(true);
    })




    socket.on("receive-username", (receivedUsername: string) => {
        setIsChattingWith(receivedUsername);

    });





    useEffect(() => {
        if (msgBoxRef.current) {
            msgBoxRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                }
            )
        }
    }, [messages])

    return (

        <>

            { inChat ?

                <div className={messagingStyles['centered']}>
                    <div className={messagingStyles["wrapper-div"]}>

                        <div>


                            <h4>You are chatting with: </h4>
                            <h4 style={{ color: 'indigo' }}>
                                {isChattingWith}
                            </h4>
                        </div>
                        <div className={messagingStyles["messagingBox"]}>

                            <div>
                                <div className={messagingStyles['chatBox']}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {messages.slice(1).map((eachMessage, index) =>
                                            <div key={v4()} ref={msgBoxRef} className={messagingStyles['block']} style={username === eachMessage.from ? {alignItems:"flex-end"} : {alignItems:"flex-start"}}>
                                                <div>
                                                    <p  className={ username === eachMessage.from ? messagingStyles['msg-me']: messagingStyles['msg-from']} >{eachMessage.text}</p>

                                                </div>
                                                {
                                                    (index === messages.length - 2) ?
                                                        <div className={messagingStyles['meta']}>
                                                            <p>{eachMessage.from === username ? "You" : eachMessage.from} at</p>
                                                            <p>{eachMessage.timeSent}</p>

                                                        </div>
                                                        :""}

                                            </div>


                                        )}
                                    </div>

                                </div>


                                <div className={messagingStyles['action']}>
                                    <div className={messagingStyles['new-send']}
                                         style={newOne ? {  textAlign: 'center', color: 'white'} : {}}

                                         onClick={() => {

                                             if (newOne) {
                                                 window.location.reload();
                                             } else {
                                                 setNewOne(true);
                                             }
                                         }}>{newOne ? "Sure?" : "New"}</div>

                                    <input className={messagingStyles["textareaStyle"]} placeholder="type something..."
                                           onChange={(e) => { setWrittenMessage(e.target.value); if(newOne){setNewOne(false)}}}
                                           onKeyDown={(e) => {
                                               if (e.key == "Enter") {
                                                   if (writtenMessage.length != 0) {

                                                       setMessages([...messages, {from: username, text: writtenMessage, timeSent: returnCurrentTime()}]);
                                                       setWrittenMessage("");
                                                       sendMessage();
                                                   }
                                               }
                                           }}
                                           value={writtenMessage}></input>

                                    <div className={messagingStyles['new-send']}
                                         onClick={() => {
                                             if (writtenMessage.trim() !== "") {
                                                 setMessages([...messages, {from: username, text: writtenMessage, timeSent: `${returnCurrentTime()}`}]);
                                                 setWrittenMessage("");
                                                 sendMessage();
                                             }
                                         }}

                                    >Send</div>
                                </div>
                                <div style={{textAlign: 'center', marginTop:'5px', color: "#4B0082"}}>Active Users: <>{actives}</></div>

                            </div>
                        </div>

                    </div>
                </div>

                :


                <div className={messagingStyles['centered']} style={{color: 'white', textAlign: 'center'}}>

                    Wait till we are searching someone for you 😊


                </div>

            }
        </>
    )
}

export default MessagingPage;