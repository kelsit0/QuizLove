import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private route:Router){

  }

  responder():void{
    console.log("responder")
    this.route.navigate(['/answer-test'])
  }

  crear():void{
    console.log("crear")
    
    this.route.navigate(['/create-test'])
  }

}
