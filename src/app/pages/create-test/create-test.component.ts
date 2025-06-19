import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz, Question, Answer } from '../../models/quiz.model';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent {
  quiz: Quiz = {
    title: '',
    description: '',
    creatorId: 'user',
    createdAt: new Date(),
    questions: []
  };
  
  currentQuestion: Question = this.createEmptyQuestion();

  mostrarListado = false;
  quizCreated = false;
  error = '';
  isLoading = false;
  validationErrors: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private quizService: QuizService
  ) {}

  createEmptyQuestion(): Question {
    return {
      text: '',
      answers: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
  }

  setCorrectAnswer(selectedAnswer: Answer) {
    this.currentQuestion.answers.forEach(answer => {
      answer.isCorrect = (answer === selectedAnswer);
    });
  }

  validateQuestion(): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];
    
    if (!this.currentQuestion.text?.trim()) {
      errors.push('El texto de la pregunta es requerido');
    }

    const emptyAnswers = this.currentQuestion.answers.filter(a => !a.text?.trim());
    if (emptyAnswers.length > 0) {
      errors.push('Todas las respuestas deben tener texto');
    }

    const correctAnswers = this.currentQuestion.answers.filter(a => a.isCorrect);
    if (correctAnswers.length !== 1) {
      errors.push('Debe haber exactamente una respuesta correcta');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateQuiz(): { isValid: boolean, errors: string[] } {
    const errors: string[] = [];

    if (!this.quiz.title?.trim()) {
      errors.push('El título del quiz es requerido');
    }

    if (!this.quiz.description?.trim()) {
      errors.push('La descripción del quiz es requerida');
    }

    if (!this.quiz.questions.length) {
      errors.push('El quiz debe tener al menos una pregunta');
    } else {
      // Validar cada pregunta
      this.quiz.questions.forEach((question, index) => {
        if (!question.text?.trim()) {
          errors.push(`La pregunta ${index + 1} debe tener texto`);
        }
        
        const emptyAnswers = question.answers.filter(a => !a.text?.trim());
        if (emptyAnswers.length > 0) {
          errors.push(`Todas las respuestas de la pregunta ${index + 1} deben tener texto`);
        }

        const correctAnswers = question.answers.filter(a => a.isCorrect);
        if (correctAnswers.length !== 1) {
          errors.push(`La pregunta ${index + 1} debe tener exactamente una respuesta correcta`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  guardarPregunta() {
    this.validationErrors = {};
    const validation = this.validateQuestion();
    
    if (validation.isValid) {
      // Crear una copia limpia de la pregunta
      const cleanQuestion: Question = {
        text: this.currentQuestion.text.trim(),
        answers: this.currentQuestion.answers.map(a => ({
          text: a.text.trim(),
          isCorrect: a.isCorrect
        }))
      };
      
      this.quiz.questions.push(cleanQuestion);
      this.currentQuestion = this.createEmptyQuestion();
      this.mostrarListado = true;
      this.error = '';
    } else {
      this.error = validation.errors.join('\n');
    }
  }

  verPreguntas() {
    this.mostrarListado = true;
    this.error = '';
  }

  noVerPreguntas() {
    this.mostrarListado = false;
    this.error = '';
  }

  eliminarPregunta(index: number) {
    this.quiz.questions.splice(index, 1);
  }

  editarPregunta(index: number) {
    this.currentQuestion = { ...this.quiz.questions[index] };
    this.quiz.questions.splice(index, 1);
    this.error = '';
  }

  finalizarQuiz() {
    this.validationErrors = {};
    const validation = this.validateQuiz();
    
    if (validation.isValid) {
      this.isLoading = true;
      this.error = '';
      
      // Crear una copia limpia del quiz
      const cleanQuiz: Quiz = {
        title: this.quiz.title.trim(),
        description: this.quiz.description.trim(),
        creatorId: this.quiz.creatorId,
        createdAt: new Date(),
        questions: this.quiz.questions.map(q => ({
          text: q.text.trim(),
          answers: q.answers.map(a => ({
            text: a.text.trim(),
            isCorrect: a.isCorrect
          }))
        }))
      };
      
      this.quizService.createQuiz(cleanQuiz).subscribe({
        next: (createdQuiz) => {
          this.quiz = createdQuiz;
          this.quizCreated = true;
          this.isLoading = false;
          this.error = '';
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
          
          if (error.error?.errors) {
            Object.keys(error.error.errors).forEach(key => {
              this.validationErrors[key] = error.error.errors[key][0];
            });
          }
        }
      });
    } else {
      this.error = validation.errors.join('\n');
    }
  }

  copyToClipboard() {
    if (this.quiz.id) {
      const url = `${window.location.origin}/answer-test/${this.quiz.id}`;
      navigator.clipboard.writeText(url).then(() => {
        console.log('URL copiada al portapapeles');
      }).catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        this.error = 'Error al copiar la URL al portapapeles';
      });
    }
  }

  isAddButtonDisabled(): boolean {
    return !this.currentQuestion.text?.trim() || 
           this.currentQuestion.answers.some(a => !a.text?.trim());
  }

  reiniciarQuiz() {
    this.quiz = {
      title: '',
      description: '',
      creatorId: 'user',
      createdAt: new Date(),
      questions: []
    };
    this.currentQuestion = this.createEmptyQuestion();
    this.mostrarListado = false;
    this.quizCreated = false;
    this.error = '';
    this.validationErrors = {};
  }
}