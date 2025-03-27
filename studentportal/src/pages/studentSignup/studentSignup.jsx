import { Fragment, useState } from 'react';
import Navbar from '../../components/navbar';
const StudentSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    const student = {
      name: name,
      email: email,
      password: password,
    };
    console.log(student);
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Sign Up for a Student Acoount </h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
              <input
                type='text'
                placeholder='Full Name'
                onChange={(e) => setName(e.target.value)}
              />
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
              <input
                type='password'
                placeholder='Confirm Password'
                onChange={(e) => setConfirmPassword(e.target.value)}
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
        <div className='footerContainer'>footer</div>
      </div>
    </Fragment>
  );
};

export default StudentSignup;
