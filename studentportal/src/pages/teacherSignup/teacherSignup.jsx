import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import M from 'materialize-css';

const TeacherSignup = () => {
  const teacherSignupLinks = [
    { label: 'Student Login', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [code, setCode] = useState('');
  const secretCode = '123456';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (code !== secretCode) {
      setErrorMessage('Invalid secret code');
      return;
    }
    if (code === secretCode) {
      fetch('http://localhost:3000/api/teacherSignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'User already exists') {
            setErrorMessage('User already exists, Please login instead');
          } else {
            M.toast({ html: 'Signup Succesfull', classes: 'green' });
            sessionStorage.setItem('token', data.token);
            navigate('/createClass');
          }
        })
        .catch((error) => {
          console.log('Error signing up ', error);
        });
    }
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={teacherSignupLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Sign Up for a Teacher Account</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
              <input
                type='text'
                placeholder='Full Name '
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type='text'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type='password'
                placeholder='Confirm Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <input
                type='text'
                placeholder='Secret Code'
                onChange={(e) => setCode(e.target.value)}
              />
              <button className='loginButton' type='submit'>
                Sign Up
              </button>
              <hr
                style={{
                  margin: '0px',
                }}
              />
              <p style={{ margin: '0px' }}>
                already have an account ? <a href='/teacherLogin'>Log in</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherSignup;
