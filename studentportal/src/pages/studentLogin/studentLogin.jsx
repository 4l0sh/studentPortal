import { Fragment } from 'react';
import Navbar from '../../components/navbar';
import './studentLogin.css';

const TeacherLogin = () => {
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Login To Your Student Account </h2>
            <form className='loginForm'>
              <input type='email' placeholder='Email Address' />
              <input type='password' placeholder='Password' />
              <button className='loginButton' type='submit'>
                Log In{' '}
              </button>
            </form>
            <hr />
            <p>
              {' '}
              <a href='#'>Forgot Password?</a> reset your password
            </p>

            <p>
              <a href='/signup'>Create Account </a> if you don't have one{' '}
            </p>
          </div>
        </div>
        <div className='footerContainer'>footer</div>
      </div>
    </Fragment>
  );
};

export default TeacherLogin;
