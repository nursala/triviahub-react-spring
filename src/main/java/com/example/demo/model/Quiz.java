package com.example.demo.model;

import java.io.Serializable;
import java.util.UUID;

/**
 * Serializable quiz definition used by the backend and admin workflow.
 * Titles and categories are normalized to lowercase so comparisons and
 * filtering remain consistent across persisted data.
 */
public class Quiz implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String title;
    private String category;
    private String description;

    /**
     * Default constructor generating a unique UUID for this quiz.
     */
    public Quiz() {
        this.id = UUID.randomUUID().toString();
    }

    /**
     * Creates a quiz with validated fields.
     *
     * Delegates to the validating setters so the same rules apply no matter how
     * a Quiz is built, including when Jackson selects this constructor as the
     * deserialization creator (it does, via {@code -parameters} names under
     * Spring Boot), which would otherwise bypass setter validation.
     *
     * @param title the quiz title (mandatory, non-blank; stored in lowercase)
     * @param category the quiz category (mandatory, non-blank; stored in lowercase)
     * @param description the quiz description
     * @throws IllegalArgumentException if title or category is null or blank
     */
    public Quiz(String title, String category, String description) {
        this.id = UUID.randomUUID().toString();
        setTitle(title);
        setCategory(category);
        setDescription(description);
    }

    /**
     * Gets the unique identifier for this quiz.
     *
     * @return unique quiz identifier
     */
    public String getId() { return id; }

    /**
     * Sets the unique identifier for this quiz.
     *
     * @param id the unique quiz ID
     */
    public void setId(String id) { this.id = id; }

    /**
     * Gets the quiz title.
     *
     * @return normalized quiz title
     */
    public String getTitle() { return title; }

    /**
     * Sets the quiz title, enforcing lowercase normalization.
     *
     * @param title the quiz title to set (mandatory, non-blank; normalized to lowercase)
     * @throws IllegalArgumentException if title is null or blank
     */
    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("title is required.");
        }
        this.title = title.toLowerCase();
    }

    /**
     * Gets the quiz category.
     *
     * @return normalized quiz category
     */
    public String getCategory() { return category; }

    /**
     * Sets the quiz category, enforcing lowercase normalization.
     *
     * @param category the quiz category to set (mandatory, non-blank; normalized to lowercase)
     * @throws IllegalArgumentException if category is null or blank
     */
    public void setCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("category is required.");
        }
        this.category = category.toLowerCase();
    }

    /**
     * Gets the quiz description.
     *
     * @return quiz description
     */
    public String getDescription() { return description; }

    /**
     * Sets the quiz description.
     *
     * @param description the quiz description
     */
    public void setDescription(String description) { this.description = description; }
}
