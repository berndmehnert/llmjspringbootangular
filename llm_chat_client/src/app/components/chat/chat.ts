import {
  Component,
  ElementRef,
  effect,
  signal,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInput } from '../chat-input/chat-input';
import { ChatService } from '../../chat-service';
import { MarkdownComponent } from "ngx-markdown";

export type MessageSender = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatInput, MarkdownComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  // Signal state
  readonly messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      text: 'Hello! How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  assistantResponse = signal<string>('');
  isLoading = signal<boolean>(false);

  // Whether we should auto-stick to bottom on new messages
  private readonly stickToBottom = signal(true);

  // Signal query to the scroll container
  private readonly scrollEl = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  constructor(private chatService: ChatService) {
    // Start at the bottom after first render
    afterNextRender(() => this.scrollToBottom());

    // Auto-scroll on new messages only if we're near the bottom
    effect(() => {
      this.messages(); // track changes
      if (this.stickToBottom()) {
        queueMicrotask(() => this.scrollToBottom({ smooth: true }));
      }
    });
  }

  onScroll() {
    const el = this.scrollEl()?.nativeElement;
    if (!el) return;
    const threshold = 80; // px
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.stickToBottom.set(distanceFromBottom <= threshold);
  }

  handleNewMessage(message: string) {
    if (!message || message.length == 0) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID?.() ?? String(Date.now()) + '-u',
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    this.messages.update(list => [...list, userMessage]);

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID?.() ?? String(Date.now()) + '-u',
      text: this.assistantResponse(),
      sender: 'assistant',
      timestamp: new Date(),
    };
    this.messages.update(list => [...list, assistantMessage]);

    this.assistantResponse.set('');
    this.isLoading.set(true);

    this.chatService.getChatStream(message, {
      onMessage: (content: string) => {
        // Use .update() to calculate the new value from the old one
        this.assistantResponse.update(currentValue => currentValue + content);
        this.messages.update(list => {
          // Update the last assistant message with the new content
          const updatedList = [...list];
          if (list.length > 0) {
            updatedList[list.length - 1] = {
              ...updatedList[list.length - 1],
              text: this.assistantResponse(),
            };
          }
          return updatedList;
        });
      },
      onClose: () => {
        this.isLoading.set(false);
      },
      onError: (error: any) => {
        this.isLoading.set(false);
        this.assistantResponse.set('Sorry, an error occurred. Please try again.');
        console.error('Error during streaming:', error);
      }
    });
  }

  private scrollToBottom(opts?: { smooth?: boolean }) {
    const el = this.scrollEl()?.nativeElement;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: opts?.smooth ? 'smooth' : 'auto',
    });
  }
}