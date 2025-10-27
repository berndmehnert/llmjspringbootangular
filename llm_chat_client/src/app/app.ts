import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chat } from "./components/chat/chat";
import { AuthService } from './auth-service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('llm_chat_client');
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    // On startup, check if we still have a valid session cookie.
    this.authService.verifyAuthentication().pipe(take(1)).subscribe({
      next: result => {
        if (result) {
          console.log("Using valid session!");
        } else {
          this.startNewChat();
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  startNewChat() {
    // If not authenticated, or to start a new session, just call login.
    this.authService.login().subscribe(success => {
      if (success) {
        console.log("New chat session is active!");
      }
    });
  }
}
