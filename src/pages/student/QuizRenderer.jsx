// QuizComponent.jsx
import React, { useState } from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

const QuizComponent = ({ 
  quiz, 
  currentQuizIndex, 
  totalQuizzes,
  onPrevQuiz,
  onNextQuiz,
  handleQuiz,
  onQuizComplete,
 
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, qIndex) => {
      if (selectedAnswers[qIndex] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const total = quiz.questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 70;
    
    const results = { correct, total, score, passed };
    setQuizResults(results);
    
    if (passed) {
      onQuizComplete();
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setQuizResults(null);
  };

  const allQuestionsAnswered = quiz.questions.every(
    (_, index) => selectedAnswers[index] !== undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            {quiz.title}
          </h3>
          <p className="text-sm text-gray-600">
            Quiz {currentQuizIndex + 1} of {totalQuizzes}
          </p>
        </div>
        
        {totalQuizzes > 1 && (
          <div className="flex gap-2">
            <button
              onClick={onPrevQuiz}
              disabled={currentQuizIndex === 0}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={onNextQuiz}
              disabled={currentQuizIndex === totalQuizzes - 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {quizResults && (
        <div className={`p-4 rounded-lg ${
          quizResults.passed 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <h4 className={`font-semibold ${
            quizResults.passed ? 'text-green-800' : 'text-red-800'
          }`}>
            {quizResults.passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h4>
          <p className={quizResults.passed ? 'text-green-700' : 'text-red-700'}>
            Score: {quizResults.correct}/{quizResults.total} ({quizResults.score}%)
          </p>
        </div>
      )}

      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => {
          const selected = selectedAnswers[qIndex];
          const isCorrect = quizResults && selected === question.correctAnswerIndex;
          const isWrong = quizResults && selected !== undefined && 
                         selected !== question.correctAnswerIndex;

          return (
            <div key={qIndex} className="p-6 bg-white border rounded-lg">
              <h4 className="font-medium text-gray-800 mb-4">
                {qIndex + 1}. {question.question}
              </h4>
              
              <div className="space-y-2">
                {question.options.map((option, optIndex) => {
                  let optionClass = "w-full p-3 text-left border rounded-lg transition-colors ";
                  
                  if (quizResults) {
                    if (optIndex === question.correctAnswerIndex) {
                      optionClass += "bg-green-50 border-green-200 text-green-800";
                    } else if (selected === optIndex && isWrong) {
                      optionClass += "bg-red-50 border-red-200 text-red-800";
                    } else {
                      optionClass += "bg-gray-50 border-gray-200 text-gray-600";
                    }
                  } else {
                    optionClass += selected === optIndex
                      ? "bg-blue-50 border-blue-300 text-blue-800"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => !quizResults && handleAnswerSelect(qIndex, optIndex)}
                      disabled={quizResults}
                      className={optionClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quizResults && optIndex === question.correctAnswerIndex && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!quizResults ? (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        </div>
      ) : !quizResults.passed && (
        <div className="flex justify-center">
          <button
            onClick={handleRetake}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;