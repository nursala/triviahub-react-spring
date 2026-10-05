package com.example.demo.controller;

import com.example.demo.model.GameResult;
import com.example.demo.service.DataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for game result and leaderboard endpoints.
 */
@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final DataService dataService;

    /**
     * Creates a result controller with required service dependency.
     *
     * @param dataService service used for result persistence and leaderboard queries
     */
    public ResultController(DataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Retrieves all stored quiz results.
     *
     * @return HTTP 200 with all saved results
     */
    @GetMapping
    public ResponseEntity<List<GameResult>> getAllResults() {
        return ResponseEntity.ok(dataService.readResults());
    }

    /**
     * Retrieves the global leaderboard across all quizzes.
     *
     * @return HTTP 200 with top global results
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<GameResult>> getGlobalLeaderboard() {
        return ResponseEntity.ok(dataService.getGlobalLeaderboard());
    }

    /**
     * Retrieves leaderboard entries for one quiz.
     *
     * @param quizId quiz identifier
     * @return HTTP 200 with quiz-specific leaderboard
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<GameResult>> getQuizLeaderboard(@PathVariable String quizId) {
        return ResponseEntity.ok(dataService.getQuizLeaderboard(quizId));
    }

    /**
     * Saves a completed game result.
     *
     * @param result result payload
     * @return HTTP 201 with the saved result
     * @throws IllegalArgumentException when payload validation fails
     */
    @PostMapping
    public ResponseEntity<GameResult> saveResult(@RequestBody GameResult result) {
        GameResult saved = dataService.saveResult(result);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
