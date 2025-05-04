import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const score = parseInt(queryParams.get('score') || '0');
  const total = parseInt(queryParams.get('total') || '10');
  
  const percentage = Math.round((score / total) * 100);
  const [confetti, setConfetti] = useState([]);
  
  // Generate feedback based on score
  const getFeedback = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-green-400' };
    if (percentage >= 70) return { text: 'Great job!', color: 'text-blue-400' };
    if (percentage >= 50) return { text: 'Good effort!', color: 'text-yellow-400' };
    if (percentage >= 30) return { text: 'Keep practicing!', color: 'text-orange-400' };
    return { text: 'Better luck next time!', color: 'text-red-400' };
  };
  
  const feedback = getFeedback();

  // Create confetti effect if score is good
  useEffect(() => {
    if (percentage >= 50) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 100 }).map((_, i) => {
        return {
          id: i,
          x: Math.random() * 100,
          y: -10 - (Math.random() * 25),
          size: 5 + (Math.random() * 10),
          rotation: Math.random() * 360,
          color: [
            '#FF6B6B', '#FF9E7A', '#FFD166', 
            '#06D6A0', '#118AB2', '#073B4C',
            '#8338EC', '#3A86FF', '#FB5607',
            '#FFBE0B', '#7209B7', '#F72585'
          ][Math.floor(Math.random() * 12)]
        };
      });
      setConfetti(pieces);
    }
  }, [percentage]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative overflow-hidden">
      {/* Confetti animation */}
      {percentage >= 50 && (
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map(piece => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 z-0"
              style={{ 
                backgroundColor: piece.color,
                borderRadius: '2px',
                width: piece.size,
                height: piece.size,
                left: `${piece.x}%`,
                top: `${piece.y}%`
              }}
              initial={{ y: piece.y, x: piece.x, rotate: 0 }}
              animate={{ 
                y: window.innerHeight, 
                x: piece.x + (Math.random() * 100 - 50),
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1) 
              }}
              transition={{ 
                duration: 3 + Math.random() * 4,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl relative z-10"
      >
        <div className="text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Results
          </motion.h1>
          
          <motion.div
            className="mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div className="relative w-48 h-48 mx-auto">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full bg-white/5"></div>
              
              {/* Progress circle */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="8" 
                />
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="url(#gradient)"
                  strokeWidth="8" 
                  strokeDasharray="251" 
                  strokeDashoffset="251"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - ((percentage / 100) * 251) }}
                  transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {percentage}%
                </motion.span>
                <motion.span 
                  className="text-sm text-blue-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {score} of {total} correct
                </motion.span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h2 className={`text-2xl font-bold mb-2 ${feedback.color}`}>{feedback.text}</h2>
            <p className="text-gray-300">
              {percentage >= 70 ? 
                'Impressive knowledge! You really know your stuff.' : 
                percentage >= 50 ? 
                'Good work! Keep learning and you\'ll be an expert.' :
                'Don\'t worry, practice makes perfect. Try again!'}
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <motion.button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all transform hover:scale-105 border border-white/10"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              New Quiz
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/quiz' + location.search)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-medium transition-all transform hover:scale-105 shadow-lg hover:from-blue-700 hover:to-purple-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Score breakdown */}
      {total > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8 relative z-10 p-6 bg-white/5 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-3 text-blue-300">How'd you do?</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Correct answers:</span>
              <span className="text-green-400 font-medium">{score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Incorrect answers:</span>
              <span className="text-red-400 font-medium">{total - score}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Accuracy rate:</span>
              <span className={percentage >= 70 ? "text-green-400 font-medium" : percentage >= 50 ? "text-yellow-400 font-medium" : "text-red-400 font-medium"}>
                {percentage}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Results;