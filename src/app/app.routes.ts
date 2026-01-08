import { Routes } from '@angular/router';
import { ServerError } from './server-error/server-error';
import { NotFound } from './not-found/not-found';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Home } from './home/home';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "login", component: Login},
    {path: "profile", component: Profile},
    {path: "server-error", component: ServerError},
    {path: "**", component: NotFound},
];
