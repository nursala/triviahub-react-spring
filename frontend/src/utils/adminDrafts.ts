/**
 * Shared draft types, default values, and conversion helpers for the admin
 * quiz/question forms.
 *
 * These are extracted into their own module — rather than living inside
 * QuizForm.tsx / QuestionFormModal.tsx — so that those component files export
 * only React components. Mixing component and non-component exports in the
 * same file disables Vite's Fast Refresh for that file (the
 * react-refresh/only-export-components lint rule), so this module is the
 * single source of truth that both the form components and the AdminPanel
 * container import from.
 */

import type { Question } from "./apiClient.ts";

/**
 * Draft shape used while creating or editing a quiz through the admin forms.
 */
export type QuizDraft = {
  title: string;
  category: string;
  description: string;
};

/**
 * Default empty draft used to initialize and reset the "Add quiz" and
 * "Edit quiz" forms.
 */
export const EMPTY_QUIZ_DRAFT: QuizDraft = {
  title: "",
  category: "",
  description: "",
};

/**
 * Draft shape used while creating or editing a question through the admin
 * forms. All fields are kept as raw strings (including numeric ones) so the
 * form can hold intermediate/invalid input until the parent validates and
 * converts it.
 */
export type QuestionDraft = {
  text: string;
  options: [string, string, string, string];
  correctIndex: string;
  hint: string;
  difficulty: string;
};

/**
 * Default empty draft used to initialize and reset the "Add question" form.
 */
export const EMPTY_QUESTION_DRAFT: QuestionDraft = {
  text: "",
  options: ["", "", "", ""],
  correctIndex: "0",
  hint: "",
  difficulty: "easy",
};

/**
 * Keys of QuestionDraft that hold a single string value (i.e. everything but
 * the options tuple). Used to type field-change callbacks for the text/select
 * inputs, as opposed to the per-index option inputs.
 */
export type QuestionDraftTextField = Exclude<keyof QuestionDraft, "options">;

/**
 * Builds an editable draft from an existing question, used to pre-fill the
 * "Edit question" form.
 *
 * @param question the question to convert into a draft
 * @returns a QuestionDraft populated from the question's current values
 */
export function buildQuestionDraft(question: Question): QuestionDraft {
  return {
    text: question.text,
    options: [
      question.options[0] ?? "",
      question.options[1] ?? "",
      question.options[2] ?? "",
      question.options[3] ?? "",
    ],
    correctIndex: String(question.correctIndex),
    hint: question.hint,
    difficulty: question.difficulty,
  };
}
