import { SimpleNullOriginWebSocketClient } from "../src/client/SimpleNullOriginWebSocketClient";

(async ()=>{
    const client: SimpleNullOriginWebSocketClient = new SimpleNullOriginWebSocketClient("ws://127.0.0.1:12345");
    
    await client.establishWebSocketConnection();

})();