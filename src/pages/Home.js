import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { id: 'general', name: 'General Knowledge', icon: '🧠' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'history', name: 'History', icon: '📜' },
  { id: 'geography', name: 'Geography', icon: '🌍' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'computers', name: 'Technology', icon: '💻' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', color: 'from-green-500 to-green-600' },
  { id: 'medium', name: 'Medium', color: 'from-yellow-500 to-yellow-600' },
  { id: 'hard', name: 'Hard', color: 'from-red-500 to-red-600' },
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [questionsAmount, setQuestionsAmount] = useState(10);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  
  const handleStartQuiz = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append('category', selectedCategory);
    if (selectedDifficulty) queryParams.append('difficulty', selectedDifficulty);
    queryParams.append('amount', questionsAmount);
    
    navigate(`/quiz?${queryParams.toString()}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-10"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold mb-4 inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
        >
          QuizMaster Challenge
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-xl text-blue-200"
        >
          Test your knowledge across various topics
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible" 
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-xl mb-8"
      >
        {/* Categories */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Select a Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500/30 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className={`text-sm ${selectedCategory === category.id ? 'text-blue-200' : 'text-gray-300'}`}>
                  {category.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Difficulty */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Select Difficulty</h2>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map((difficulty) => (
              <motion.button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`py-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedDifficulty === difficulty.id
                    ? `bg-gradient-to-r ${difficulty.color} border-none`
                    : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={`font-medium ${selectedDifficulty === difficulty.id ? 'text-white' : 'text-gray-300'}`}>
                  {difficulty.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Number of Questions */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Number of Questions</h2>
          <div className="flex items-center">
            <motion.button
              onClick={() => setQuestionsAmount(Math.max(5, questionsAmount - 5))}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              disabled={questionsAmount <= 5}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-xl">-</span>
            </motion.button>
            
            <div className="flex-1 mx-4">
              <div className="relative h-6">
                <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                <motion.div 
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: '50%' }}
                  animate={{ width: `${((questionsAmount - 5) / 20) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium">
                  {questionsAmount} Questions
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={() => setQuestionsAmount(Math.min(25, questionsAmount + 5))}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              disabled={questionsAmount >= 25}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-xl">+</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Start Button */}
      <motion.div
        variants={itemVariants} 
        className="text-center"
      >
        <motion.button
          onClick={handleStartQuiz}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg shadow-lg 
                    hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 25px rgba(79, 70, 229, 0.6)" 
          }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <div className="flex items-center">
            <span>Start Quiz</span>
            <motion.span
              animate={{ x: isHovering ? 8 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="ml-2"
            >
              →
            </motion.span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Home;