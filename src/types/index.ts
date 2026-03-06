export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
  isShared: boolean;
}

export interface CreateCalculationDto {
  expression: string;
  result: string;
}

export interface ShareCalculationDto {
  calculationId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
