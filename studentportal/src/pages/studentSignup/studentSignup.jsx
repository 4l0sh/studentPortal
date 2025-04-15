import { Fragment, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import M from 'materialize-css';
import './studentSignup.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthText, setPasswordStrengthText] = useState('');

  // Check password strength
  useEffect(() => {
    if (password) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isLongEnough = password.length >= 8;

      const strength = [
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        isLongEnough,
      ].filter(Boolean).length;

      if (strength <= 2) {
        setPasswordStrength('weak');
        setPasswordStrengthText('Weak password');
      } else if (strength <= 4) {
        setPasswordStrength('medium');
        setPasswordStrengthText('Medium strength password');
      } else {
        setPasswordStrength('strong');
        setPasswordStrengthText('Strong password');
      }
    } else {
      setPasswordStrength('');
      setPasswordStrengthText('');
    }
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate form
    if (!name || !email || !password || !confirmPassword || !classCode) {
      setErrorMessage('Please fill all the fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    fetch('http://localhost:3000/api/studentSignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, classCode }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'User already exists') {
          setErrorMessage('User already exists, Please login instead');
        } else {
          M.toast({ html: 'Signup Successful', classes: 'green' });
          sessionStorage.setItem('token', data.token);
          navigate('/student/home');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentSignupLinks} />
        <div className='signupContainer'>
          <div className='signupCard'>
            <h2>Create Student Account</h2>
            <p className='signupSubtitle'>Join our learning community today</p>

            {errorMessage && <div className='errorMessage'>{errorMessage}</div>}

            <form className='signupForm' onSubmit={(e) => handleSubmit(e)}>
              <div className='formGroup'>
                <label htmlFor='name'>Full Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter your full name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='formGroup'>
                <label htmlFor='email'>Email Address</label>
                <input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='formGroup'>
                <label htmlFor='password'>Password</label>
                <input
                  id='password'
                  type='password'
                  placeholder='Create a password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password && (
                  <>
                    <div className='passwordStrength'>
                      <div
                        className={`passwordStrengthBar strength-${passwordStrength}`}
                      ></div>
                    </div>
                    <div className='passwordStrengthText'>
                      {passwordStrengthText}
                    </div>
                  </>
                )}
              </div>

              <div className='formGroup'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className='formGroup'>
                <label htmlFor='classCode'>Class Code</label>
                <input
                  id='classCode'
                  type='text'
                  placeholder='Enter your class code'
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  required
                />
                <div className='classCodeInfo'>
                  Ask your teacher for the class code if you don't have it
                </div>
              </div>

              <button
                className={`loginButton ${isLoading ? 'loading' : ''}`}
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <hr />

            <div className='signupPrompt'>
              <p>
                Already have an account?{' '}
                <Link to='/' className='loginLink'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default StudentSignup;
