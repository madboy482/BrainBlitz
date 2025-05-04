import React, { useState } from 'react';
import quizData from '../data/quizData';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Handle selection of an option
  const handleOptionSelect = (option) => {
    if (!showAnswer) {
      setSelectedOption(option);
    }
  };

  // Check answer and move to next question
  const handleNextQuestion = () => {
    // If no option selected, don't proceed
    if (selectedOption === null) {
      return;
    }

    // If showing answer, move to next question
    if (showAnswer) {
      const nextQuestion = currentQuestion + 1;

      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setShowAnswer(false);
      } else {
        setQuizCompleted(true);
      }
    } else {
      // Check if answer is correct
      const isCorrect = selectedOption === quizData[currentQuestion].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      setShowAnswer(true);
    }
  };

  // Restart the quiz
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
  };

  // If quiz is completed, show results
  if (quizCompleted) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Quiz Completed!</h2>
        <div className="text-center">
          <p className="text-xl mb-4">
            Your score: <span className="font-bold">{score}</span> out of <span className="font-bold">{quizData.length}</span>
          </p>
          <p className="mb-6">
            {score === quizData.length
              ? "Perfect score! Excellent job! 🎉"
              : score >= quizData.length / 2
                ? "Good job! You did well! 👍"
                : "Better luck next time! Keep learning! 📚"}
          </p>
          <button
            onClick={handleRestartQuiz}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // Current question data
  const { question, options, correctAnswer } = quizData[currentQuestion];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Interactive Quiz</h2>
        <p className="text-sm">
          Question {currentQuestion + 1}/{quizData.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{question}</h3>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`p-3 border rounded-lg cursor-pointer transition duration-200 ${
                selectedOption === option
                  ? showAnswer
                    ? option === correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50 border-gray-200"
              } ${
                showAnswer && option === correctAnswer
                  ? "bg-green-100 border-green-500"
                  : ""
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback when answer is shown */}
      {showAnswer && (
        <div className={`mb-4 p-3 rounded ${selectedOption === correctAnswer ? "bg-green-100" : "bg-red-100"}`}>
          <p>
            {selectedOption === correctAnswer 
              ? "Correct! Well done! ✅" 
              : `Incorrect! The correct answer is: ${correctAnswer} ❌`}
          </p>
        </div>
      )}

      {/* Score */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium">Score: {score}</p>
        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            selectedOption === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {showAnswer ? "Next Question" : "Check Answer"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;