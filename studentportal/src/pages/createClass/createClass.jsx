import { Fragment, useState } from 'react';
import './createClass.css';
const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const submitHandle = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/createClass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({ className, classCode }),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data);
            window.location.href = '/teacher/home';
          });
        } else if (response.status === 400) {
          setErrorMessage('Class already exists');
        } else {
          setErrorMessage('Something went wrong');
        }
      })
      .catch((error) => {
        console.log('Error creating class ', error);
        setErrorMessage('Something went wrong');
      });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='navBar'>
          <div className='navBarTitle'>
            <h2>Create Class</h2>
          </div>
          <div className='navBarLinks'>
            <a href='/about'>About</a>
            <a href='#'>Contact</a>
          </div>
        </div>
        <div className='createClassContainer'>
          <div className='loginCard'>
            <h2>Create Your Class</h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <form className='classForm' onSubmit={(e) => submitHandle(e)}>
              <input
                type='text'
                placeholder='Class Name'
                onChange={(e) => setClassName(e.target.value)}
              />
              <input
                type='text'
                placeholder='Class Code '
                onChange={(e) => setClassCode(e.target.value)}
              />
              <button type='submit'>Create Class</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateClass;
