package com.example.demo.model;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Serializable record of a completed quiz attempt.
 * Captures the quiz played, player identity, scoring metrics, and the
 * timestamp used for leaderboard displays.
 */
public class GameResult implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;
    private String quizId;
    private String playerName;
    private int score;
    private int correctAnswers;
    private int totalQuestions;
    private int hintsUsed;
    private long durationSeconds;
    private LocalDateTime playedAt;

    /**
     * Default constructor generating a unique UUID and capture timestamp.
     */
    public GameResult() {
        this.id = UUID.randomUUID().toString();
        this.playedAt = LocalDateTime.now();
    }

    /**
     * Gets the unique identifier for this game result.
     *
     * @return unique result identifier
     */
    public String getId() { return id; }

    /**
     * Sets the unique identifier for this game result.
     *
     * @param id the unique result ID
     */
    public void setId(String id) { this.id = id; }

    /**
     * Gets the quiz ID this result belongs to.
     *
     * @return quiz identifier
     */
    public String getQuizId() { return quizId; }

    /**
     * Sets the quiz ID this result belongs to.
     *
     * @param quizId the quiz ID (mandatory, non-blank)
     * @throws IllegalArgumentException if quizId is null or blank
     */
    public void setQuizId(String quizId) {
        if (quizId == null || quizId.trim().isEmpty()) {
            throw new IllegalArgumentException("quizId is required.");
        }
        this.quizId = quizId;
    }

    /**
     * Gets the player name stored for leaderboard matching.
     *
     * @return normalized player name
     */
    public String getPlayerName() { return playerName; }

    /**
     * Sets the player name in lowercase for consistent storage and leaderboard filtering.
     *
     * @param playerName the player name (mandatory, non-blank)
     * @throws IllegalArgumentException if playerName is null or blank
     */
    public void setPlayerName(String playerName) {
        if (playerName == null || playerName.trim().isEmpty()) {
            throw new IllegalArgumentException("playerName is required.");
        }
        this.playerName = playerName.toLowerCase();
    }

    /**
     * Gets the final score achieved in this game.
     *
     * @return final score
     */
    public int getScore() { return score; }

    /**
     * Sets the final score achieved in this game.
     *
     * @param score the final score (must be between 0 and 100 inclusive)
     * @throws IllegalArgumentException if score is outside the 0-100 range
     */
    public void setScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("score must be between 0 and 100.");
        }
        this.score = score;
    }

    /**
     * Gets the count of correct answers submitted.
     *
     * @return number of correct answers
     */
    public int getCorrectAnswers() { return correctAnswers; }

    /**
     * Sets the count of correct answers submitted.
     *
     * @param correctAnswers the number of correct answers
     */
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

    /**
     * Gets the total number of questions in the quiz.
     *
     * @return total question count
     */
    public int getTotalQuestions() { return totalQuestions; }

    /**
     * Sets the total number of questions in the quiz.
     *
     * @param totalQuestions the total number of questions
     */
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    /**
     * Gets the number of hints used during gameplay.
     *
     * @return number of hints used
     */
    public int getHintsUsed() { return hintsUsed; }

    /**
     * Sets the number of hints used during gameplay.
     *
     * @param hintsUsed the number of hints used
     */
    public void setHintsUsed(int hintsUsed) { this.hintsUsed = hintsUsed; }

    /**
     * Gets the duration of the game session in seconds.
     *
     * @return duration in seconds
     */
    public long getDurationSeconds() { return durationSeconds; }

    /**
     * Sets the duration of the game session in seconds.
     *
     * @param durationSeconds the duration in seconds
     */
    public void setDurationSeconds(long durationSeconds) { this.durationSeconds = durationSeconds; }

    /**
     * Gets the timestamp when the game was played.
     *
     * @return gameplay timestamp
     */
    public LocalDateTime getPlayedAt() { return playedAt; }

    /**
     * Sets the timestamp when the game was played.
     *
     * @param playedAt the timestamp of gameplay
     */
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
}
