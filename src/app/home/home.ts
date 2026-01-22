import { Component, inject } from '@angular/core';
import { PassportService } from '../_services/passport-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private _passport = inject(PassportService)

  constructor(private router: Router) {
    if (!this._passport.data())
      this.router.navigate(['/login'])
  }

  private _http = inject(HttpClient)
  makeError(code: number) {
    const baseUrl = environment.baseUrl + '/util/make-error/' + code
    this._http.get(baseUrl).subscribe({
      error: (err) => {
        console.log(err)
      }
    })
  }
}