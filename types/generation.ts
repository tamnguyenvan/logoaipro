
export interface LogoGeneration {
  generationId: string;
}

export interface GenerationError {
  code: number;
  message: string;
}

export interface LogoStyle {
  id: string;
  name: string;
  description: string;
  directive: string;
  preview: string;
}