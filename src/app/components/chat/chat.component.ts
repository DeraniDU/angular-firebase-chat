import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { ChatService, Message } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
  // Remove 'standalone: true' if present
  // Remove 'imports: []' if present
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  
  user$: Observable<User | null>;
  messages$: Observable<Message[]>;
  messageControl = new FormControl('');
  currentUser: User | null = null;
  
  private subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {
    this.user$ = this.authService.user$;
    this.messages$ = this.chatService.getMessages();
  }

  ngOnInit() {
    this.subscription.add(
      this.user$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async sendMessage() {
    const text = this.messageControl.value?.trim();
    if (text && this.currentUser) {
      try {
        await this.chatService.sendMessage(text, this.currentUser);
        this.messageControl.reset();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  signOut() {
    this.authService.signOut();
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  isMyMessage(message: Message): boolean {
    return this.currentUser?.uid === message.userId;
  }
}
