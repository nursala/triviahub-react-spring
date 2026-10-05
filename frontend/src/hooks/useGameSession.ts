/**
 * Action-oriented facade over the game-session context.
 * Exposes the small API used by gameplay screens so callers do not dispatch
 * raw reducer actions directly.
 */
import { useCallback } from "react";
import { useGameSessionContext } from "../context/GameSessionContext.tsx";
export function useGameSession() {
  const { state, dispatch } = useGameSessionContext();

  const startSession = useCallback((quizId: string) => {
    dispatch({ type: "START_SESSION", quizId });
  }, [dispatch]);

  const endSession = useCallback(() => {
    dispatch({ type: "END_SESSION" });
  }, [dispatch]);

  return { state, startSession, endSession };
}

