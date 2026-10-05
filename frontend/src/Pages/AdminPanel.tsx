/**
 * Administrative workspace for quiz and question maintenance.
 * Centralizes backend CRUD orchestration here while delegating rendering to
 * presentational admin components.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import type { FormEvent } from "react";
import {
  fetchAllQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestionsForQuiz,
  type Quiz,
  type Question,
  type QuestionInput,
} from "../utils/apiClient.ts";
import { InlineAlert } from "../utils/notificationUtils";
import { generateNotificationId, type Notification } from "../utils/notificationUtils";
import {
  EMPTY_QUIZ_DRAFT,
  EMPTY_QUESTION_DRAFT,
  buildQuestionDraft,
  type QuizDraft,
  type QuestionDraft,
} from "../utils/adminDrafts.ts";
import QuizForm from "../Components/admin/QuizForm.tsx";
import QuizList from "../Components/admin/QuizList.tsx";
import QuestionManager from "../Components/admin/QuestionManager.tsx";
import QuizEditModal from "../Components/admin/QuizEditModal.tsx";
import QuestionFormModal from "../Components/admin/QuestionFormModal.tsx";
import ConfirmDeleteModal from "../Components/admin/ConfirmDeleteModal.tsx";

export default function AdminPanel() {
  const [quizList, setQuizList] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingQuiz, setIsDeletingQuiz] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [draft, setDraft] = useState<QuizDraft>(EMPTY_QUIZ_DRAFT);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizEditDraft, setQuizEditDraft] = useState<QuizDraft>(EMPTY_QUIZ_DRAFT);
  const [isSavingQuizEdit, setIsSavingQuizEdit] = useState(false);

  const [questionModalMode, setQuestionModalMode] = useState<"add" | "edit" | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionDraft, setQuestionDraft] = useState<QuestionDraft>(EMPTY_QUESTION_DRAFT);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  /**
   * Quiz data is loaded once for the session and then kept in local state so
   * CRUD actions can update the UI immediately without a full page refetch.
   */
  useEffect(() => {
    const controller = new AbortController();

    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const quizzes = await fetchAllQuizzes(controller.signal);
        setQuizList(quizzes);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to load quizzes";

        setNotification({
          id: generateNotificationId(),
          type: "danger",
          message: errorMessage,
          dismissible: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
    return () => controller.abort();
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const selectedQuiz = useMemo(() => {
    return quizList.find((quiz) => quiz.id === selectedQuizId) ?? null;
  }, [quizList, selectedQuizId]);

  const selectedQuizQuestionCount = useMemo(() => {
    if (!selectedQuiz) return 0;
    return selectedQuiz.questionCount ?? questions.length;
  }, [questions.length, selectedQuiz]);

  const handleSelectQuiz = useCallback((quizId: string) => {
    setSelectedQuizId(quizId);
  }, []);

  /**
   * Questions are fetched only for the selected quiz to avoid loading the
   * entire question bank before the user asks for it.
   */
  useEffect(() => {
    if (!selectedQuizId) return;

    const controller = new AbortController();

    const loadQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const fetchedQuestions = await fetchQuestionsForQuiz(selectedQuizId, controller.signal);
        setQuestions(fetchedQuestions);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to load questions";

        setNotification({
          id: generateNotificationId(),
          type: "danger",
          message: errorMessage,
          dismissible: true,
        });
        setQuestions([]);
      } finally {
        setQuestionsLoading(false);
      }
    };

    loadQuestions();
    return () => controller.abort();
  }, [selectedQuizId]);

  /**
   * Updates a single field of the "Add Quiz" draft and clears any active
   * notification so validation feedback disappears as soon as the user starts
   * correcting the form.
   */
  const handleQuizDraftChange = useCallback(
    (field: keyof QuizDraft, value: string) => {
      clearNotification();
      setDraft((current) => ({ ...current, [field]: value }));
    },
    [clearNotification]
  );

  const handleAddQuiz = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      clearNotification();

      const title = draft.title.trim();
      const category = draft.category.trim();
      const description = draft.description.trim();

      if (!title || !category) {
        setNotification({
          id: generateNotificationId(),
          type: "danger",
          message: "Title and category are required.",
          dismissible: true,
        });
        return;
      }

      const duplicate = quizList.some(
        (quiz) => quiz.title.trim().toLowerCase() === title.toLowerCase()
      );
      if (duplicate) {
        setNotification({
          id: generateNotificationId(),
          type: "danger",
          message: "A quiz with this title already exists.",
          dismissible: true,
        });
        return;
      }

      const controller = new AbortController();
      setIsCreating(true);

      try {
        const newQuiz = await createQuiz(
          {
            title,
            category,
            description: description || "Custom quiz created from admin panel",
          },
          controller.signal
        );

        setQuizList((current) => [newQuiz, ...current]);
        setDraft(EMPTY_QUIZ_DRAFT);
        setNotification({
          id: generateNotificationId(),
          type: "success",
          message: `Quiz "${newQuiz.title}" created successfully!`,
          autoClose: true,
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        const errorMessage =
          err && typeof err === "object" && "error" in err
            ? (err as { error: string }).error
            : "Failed to create quiz";

        setNotification({
          id: generateNotificationId(),
          type: "danger",
          message: errorMessage,
          dismissible: true,
        });
      } finally {
        setIsCreating(false);
      }
    },
    [clearNotification, draft, quizList]
  );

  const handleOpenEditQuiz = useCallback(
    (quiz: Quiz) => {
      clearNotification();
      setEditingQuiz(quiz);
      setQuizEditDraft({
        title: quiz.title,
        category: quiz.category,
        description: quiz.description,
      });
    },
    [clearNotification]
  );

  const handleCancelEditQuiz = useCallback(() => {
    setEditingQuiz(null);
    setQuizEditDraft(EMPTY_QUIZ_DRAFT);
    setIsSavingQuizEdit(false);
  }, []);

  /**
   * Editing leaves notifications untouched because they reflect save outcomes,
   * not transient keystroke state inside the modal.
   */
  const handleQuizEditDraftChange = useCallback((field: keyof QuizDraft, value: string) => {
    setQuizEditDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const handleSaveEditQuiz = useCallback(async () => {
    if (!editingQuiz) return;

    const title = quizEditDraft.title.trim();
    const category = quizEditDraft.category.trim();
    const description = quizEditDraft.description.trim();

    if (!title || !category) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "Title and category are required.",
        dismissible: true,
      });
      return;
    }

    const duplicate = quizList.some(
      (quiz) => quiz.id !== editingQuiz.id && quiz.title.trim().toLowerCase() === title.toLowerCase()
    );
    if (duplicate) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "A quiz with this title already exists.",
        dismissible: true,
      });
      return;
    }

    const controller = new AbortController();
    setIsSavingQuizEdit(true);

    try {
      const updatedQuiz = await updateQuiz(
        editingQuiz.id,
        { title, category, description: description || editingQuiz.description },
        controller.signal
      );

      setQuizList((current) =>
        current.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
      );
      setNotification({
        id: generateNotificationId(),
        type: "success",
        message: `Quiz "${updatedQuiz.title}" updated successfully!`,
        autoClose: true,
      });
      handleCancelEditQuiz();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err && typeof err === "object" && "error" in err
          ? (err as { error: string }).error
          : "Failed to update quiz";

      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: errorMessage,
        dismissible: true,
      });
    } finally {
      setIsSavingQuizEdit(false);
    }
  }, [editingQuiz, handleCancelEditQuiz, quizEditDraft, quizList]);

  const handleRequestDeleteQuiz = useCallback((quiz: Quiz) => {
    setQuizToDelete(quiz);
  }, []);

  const handleConfirmDeleteQuiz = useCallback(async () => {
    if (!quizToDelete) return;

    const deletingSelectedQuiz = quizToDelete.id === selectedQuizId;
    const controller = new AbortController();
    setIsDeletingQuiz(true);

    try {
      await deleteQuiz(quizToDelete.id, controller.signal);
      setQuizList((current) => current.filter((quiz) => quiz.id !== quizToDelete.id));

      if (deletingSelectedQuiz) {
        setSelectedQuizId(null);
        setQuestions([]);
      }

      setNotification({
        id: generateNotificationId(),
        type: "info",
        message: `Quiz "${quizToDelete.title}" deleted successfully.`,
        autoClose: true,
      });
      setQuizToDelete(null);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err && typeof err === "object" && "error" in err
          ? (err as { error: string }).error
          : "Failed to delete quiz";

      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: errorMessage,
        dismissible: true,
      });
    } finally {
      setIsDeletingQuiz(false);
    }
  }, [quizToDelete, selectedQuizId]);

  const handleCancelDeleteQuiz = useCallback(() => {
    setQuizToDelete(null);
  }, []);

  const handleOpenAddQuestion = useCallback(() => {
    if (!selectedQuizId) return;
    clearNotification();
    setQuestionModalMode("add");
    setEditingQuestion(null);
    setQuestionDraft(EMPTY_QUESTION_DRAFT);
  }, [clearNotification, selectedQuizId]);

  const handleOpenEditQuestion = useCallback(
    (question: Question) => {
      clearNotification();
      setQuestionModalMode("edit");
      setEditingQuestion(question);
      setQuestionDraft(buildQuestionDraft(question));
    },
    [clearNotification]
  );

  const handleCancelQuestionModal = useCallback(() => {
    setQuestionModalMode(null);
    setEditingQuestion(null);
    setQuestionDraft(EMPTY_QUESTION_DRAFT);
    setIsSavingQuestion(false);
  }, []);

  const handleOpenDeleteQuestion = useCallback(
    (question: Question) => {
      clearNotification();
      setQuestionToDelete(question);
    },
    [clearNotification]
  );

  const handleCancelDeleteQuestion = useCallback(() => {
    setQuestionToDelete(null);
    setIsDeletingQuestion(false);
  }, []);

  /**
   * Option edits are handled separately so the fixed four-option tuple shape is
   * preserved while the user types.
   */
  const handleQuestionDraftChange = useCallback(
    (field: Exclude<keyof QuestionDraft, "options">, value: string) => {
      setQuestionDraft((current) => ({ ...current, [field]: value }));
    },
    []
  );

  /**
   * Updating one option in place avoids rebuilding question-form state in the
   * child component and keeps the tuple contract explicit here.
   */
  const handleQuestionOptionChange = useCallback((index: number, value: string) => {
    setQuestionDraft((current) => {
      const nextOptions = [...current.options] as [string, string, string, string];
      nextOptions[index] = value;
      return { ...current, options: nextOptions };
    });
  }, []);

  /**
   * Options are trimmed and validated before submission so the frontend keeps
   * the same four-option contract enforced by the backend.
   */
  const handleSaveQuestion = useCallback(async () => {
    if (!selectedQuizId || !questionModalMode) return;

    const text = questionDraft.text.trim();
    const options = questionDraft.options.map((option) => option.trim()) as [string, string, string, string];
    const correctIndex = Number(questionDraft.correctIndex);
    const hint = questionDraft.hint.trim();
    const difficulty = questionDraft.difficulty.trim().toLowerCase();

    if (!text) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "Question text is required.",
        dismissible: true,
      });
      return;
    }

    if (options.some((option) => !option)) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "All 4 options are required.",
        dismissible: true,
      });
      return;
    }

    if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "Correct answer index must be between 0 and 3.",
        dismissible: true,
      });
      return;
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: "Difficulty must be easy, medium, or hard.",
        dismissible: true,
      });
      return;
    }

    const payload: QuestionInput = {
      quizId: selectedQuizId,
      text,
      options,
      correctIndex,
      hint,
      difficulty,
    };

    const controller = new AbortController();
    setIsSavingQuestion(true);

    try {
      if (questionModalMode === "add") {
        const createdQuestion = await createQuestion(payload, controller.signal);
        setQuestions((current) => [...current, createdQuestion]);
        setQuizList((current) =>
          current.map((quiz) =>
            quiz.id === selectedQuizId
              ? { ...quiz, questionCount: (quiz.questionCount ?? 0) + 1 }
              : quiz
          )
        );
        setNotification({
          id: generateNotificationId(),
          type: "success",
          message: "Question created successfully!",
          autoClose: true,
        });
      } else if (editingQuestion) {
        const updatedQuestion = await updateQuestion(editingQuestion.id, payload, controller.signal);
        setQuestions((current) =>
          current.map((question) => (question.id === updatedQuestion.id ? updatedQuestion : question))
        );
        setNotification({
          id: generateNotificationId(),
          type: "success",
          message: "Question updated successfully!",
          autoClose: true,
        });
      }

      handleCancelQuestionModal();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err && typeof err === "object" && "error" in err
          ? (err as { error: string }).error
          : questionModalMode === "add"
            ? "Failed to create question"
            : "Failed to update question";

      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: errorMessage,
        dismissible: true,
      });
    } finally {
      setIsSavingQuestion(false);
    }
  }, [editingQuestion, handleCancelQuestionModal, questionDraft, questionModalMode, selectedQuizId]);

  const handleConfirmDeleteQuestion = useCallback(async () => {
    if (!questionToDelete) return;

    const controller = new AbortController();
    setIsDeletingQuestion(true);

    try {
      await deleteQuestion(questionToDelete.id, controller.signal);
      setQuestions((current) => current.filter((question) => question.id !== questionToDelete.id));
      setQuizList((current) =>
        current.map((quiz) =>
          quiz.id === questionToDelete.quizId
            ? { ...quiz, questionCount: Math.max(0, (quiz.questionCount ?? 0) - 1) }
            : quiz
        )
      );

      setNotification({
        id: generateNotificationId(),
        type: "success",
        message: "Question deleted successfully!",
        autoClose: true,
      });
      handleCancelDeleteQuestion();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err && typeof err === "object" && "error" in err
          ? (err as { error: string }).error
          : "Failed to delete question";

      setNotification({
        id: generateNotificationId(),
        type: "danger",
        message: errorMessage,
        dismissible: true,
      });
    } finally {
      setIsDeletingQuestion(false);
    }
  }, [handleCancelDeleteQuestion, questionToDelete]);

  if (loading) {
    return (
      <main className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading quizzes...</span>
          </Spinner>
          <p className="text-muted">Loading quiz data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h4 mb-1">Admin Panel</h1>
          <p className="text-muted mb-0">Manage quizzes with full backend integration</p>
        </div>
        <span className="badge bg-primary">Backend Connected</span>
      </div>

      {notification && (
        <InlineAlert
          notification={notification}
          onDismiss={() => setNotification(null)}
        />
      )}

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <QuizForm
            draft={draft}
            isSubmitting={isCreating}
            onFieldChange={handleQuizDraftChange}
            onSubmit={handleAddQuiz}
          />
        </div>

        <div className="col-12 col-lg-7">
          <QuizList
            quizzes={quizList}
            selectedQuizId={selectedQuizId}
            isDeleting={isDeletingQuiz}
            onSelect={handleSelectQuiz}
            onEdit={handleOpenEditQuiz}
            onDelete={handleRequestDeleteQuiz}
          />

          <QuestionManager
            selectedQuiz={selectedQuiz}
            questions={questions}
            questionCount={selectedQuizQuestionCount}
            isLoading={questionsLoading}
            onAddQuestion={handleOpenAddQuestion}
            onEditQuestion={handleOpenEditQuestion}
            onDeleteQuestion={handleOpenDeleteQuestion}
          />
        </div>
      </div>

      <QuizEditModal
        quiz={editingQuiz}
        draft={quizEditDraft}
        isSaving={isSavingQuizEdit}
        onFieldChange={handleQuizEditDraftChange}
        onCancel={handleCancelEditQuiz}
        onSave={handleSaveEditQuiz}
      />

      <QuestionFormModal
        mode={questionModalMode}
        draft={questionDraft}
        isSaving={isSavingQuestion}
        onFieldChange={handleQuestionDraftChange}
        onOptionChange={handleQuestionOptionChange}
        onCancel={handleCancelQuestionModal}
        onSave={handleSaveQuestion}
      />

      <ConfirmDeleteModal
        show={questionToDelete !== null}
        title="Delete question?"
        itemName={questionToDelete?.text ?? ""}
        warningText="This action will permanently remove the question from the selected quiz."
        isDeleting={isDeletingQuestion}
        onCancel={handleCancelDeleteQuestion}
        onConfirm={handleConfirmDeleteQuestion}
      />

      <ConfirmDeleteModal
        show={quizToDelete !== null}
        title="Delete quiz?"
        itemName={quizToDelete?.title ?? ""}
        warningText="This action will permanently remove the quiz and all its associated data from the backend."
        isDeleting={isDeletingQuiz}
        onCancel={handleCancelDeleteQuiz}
        onConfirm={handleConfirmDeleteQuiz}
      />
    </main>
  );
}
