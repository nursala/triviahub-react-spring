package com.example.demo.controller;

import com.example.demo.model.Quiz;
import com.example.demo.service.DataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for quiz resource operations.
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final DataService dataService;

    /**
     * Creates a controller with the required data service dependency.
     *
     * @param dataService service responsible for quiz persistence and business rules
     */
    public QuizController(DataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Retrieves all quizzes with computed question counts.
     * The list and counts are built atomically by the service layer so the
     * response always reflects a single consistent snapshot of the data.
     *
     * @return HTTP 200 with a list of quiz summaries
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllQuizzes() {
        return ResponseEntity.ok(dataService.getAllQuizzesWithCounts());
    }

    /**
     * Retrieves a quiz by its identifier.
     *
     * @param id quiz identifier
     * @return HTTP 200 with the quiz payload
     * @throws java.util.NoSuchElementException when quiz does not exist
     */
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String id) {
        return ResponseEntity.ok(dataService.getQuizById(id));
    }

    /**
     * Creates a new quiz.
     *
     * @param newQuiz request body containing quiz fields
     * @return HTTP 201 with the created quiz
     * @throws IllegalStateException when title already exists
     * @throws IllegalArgumentException when payload validation fails
     */
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz newQuiz) {
        Quiz savedQuiz = dataService.addQuiz(newQuiz);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuiz);
    }

    /**
     * Updates an existing quiz by identifier.
     *
     * @param id quiz identifier
     * @param updatedQuiz request body containing replacement fields
     * @return HTTP 200 with updated quiz
     * @throws java.util.NoSuchElementException when quiz does not exist
     * @throws IllegalStateException when title already exists
     */
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String id, @RequestBody Quiz updatedQuiz) {
        Quiz savedQuiz = dataService.updateQuiz(id, updatedQuiz);
        return ResponseEntity.ok(savedQuiz);
    }

    /**
     * Deletes a quiz and its associated questions.
     *
     * @param id quiz identifier
     * @return HTTP 204 when deletion succeeds
     * @throws java.util.NoSuchElementException when quiz does not exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        dataService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }
}