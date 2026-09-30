import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Play, FileText, Book, Clock, CheckCircle, Loader, HelpCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import QuizComponent from './QuizRenderer';

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Learning = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [progress, setProgress] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  // const [selectedAnswers, setSelectedAnswers] = useState({});

  // ⚠️ Replace this with actual logged-in userId from context/auth
  const userId = "64f4a3c1f6a8c8b123456789"; 

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/learning/${courseId}`);
      setCourseData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await api.get(`/progress/${userId}/${courseId}`);
      const completed = res.data.completedLessons.reduce((acc, lessonId) => {
        acc[lessonId] = true;
        return acc;
      }, {});
      setCompletedLessons(completed);
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
      fetchProgress();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseData?.modules?.length > 0) {
      const firstModule = courseData.modules[0];
      setExpandedModules({ [firstModule._id]: true });
      if (firstModule.lessons?.length > 0) {
        setSelectedLesson(firstModule.lessons[0]);
      }
    }
  }, [courseData]);

  useEffect(() => {
    const totalLessons = courseData?.modules?.reduce(
      (total, module) => total + (module.lessons?.length || 0), 
      0
    ) || 0;
    const completed = Object.keys(completedLessons).length;
    setProgress(totalLessons > 0 ? (completed / totalLessons) * 100 : 0);
  }, [completedLessons, courseData]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizResults({});
  };

  // ✅ Backend call to mark lesson complete
  const markLessonComplete = async (lessonId) => {
    try {
      await api.post(`/progress/complete`, { userId, courseId, lessonId });
      setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4 text-red-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'quiz': return <HelpCircle className="w-4 h-4 text-purple-500" />;
      default: return <Book className="w-4 h-4 text-green-500" />;
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`${currentQuizIndex}-${questionIndex}`]: answerIndex
    }));
  };

  // ✅ Submit quiz + update backend if passed
  const submitQuiz = async () => {
    if (!selectedLesson?.quizzes?.[currentQuizIndex]) return;
    
    const quiz = selectedLesson.quizzes[currentQuizIndex];
    const results = {};
    let correctAnswers = 0;

    quiz.questions.forEach((question, index) => {
      console.log(selectedAnswers,"selectedAnswers");
      const selectedAnswer = selectedAnswers[`${currentQuizIndex}-${index}`];
      console.log(selectedAnswer,question,"selectedAnswer");
      const isCorrect = selectedAnswer === question.correctAnswerIndex;
      results[index] = {
        selected: selectedAnswer,
        correct: question.correctAnswerIndex,
        isCorrect
      };
      if (isCorrect) correctAnswers++;
    });

    const score = (correctAnswers / quiz.questions.length) * 100;
    setQuizResults({
      ...results,
      score,
      total: quiz.questions.length,
      correct: correctAnswers
    });
    console.log("Quiz Results:", results, "Score:", score);
    if (score >= 70) {
      await markLessonComplete(selectedLesson._id);
    }
  };

  const nextQuiz = () => {
    if (selectedLesson?.quizzes && currentQuizIndex < selectedLesson.quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswers({});
      setQuizResults({});
    }
  };

  const prevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
      setSelectedAnswers({});
      setQuizResults({});
    }
  };

  // ... (renderLessonContent remains same except markLessonComplete now calls backend)

  const renderLessonContent = () => {
    if (!selectedLesson) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Select a lesson to begin learning</p>
          </div>
        </div>
      );
    }

    const { type, content, videoUrl, pdfUrl, title } = selectedLesson;

    switch (type) {
      case 'quiz':
        return (
          <>
           <CheckCircle className="w-4 h-4" />
               <span 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  completedLessons[selectedLesson._id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
               >
               
               {completedLessons[selectedLesson._id] ? 'Completed' : 'Mark Complete'}
         </span> 
          <QuizComponent
            quiz={selectedLesson.quizzes[currentQuizIndex]}
            currentQuizIndex={currentQuizIndex}
            totalQuizzes={selectedLesson.quizzes.length}
            onPrevQuiz={prevQuiz}
            onNextQuiz={nextQuiz}
            handleQuiz={handleQuizAnswer}
            onQuizComplete={submitQuiz}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
          />
          </>
        );

      case 'video':
      case 'pdf':
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={() => markLessonComplete(selectedLesson._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  completedLessons[selectedLesson._id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {completedLessons[selectedLesson._id] ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            {/* Conditional rendering for video/pdf/text */}
            {type === 'video' && videoUrl && (
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video className="w-full h-auto" controls src={videoUrl}></video>
              </div>
            )}

            {type === 'pdf' && pdfUrl && (
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={`${import.meta.env.VITE_API_UPLOAD_URL}/lessons/${pdfUrl}`}
                  className="w-full h-screen"
                  title={title}
                />
              </div>
            )}

            {content && (
              <div className="prose max-w-none bg-white p-6 rounded-lg border">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{courseData.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{courseData.category}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-blue-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Modules & Lessons */}
        <div className="flex-1 overflow-y-auto">
          {courseData.modules?.map((module) => (
            <div key={module._id} className="border-b border-gray-100">
              <button
                onClick={() => toggleModule(module._id)}
                className="w-full p-4 text-left flex justify-between hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{module.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{module.lessons?.length || 0} lessons</p>
                </div>
                {expandedModules[module._id] 
                  ? <ChevronDown className="w-4 h-4 text-gray-400" /> 
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>

              {expandedModules[module._id] && (
                <div className="pb-2">
                  {module.lessons?.map((lesson) => (
                    <button
                      key={lesson._id}
                      onClick={() => selectLesson(lesson)}
                      className={`w-full p-3 pl-8 flex justify-between hover:bg-blue-50 ${
                        selectedLesson?._id === lesson._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {getLessonIcon(lesson.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            selectedLesson?._id === lesson._id ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatDuration(lesson.duration)}</span>
                          </div>
                        </div>
                      </div>
                      {completedLessons[lesson._id] && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">{renderLessonContent()}</div>
      </div>
    </div>
  );
};

export default Learning;
