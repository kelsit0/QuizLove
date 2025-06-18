import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Quiz, Question, QuizResult } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly API_URL = 'http://localhost:3000/api'; // Cambiar por tu URL de API

  constructor(private http: HttpClient) {}

  // Crear un nuevo quiz
  createQuiz(questions: Question[]): Observable<Quiz> {
    const quiz: Partial<Quiz> = {
      createdBy: 'user123', // TODO: Obtener del servicio de autenticación
      createdAt: new Date(),
      questions
    };

    return this.http.post<Quiz>(`${this.API_URL}/quizzes`, quiz).pipe(
      catchError(error => {
        console.error('Error creating quiz:', error);
        // Por ahora, simularemos la respuesta
        return of({
          id: Math.random().toString(36).substring(2, 15),
          createdBy: quiz.createdBy!,
          createdAt: quiz.createdAt!,
          questions: quiz.questions!
        });
      })
    );
  }

  // Obtener un quiz por ID
  getQuizById(id: string): Observable<Quiz | null> {
    return this.http.get<Quiz>(`${this.API_URL}/quizzes/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching quiz:', error);
        // Por ahora, intentamos obtener del localStorage
        const storedQuiz = localStorage.getItem(`quiz_${id}`);
        if (storedQuiz) {
          const questions = JSON.parse(storedQuiz);
          const quiz: Quiz = {
            id,
            createdBy: 'user123',
            createdAt: new Date(),
            questions
          };
          return of(quiz);
        }
        return of(null);
      })
    );
  }

  // Enviar respuestas del quiz
  submitQuizAnswers(quizId: string, answers: { pregunta: string; respuesta: string }[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.API_URL}/quizzes/${quizId}/submit`, { answers }).pipe(
      catchError(error => {
        console.error('Error submitting answers:', error);
        // Por ahora, simularemos la validación
        return this.getQuizById(quizId).pipe(
          map(quiz => {
            if (!quiz) throw new Error('Quiz not found');
            
            const results = answers.map((answer, index) => {
              const question = quiz.questions[index];
              return {
                correct: answer.respuesta.toLowerCase().trim() === question.respuesta.toLowerCase().trim(),
                userAnswer: answer.respuesta,
                correctAnswer: question.respuesta
              };
            });

            const score = (results.filter(r => r.correct).length / results.length) * 100;

            return {
              quizId,
              answers: results,
              score,
              completedAt: new Date()
            };
          })
        );
      })
    );
  }

  // Obtener todos los quizzes de un usuario
  getUserQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.API_URL}/users/quizzes`).pipe(
      catchError(error => {
        console.error('Error fetching user quizzes:', error);
        return of([]); // Por ahora retornamos array vacío
      })
    );
  }

  // Buscar un quiz por ID (versión simplificada para la búsqueda directa)
  searchQuizById(id: string): Observable<Quiz | null> {
    return this.getQuizById(id);
  }
} 