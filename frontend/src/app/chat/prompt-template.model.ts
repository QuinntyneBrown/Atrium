export type PromptMode = 'Check' | 'Correct' | 'Author' | 'Custom';

export const PROMPT_MODES: readonly PromptMode[] = [
  'Check',
  'Correct',
  'Author',
  'Custom',
];

export interface PromptTemplate {
  id: string;
  name: string;
  mode: PromptMode;
  body: string;
  isBuiltIn: boolean;
  createdOnUtc: string;
  modifiedOnUtc: string;
}

export interface CreatePromptTemplateRequest {
  name: string;
  mode: PromptMode;
  body: string;
}

export interface UpdatePromptTemplateRequest {
  name: string;
  mode: PromptMode;
  body: string;
}
