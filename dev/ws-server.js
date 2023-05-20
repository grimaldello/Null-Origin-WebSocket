// Importing the required modules
const WebSocketServer = require('ws');
 
const webSocketPort = 12345;
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: webSocketPort })
 
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
 
    // sending message to client
    ws.send('Welcome, you are connected!');
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log(`The WebSocket server is running on port ${webSocketPort}`);