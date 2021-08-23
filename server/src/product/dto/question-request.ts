export interface QuestionPostRequest {
  productId: number;
  userId?: number;
  type: string;
  title: string;
  question: string;
  isSecret: boolean;
}

export interface CreateQuestionPostRequest extends QuestionPostRequest {
  product: {
    id: number;
  };
  user: {
    id: number;
  };
}

export interface QuestionPatchRequest {
  type: string;
  title: string;
  question: string;
  isSecret: boolean;
}
