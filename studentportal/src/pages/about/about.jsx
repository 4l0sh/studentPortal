import { Fragment } from 'react';
import '../teacherLogin/studentLogin.css';

const About = () => {
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='navBar'>
          <div className='navBarTitle'>
            <h2>Student Portal</h2>
          </div>
          <div className='navBarLinks'>
            <a href='#'>Login as a Teacher</a>
            <a href='/'>Login as a Student</a>
            <a href='/about'>About</a>
            <a href='#'>Contact</a>
          </div>
        </div>{' '}
        <div className='aboutContainer'>
          <div className='aboutCard'>
            <h2>About</h2>
            <p>
              This is a simple student portal application that allows students
              to log in to their accounts and access their grades, assignments,
              and other information. The application is built using React and
              React Router.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default About;
