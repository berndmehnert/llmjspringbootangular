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

  async getChatStream(userMessage: string, callbacks: ChatStreamCallbacks): Promise<void> {
    try {
      fetchEventSource(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // !!!! This line ensures that cookies are sent with the request
        // The body must be a stringified JSON object
        body: JSON.stringify({
          userMessage: userMessage,
        }),

        onopen: async (response) => {
          if (response.ok) {
            console.log('Connection opened.');
          } else {
            const error = await response.json();
            callbacks.onError(error);
          }
        },

        onmessage: (event) => {
          const parsedData = JSON.parse(event.data);
          if (parsedData.done === false) {
            const content = parsedData.message.content;
            callbacks.onMessage(content);
          }
        },

        onclose: () => {
          console.log('Connection closed by server.');
          callbacks.onClose();
        },

        onerror: (err) => {
          console.error('EventSource failed:', err);
          callbacks.onError(err);
          throw err;
        },
      });
    } catch (error) {
      console.error('Failed to start chat stream:', error);
    }
  }
}
