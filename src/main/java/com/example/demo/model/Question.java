package com.example.demo.model;

import java.io.Serializable;
import java.util.UUID;

/**
 * Serializable trivia question linked to a quiz.
 * Stores the prompt, four answer options, the correct option index, and
 * optional gameplay metadata such as hint text and difficulty.
 */
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String quizId;
    private String text;
    private String[] options;
    private int correctIndex;
    private String hint;
    private String difficulty;

    /**
     * Default constructor generating a UUID and initializing options.
     */
    public Question() {
        this.id = UUID.randomUUID().toString();
        this.options = new String[4];
    }

    /**
     * Returns the question identifier.
     *
     * @return unique question identifier
     */
    public String getId() { return id; }

    /**
     * Replaces the question identifier.
     *
     * @param id question identifier
     */
    public void setId(String id) { this.id = id; }

    /**
     * Returns the parent quiz identifier.
     *
     * @return quiz identifier
     */
    public String getQuizId() { return quizId; }

    /**
     * Assigns the question to a quiz.
     *
     * @param quizId parent quiz identifier
     */
    public void setQuizId(String quizId) { this.quizId = quizId; }

    /**
     * Returns the question prompt shown to players.
     *
     * @return question text
     */
    public String getText() { return text; }

    /**
     * Sets the question text.
     *
     * @param text the question text (mandatory, non-blank)
     * @throws IllegalArgumentException if text is null or blank
     */
    public void setText(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Question text is required.");
        }
        this.text = text;
    }

    /**
     * Returns the four answer options in display order.
     *
     * @return answer options
     */
    public String[] getOptions() { return options; }

    /**
     * Sets exactly 4 non-empty options for the question.
     *
     * @param options array of exactly 4 non-blank strings
     * @throws IllegalArgumentException if there are not exactly 4 options or any option is blank
     */
    public void setOptions(String[] options) {
        if (options == null || options.length != 4) {
            throw new IllegalArgumentException("Question must have exactly 4 options.");
        }
        for (String option : options) {
            if (option == null || option.trim().isEmpty()) {
                throw new IllegalArgumentException("All 4 options must be non-empty.");
            }
        }
        this.options = options;
    }

    /**
     * Returns the index of the correct answer.
     *
     * @return correct option index
     */
    public int getCorrectIndex() { return correctIndex; }

    /**
     * Sets the correct answer index.
     *
     * @param correctIndex integer between 0 and 3
     * @throws IllegalArgumentException if index is out of bounds
     */
    public void setCorrectIndex(int correctIndex) {
        if (correctIndex < 0 || correctIndex > 3) {
            throw new IllegalArgumentException("correctIndex must be between 0 and 3.");
        }
        this.correctIndex = correctIndex;
    }

    /**
     * Returns the hint shown when a player requests help.
     *
     * @return hint text, or {@code null} when no hint is defined
     */
    public String getHint() { return hint; }

    /**
     * Sets the hint text available during gameplay.
     *
     * @param hint hint text
     */
    public void setHint(String hint) { this.hint = hint; }

    /**
     * Returns the configured difficulty level.
     *
     * @return normalized difficulty value
     */
    public String getDifficulty() { return difficulty; }

    /**
     * Normalizes and validates the difficulty label.
     *
     * @param difficulty difficulty value: easy, medium, or hard
     * @throws IllegalArgumentException when the value is missing or unsupported
     */
    public void setDifficulty(String difficulty) {
        if (difficulty == null) throw new IllegalArgumentException("difficulty is required.");
        String normalized = difficulty.toLowerCase();
        if (!normalized.equals("easy") && !normalized.equals("medium") && !normalized.equals("hard")) {
            throw new IllegalArgumentException("difficulty must be easy, medium, or hard.");
        }
        this.difficulty = normalized;
    }
}
