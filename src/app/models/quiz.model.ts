export interface Answer {
    id?: number;
    questionId?: number;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: number;
    quizId?: number;
    text: string;
    answers: Answer[];
}

export interface Quiz {
    id?: number;
    title: string;
    description: string;
    creatorId: string;
    createdAt: Date;
    questions: Question[];
}

export interface QuizResult {
    correctAnswers: number;
    totalQuestions: number;
    answers: {
        questionId: number;
        answerId: number;
        isCorrect: boolean;
    }[];
}

export interface QuizResponse {
    questionId: number;
    answerId: number;
    isCorrect: boolean;
} 