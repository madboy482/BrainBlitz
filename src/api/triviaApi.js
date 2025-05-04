const CATEGORY_MAP = {
    general: 9, // General Knowledge
    books: 10,
    film: 11,
    music: 12,
    television: 14,
    videogames: 15,
    science: 17,
    computers: 18, // Science: Computers
    technology: 18, // Science: Computers
    mathematics: 19,
    sports: 21,
    geography: 22,
    history: 23,
    art: 25,
    entertainment: 11 // Default to film for entertainment
  };
  
  export async function fetchQuizQuestions(amount = 10, category = '', difficulty = '') {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  
    if (category && CATEGORY_MAP[category]) {
      url += `&category=${CATEGORY_MAP[category]}`;
    }
  
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      url += `&difficulty=${difficulty}`;
    }
  
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url);
  
        if (response.status === 429) {
          console.warn(`Received 429 Too Many Requests. Retry ${attempt}/${maxRetries}...`);
          const delay = baseDelay * attempt;
          await new Promise(res => setTimeout(res, delay));
          continue;
        }
  
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.response_code !== 0) {
          switch (data.response_code) {
            case 1:
              throw new Error('No questions available for these options. Try different settings.');
            case 2:
              throw new Error('Invalid parameters. Please check your selections.');
            case 3:
              throw new Error('Session token not found.');
            case 4:
              throw new Error('Session token is empty.');
            default:
              throw new Error('Unknown error fetching quiz data.');
          }
        }
  
        return data.results;
  
      } catch (error) {
        if (attempt === maxRetries) {
          console.error('Error fetching quiz questions:', error);
          throw error;
        } else {
          console.warn(`Retrying (${attempt}/${maxRetries}) after error: ${error.message}`);
          const delay = baseDelay * attempt;
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
  
    throw new Error('Failed to fetch quiz questions after multiple attempts.');
  }
  