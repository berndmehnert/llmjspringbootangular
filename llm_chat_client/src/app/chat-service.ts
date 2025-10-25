import { Injectable } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { AuthService } from './auth-service';

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

  constructor(private authService: AuthService) { }

  async getChatStream(userMessage: string, callbacks: ChatStreamCallbacks): Promise<void> {
    try {
      const token = await this.authService.getValidToken();

      if (!token) {
        callbacks.onError('Failed to obtain authentication token');
        return;
      }

      fetchEventSource(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
          // Important: Throwing an error here will stop the library from retrying.
          throw err;
        },
      });
    } catch (error) {
      console.error('Failed to start chat stream:', error);
      callbacks.onError(error);
    }
  }
}
