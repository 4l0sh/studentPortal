import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import M from 'materialize-css';
const StudentSignup = () => {
  const studentSignupLinks = [
    { label: 'Teacher Login', href: '/teacherLogin' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classCode, setClassCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill all the fields');
      return;
    }
    fetch('http://localhost:3000/api/studentSignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, classCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'User already exists') {
          setErrorMessage('User already exists, Please login instead');
        } else {
          M.toast({ html: 'Signup Succesfull', classes: 'green' });
          sessionStorage.setItem('token', data.token);
          navigate('/student/home');
        }
      });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentSignupLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Sign Up for a Student Acoount </h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
              <input
                type='text'
                placeholder='Full Name'
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type='email'
                placeholder='Email Address'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type='password'
                placeholder='Confirm Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <input
                type='text'
                placeholder='Class Code'
                required
                onChange={(e) => setClassCode(e.target.value)}
              />
              <button className='loginButton' type='submit'>
                Sign Up{' '}
              </button>
            </form>
            <hr />
            <p>
              Already have an Account ? <a href='/'>Login</a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default StudentSignup;
