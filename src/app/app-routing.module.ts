import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './layout/home/home.component';
import {NotFoundComponent} from './layout/not-found/not-found.component';
import {ListEventComponent} from './features/events/list-event/list-event.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path:'',redirectTo:'home',pathMatch:'full'},
  { path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule) },
  { path: 'feedback', loadChildren: () => import('./features/events/feedback/feedback.module').then(m => m.FeedbackModule) },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'**',component:NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
