import { Fragment, useState } from 'react';
import Navbar from '../../components/navbar';
import './studentLogin.css';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandle = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill all the fields');
      return;
    }
    fetch('http://localhost:3000/api/teacherLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'User does not exist') {
          alert('User does not exist, Please signup instead');
        } else if (data.message === 'Incorrect Password') {
          alert('Incorrect Password');
        } else {
          alert('Login Succesfull');
          sessionStorage.setItem('token', data.token);
          window.location.href = '/home';
        }
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Login To Your Student Account </h2>
            <form className='loginForm' onSubmit={(e) => submitHandle(e)}>
              <input
                type='email'
                placeholder='Email Address'
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
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
