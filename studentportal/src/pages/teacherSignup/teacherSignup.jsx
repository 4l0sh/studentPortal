import { Fragment } from 'react';
import Navbar from '../../components/navbar';

const TeacherSignup = () => {
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Sign Up for a Teacher Account</h2>
            <form className='loginForm'>
              <input type='text' placeholder='Full Name ' />
              <input type='text' placeholder='Email' />
              <input type='password' placeholder='Password' />
              <input type='password' placeholder='Confirm Password' />
              <input type='text' placeholder='Secret Code' />
              <button className='loginButton' type='submit'>
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherSignup;
