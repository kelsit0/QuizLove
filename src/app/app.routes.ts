import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

        ///a futuro lazy loading components
    {
        path:'',
        component:LoginComponent
    }

];
