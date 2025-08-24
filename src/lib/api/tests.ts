/**
 * Fetch test data by ID from the API
 * @param testId - The unique identifier for the test
 * @returns Promise containing the test data as text
 */
export async function getTestById(testId: string): Promise<string> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    const response = await fetch(`${apiBaseUrl}/Tests/${testId}`, {
      method: 'GET',
      headers: {
        'accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch test: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching test:', error);
    throw error;
  }
}

/**
 * Fetch all tests from the API
 * @returns Promise containing array of test objects
 */
export async function getTests(): Promise<any[]> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    const response = await fetch(`${apiBaseUrl}/Tests`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tests: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
}

/**
 * Fetch questions for a specific test from the API
 * @param testId - The unique identifier for the test
 * @returns Promise containing array of question objects
 */
export async function getQuestionsByTest(testId: string): Promise<any[]> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    const response = await fetch(`${apiBaseUrl}/Questions/bytest/${testId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

/**
 * Check if a free text answer is correct using the AI answer checking API
 * @param userAnswer - The user's provided answer
 * @param actualAnswer - The expected/correct answer
 * @returns Promise containing boolean indicating if the answer is correct
 */
export async function checkFreeTextAnswer(userAnswer: string, actualAnswer: string): Promise<boolean> {
  try {
    const apiBaseUrl = import.meta.env.VITE_ENV_apiBaseUrl;
    const response = await fetch(`${apiBaseUrl}/AnswerCheck/check`, {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userAnswer: userAnswer.trim(),
        actualAnswer: actualAnswer
      })
    });

    if (!response.ok) {
      throw new Error(`Answer check API failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.text();
    return result.toLowerCase() === 'true';
  } catch (error) {
    console.error('Error calling answer check API:', error);
    throw error;
  }
}
