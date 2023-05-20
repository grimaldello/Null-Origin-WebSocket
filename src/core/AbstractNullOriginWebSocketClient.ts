import { NullOriginWebSocketProxy } from "./NullOriginWebSocketProxy";
import { WebSocketWrapperResponse } from "./WebSocketWrapperResponse";


export abstract class AbstractNullOriginWebSocketClient {
    private nullOriginWebSocketProxy: NullOriginWebSocketProxy;
    protected isConnected: boolean = false;
    protected url: string;

    protected abstract onopenCallback(event: WebSocketWrapperResponse): void;
    protected abstract onmessageCallback(messageEvent: WebSocketWrapperResponse): void;
    protected abstract onerrorCallback(event: WebSocketWrapperResponse): void;
    protected abstract oncloseCallback(closeEvent: WebSocketWrapperResponse): void;

    private internalOnOpenCallback(event: WebSocketWrapperResponse): void {
        this.isConnected = true;
        this.onopenCallback(event);
    }

    private internalOnErrorCallback(event: WebSocketWrapperResponse): void {
        this.onerrorCallback(event);
    }

    private internalOnCloseCallback(closeEvent: WebSocketWrapperResponse): void {
        this.isConnected = false;
        this.oncloseCallback(closeEvent)
    }

    private internalOnMessageCallback(messageEvent: WebSocketWrapperResponse): void {
        this.onmessageCallback(messageEvent);
    }

    constructor(url: string) {
        this.url = url;
    }

    public async sendDataToWebSocket(data: any): Promise<void> {
        this.nullOriginWebSocketProxy.sendDataToWebSocket(data);
    }

    public async destroy(): Promise<boolean> {
        this.nullOriginWebSocketProxy.destroyWebSocket();
        return this.waitForWebSocketDisconnection();
    }

    private async waitForWebSocketDisconnection(): Promise<boolean> {
        return new Promise(async (resolve)=>{
            while(this.isConnected === true) {
                await new Promise( resolve => setTimeout(resolve, 100));
            }
            resolve(this.isConnected);
        });
    }

    private async waitForWebSocketConnection(): Promise<boolean> {
        return new Promise(async (resolve)=>{
            while(this.isConnected === false) {
                await new Promise( resolve => setTimeout(resolve, 100));
            }
            resolve(this.isConnected);
        });
    }

    public async establishWebSocketConnection(): Promise<boolean> {
        const self = this;

        this.nullOriginWebSocketProxy = new NullOriginWebSocketProxy(
            this.url, 
            (messageEvent: WebSocketWrapperResponse)=>{self.internalOnMessageCallback(messageEvent)},
            (closeEvent: WebSocketWrapperResponse)=>{self.internalOnCloseCallback(closeEvent);},
            (event: WebSocketWrapperResponse)=>{self.internalOnOpenCallback(event);},
            (event: WebSocketWrapperResponse)=>{self.internalOnErrorCallback(event);},
        );
        return this.waitForWebSocketConnection();
    }
}


