import { Injectable } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export interface ChatStreamCallbacks {
  onMessage: (content: string) => void;
  onClose: () => void;
  onError: (error: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat/stream'; // Your backend URL
  
    constructor() { }
  
    getChatStream(userMessage: string, callbacks: ChatStreamCallbacks): void {
  
      fetchEventSource(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The body must be a stringified JSON object
        body: JSON.stringify({
          userMessage: userMessage,
        }),
  
        // This is called when the connection is opened
        onopen: async (response) => {
          if (response.ok) {
            console.log('Connection opened.');
          } else {
            // Handle server-side errors (e.g., 4xx, 5xx)
            const error = await response.json();
            callbacks.onError(error);
          }
        },
  
        // This is called for each "data:" chunk !
        onmessage: (event) => {
          const parsedData = JSON.parse(event.data);
          if (parsedData.done === false) {
            const content = parsedData.message.content;
            // Pass the content chunk to the component via the callback
            callbacks.onMessage(content);
          }
        },
  
        // This is called when the stream is closed by the server
        onclose: () => {
          console.log('Connection closed by server.');
          callbacks.onClose();
        },
  
        // This is called for any network-related errors
        onerror: (err) => {
          console.error('EventSource failed:', err);
          callbacks.onError(err);
          // Important: Throwing an error here will stop the library from retrying.
          throw err;
        },
      });
    }
}
