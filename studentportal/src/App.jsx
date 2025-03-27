import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentLogin from './pages/studentLogin/studentLogin';
import StudentSignup from './pages/studentSignup/studentSignup';
import About from './pages/about/about';
import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path='/' element={<StudentLogin />} />
          <Route path='/signup' element={<StudentSignup />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
