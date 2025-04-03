import { Fragment, useState } from 'react';
import Navbar from '../../components/navbar';
import './createClass.css';
const CreateClass = () => {
  const createClassLinks = [
    { label: 'Student Login', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
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
            sessionStorage.setItem('classCode', classCode);
            window.location.href = '/teacher/home';
          });
        } else if (response.status === 400) {
          setErrorMessage('Class Code already exists');
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
        <Navbar links={createClassLinks} />
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
