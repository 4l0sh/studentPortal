import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import M from 'materialize-css';
import './studentLogin.css';

const TeacherLogin = () => {
  const studentLoginLinks = [
    { label: 'Teacher Login', href: '/teacherLogin' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
          setErrorMessage('User does not exist, Please signup instead');
        } else if (data.message === 'Incorrect Password') {
          setErrorMessage('Incorrect Password');
        } else {
          M.toast({ html: 'Login Succesfull', classes: 'green' });
          sessionStorage.setItem('token', data.token);
          navigate('/student/home');
        }
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentLoginLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Log into Your Student Account </h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
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
              Don't have an account ? <a href='/signup'> Create account </a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default TeacherLogin;
