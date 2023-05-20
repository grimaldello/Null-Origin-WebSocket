export interface WebSocketWrapperResponse {
    webSocketEventType: "onopen" | "onmessage" | "onclose" | "onerror",
    result?: string,
    __originalEvent?: any // Map here all additional fields of the original event
}