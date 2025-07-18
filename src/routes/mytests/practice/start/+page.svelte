<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getTestById, getQuestionsByTest } from '$lib/api/tests';
  import Loading from '$lib/components/loading.svelte';

  let testData = null;
  let questions = [];
  let isLoading = true;
  let error = null;
  let testId = null;
  let testMode = 'practice'; // 'practice' or 'exam'
  let currentQuestionIndex = 0;
  let userAnswers = {};
  let timeRemaining = null;
  let timer = null;
  let isSubmitting = false;
  let showExplanation = false;
  let testStartTime = null;

  $: isPracticeMode = testMode === 'practice';
  $: isExamMode = testMode === 'exam';

  $: currentQuestion = questions[currentQuestionIndex];
  $: totalQuestions = questions.length;
  $: progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  $: answeredCount = Object.keys(userAnswers).length;
  $: isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  $: isFirstQuestion = currentQuestionIndex === 0;

  onMount(async () => {
    testId = $page.url.searchParams.get('testId');
    testMode = $page.url.searchParams.get('mode') || 'practice';
    
    if (!testId) {
      error = 'No test ID provided';
      isLoading = false;
      return;
    }

    try {
      testStartTime = new Date();
      
      // Fetch test data and questions in parallel
      const [rawTestData, questionsData] = await Promise.all([
        getTestById(testId),
        getQuestionsByTest(testId)
      ]);

      // Parse test data
      try {
        testData = JSON.parse(rawTestData);
      } catch {
        testData = { content: rawTestData };
      }

      // Validate questions data
      if (!Array.isArray(questionsData)) {
        throw new Error('Invalid questions data received');
      }

      questions = questionsData;
      
      if (questions.length === 0) {
        throw new Error('No questions found for this test');
      }

      // Start timer if test has duration
      if (testData.duration) {
        timeRemaining = testData.duration * 60; // Convert to seconds
        startTimer();
      }
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function startTimer() {
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
        }
      }, 1000);
    }
  }

  function formatTime(seconds) {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleAnswerSelect(questionId, selectedAnswer) {
    userAnswers[questionId] = selectedAnswer;
    userAnswers = { ...userAnswers }; // Trigger reactivity
    showExplanation = false;
  }

  function navigateToQuestion(index) {
    if (index >= 0 && index < totalQuestions) {
      currentQuestionIndex = index;
      showExplanation = false;
    }
  }

  function goToNextQuestion() {
    if (!isLastQuestion) {
      currentQuestionIndex++;
      showExplanation = false;
    }
  }

  function goToPreviousQuestion() {
    if (!isFirstQuestion) {
      currentQuestionIndex--;
      showExplanation = false;
    }
  }

  function toggleExplanation() {
    if (currentQuestion && currentQuestion.explanation) {
      showExplanation = !showExplanation;
    }
  }

  function saveProgress() {
    try {
      const progressData = {
        testId,
        userAnswers,
        currentQuestionIndex,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`test_progress_${testId}`, JSON.stringify(progressData));
      // Show success message
      alert('Progress saved successfully!');
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Failed to save progress. Please try again.');
    }
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem(`test_progress_${testId}`);
      if (saved) {
        const progressData = JSON.parse(saved);
        userAnswers = progressData.userAnswers || {};
        currentQuestionIndex = progressData.currentQuestionIndex || 0;
        return true;
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    }
    return false;
  }

  async function handleAutoSubmit() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    alert('Time is up! Your test will be submitted automatically.');
    await submitTest();
  }

  async function submitTest() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    
    try {
      if (timer) clearInterval(timer);
      
      // Calculate test duration
      const testEndTime = new Date();
      const testDuration = testStartTime ? Math.floor((testEndTime - testStartTime) / 1000 / 60) : 0;
      
      // Calculate score based on correct answers
      let correctAnswers = 0;
      const questionResults = [];
      
      questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        questionResults.push({
          questionId: question.id,
          questionText: question.questionText,
          userAnswer: userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
          explanation: question.explanation
        });
      });
      
      const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      // Prepare submission data
      const submissionData = {
        testId,
        answers: userAnswers,
        totalQuestions,
        answeredCount,
        correctAnswers,
        score,
        questionResults,
        startTime: testStartTime,
        endTime: testEndTime,
        duration: testDuration
      };
      
      console.log('Test submission data:', submissionData);
      
      // Store results for the results page
      sessionStorage.setItem(`test_results_${testId}`, JSON.stringify(submissionData));
      
      // Clear saved progress
      localStorage.removeItem(`test_progress_${testId}`);
      
      // Navigate to results
      goto(`/mytests/practice/results?testId=${testId}`);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
      isSubmitting = false;
    }
  }

  function goBack() {
    if (timer) clearInterval(timer);
    const confirmMessage = isExamMode ? 
      'Are you sure you want to exit the exam? Your progress will be lost.' :
      'Are you sure you want to exit? Your progress will be lost.';
    
    if (confirm(confirmMessage)) {
      goto(`/mytests/practice?testId=${testId}`);
    }
  }

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<svelte:head>
  <title>{isExamMode ? 'Exam Mode' : 'Practice Mode'} - EduGamez</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-4xl mx-auto">
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <Loading />
        <p class="ml-4 text-gray-600">Loading test questions...</p>
      </div>
    {:else if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <h3 class="font-bold">Error loading test</h3>
        <p>{error}</p>
        <div class="mt-4 flex gap-2">
          <button 
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            on:click={() => window.location.reload()}
          >
            Retry
          </button>
          <button 
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            on:click={goBack}
          >
            Go Back
          </button>
        </div>
      </div>
    {:else if questions.length > 0}
      <!-- Test Header -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-800">
              {testData.title || `Test ${testId}`}
            </h1>
            <span class="ml-4 px-3 py-1 rounded-full text-sm font-medium
              {isExamMode ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
              {isExamMode ? 'Exam Mode' : 'Practice Mode'}
            </span>
          </div>
          {#if timeRemaining !== null}
            <div class="flex items-center text-lg font-mono {timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(timeRemaining)}
            </div>
          {/if}
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style="width: {progress}%"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount}/{totalQuestions} answered</span>
        </div>
      </div>

      <!-- Question Content -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
        {#if currentQuestion}
          <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-2xl font-semibold text-gray-800 flex-1">
                {currentQuestion.questionText}
              </h2>
              {#if currentQuestion.questionType}
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm ml-4">
                  {currentQuestion.questionType}
                </span>
              {/if}
            </div>
            
            <!-- Options -->
            {#if currentQuestion.options && currentQuestion.options.length > 0}
              <div class="space-y-3">
                {#each currentQuestion.options as option}
                  <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
                    {userAnswers[currentQuestion.id] === option.optionKey ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}">
                    <input 
                      type="radio" 
                      name="question-{currentQuestion.id}"
                      value={option.optionKey}
                      checked={userAnswers[currentQuestion.id] === option.optionKey}
                      on:change={() => handleAnswerSelect(currentQuestion.id, option.optionKey)}
                      class="mr-3"
                    />
                    <div class="flex-1">
                      <div class="font-medium text-gray-800">{option.optionKey}. {option.optionText}</div>
                    </div>
                  </label>
                {/each}
              </div>
            {:else}
              <!-- Text input for non-multiple choice questions -->
              <div class="mt-4">
                <textarea 
                  class="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your answer here..."
                  rows="4"
                  bind:value={userAnswers[currentQuestion.id]}
                  on:input={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                ></textarea>
              </div>
            {/if}
            
            <!-- Explanation -->
            {#if isPracticeMode && currentQuestion.explanation && showExplanation}
              <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 class="font-semibold text-yellow-800 mb-2">Explanation:</h4>
                <p class="text-yellow-700">{currentQuestion.explanation}</p>
              </div>
            {/if}
            
            <!-- Helper Links -->
            {#if isPracticeMode && currentQuestion.helperLinks && currentQuestion.helperLinks.length > 0}
              <div class="mt-4">
                <h4 class="font-semibold text-gray-800 mb-2">Helpful Resources:</h4>
                <div class="space-y-2">
                  {#each currentQuestion.helperLinks as link}
                    <a 
                      href={link.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {link.linkDescription} ({link.linkType})
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Navigation Controls -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              on:click={goBack}
            >
              Exit Test
            </button>
            {#if isPracticeMode}
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                on:click={saveProgress}
              >
                Save Progress
              </button>
              {#if currentQuestion && currentQuestion.explanation}
                <button
                  class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                  on:click={toggleExplanation}
                >
                  {showExplanation ? 'Hide' : 'Show'} Explanation
                </button>
              {/if}
            {/if}
          </div>
          
          <div class="flex gap-2">
            <button
              class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              disabled={isFirstQuestion}
              on:click={goToPreviousQuestion}
            >
              Previous
            </button>
            
            {#if !isLastQuestion}
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                on:click={goToNextQuestion}
              >
                Next
              </button>
            {:else}
              <button
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                disabled={isSubmitting}
                on:click={submitTest}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Question Navigator -->
      <div class="bg-white rounded-lg shadow-md p-4 mt-6">
        <h3 class="font-semibold text-gray-800 mb-3">Question Navigator</h3>
        <div class="grid grid-cols-10 gap-2">
          {#each questions as question, index}
            <button
              class="w-10 h-10 rounded-lg text-sm font-medium transition-colors
                {index === currentQuestionIndex ? 'bg-blue-500 text-white' : 
                 userAnswers[question.id] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
              on:click={() => navigateToQuestion(index)}
            >
              {index + 1}
            </button>
          {/each}
        </div>
        <div class="flex justify-center gap-6 mt-4 text-sm text-gray-600">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            Current
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
            Answered
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-gray-300 rounded mr-2"></div>
            Unanswered
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">No Questions Available</h3>
        <p class="text-gray-500 mb-4">This test doesn't have any questions yet.</p>
        <button 
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          on:click={goBack}
        >
          Go Back
        </button>
      </div>
    {/if}
  </div>
</div>
