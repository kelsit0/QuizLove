export interface Question {
    id?: string;
    pregunta: string;
    respuesta: string;
}

export interface Quiz {
    id: string;
    title?: string;
    createdBy: string;
    createdAt: Date;
    questions: Question[];
}

export interface QuizResponse {
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
}

export interface QuizResult {
    quizId: string;
    answers: QuizResponse[];
    score: number;
    completedAt: Date;
} 