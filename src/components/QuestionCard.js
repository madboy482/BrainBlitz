import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ 
  question, 
  answers, 
  callback, 
  userAnswer, 
  questionNumber, 
  totalQuestions,
  timer
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const handleAnswerClick = (answer) => {
    if (userAnswer) return; // Prevent changing answer if already submitted
    setSelectedAnswer(answer);
    callback(answer);
  };
  
  // Calculate progress percentage
  const progress = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl max-w-3xl mx-auto"
    >
      {/* Progress and Question Counter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-300">
            Question {questionNumber} of {totalQuestions}
          </span>
          {timer !== undefined && (
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {timer}s
            </span>
          )}
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Question Text */}
      <motion.h2 
        className="text-xl md:text-2xl font-semibold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        dangerouslySetInnerHTML={{ __html: question }}
      />
      
      {/* Answer Options */}
      <div className="space-y-3">
        {answers.map((answer, index) => {
          // Determine button styling based on answer state
          const isSelected = selectedAnswer === answer;
          const isCorrect = userAnswer?.correctAnswer === answer;
          const isWrong = userAnswer && userAnswer.answer === answer && !isCorrect;
          
          let buttonClasses = 'w-full text-left p-4 rounded-xl transition-all duration-300 border ';
          
          if (userAnswer) {
            if (isCorrect) {
              buttonClasses += 'bg-green-500/20 border-green-500/50 text-green-300';
            } else if (isWrong) {
              buttonClasses += 'bg-red-500/20 border-red-500/50 text-red-300';
            } else if (answer === userAnswer.correctAnswer) {
              // Show correct answer when user selected a different wrong answer
              buttonClasses += 'bg-green-500/10 border-green-500/30 text-green-200';
            } else {
              buttonClasses += 'bg-white/5 border-white/10 text-gray-400';
            }
          } else {
            buttonClasses += isSelected 
              ? 'bg-blue-600/20 border-blue-500/50 text-white'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
          }
          
          return (
            <motion.button
              key={answer}
              onClick={() => handleAnswerClick(answer)}
              className={buttonClasses}
              disabled={userAnswer !== undefined}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: userAnswer ? 1 : 1.01 }}
              whileTap={{ scale: userAnswer ? 1 : 0.99 }}
            >
              <div className="flex items-center">
                <span className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm font-medium">
                  {['A', 'B', 'C', 'D'][index]}
                </span>
                <span 
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </div>
              
              {/* Show feedback icons */}
              {userAnswer && (
                <motion.div 
                  className="absolute right-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  {isCorrect && (
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isWrong && (
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
