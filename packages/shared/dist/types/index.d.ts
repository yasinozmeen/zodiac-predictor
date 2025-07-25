export interface ZodiacSign {
    name: string;
    symbol: string;
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    dates: {
        start: string;
        end: string;
    };
}
export interface CompatibilityResult {
    sign1: string;
    sign2: string;
    percentage: number;
    description: string;
}
export interface PersonalityAnalysis {
    zodiacSign: string;
    element: string;
    traits: string[];
    strengths: string[];
    challenges: string[];
    compatibility: CompatibilityResult[];
}
export interface Category {
    id: string;
    name: string;
    description: string | null;
    orderIndex: number;
    iconName: string | null;
    createdAt: string;
}
export interface Question {
    id: string;
    categoryId: string;
    questionText: string;
    orderIndex: number;
    createdAt: string;
    options?: QuestionOption[];
}
export interface QuestionOption {
    id: string;
    questionId: string;
    optionText: string;
    orderIndex: number;
}
export interface UserResponse {
    questionId: string;
    selectedOptionId: string;
    answeredAt: Date;
}
export interface SurveyData {
    birthDate: string;
    birthTime?: string;
    birthLocation: string;
    personality?: string;
    interests?: string[];
}
export interface SurveyResult {
    id: string;
    timestamp: string;
    surveyData: SurveyData;
    personalityAnalysis: PersonalityAnalysis;
    recommendations: string[];
    insights: string[];
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp?: string;
}
export interface ApiError {
    success: false;
    message: string;
    stack?: string;
    timestamp: string;
}
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface UserSession {
    userId: string;
    token: string;
    expiresAt: string;
}
//# sourceMappingURL=index.d.ts.map