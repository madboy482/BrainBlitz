import { useState, useEffect, useCallback } from 'react';
import { fetchQuizQuestions } from '../api/triviaApi';

export function useQuiz(amount = 10, category = '', difficulty = '') {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questionsFetched, setQuestionsFetched] = useState(false);

  // Load questions when parameters change
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching ${amount} questions, category: ${category || 'any'}, difficulty: ${difficulty || 'any'}`);
        const fetched = await fetchQuizQuestions(amount, category, difficulty);
        
        if (!fetched || fetched.length === 0) {
          throw new Error('No questions found. Try different options.');
        }
        
        // Process questions once when fetched to ensure they have stable IDs
        const processedQuestions = fetched.map((q, index) => ({
          ...q,
          id: `question-${index}`, // Add a stable ID to each question
        }));
        
        setQuestions(processedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setQuizStarted(true);
        setQuizCompleted(false);
        setQuestionsFetched(true);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to fetch questions. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    // Only fetch questions if they haven't been fetched yet or if parameters change
    if (!questionsFetched || amount !== questions.length || 
        (category !== '' && !questions[0]?.category?.toLowerCase().includes(category)) ||
        (difficulty !== '' && questions[0]?.difficulty !== difficulty)) {
      loadQuestions();
    }
  }, [amount, category, difficulty, questionsFetched, questions]);

  // Function to check an answer
  const checkAnswer = useCallback((answer) => {
    if (!questions || currentIndex >= questions.length) return;
    
    const correct = questions[currentIndex].correct_answer;
    if (answer === correct) {
      setScore(prev => prev + 1);
    }
    
    // Use a setTimeout to ensure state updates don't conflict
    setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        setQuizCompleted(true);
      } else {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }
    }, 100);
  }, [currentIndex, questions]);

  // Function to restart the quiz with same settings
  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setQuizCompleted(false);
    // Don't re-shuffle the questions to maintain consistency
  }, []);

  // Calculate progress percentage
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  return { 
    questions, 
    currentQuestion: questions[currentIndex],
    currentIndex, 
    score, 
    loading, 
    error,
    progress,
    quizStarted,
    quizCompleted,
    totalQuestions: questions.length,
    checkAnswer,
    restartQuiz
  };
}
