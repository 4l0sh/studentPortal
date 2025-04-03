import { Fragment, useState } from 'react';
import Navbar from '../../components/navbar';
import dotenv from 'dotenv';
import emailjs from '@emailjs/browser';
import M from 'materialize-css';
import Footer from '../../components/footer';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const contactPageLinks = [
    { label: 'Teacher Login', href: '/teacherLogin' },
    { label: 'Student Login', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_name: 'Ali',
    };
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);

        M.toast({ html: 'Message sent successfully!', classes: 'green' });
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setErrorMessage('Failed to send message. Please try again later.');
      });
  };
  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={contactPageLinks} />
        <div className='loginContainer'>
          <div className='loginCard'>
            <h2>Contact Us</h2>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <p>If you have any questions, feel free to reach out!</p>
            <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
              <input
                type='text'
                placeholder='Your Name'
                required
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type='email'
                placeholder='Your Email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                style={{
                  height: '100px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                placeholder='Your Message'
                required
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button type='submit' className='loginButton'>
                Send Message
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Contact;
