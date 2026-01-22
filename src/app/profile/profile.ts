import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PassportService } from '../_services/passport-service';
import { getAvatar } from '../_helpers/avatar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UploadPhoto } from '../_dialog/upload-photo/upload-photo';
import { UserService } from '../_services/user-service';

@Component({
  selector: 'app-profile',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private _passport = inject(PassportService);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  private _userService = inject(UserService);

  displayName = computed(() => this._passport.data()?.display_name ?? 'Guest');
  avatarUrl = computed(() => this._passport.image());

  logout(): void {
    this._passport.destroy();
    this._router.navigate(['/']);
  }

  openDialog(): void {
    const ref = this._dialog.open(UploadPhoto, {
      data: { name: this.displayName() },
      width: '400px',
    });
    ref.afterClosed().subscribe(async (file) => {
      if (file) {
        await this._userService.uploadAvatarImg(file);
      }
    });
  }

  editProfile(): void {
    this._router.navigate(['/']);
  }
}
