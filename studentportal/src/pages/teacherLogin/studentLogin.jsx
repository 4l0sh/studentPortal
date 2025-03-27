import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import './studentLogin.css';

const TeacherLogin = () => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='navBar'>
          <div className='navBarTitle'>
            <h2>Student Portal</h2>
          </div>
          <div className='navBarLinks'>
            <a href='#'>Login as a Teacher</a>
            <a href='#'>Home</a>
            <a href='/about'>About</a>
            <a href='#'>Contact</a>
          </div>
        </div>
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
              <a href='#'>Create Account </a> if you don't have one{' '}
            </p>
          </div>
        </div>
        <div className='footerContainer'>footer</div>
      </div>
    </Fragment>
  );
};

export default TeacherLogin;
