import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const TeacherLogin = () => {
  const teacherLoginLinks = [
    { label: 'Student Login', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill all the fields');
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
          setErrorMessage('User does not exist, Please create an account');
        } else if (data.message === 'Incorrect Password') {
          setErrorMessage('Incorrect Password');
        } else {
          sessionStorage.setItem('token', data.token);
          M.toast({ html: 'Login Succesfull', classes: 'green' });
          navigate('/teacher/home');
          fetch('http://localhost:3000/api/getClassCode', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              token: data.token,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.classCode) {
                sessionStorage.setItem('classCode', data.classCode);
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage('Internal server error');
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={teacherLoginLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Log into Your Teacher Account </h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <form className='loginForm' onSubmit={(e) => submitHandler(e)}>
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
        <Footer />
      </div>
    </Fragment>
  );
};

export default TeacherLogin;
