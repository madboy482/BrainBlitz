import React, { useEffect, useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from './QuestionCard';

export default function Quiz() {
  const { questions, currentIndex, score, loading, checkAnswer } = useQuiz();
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Only shuffle answers when questions change or when current index changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const currentQ = questions[currentIndex];
      // Shuffle answers once and store them
      setShuffledAnswers(
        [...currentQ.incorrect_answers, currentQ.correct_answer]
        .sort(() => Math.random() - 0.5)
      );
    }
  }, [questions, currentIndex]);

  if (loading) return <p className="text-center text-lg">Loading questions...</p>;
  if (currentIndex >= questions.length) return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Quiz Finished!</h1>
      <p>Your Score: {score} / {questions.length}</p>
    </div>
  );

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto mt-10">
      <QuestionCard
        question={currentQ.question}
        answers={shuffledAnswers}
        callback={checkAnswer}
      />
      <p className="mt-4 text-center">Score: {score}</p>
    </div>
  );
}
