import { Fragment, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import M from 'materialize-css';
import './studentLogin.css';

const StudentLogin = () => {
  const studentLoginLinks = [
    { label: 'Teacher Login', href: '/teacherLogin' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandle = (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please fill all the fields');
      return;
    }
    
    setIsLoading(true);
    
    fetch('http://localhost:3000/api/studentLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'User does not exist') {
          setErrorMessage('User does not exist, Please signup instead');
        } else if (data.message === 'Incorrect Password') {
          setErrorMessage('Incorrect Password');
        } else {
          M.toast({ html: 'Login Successful', classes: 'green' });
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('studentId', data.studentId);
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
        <Navbar links={studentLoginLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Student Login</h2>
            <p className="loginSubtitle">Welcome back! Please login to your account.</p>
            
            {errorMessage && <div className='errorMessage'>{errorMessage}</div>}
            
            <form className='loginForm' onSubmit={(e) => submitHandle(e)}>
              <div className="formGroup">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="formGroup">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                className={`loginButton ${isLoading ? 'loading' : ''}`} 
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            
            <div className="loginOptions">
              <Link to="/forgot-password" className="forgotPassword">Forgot Password?</Link>
            </div>
            
            <hr />
            
            <div className="signupPrompt">
              <p>Don't have an account? <Link to="/signup" className="signupLink">Create account</Link></p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default StudentLogin;
