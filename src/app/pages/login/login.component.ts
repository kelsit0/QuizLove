import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Añade esta línea
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
///aca aplica binding
export class LoginComponent {

  ///unidireccional binding 
  email:string ='';
  password:string ='';

  constructor(private router: Router){
    
  }
  submit():void{
    console.log("credenciales", this.email, this.password)
    this.router.navigate(['/home'])
  }
}
