import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuizQuestions } from '../services/quizService';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const amount = queryParams.get('amount') || 10;
  const category = queryParams.get('category') || '';
  const difficulty = queryParams.get('difficulty') || '';

  // Fetch quiz questions from API
  useEffect(() => {
    const getQuestions = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        console.log(`Attempting to fetch ${amount} questions with category ${category} and difficulty ${difficulty}`);
        
        const data = await fetchQuizQuestions(amount, category, difficulty);
        
        if (data.length === 0) {
          console.error('No questions returned from API');
          setError('Could not load questions. Please try again with different options.');
        } else {
          console.log(`Successfully loaded ${data.length} questions`);
          setQuestions(data);
          setTimerActive(true);
        }
      } catch (err) {
        console.error('Error in quiz component:', err);
        setError('Failed to fetch questions. Please check your internet connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, [amount, category, difficulty]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up, move to next question
      handleNextQuestion(true);
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, handleNextQuestion]);

  const handleOptionSelect = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
    }
  };

  const handleNextQuestion = (timeUp = false) => {
    // If time's up or an option is selected
    if (timeUp || selectedOption !== null) {
      // Check answer if not already shown
      if (!showAnswer) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) {
          setScore(score + 1);
        }
        setShowAnswer(true);
        setTimerActive(false);
      } else {
        // Move to next question
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
          setCurrentQuestionIndex(nextQuestionIndex);
          setSelectedOption(null);
          setShowAnswer(false);
          setTimeLeft(30); // Reset timer for next question
          setTimerActive(true);
        } else {
          // Quiz finished, navigate to results
          navigate('/results', { 
            state: { 
              score, 
              total: questions.length,
              quizDetails: {
                category: category || 'Mixed',
                difficulty: difficulty || 'Mixed',
                amount
              }
            } 
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-medium text-gray-700">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="text-amber-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Error</h2>
        <p className="mb-6 text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">QuizMaster</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-white text-indigo-600 font-bold py-1 px-3 rounded-full text-sm">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
              <span className="bg-white text-indigo-600 font-bold py-1 px-3 rounded-full text-sm">
                Score: {score}
              </span>
            </div>
          </div>
          
          {/* Timer */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Time left</span>
              <span className={`font-medium ${timeLeft < 10 ? 'text-red-300' : ''}`}>
                {timeLeft} seconds
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${timeLeft < 10 ? 'bg-red-400' : 'bg-white'}`} 
                style={{ width: `${(timeLeft / 30) * 100}%`, transition: 'width 1s linear' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                {currentQuestion.question}
              </h3>
              
              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: !showAnswer ? 1.02 : 1 }}
                    whileTap={{ scale: !showAnswer ? 0.98 : 1 }}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === option
                        ? showAnswer
                          ? option === currentQuestion.correctAnswer
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : "bg-indigo-100 border-indigo-500"
                        : "hover:border-gray-300 border-gray-200"
                    } ${
                      showAnswer && option === currentQuestion.correctAnswer
                        ? "bg-green-100 border-green-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        selectedOption === option
                          ? showAnswer
                            ? option === currentQuestion.correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } ${
                        showAnswer && option === currentQuestion.correctAnswer
                          ? "bg-green-500 text-white"
                          : ""
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feedback when answer is shown */}
          {showAnswer && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg ${
                selectedOption === currentQuestion.correctAnswer
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  selectedOption === currentQuestion.correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {selectedOption === currentQuestion.correctAnswer ? "✓" : "✗"}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedOption === currentQuestion.correctAnswer
                      ? "Correct! Well done!"
                      : "Incorrect!"}
                  </p>
                  {selectedOption !== currentQuestion.correctAnswer && (
                    <p className="text-sm mt-1">
                      The correct answer is: <span className="font-semibold">{currentQuestion.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Next button */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Quit Quiz
            </button>
            
            <button
              onClick={() => handleNextQuestion()}
              disabled={selectedOption === null && !showAnswer}
              className={`px-6 py-3 rounded-lg font-semibold ${
                selectedOption === null && !showAnswer
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {showAnswer ? "Next Question" : "Check Answer"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Quiz;