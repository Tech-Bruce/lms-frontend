import React from 'react'
import ModuleForm from './ModuleForm';
import LessonForm from './LessonForm';
import QuizForm from './QuizForm';

const Builder = () => {
  return (
    <div>
      <ModuleForm/>
      <LessonForm/>
        <QuizForm/>
    </div>
  )
}

export default Builder;
