/**
 * Global game-session context.
 * Keeps lightweight session state in one place so pages can coordinate quiz
 * start and end events without threading props through the route tree.
 */
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";

type GameSessionState = {
  activeQuizId: string | null;
  isActive: boolean;
};

type GameSessionAction =
  | { type: "START_SESSION"; quizId: string }
  | { type: "END_SESSION" };

const initialState: GameSessionState = {
  activeQuizId: null,
  isActive: false,
};

function gameSessionReducer(state: GameSessionState, action: GameSessionAction): GameSessionState {
  switch (action.type) {
    case "START_SESSION":
      return { activeQuizId: action.quizId, isActive: true };
    case "END_SESSION":
      return { activeQuizId: null, isActive: false };
    default:
      return state;
  }
}

type GameSessionContextValue = {
  state: GameSessionState;
  dispatch: Dispatch<GameSessionAction>;
};

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

/**
 * Provides the shared game-session store to the routed frontend.
 */
export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameSessionReducer, initialState);
  return (
    <GameSessionContext.Provider value={{ state, dispatch }}>
      {children}
    </GameSessionContext.Provider>
  );
}

/**
 * Reads the game-session context and fails fast when the provider is missing.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGameSessionContext(): GameSessionContextValue {
  const context = useContext(GameSessionContext);
  if (!context) {
    throw new Error("useGameSessionContext must be used inside GameSessionProvider");
  }
  return context;
}

