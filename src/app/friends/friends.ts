import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FriendService } from '../_services/friend-service';
import { BrawlerSummary } from '../_models/brawler';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatDialog } from '../_dialog/chat/chat';

@Component({
    selector: 'app-friends',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    templateUrl: './friends.html',
    styleUrl: './friends.scss'
})
export class Friends implements OnInit {
    private _friendsService = inject(FriendService);
    private _snackBar = inject(MatSnackBar);
    private _router = inject(Router);
    private _dialog = inject(MatDialog);

    searchQuery = '';
    isFocused = false;
    searchResults = signal<BrawlerSummary | null>(null);
    friendsList = signal<BrawlerSummary[]>([]);
    isSearching = signal(false);
    isAdding = signal(false);

    async ngOnInit() {
        await this.loadFriends();
    }

    async loadFriends() {
        try {
            const friends = await this._friendsService.getFriends();
            this.friendsList.set(friends);
        } catch (error) {
            console.error('Failed to load friends', error);
        }
    }

    async search() {
        if (!this.searchQuery.includes('#')) {
            this._snackBar.open('Please use Name#1234 format', 'Close', { duration: 3000 });
            return;
        }

        this.isSearching.set(true);
        try {
            const brawler = await this._friendsService.searchFriend(this.searchQuery);
            this.searchResults.set(brawler);
        } catch (error: any) {
            this.searchResults.set(null);
            this._snackBar.open('Agent not found', 'Close', { duration: 3000 });
        } finally {
            this.isSearching.set(false);
        }
    }

    async addFriend(friend: BrawlerSummary) {
        if (this.isAdding()) return;

        console.log('Attempting to connect with agent:', friend);
        this.isAdding.set(true);
        try {
            await this._friendsService.addFriend(friend.id);
            this._snackBar.open(`Established connection with ${friend.display_name}!`, 'Success', {
                duration: 3000,
                panelClass: 'success-snackbar'
            });
            this.searchResults.set(null);
            this.searchQuery = '';
            await this.loadFriends();
        } catch (error: any) {
            console.error('Connection failed:', error);
            const msg = typeof error.error === 'string' ? error.error : (error.error?.message || 'Failed to establish connection');
            this._snackBar.open(msg, 'Protocol Error', { duration: 5000 });
        } finally {
            this.isAdding.set(false);
        }
    }

    viewFriendMission(friend: BrawlerSummary) {
        this._router.navigate(['/missions'], { queryParams: { brawler_id: friend.id } });
    }

    openChat(friend: BrawlerSummary) {
        this._dialog.open(ChatDialog, {
            data: { friend },
            width: '450px',
            panelClass: 'chat-dialog-panel'
        });
    }
}
