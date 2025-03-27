import { Fragment } from 'react';
import Navbar from '../../components/navbar';

const TeacherLogin = () => {
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Log into Your Teacher account </h2>
            <form className='loginForm'>
              <input type='email' placeholder='Email Address' />
              <input type='password' placeholder='Password' />
              <button className='loginButton' type='submit'>
                Log In
              </button>
            </form>
            <hr />
            <p>
              Don't have an account ?{' '}
              <a href='/teacherSignup'>Create account</a>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherLogin;
