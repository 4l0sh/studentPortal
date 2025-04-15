import { Fragment, useState } from 'react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import emailjs from '@emailjs/browser';
import M from 'materialize-css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [code, setCode] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(randomCode);
    const PUBLIC_KEY = import.meta.env.VITE_PASSWORD_PUBLIC_KEY;
    const SERVICE_ID = import.meta.env.VITE_PASSWORD_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_PASSWORD_TEMPLATE_ID;
    const templateParams = {
      to_email: email,
      code: randomCode,
    };
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log('Email sent successfully!', response.status, response.text);
        M.toast({ html: 'Code sent successfully!', classes: 'green' });
        setIsFormOpen(true);
      },
      (error) => {
        console.error('Error sending email:', error);
        setErrorMessage('Failed to send code. Please try again later.');
      }
    );
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode === '') {
      setErrorMessage('Please enter the verification code');
      return;
    }
    if (verificationCode !== code) {
      setErrorMessage('Incorrect verification code');
      return;
    }
    fetch('http://localhost:3000/api/oneTimeCode/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'User does not exist') {
          setErrorMessage('User does not exist');
          return;
        }
        if (data.status === 200) {
          M.toast({ html: 'Code verified successfully!', classes: 'green' });
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('studentId', data.studentId);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Failed to verify code. Please try again later.');
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar
          links={[
            { label: 'Teacher Login', href: '/teacherLogin' },
            { label: 'Student Login', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Forgot Password</h2>
            <p className='errorMsg'>{errorMessage}</p>
            <p>Please enter your email address to send a one-time Code</p>
            <form className='loginForm' onSubmit={(e) => handleEmailSubmit(e)}>
              <div className='input-field'>
                <input
                  type='email'
                  id='email'
                  required
                  placeholder='Email Address'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type='submit' className='loginButton'>
                Send Code
              </button>
            </form>
            {isFormOpen && (
              <form
                className='loginForm'
                style={{ marginTop: '20px' }}
                onSubmit={(e) => handleCodeSubmit(e)}
              >
                <input
                  type='text'
                  placeholder='Enter Verification Code'
                  className='codeInput'
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button type='submit' className='loginButton'>
                  Submit Code
                </button>
              </form>
            )}
            <p className='backToLogin'>
              Remembered your password? <a href='/'>Back to Login</a>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
