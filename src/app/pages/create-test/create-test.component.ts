import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {
  preguntas: Question[] = [];
  nuevaPregunta: Question = { pregunta: '', respuesta: '' };
  mostrarListado = false;
  quizCreated = false;

  constructor(private router: Router) {}

  guardarPregunta() {
    if (this.nuevaPregunta.pregunta && this.nuevaPregunta.respuesta) {
      this.preguntas.push({ ...this.nuevaPregunta });
      this.nuevaPregunta = { pregunta: '', respuesta: '' };
      this.mostrarListado = true;
    }
  }

  verPreguntas() {
    this.mostrarListado = true;
  }

  noVerPreguntas() {
    this.mostrarListado = false;
  }

  eliminarPregunta(index: number) {
    this.preguntas.splice(index, 1);
  }

  editarPregunta(index: number) {
    this.nuevaPregunta = { ...this.preguntas[index] };
    this.preguntas.splice(index, 1);
  }

  finalizarQuiz() {
    if (this.preguntas.length > 0) {
      // TODO: Save quiz to a service/backend
      this.quizCreated = true;
      // Generate a unique quiz ID
      const quizId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(this.preguntas));
      
      // Navigate to the share screen or show share dialog
      // For now, we'll just console.log the sharing URL
      console.log(`Quiz created! Share this URL with your partner: /answer-test/${quizId}`);
    }
  }

  reiniciarQuiz() {
    this.preguntas = [];
    this.nuevaPregunta = { pregunta: '', respuesta: '' };
    this.mostrarListado = false;
    this.quizCreated = false;
  }
}