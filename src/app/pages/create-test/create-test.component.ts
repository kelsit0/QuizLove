import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss'] 
})
export class CreateTestComponent {
  
  preguntas: { pregunta: string; respuesta: string }[] = [];
  nuevaPregunta = { pregunta: '', respuesta: '' };
  mostrarListado = false;

  guardarPregunta() {
    if (this.nuevaPregunta.pregunta && this.nuevaPregunta.respuesta) {
      this.preguntas.push({ ...this.nuevaPregunta });
      this.nuevaPregunta = { pregunta: '', respuesta: '' };
    }
  }

  verPreguntas() {
    this.mostrarListado = true;
  }
  noVerPreguntas(){
    this.mostrarListado = false;
  }
}