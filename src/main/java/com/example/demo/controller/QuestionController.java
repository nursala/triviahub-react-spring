package com.example.demo.controller;

import com.example.demo.model.Question;
import com.example.demo.service.DataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for question resource operations.
 */
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final DataService dataService;

    /**
     * Creates a question controller with required service dependency.
     *
     * @param dataService the service used to manage serialized question data
     */
    public QuestionController(DataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Retrieves all questions for a specific quiz.
     *
     * @param quizId identifier of the quiz
     * @return HTTP 200 containing all questions in the quiz
     */
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuestionsForQuiz(@PathVariable String quizId) {
        return ResponseEntity.ok(dataService.getQuestionsForQuiz(quizId));
    }

    /**
     * Retrieves all questions for a specific quiz in randomized order.
     *
     * @param quizId identifier of the quiz
     * @return HTTP 200 containing randomized questions for gameplay
     */
    @GetMapping("/{quizId}/questions/random")
    public ResponseEntity<List<Question>> getRandomQuestionsForQuiz(@PathVariable String quizId) {
        return ResponseEntity.ok(dataService.getRandomQuestionsForQuiz(quizId));
    }

    /**
     * Creates and stores a new question.
     *
     * @param question request payload containing question data
     * @return HTTP 201 with created question
     * @throws IllegalArgumentException when validation fails
     */
    @PostMapping
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        Question saved = dataService.addQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Updates an existing question by identifier.
     *
     * @param id question identifier
     * @param question replacement question payload
     * @return HTTP 200 with updated question
     * @throws java.util.NoSuchElementException when question does not exist
     */
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable String id, @RequestBody Question question) {
        Question updated = dataService.updateQuestion(id, question);
        return ResponseEntity.ok(updated);
    }

    /**
     * Deletes a question by identifier.
     *
     * @param id question identifier
     * @return HTTP 204 when deletion succeeds
     * @throws java.util.NoSuchElementException when question does not exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
        dataService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}