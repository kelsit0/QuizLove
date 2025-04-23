import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

        ///a futuro lazy loading components
    {
        path:'',
        component:LoginComponent
    },
    {
        path:'home',
        component:HomeComponent
    },
    
];
