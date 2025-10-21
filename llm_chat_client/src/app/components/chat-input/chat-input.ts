import { Component, effect, input, output, signal } from '@angular/core';
import { Autosize } from '../../directives/autosize';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-chat-input',
  imports: [Autosize, ReactiveFormsModule, CommonModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css'
})
export class ChatInput {
  messageSentEvent = output<string>();
  isDisabled = input<boolean>(false);
  isFocused = signal(false);

  onFocus() {
    this.isFocused.set(true);
    console.log("Focus set to true");
  }

  onBlur() {
    this.isFocused.set(false);
  }

  // Handle focus events for the textarea
  onTextareaFocus() {
    this.isFocused.set(true);
  }

  onTextareaBlur() {
    this.isFocused.set(false);
  }

  chatForm = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5000)])
  });

  constructor() {
    effect(() => {
      if (this.isDisabled()) {
        this.chatForm.disable();
      } else {
        this.chatForm.enable();
      }
    });
  }

  get messageControl() {
    return this.chatForm.get('message');
  }

  handleEnter(event: Event) {
    if (event instanceof KeyboardEvent && !event.shiftKey) {
      event.preventDefault(); // Prevent the default newline action
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.chatForm.invalid) {
      return;
    }
    this.messageSentEvent.emit(this.messageControl?.value as string);
    this.chatForm.reset();
  }
}
