import { Component, Inject, OnInit, signal, effect, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../_services/message-service';
import { PassportService } from '../../_services/passport-service';
import { Message } from '../../_models/message';
import { BrawlerSummary } from '../../_models/brawler';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './chat.html',
    styleUrl: './chat.scss'
})
export class ChatDialog implements OnInit {
    private _messageService = inject(MessageService);
    private _passportService = inject(PassportService);

    messages = signal<Message[]>([]);
    newMessage = '';
    currentUserId = signal<number | null>(null);
    todaysDate = new Date();

    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<ChatDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { friend: BrawlerSummary }
    ) {
        this.currentUserId.set(this._passportService.data()?.brawler_id ?? null);

        // Polling for new messages every 3 seconds for simplicity
        setInterval(() => {
            this.loadMessages();
        }, 3000);
    }

    ngOnInit() {
        this.loadMessages();
    }

    async loadMessages() {
        try {
            console.log('Fetching decryption keys for conversation with agent:', this.data.friend.id);
            const msgs = await this._messageService.get_conversation(this.data.friend.id);
            console.log('Synchronized logs found:', msgs.length);
            // Only update if messages changed to avoid jitter
            if (msgs.length !== this.messages().length) {
                this.messages.set(msgs);
                setTimeout(() => this.scrollToBottom(), 100);
            }
        } catch (error) {
            console.error('FAILED TO SYNCHRONIZE COMM LOGS:', error);
        }
    }

    async sendMessage() {
        const content = this.newMessage.trim();
        if (!content) return;

        try {
            console.log('Transmitting burst to agent:', this.data.friend.id);
            await this._messageService.send_message(this.data.friend.id, content);
            console.log('Transmission successful');
            this.newMessage = '';
            await this.loadMessages();
        } catch (error) {
            console.error('TRANSMISSION_FAILURE:', error);
        }
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    close() {
        this.dialogRef.close();
    }
}
