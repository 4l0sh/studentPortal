import { Fragment } from 'react';
import '../studentLogin/studentLogin.css';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
const About = () => {
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
        <div className='aboutContainer'>
          <div className='aboutCard'>
            <h2>About</h2>
            <p>
              This is a simple student portal application that allows students
              to log in to their accounts and access their grades, assignments,
              and other information. The application is built using React and
              React Router.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default About;
