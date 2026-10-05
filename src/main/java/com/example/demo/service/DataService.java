package com.example.demo.service;

import com.example.demo.model.GameResult;
import com.example.demo.model.Question;
import com.example.demo.model.Quiz;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

/**
 * Central application service for quiz, question, and result persistence.
 * Uses synchronized access around serialized file operations so each request
 * observes a consistent snapshot of the stored data.
 */
@Service
public class DataService {

    private static final String QUIZZES_FILE = "quizzes.ser";
    private static final String QUESTIONS_FILE = "questions.ser";
    private static final String RESULTS_FILE = "results.ser";

    /**
     * Reads a serialized collection from disk.
     *
     * @param filename serialized file name
     * @return deserialized list, or an empty list when the file does not exist
     */
    @SuppressWarnings("unchecked")
    private synchronized <T> List<T> readFromFile(String filename) {
        File file = new File(filename);
        if (!file.exists()) return new ArrayList<>();
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file))) {
            return (List<T>) ois.readObject();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read serialized data from " + filename, e);
        }
    }

    /**
     * Replaces a serialized collection on disk.
     *
     * @param filename serialized file name
     * @param data collection to persist
     */
    private synchronized <T> void writeToFile(String filename, List<T> data) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(data);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write serialized data to " + filename, e);
        }
    }

    /**
     * Retrieves every stored quiz.
     *
     * @return all quizzes in persistence order
     */
    public synchronized List<Quiz> readQuizzes() { return readFromFile(QUIZZES_FILE); }

    /**
     * Persists the full quiz collection.
     *
     * @param quizzes complete quiz list to save
     */
    private synchronized void writeQuizzes(List<Quiz> quizzes) { writeToFile(QUIZZES_FILE, quizzes); }

    /**
     * Counts how many questions belong to a quiz.
     *
     * @param quizId quiz identifier
     * @return number of questions assigned to the quiz
     */
    public synchronized int getQuestionCountForQuiz(String quizId) {
        return (int) readQuestions().stream().filter(q -> q.getQuizId().equals(quizId)).count();
    }

    /**
     * Builds the full quiz list enriched with each quiz's question count.
     * Reads quizzes and questions once under a single lock so the returned
     * snapshot is internally consistent while counts are computed.
     *
     * @return list of quiz summaries including question counts
     */
    public synchronized List<Map<String, Object>> getAllQuizzesWithCounts() {
        List<Quiz> quizzes = readQuizzes();
        List<Question> questions = readQuestions();

        List<Map<String, Object>> response = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            long questionCount = questions.stream()
                    .filter(question -> question.getQuizId().equals(quiz.getId()))
                    .count();

            Map<String, Object> quizData = new LinkedHashMap<>();
            quizData.put("id", quiz.getId());
            quizData.put("title", quiz.getTitle());
            quizData.put("category", quiz.getCategory());
            quizData.put("description", quiz.getDescription());
            quizData.put("questionCount", (int) questionCount);
            response.add(quizData);
        }
        return response;
    }

    /**
     * Retrieves one quiz by identifier.
     *
     * @param id quiz identifier
     * @return matching quiz
     * @throws NoSuchElementException when the quiz does not exist
     */
    public synchronized Quiz getQuizById(String id) {
        return readQuizzes().stream().filter(q -> q.getId().equals(id)).findFirst()
                .orElseThrow(() -> new NoSuchElementException("Quiz not found"));
    }

    /**
     * Stores a new quiz after validating title uniqueness.
     *
     * @param newQuiz quiz to add
     * @return saved quiz
     * @throws IllegalStateException when another quiz already uses the same title
     */
    public synchronized Quiz addQuiz(Quiz newQuiz) {
        List<Quiz> quizzes = readQuizzes();
        if (quizzes.stream().anyMatch(q -> q.getTitle().equalsIgnoreCase(newQuiz.getTitle()))) {
            throw new IllegalStateException("A quiz with this title already exists.");
        }
        quizzes.add(newQuiz);
        writeQuizzes(quizzes);
        return newQuiz;
    }

    /**
     * Replaces the stored data for an existing quiz.
     *
     * @param id quiz identifier to update
     * @param updatedData replacement quiz data
     * @return updated quiz
     * @throws NoSuchElementException when the quiz does not exist
     * @throws IllegalStateException when the updated title conflicts with another quiz
     */
    public synchronized Quiz updateQuiz(String id, Quiz updatedData) {
        List<Quiz> quizzes = readQuizzes();
        for (int i = 0; i < quizzes.size(); i++) {
            if (quizzes.get(i).getId().equals(id)) {
                if (quizzes.stream().anyMatch(q -> !q.getId().equals(id) && q.getTitle().equalsIgnoreCase(updatedData.getTitle()))) {
                    throw new IllegalStateException("A quiz with this title already exists.");
                }
                updatedData.setId(id);
                quizzes.set(i, updatedData);
                writeQuizzes(quizzes);
                return updatedData;
            }
        }
        throw new NoSuchElementException("Quiz not found");
    }

    /**
     * Deletes a quiz and removes all questions assigned to it.
     *
     * @param id quiz identifier
     * @throws NoSuchElementException when the quiz does not exist
     */
    public synchronized void deleteQuiz(String id) {
        List<Quiz> quizzes = readQuizzes();
        if (!quizzes.removeIf(q -> q.getId().equals(id))) throw new NoSuchElementException("Quiz not found");
        writeQuizzes(quizzes);

        List<Question> questions = readQuestions();
        questions.removeIf(q -> q.getQuizId().equals(id));
        writeQuestions(questions);
    }

    /**
     * Retrieves every stored question.
     *
     * @return all questions in persistence order
     */
    public synchronized List<Question> readQuestions() { return readFromFile(QUESTIONS_FILE); }

    /**
     * Persists the full question collection.
     *
     * @param questions complete question list to save
     */
    private synchronized void writeQuestions(List<Question> questions) { writeToFile(QUESTIONS_FILE, questions); }

    /**
     * Retrieves every question assigned to one quiz.
     *
     * @param quizId quiz identifier
     * @return questions belonging to the quiz
     */
    public synchronized List<Question> getQuestionsForQuiz(String quizId) {
        return readQuestions().stream().filter(q -> q.getQuizId().equals(quizId)).collect(Collectors.toList());
    }

    /**
     * Returns a shuffled copy of a quiz's questions for gameplay.
     *
     * @param quizId quiz identifier
     * @return randomized question list
     */
    public synchronized List<Question> getRandomQuestionsForQuiz(String quizId) {
        List<Question> questions = getQuestionsForQuiz(quizId);
        Collections.shuffle(questions);
        return questions;
    }

    /**
     * Stores a new question.
     *
     * @param q question to add
     * @return saved question
     */
    public synchronized Question addQuestion(Question q) {
        List<Question> questions = readQuestions();
        questions.add(q);
        writeQuestions(questions);
        return q;
    }

    /**
     * Replaces the stored data for an existing question.
     *
     * @param id question identifier
     * @param updatedQ replacement question data
     * @return updated question
     * @throws NoSuchElementException when the question does not exist
     */
    public synchronized Question updateQuestion(String id, Question updatedQ) {
        List<Question> questions = readQuestions();
        for (int i = 0; i < questions.size(); i++) {
            if (questions.get(i).getId().equals(id)) {
                updatedQ.setId(id);
                questions.set(i, updatedQ);
                writeQuestions(questions);
                return updatedQ;
            }
        }
        throw new NoSuchElementException("Question not found");
    }

    /**
     * Deletes one stored question.
     *
     * @param id question identifier
     * @throws NoSuchElementException when the question does not exist
     */
    public synchronized void deleteQuestion(String id) {
        List<Question> questions = readQuestions();
        if (!questions.removeIf(q -> q.getId().equals(id))) throw new NoSuchElementException("Question not found");
        writeQuestions(questions);
    }

    /**
     * Retrieves every stored game result.
     *
     * @return all saved results in persistence order
     */
    public synchronized List<GameResult> readResults() { return readFromFile(RESULTS_FILE); }

    /**
     * Persists the full result collection.
     *
     * @param results complete result list to save
     */
    private synchronized void writeResults(List<GameResult> results) { writeToFile(RESULTS_FILE, results); }

    /**
     * Stores a completed game result.
     *
     * @param result result to save
     * @return saved result
     */
    public synchronized GameResult saveResult(GameResult result) {
        List<GameResult> results = readResults();
        results.add(result);
        writeResults(results);
        return result;
    }

    /**
     * Builds the global leaderboard.
     *
     * @return top 20 results ordered by score descending, then duration ascending
     */
    public synchronized List<GameResult> getGlobalLeaderboard() {
        return readResults().stream()
                .sorted(Comparator.comparingInt(GameResult::getScore).reversed()
                        .thenComparingLong(GameResult::getDurationSeconds))
                .limit(20)
                .collect(Collectors.toList());
    }

    /**
     * Builds the leaderboard for one quiz.
     *
     * @param quizId quiz identifier
     * @return top 10 quiz results ordered by score descending, then duration ascending
     */
    public synchronized List<GameResult> getQuizLeaderboard(String quizId) {
        return readResults().stream()
                .filter(r -> r.getQuizId().equals(quizId))
                .sorted(Comparator.comparingInt(GameResult::getScore).reversed()
                        .thenComparingLong(GameResult::getDurationSeconds))
                .limit(10)
                .collect(Collectors.toList());
    }
}
