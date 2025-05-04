// Removed unused `axios` import

// QuizAPI base URL
const API_URL = 'https://quizapi.io/api/v1/questions';

// Your QuizAPI key (replace with your actual API key)
const API_KEY = 'lpJNANYSmzXF0TunlzF96S2bPvnaWnGO2gOueDXR';

/**
 * Fetches quiz questions from QuizAPI
 * @param {number} amount - Number of questions to fetch
 * @param {string} category - Category to fetch questions from (not used in QuizAPI)
 * @param {string} difficulty - Difficulty level (not used in QuizAPI)
 * @returns {Array} - Array of formatted quiz questions
 */
export const fetchQuizQuestions = async (amount = 10, category = '', difficulty = '') => {
  try {
    console.log(`Fetching ${amount} questions from QuizAPI`);

    // QuizAPI does not support category or difficulty filtering, so we fetch a fixed number of questions
    const response = await axios.get(API_URL, {
      headers: {
        'X-Api-Key': API_KEY
      },
      params: {
        limit: amount
      }
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.length > 0) {
      console.log(`Successfully fetched ${response.data.length} questions from QuizAPI`);
      return processQuestions(response.data);
    } else {
      console.error('No questions returned from QuizAPI');
      return [];
    }
  } catch (error) {
    console.error('Error fetching quiz questions from QuizAPI:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return [];
  }
};

// Process API question results into our app's format
const processQuestions = (results) => {
  return results.map((question) => {
    const incorrectAnswers = Array.isArray(question.incorrect_answers) ? question.incorrect_answers : [];
    return {
      id: question.id || Math.random().toString(36).substr(2, 9),
      question: question.question,
      options: [...incorrectAnswers, question.correct_answer].sort(() => Math.random() - 0.5),
      correctAnswer: question.correct_answer,
      category: question.category || 'General',
    };
  });
};

/**
 * Get available quiz categories (static categories for now as QuizAPI does not provide categories)
 * @returns {Array} - Array of category objects
 */
export const fetchCategories = async () => {
  try {
    console.log('Fetching categories');
    return [
      { id: 'general', name: 'General Knowledge' },
      { id: 'technology', name: 'Technology' },
      { id: 'science', name: 'Science' },
      { id: 'history', name: 'History' }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};