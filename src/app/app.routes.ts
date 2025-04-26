import { Routes } from '@angular/router';
export const routes: Routes = [

        ///a futuro lazy loading components
    {
        path:'',
        loadComponent:()=>import('./pages/login/login.component')
    },
    {
        path:'home',
        loadComponent:()=>import('./pages/home/home.component')
    },
    
];
