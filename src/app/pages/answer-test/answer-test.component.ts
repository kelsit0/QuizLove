import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { Quiz, Question, QuizResult } from '../../models/quiz.model';

@Component({
  selector: 'app-answer-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './answer-test.component.html',
  styleUrls: ['./answer-test.component.scss']
})
export class AnswerTestComponent implements OnInit {
  quiz: Quiz | null = null;
  currentQuestion: Question | null = null;
  currentQuestionIndex: number = 0;
  totalQuestions: number = 0;
  progressPercentage: number = 0;
  userAnswer: string = '';
  showResults: boolean = false;
  correctAnswers: number = 0;
  quizId: string = '';
  isLoading: boolean = true;
  error: string = '';
  userAnswers: { pregunta: string; respuesta: string }[] = [];
  quizResult: QuizResult | null = null;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el ID del quiz de la URL
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadQuiz(id);
      } else {
        this.error = 'No se proporcionó un ID de quiz válido';
      }
    });
  }

  loadQuiz(id: string) {
    this.isLoading = true;
    this.error = '';
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        if (quiz) {
          this.quiz = quiz;
          this.totalQuestions = quiz.questions.length;
          this.startQuiz();
        } else {
          this.error = 'No se encontró el quiz especificado';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.error = 'Error al cargar el quiz. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.showResults = false;
    this.userAnswers = [];
    this.updateCurrentQuestion();
  }

  updateCurrentQuestion() {
    if (this.quiz && this.currentQuestionIndex < this.quiz.questions.length) {
      this.currentQuestion = this.quiz.questions[this.currentQuestionIndex];
      this.progressPercentage = (this.currentQuestionIndex / this.totalQuestions) * 100;
      this.userAnswer = '';
    } else {
      this.submitQuiz();
    }
  }

  submitAnswer() {
    if (this.currentQuestion && this.userAnswer.trim()) {
      this.userAnswers.push({
        pregunta: this.currentQuestion.pregunta,
        respuesta: this.userAnswer.trim()
      });
      
      this.currentQuestionIndex++;
      this.updateCurrentQuestion();
    }
  }

  submitQuiz() {
    if (this.quiz && this.userAnswers.length === this.quiz.questions.length) {
      this.isLoading = true;
      this.quizService.submitQuizAnswers(this.quiz.id, this.userAnswers).subscribe({
        next: (result) => {
          this.quizResult = result;
          this.correctAnswers = result.answers.filter(a => a.correct).length;
          this.showResults = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error submitting quiz:', error);
          this.error = 'Error al enviar las respuestas. Por favor, intenta de nuevo.';
          this.isLoading = false;
        }
      });
    }
  }

  restartQuiz() {
    if (this.quiz) {
      this.startQuiz();
    }
  }

  searchQuiz(id: string) {
    this.router.navigate(['/answer-test', id]);
  }
}
