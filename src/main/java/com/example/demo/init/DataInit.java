package com.example.demo.init;

import com.example.demo.model.GameResult;
import com.example.demo.model.Question;
import com.example.demo.model.Quiz;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Standalone seed-data initializer for the TriviaHub backend.
 * Writes sample quizzes, questions, and leaderboard entries to the serialized
 * data files expected by the application.
 */
public class DataInit {

    /**
     * Generates and persists the sample dataset used for local development and demonstrations.
     *
     * @param args command-line arguments; ignored
     */
    public static void main(String[] args) {
        List<Quiz> quizzes = new ArrayList<>();
        List<Question> questions = new ArrayList<>();
        List<GameResult> results = new ArrayList<>();

        // Quiz 1: Calculus (Category: Math)
        Quiz qz1 = new Quiz("Calculus Fundamentals", "math", "Basic limits, derivatives, and integrals.");
        quizzes.add(qz1);

        questions.add(createQuestion(qz1.getId(), "What is the derivative of x^2?", new String[]{"2x", "x", "2", "x^2"}, 0, "Power rule", "easy"));
        questions.add(createQuestion(qz1.getId(), "What is the integral of 2x?", new String[]{"2", "x^2 + C", "x", "2x^2 + C"}, 1, "Reverse power rule", "easy"));
        questions.add(createQuestion(qz1.getId(), "Limit of 1/x as x approaches infinity?", new String[]{"1", "Infinity", "0", "Undefined"}, 2, "Think of very large denominators", "medium"));
        questions.add(createQuestion(qz1.getId(), "Derivative of sin(x)?", new String[]{"-cos(x)", "sin(x)", "-sin(x)", "cos(x)"}, 3, "Basic trigonometric derivative", "easy"));
        questions.add(createQuestion(qz1.getId(), "What is the derivative of e^x?", new String[]{"x*e^x", "e^x", "e", "x"}, 1, "It is unique", "easy"));

        // Quiz 2: Database Management (Category: Technology)
        Quiz qz2 = new Quiz("Database Management", "technology", "Core concepts of relational and non-relational databases.");
        quizzes.add(qz2);

        questions.add(createQuestion(qz2.getId(), "What does SQL stand for?", new String[]{"Strong Question Language", "Structured Query Loop", "Structured Query Language", "System Query Language"}, 2, "Used for relational databases", "easy"));
        questions.add(createQuestion(qz2.getId(), "Which of the following is a NoSQL database?", new String[]{"MySQL", "PostgreSQL", "Oracle", "MongoDB"}, 3, "Document-based database", "medium"));
        questions.add(createQuestion(qz2.getId(), "What is a primary key?", new String[]{"Unique identifier", "Foreign key", "Index", "Table name"}, 0, "Ensures row uniqueness", "easy"));
        questions.add(createQuestion(qz2.getId(), "What does ACID stand for?", new String[]{"Active, Consistent, Isolated, Durable", "Atomicity, Consistency, Isolation, Durability", "Atomicity, Concurrency, Isolation, Durability", "Array, Consistency, Isolation, Data"}, 1, "Transaction properties", "hard"));
        questions.add(createQuestion(qz2.getId(), "Which join returns all rows from both tables?", new String[]{"Inner Join", "Left Join", "Full Outer Join", "Right Join"}, 2, "Combines left and right", "medium"));

        // Quiz 3: Cybersecurity (Category: Technology)
        Quiz qz3 = new Quiz("Cybersecurity & Malware", "technology", "Questions on security protocols and analysis.");
        quizzes.add(qz3);

        questions.add(createQuestion(qz3.getId(), "What is an SQL Injection?", new String[]{"A type of database backup", "A joining technique", "A database optimization", "Malicious code inserted into strings"}, 3, "Exploits poor input validation", "medium"));
        questions.add(createQuestion(qz3.getId(), "What does malware stand for?", new String[]{"Malicious software", "Malfunctioning hardware", "Malevolent spyware", "Mainframe warehouse"}, 0, "Software designed to cause harm", "easy"));
        questions.add(createQuestion(qz3.getId(), "Which of these is a symmetric encryption algorithm?", new String[]{"RSA", "AES", "DSA", "ECC"}, 1, "Advanced Encryption Standard", "hard"));
        questions.add(createQuestion(qz3.getId(), "What is a DDoS attack?", new String[]{"Direct Data Over System", "Distributed Data Optimization System", "Distributed Denial of Service", "Denial of Data Service"}, 2, "Overwhelms a server with traffic", "medium"));
        questions.add(createQuestion(qz3.getId(), "What is phishing?", new String[]{"A firewall type", "An encryption method", "A database protocol", "Fraudulent attempt to obtain sensitive info"}, 3, "Often done via deceptive emails", "easy"));

        results.add(createResult(qz1.getId(), "nour", 96, 5, 5, 0, 38, LocalDateTime.now().minusDays(3)));
        results.add(createResult(qz1.getId(), "amer", 88, 4, 5, 1, 51, LocalDateTime.now().minusDays(2)));
        results.add(createResult(qz2.getId(), "lina", 92, 5, 5, 1, 44, LocalDateTime.now().minusDays(2).minusHours(5)));
        results.add(createResult(qz2.getId(), "sami", 80, 4, 5, 2, 67, LocalDateTime.now().minusDays(1)));
        results.add(createResult(qz3.getId(), "maya", 90, 5, 5, 1, 47, LocalDateTime.now().minusHours(18)));
        results.add(createResult(qz3.getId(), "adam", 74, 4, 5, 2, 73, LocalDateTime.now().minusHours(9)));

        writeToFile("quizzes.ser", quizzes);
        writeToFile("questions.ser", questions);
        writeToFile("results.ser", results);

        System.out.println("Data initialization completed successfully!");
    }

