import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentLogin from './pages/studentLogin/studentLogin';
import StudentSignup from './pages/studentSignup/studentSignup';
import TeacherSignup from './pages/teacherSignup/teacherSignup';
import TeacherLogin from './pages/teacherLogin/teacherLogin';
import TeacherHome from './pages/teacherHome/teacherHome';
import About from './pages/about/about';
import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<StudentLogin />} />
          <Route path='/signup' element={<StudentSignup />} />
          <Route path='/teacherSignup' element={<TeacherSignup />} />
          <Route path='/teacherLogin' element={<TeacherLogin />} />
          <Route path='/about' element={<About />} />
          <Route path='/teacher/home' element={<TeacherHome />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
