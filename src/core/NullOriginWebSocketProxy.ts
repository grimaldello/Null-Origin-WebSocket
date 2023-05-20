import { WebSocketWrapperResponse } from "./WebSocketWrapperResponse";

class WebSocketWrapper {

    private webSocket: WebSocket;

    private forwardBackWebSocketResponseToProxy(webSocketWrapperResponseData: WebSocketWrapperResponse) {
        window.parent.postMessage(JSON.stringify(webSocketWrapperResponseData), '*');
    }

    constructor(url: string) {

        const self = this;

        console.log(`Creating websocket...`);
        console.log(`Connecting to ${url}`);
        this.webSocket = new WebSocket(url);
        
        this.webSocket.onopen = (event: Event)=>{
            console.log(`Connected to ${url}`);
            self.forwardBackWebSocketResponseToProxy({
                webSocketEventType: "onopen",
                __originalEvent: {"type": event.type}
            });
        };

        this.webSocket.onmessage = (event: MessageEvent<any>) => {
            self.forwardBackWebSocketResponseToProxy({
                webSocketEventType: "onmessage",
                result: event.data,
                __originalEvent: {"origin": event.origin, "type": event.type}
            });
        };

        this.webSocket.onclose = (event: CloseEvent) => {
            self.forwardBackWebSocketResponseToProxy({
                webSocketEventType: "onclose",
                __originalEvent: {"type": event.type}
            });
        };

        this.webSocket.onerror = (event: Event) => { 
            self.forwardBackWebSocketResponseToProxy({
                webSocketEventType: "onerror",
                __originalEvent: {"type": event.type}
            });
        };
        

        window.addEventListener("message", (event: MessageEvent<any>) => {
            // Handle here data to send to WebSocket
            if(event.data.closeWebSocket) {
                self.webSocket.close();
            }
            else {
                let dataToSend: string = event.data;
                if(typeof event.data !== 'string') {
                    dataToSend = JSON.stringify(dataToSend);
                }
                self.webSocket.send(dataToSend);
            }
        }, false);
    }
}

type OnMessageCallback = (messageEvent: WebSocketWrapperResponse)=>void;
type OnCloseCallback = (closeEvent: WebSocketWrapperResponse)=>void;
type OnErrorCallback = (event: WebSocketWrapperResponse)=>void;
type OnOpenCallback = (event: WebSocketWrapperResponse)=>void;

export class NullOriginWebSocketProxy extends HTMLIFrameElement {

    private onmessageCallback: OnMessageCallback;
    private oncloseCallback: OnCloseCallback;
    private onopenCallback: OnOpenCallback;
    private onerrorCallback: OnErrorCallback;
    
    private url: string;
    private webSocketId: string;

    private createNullOriginWebSocket(url: string): string {
        const iframeContentAsBase64: string =
            window.btoa(`<script>new ${WebSocketWrapper}('${url}')</script>`);

        return `data:text/html;base64,${iframeContentAsBase64}`;
    }

    constructor(
        url: string, 
        onmessageCallback: OnMessageCallback, 
        oncloseCallback: OnCloseCallback, 
        onopenCallback: OnOpenCallback, 
        onerrorCallback: OnErrorCallback
    ) {
        super();

        const self = this;

        this.onmessageCallback = onmessageCallback;
        this.oncloseCallback = oncloseCallback;
        this.onopenCallback = onopenCallback;
        this.onerrorCallback = onerrorCallback;

        this.url = url;
        this.webSocketId = Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
        
        this.initializeInternalHiddenIframe();

        window.addEventListener("message", (event) => {
            // Handle here response from WebSocket
            if(event.origin !== "null") {
                return;
            }
            const parsedData: WebSocketWrapperResponse = JSON.parse(event.data) as WebSocketWrapperResponse;
            
            if(parsedData.webSocketEventType === "onopen") {
                self.onopenCallback(parsedData);
            }
            else if(parsedData.webSocketEventType === "onmessage") {
                self.onmessageCallback(parsedData);
            }
            else if(parsedData.webSocketEventType === "onclose") {
                self.oncloseCallback(parsedData);
                self.remove();  // Remove iframe from DOM
            }
            else if(parsedData.webSocketEventType === "onerror") {
                self.onerrorCallback(parsedData);
            }
        }, false);
    }

    private initializeInternalHiddenIframe() {
        this.id = this.webSocketId;
        this.src = this.createNullOriginWebSocket(this.url);
        this.style.display = 'none';
        document.body.appendChild(this);
    }

    public destroyWebSocket() {
        this.sendDataToWebSocket({
            closeWebSocket: true
        });
    }

    public sendDataToWebSocket(data: any): void {
        this.contentWindow.postMessage(data, '*');
    }
}

customElements.define('null-origin-web-socket-proxy', NullOriginWebSocketProxy, {extends: 'iframe'});
