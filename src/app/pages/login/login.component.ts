import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
///aca aplica binding
export default class LoginComponent {


  loginForm: FormGroup;


  ///unidireccional binding 
  constructor(private router: Router, private fb:FormBuilder){
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['', Validators.required]
    });
  }
  submit():void{
    if(this.loginForm.valid){
      const {email,password}= this.loginForm.value;
      console.log('Login Data', email, password);
      this.router.navigate(['/home'])
    }
  }
}
