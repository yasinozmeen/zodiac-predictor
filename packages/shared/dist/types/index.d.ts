export interface ZodiacSign {
    id: string;
    name: string;
    symbol: string;
    element: 'fire' | 'earth' | 'air' | 'water';
    dateRange: {
        start: string;
        end: string;
    };
}
export interface SurveyResponse {
    questionId: string;
    answer: string | number;
}
export interface PredictionResult {
    primarySign: ZodiacSign;
    confidence: number;
    traits: string[];
    description: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=index.d.ts.map