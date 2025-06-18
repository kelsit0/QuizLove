import { Routes } from '@angular/router';
export const routes: Routes = [

        ///a futuro lazy loading components
    {
        path:'',
        loadComponent:()=>import('./pages/login/login.component').then(m => m.default)
    },
    {
        path:'home',
        loadComponent:()=>import('./pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path:'create-test',
        loadComponent:()=>import('./pages/create-test/create-test.component').then(m => m.CreateTestComponent)
    },
    {
        path:'answer-test',
        loadComponent:()=>import('./pages/answer-test/answer-test.component').then(m => m.AnswerTestComponent)
    },
    {
        path:'answer-test/:id',
        loadComponent:()=>import('./pages/answer-test/answer-test.component').then(m => m.AnswerTestComponent)
    }
];
