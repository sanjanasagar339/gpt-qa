import React, { useEffect, useState } from 'react';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [quizComplete, setQuizComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // Control feedback display

  // Fetch quiz data from the API
  useEffect(() => {
    fetch("http://localhost:5000/api/questions") // Ensure this URL matches your backend endpoint
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
        } else {
          throw new Error("Invalid response structure from backend");
        }
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  const handleAnswerSelection = (index) => {
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer; // Adjusted to match the structure

    if (currentQuestion.options[selectedAnswer] === correctAnswer) {
      setFeedback("Correct! 😊");
    } else {
      setFeedback(`Wrong answer! 😞 The correct answer is: ${correctAnswer}`);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestionIndex + 1 === questions.length) {
        setQuizComplete(true);
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
      setFeedback("");
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 2000); // Wait 2 seconds before moving to the next question
  };

  if (!questions.length) {
    return <div>Loading questions...</div>;
  }

  if (quizComplete) {
    return <div>Quiz complete! 🎉 Thanks for participating.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="App">
      <h1>Financial Accounting Quiz</h1>
      <div className="question">{currentQuestion.question}</div>
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <label key={index} style={{ display: 'block', margin: '8px 0' }}>
            <input
              type="radio"
              name="answer"
              value={index}
              onChange={() => handleAnswerSelection(index)}
              checked={selectedAnswer === index}
              disabled={showFeedback} // Disable selection after submission
            />
            <span
              style={{
                backgroundColor:
                  showFeedback && index === currentQuestion.options.indexOf(currentQuestion.answer)
                    ? 'lightgreen'
                    : showFeedback && selectedAnswer === index
                    ? 'lightcoral'
                    : '',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              {String.fromCharCode(65 + index)}) {option}
            </span>
          </label>
        ))}
      </div>
      <button onClick={submitAnswer} disabled={selectedAnswer === null || showFeedback}>
        Submit
      </button>
      <div className="feedback" style={{ color: feedback.includes("Correct") ? 'green' : 'red' }}>
        {feedback}
      </div>
    </div>
  );
};

export default App;
