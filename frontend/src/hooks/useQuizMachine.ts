import { useCallback, useEffect, useReducer } from "react";

/**
 * Snapshot of "where the player currently is" within a single quiz attempt.
 *
 * This is intentionally limited to gameplay-progression data — it does not
 * hold the quiz/questions themselves (those are fetched and owned by
 * GameScreen), nor generic page UI flags like modal visibility or
 * notifications, which are unrelated to how far the player has progressed.
 *
 * `status` models the attempt's lifecycle:
 * - "idle": the machine has been created but the game has not started yet
 *   (waiting for the quiz/questions to finish loading)
 * - "playing": the player is actively answering questions and the timer is running
 * - "finished": the last question has been answered; progress is frozen and
 *   the timer has stopped (GameScreen reacts to this to submit the result)
 */
export interface QuizMachineState {
  status: "idle" | "playing" | "finished";
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  correctAnswers: number;
  attempts: number;
  hintsUsed: number;
  usedHintQuestionIds: string[];
  secondsElapsed: number;
  playerName: string;
}

/**
 * Union of every transition the quiz machine understands. Each variant carries
 * exactly the data the reducer needs to compute the next state — nothing more.
 *
 * Note that `SELECT_ANSWER` carries a pre-computed `isCorrect` flag and
 * `USE_HINT` carries a `questionId` rather than the reducer reaching into a
 * `Question` object: the reducer has no knowledge of quiz/question shapes,
 * which keeps it a small, pure, easily-unit-testable function of (state, action).
 */
export type QuizMachineAction =
  | { type: "INIT_GAME" }
  | { type: "SELECT_ANSWER"; payload: { answerIndex: number; isCorrect: boolean } }
  | { type: "USE_HINT"; payload: { questionId: string } }
  | { type: "TICK" }
  | { type: "NEXT_QUESTION" }
  | { type: "FINISH_GAME" }
  | { type: "SET_PLAYER_NAME"; payload: { name: string } };

/**
 * Builds a fresh, "idle" machine state. Used both as the hook's initial state
 * and as the result of an `INIT_GAME` transition, guaranteeing that a new
 * attempt always starts from a clean, predictable slate.
 *
 * @returns a brand new QuizMachineState with every counter at zero
 */
function createInitialState(): QuizMachineState {
  return {
    status: "idle",
    currentQuestionIndex: 0,
    selectedAnswer: null,
    correctAnswers: 0,
    attempts: 0,
    hintsUsed: 0,
    usedHintQuestionIds: [],
    secondsElapsed: 0,
    playerName: "Anonymous",
  };
}

/**
 * Pure reducer that computes the next QuizMachineState for a given action.
 *
 * Every invariant of the game flow is enforced here rather than in the
 * caller, so the machine stays consistent no matter where a transition is
 * dispatched from:
 * - Answers can only be selected once per question, and only while playing
 * - A hint can only be counted once per question, and only while playing
 * - The timer only advances while the game is actively being played
 * - The player can only move on (or finish) after answering the current question
 *
 * Invalid transitions are no-ops: the reducer returns the same state
 * reference, so React will not trigger a re-render for them.
 *
 * @param state the current machine state
 * @param action the transition to apply
 * @returns the resulting state (or the same reference if the action is a no-op)
 */
export function quizMachineReducer(state: QuizMachineState, action: QuizMachineAction): QuizMachineState {
  switch (action.type) {
    case "INIT_GAME":
      return { ...createInitialState(), status: "playing" };

    case "SELECT_ANSWER": {
      if (state.status !== "playing" || state.selectedAnswer !== null) return state;

      return {
        ...state,
        selectedAnswer: action.payload.answerIndex,
        attempts: state.attempts + 1,
        correctAnswers: action.payload.isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      };
    }

    case "USE_HINT": {
      if (state.status !== "playing" || state.usedHintQuestionIds.includes(action.payload.questionId)) {
        return state;
      }

      return {
        ...state,
        usedHintQuestionIds: [...state.usedHintQuestionIds, action.payload.questionId],
        hintsUsed: state.hintsUsed + 1,
      };
    }

    case "TICK":
      if (state.status !== "playing") return state;
      return { ...state, secondsElapsed: state.secondsElapsed + 1 };

    case "NEXT_QUESTION": {
      if (state.status !== "playing" || state.selectedAnswer === null) return state;

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswer: null,
      };
    }

    case "FINISH_GAME": {
      if (state.status !== "playing" || state.selectedAnswer === null) return state;
      return { ...state, status: "finished" };
    }

    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.payload.name };

    default:
      return state;
  }
}

/**
 * useQuizMachine
 *
 * Encapsulates the gameplay-progression state machine for a quiz attempt
 * behind a small, intention-revealing API. GameScreen stays responsible for
 * fetching the quiz/questions and submitting the final result — this hook is
 * only concerned with tracking progress through that data once it arrives.
 *
 * Internally drives its own per-second timer: a `TICK` action is dispatched
 * every second while `status === "playing"`, and the interval is cleared
 * automatically once the game leaves that status (finished) or the owning
 * component unmounts.
 *
 * @returns the current machine state plus action-dispatching helpers:
 * - `initGame`: transitions from "idle" to "playing" with a clean slate (call once the quiz/questions have loaded)
 * - `selectAnswer`: records the player's choice for the current question and whether it was correct
 * - `recordHintUsage`: marks a hint as used for the given question id
 * - `goToNextQuestion`: advances to the next question, or finishes the game if it was the last one
 * - `setPlayerName`: updates the player's display name
 */
export function useQuizMachine() {
  const [state, dispatch] = useReducer(quizMachineReducer, createInitialState());

  useEffect(() => {
    if (state.status !== "playing") return;

    const intervalId = window.setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.status]);

  const initGame = useCallback(() => {
    dispatch({ type: "INIT_GAME" });
  }, []);

  /**
   * @param answerIndex index of the option the player selected
   * @param correctIndex index of the correct option for the current question
   */
  const selectAnswer = useCallback((answerIndex: number, correctIndex: number) => {
    dispatch({
      type: "SELECT_ANSWER",
      payload: { answerIndex, isCorrect: answerIndex === correctIndex },
    });
  }, []);

  /**
   * @param questionId id of the question the hint was requested for
   */
  const recordHintUsage = useCallback((questionId: string) => {
    dispatch({ type: "USE_HINT", payload: { questionId } });
  }, []);

  /**
   * @param isLastQuestion whether the question being left is the final one
   */
  const goToNextQuestion = useCallback((isLastQuestion: boolean) => {
    dispatch(isLastQuestion ? { type: "FINISH_GAME" } : { type: "NEXT_QUESTION" });
  }, []);

  const setPlayerName = useCallback((name: string) => {
    dispatch({ type: "SET_PLAYER_NAME", payload: { name } });
  }, []);

  return { state, initGame, selectAnswer, recordHintUsage, goToNextQuestion, setPlayerName };
}