    /**
     * Builds a seeded question using the model's validation rules.
     *
     * @param quizId the quiz ID this question belongs to
     * @param text the question text
     * @param options array of exactly 4 answer options
     * @param correctIndex the index (0-3) of the correct answer
     * @param hint optional hint for the question
     * @param difficulty the difficulty level (easy, medium, or hard)
     * @return a properly initialized Question object
     */
    private static Question createQuestion(String quizId, String text, String[] options, int correctIndex, String hint, String difficulty) {
        Question q = new Question();
        q.setQuizId(quizId);
        q.setText(text);
        q.setOptions(options);
        q.setCorrectIndex(correctIndex);
        q.setHint(hint);
        q.setDifficulty(difficulty);
        return q;
    }

    /**
     * Builds a seeded game result entry for leaderboard examples.
     *
     * @param quizId related quiz identifier
     * @param playerName player name to display
     * @param score final score
     * @param correctAnswers number of correct answers
     * @param totalQuestions total question count
     * @param hintsUsed number of hints used
     * @param durationSeconds completion time in seconds
     * @param playedAt simulated play timestamp
     * @return initialized game result
     */
    private static GameResult createResult(
            String quizId,
            String playerName,
            int score,
            int correctAnswers,
            int totalQuestions,
            int hintsUsed,
            long durationSeconds,
            LocalDateTime playedAt
    ) {
        GameResult result = new GameResult();
        result.setQuizId(quizId);
        result.setPlayerName(playerName);
        result.setScore(score);
        result.setCorrectAnswers(correctAnswers);
        result.setTotalQuestions(totalQuestions);
        result.setHintsUsed(hintsUsed);
        result.setDurationSeconds(durationSeconds);
        result.setPlayedAt(playedAt);
        return result;
    }

    /**
     * Serializes a seed object graph to disk.
     *
     * @param filename target serialized file name
     * @param data object graph to serialize
     */
    private static void writeToFile(String filename, Object data) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filename))) {
            oos.writeObject(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
