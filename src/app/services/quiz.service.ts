import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Quiz, QuizResult } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:5005/api/Quiz';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createQuiz(quiz: Quiz): Observable<Quiz> {
    // Validar que el quiz tenga al menos una pregunta
    if (!quiz.questions || quiz.questions.length === 0) {
      return throwError(() => new Error('El quiz debe tener al menos una pregunta'));
    }

    // Validar cada pregunta
    for (const question of quiz.questions) {
      if (!question.answers || question.answers.length < 2) {
        return throwError(() => new Error('Cada pregunta debe tener al menos 2 respuestas'));
      }

      const correctAnswers = question.answers.filter(a => a.isCorrect).length;
      if (correctAnswers !== 1) {
        return throwError(() => new Error('Cada pregunta debe tener exactamente una respuesta correcta'));
      }
    }

    // Crear una copia limpia del quiz sin referencias circulares
    const cleanQuiz = {
      title: quiz.title?.trim() || '',
      description: quiz.description?.trim() || '',
      creatorId: quiz.creatorId || 'user',
      createdAt: new Date().toISOString(),
      questions: quiz.questions.map(q => ({
        text: q.text?.trim() || '',
        answers: q.answers.map(a => ({
          text: a.text?.trim() || '',
          isCorrect: a.isCorrect
        }))
      }))
    };

    // Validar campos requeridos
    if (!cleanQuiz.title) {
      return throwError(() => new Error('El título es requerido'));
    }
    if (!cleanQuiz.description) {
      return throwError(() => new Error('La descripción es requerida'));
    }

    // Validar que no haya campos vacíos en las preguntas y respuestas
    const hasEmptyFields = cleanQuiz.questions.some(q => 
      !q.text || q.answers.some(a => !a.text)
    );
    if (hasEmptyFields) {
      return throwError(() => new Error('Todos los campos de preguntas y respuestas son requeridos'));
    }

    // Log para depuración
    console.log('Datos enviados al backend:', JSON.stringify(cleanQuiz, null, 2));

    // Asegurarnos de que el objeto cumple con el modelo del backend
    const requestBody = {
      title: cleanQuiz.title,
      description: cleanQuiz.description,
      creatorId: cleanQuiz.creatorId,
      createdAt: cleanQuiz.createdAt,
      questions: cleanQuiz.questions.map(q => ({
        text: q.text,
        answers: q.answers.map(a => ({
          text: a.text,
          isCorrect: a.isCorrect
        }))
      }))
    };

    return this.http.post<Quiz>(this.apiUrl, requestBody, {
      ...this.httpOptions,
      headers: this.httpOptions.headers.set('Accept', 'application/json')
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${quiz.id}`, quiz)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  submitQuizAnswers(quizId: string, answers: { questionId: number; answerId: number }[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/${quizId}/submit`, { answers }, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/user`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Error completo:', error);
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.error?.errors) {
        const errorMessages = [];
        for (const key in error.error.errors) {
          if (error.error.errors[key]) {
            errorMessages.push(error.error.errors[key][0]);
          }
        }
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('\n');
        }
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 