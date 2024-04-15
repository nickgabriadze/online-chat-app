import { Socket } from 'socket.io';
import { v4 } from 'uuid';
export class Queue {

    activeUsers: Socket[] = [];
    queue: {socket: Socket, username: string}[] = [];
    active: { 
        room: string,
        socket1: Socket, 
        socket2: Socket,
        username1: String,
        username2: String

    }[] = [];


    push(socket: {socket: Socket, username: string}) {
        const newQueue = [...this.queue, socket]
        this.queue = newQueue;
    }

    pop() {
        const poppedEl = this.queue.pop();

        return poppedEl;
    }


    joinTwoSockets() {

        const randomRoom = v4();
        const twoUsers = [this.pop(), this.pop()];

        twoUsers[0]?.socket.join(randomRoom);
        twoUsers[1]?.socket.join(randomRoom);

       

        const actives = {
            room: randomRoom,
            socket1: twoUsers[0]?.socket,
            socket2: twoUsers[1]?.socket,
            username1: twoUsers[0]?.username,
            username2: twoUsers[1]?.username
        }

        
        this.active.push(actives);
        
        setTimeout(() => {
            actives.socket1.to(randomRoom).emit("receive-username", actives.username1);
            actives.socket2.to(randomRoom).emit("receive-username", actives.username2);
        }, 500);

        setTimeout(() => {
            actives.socket1.to(randomRoom).emit("open-chat");
            actives.socket2.to(randomRoom).emit("open-chat");
        }, 1000)

        
    }


    size() {
        return this.active.length;
    }

    startChat() {
        if (this.queue.length == 2) {
            this.joinTwoSockets();
        }
    }

    sendMessage(data: {
        from: String,
        text: String,
        fromSocketId: String,
        timeSent: String
    }) {

        this.active.forEach(eachChatRoom => {
            if (eachChatRoom.socket1.id === data.fromSocketId) {
                eachChatRoom.socket1.to(eachChatRoom.room).emit("receive-message", {
                    from: data.from + " ", // this is done because the 
                    // css just ignored the fact that the "from" is actually the other person and if for example
                    // the sender's username is Mike and the receiver is also Mike, it's comparing Mike === Mike and 
                    // the final message is still on the right side but the received just doesn't show up, so I'm adding a " " to make
                    // sure that the "Mike " !== "Mike"
                    text: data.text,
                    timeSent: data.timeSent
                })
            }

            if (eachChatRoom.socket2.id === data.fromSocketId) {

                eachChatRoom.socket2.to(eachChatRoom.room).emit("receive-message", {
                    from: data.from + " ",
                    text: data.text,
                    timeSent: data.timeSent
                })
            }
        });

    }

    endChat(whoLeft: Socket) {
        let roomToDelete: String = "";
        this.active.forEach((eachChatRoom) => {
            if (eachChatRoom.socket1.id === whoLeft.id) {
                eachChatRoom.socket1.to(eachChatRoom.room).emit("left-the-chat");
                roomToDelete = eachChatRoom.room;
            }

            if (eachChatRoom.socket2.id === whoLeft.id) {
                eachChatRoom.socket2.to(eachChatRoom.room).emit("left-the-chat");
                roomToDelete = eachChatRoom.room;
            }


        });

        this.active = this.active.filter(eachChat => eachChat.room !== roomToDelete);
    }

    leftTheWebsite(id: string){
        this.activeUsers = this.activeUsers.filter(u => u.id !== id);
    }

    joinedTheWebsite(socket:Socket){
        this.activeUsers.push(socket);
    }

    shareLiveUsersCounter(){
        
        this.activeUsers.forEach(each => {
            each.emit("share-live-counter", this.activeUsers.length-1);
        })

    }
}





export default Queue;