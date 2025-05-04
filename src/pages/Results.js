import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, quizDetails } = location.state || { score: 0, total: 0, quizDetails: { category: 'Unknown', difficulty: 'Unknown', amount: 0 } };
  
  // Calculate percentage
  const percentage = Math.round((score / total) * 100);
  
  // Determine message based on percentage
  const getMessage = () => {
    if (percentage >= 90) return { text: "Excellent! You're a genius!", emoji: "🏆" };
    if (percentage >= 70) return { text: "Great job! Very impressive!", emoji: "🌟" };
    if (percentage >= 50) return { text: "Good effort! Keep learning!", emoji: "👍" };
    return { text: "Keep practicing! You'll improve!", emoji: "📚" };
  };
  
  const message = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-12"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="opacity-90">Here's how you did</p>
        </div>
        
        {/* Results content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{message.emoji}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{message.text}</h3>
            <p className="text-gray-600">You scored {score} out of {total}</p>
          </div>
          
          {/* Score circle */}
          <div className="flex justify-center mb-8">
            <motion.div 
              className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            >
              {/* Circular progress indicator */}
              <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8"
                />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={percentage >= 70 ? "#4f46e5" : percentage >= 40 ? "#f59e0b" : "#ef4444"} 
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * percentage) / 100}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </svg>
              <div className="text-center z-10">
                <motion.div 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {percentage}%
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Quiz details */}
          <motion.div 
            className="bg-gray-50 rounded-xl p-6 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Quiz Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">{quizDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Difficulty</p>
                <p className="font-medium text-gray-800 capitalize">{quizDetails.difficulty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-medium text-gray-800">{total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="font-medium text-gray-800">{score}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              onClick={() => navigate('/')}
            >
              Take Another Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              onClick={() => navigate(`/quiz?amount=${quizDetails.amount}&category=${quizDetails.category !== 'Mixed' ? quizDetails.category : ''}&difficulty=${quizDetails.difficulty !== 'Mixed' ? quizDetails.difficulty : ''}`)}
            >
              Retry Same Quiz
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Results;