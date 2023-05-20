import { AbstractNullOriginWebSocketClient } from "../core/AbstractNullOriginWebSocketClient";
import { WebSocketWrapperResponse } from "../core/WebSocketWrapperResponse";

export class SimpleNullOriginWebSocketClient extends AbstractNullOriginWebSocketClient {

    private customOnOpenCallback: (response: WebSocketWrapperResponse) => void;
    private customOnMessageCallback: (response: WebSocketWrapperResponse) => void;
    private customOnErrorCallback: (response: WebSocketWrapperResponse) => void;
    private customOnCloseCallback: (response: WebSocketWrapperResponse) => void;


    protected onopenCallback(response: WebSocketWrapperResponse): void {
        console.log("onopen");
        console.log(response);
        if(this.customOnOpenCallback) {
            this.customOnOpenCallback(response);
        }
        else {
            console.warn("No custom callback defined for onopen event");
        }
    }

    protected onmessageCallback(response: WebSocketWrapperResponse): void {
        console.log("onmessage");
        console.log(response);
        if(this.customOnMessageCallback) {
            this.customOnMessageCallback(response);
        }
        else {
            console.warn("No custom callback defined for onmessage event");
        }
    }

    protected onerrorCallback(response: WebSocketWrapperResponse): void {
        console.log("onerror");
        console.log(response);
        if(this.customOnErrorCallback) {
            this.customOnErrorCallback(response);
        }
        else {
            console.warn("No custom callback defined for onerror event");
        }
    }

    protected oncloseCallback(response: WebSocketWrapperResponse): void {
        console.log("onclose");
        console.log(response);
        if(this.customOnCloseCallback) {
            this.customOnCloseCallback(response);
        }
        else {
            console.warn("No custom callback defined for onclose event");
        }
    }

    constructor(url: string) {
        super(url);
    }

    public setCustomOnOpenCallback(callback: (response: WebSocketWrapperResponse) => void) {
        this.customOnOpenCallback = callback;
    }

    public setCustomOnMessageCallback(callback: (response: WebSocketWrapperResponse) => void) {
        this.customOnMessageCallback = callback;
    }

    public setCustomOnErrorCallback(callback: (response: WebSocketWrapperResponse) => void) {
        this.customOnErrorCallback = callback;
    }

    public setCustomOnCloseCallback(callback: (response: WebSocketWrapperResponse) => void) {
        this.customOnCloseCallback = callback;
    }
}