import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from '../components/QuestionCard';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const amount = parseInt(queryParams.get('amount') || '10');
  const category = queryParams.get('category') || '';
  const difficulty = queryParams.get('difficulty') || '';
  
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  
  const { 
    questions, 
    currentQuestion,
    currentIndex, 
    score, 
    loading, 
    error,
    progress,
    totalQuestions,
    quizCompleted,
    checkAnswer 
  } = useQuiz(amount, category, difficulty);

  // Store shuffled answers for each question to ensure consistency 
  const [shuffledAnswersMap, setShuffledAnswersMap] = useState({});

  // Generate shuffled answers when questions load or currentIndex changes
  useEffect(() => {
    if (currentQuestion && !shuffledAnswersMap[currentIndex]) {
      const shuffled = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
        .sort(() => Math.random() - 0.5);
      
      setShuffledAnswersMap(prev => ({
        ...prev,
        [currentIndex]: shuffled
      }));
    }
  }, [currentQuestion, currentIndex, shuffledAnswersMap]);

  // Get the current shuffled answers
  const currentShuffledAnswers = useMemo(() => {
    if (currentQuestion && shuffledAnswersMap[currentIndex]) {
      return shuffledAnswersMap[currentIndex];
    }
    // Fallback if not yet available
    return [];
  }, [currentQuestion, currentIndex, shuffledAnswersMap]);

  useEffect(() => {
    if (quizCompleted) {
      const timer = setTimeout(() => {
        navigate(`/results?score=${score}&total=${totalQuestions}`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [quizCompleted, navigate, score, totalQuestions]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    // Add a delay before moving to the next question
    setTimeout(() => {
      checkAnswer(answer);
      setSelectedAnswer('');
      setShowAnswer(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="mt-4 text-xl text-blue-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading questions...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-500/20 p-6 rounded-xl border border-red-500/30 mb-6"
        >
          <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
          <p className="text-white/70">{error}</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Back to Home
        </motion.button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="mb-4">No questions available. Please try again with different options.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <motion.div 
            className="text-sm md:text-base text-blue-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Question {currentIndex + 1} of {totalQuestions}
          </motion.div>
          <motion.div 
            className="text-sm md:text-base text-purple-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Score: {score}
          </motion.div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      {/* Question Card with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <QuestionCard
            question={currentQuestion.question}
            answers={currentShuffledAnswers}
            callback={handleAnswerClick}
            selectedAnswer={selectedAnswer}
            showAnswer={showAnswer}
            correctAnswer={currentQuestion.correct_answer}
          />
        </motion.div>
      </AnimatePresence>

      {/* Category and Difficulty Badge */}
      <motion.div 
        className="mt-6 flex justify-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-3 py-1 text-sm bg-white/10 backdrop-blur-md rounded-full text-blue-200">
          {currentQuestion.category}
        </div>
        <div className="px-3 py-1 text-sm bg-white/10 backdrop-blur-md rounded-full text-purple-200">
          {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
        </div>
      </motion.div>

      {/* Back button */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button 
          onClick={() => navigate('/')} 
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Exit Quiz
        </button>
      </motion.div>
    </div>
  );
};

export default Quiz;
