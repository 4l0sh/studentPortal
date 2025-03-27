import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentLogin from './pages/teacherLogin/studentLogin';
import About from './pages/about/about';
import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<StudentLogin />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
