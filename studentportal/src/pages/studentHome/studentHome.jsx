import { Fragment } from 'react';
import Navbar from '../../components/navbar';
import { assignments } from '../teacherHome/teacherHome';
import './studentHome.css';

const StudentHome = () => {
  const studentHomeLinks = [
    { label: 'Home', href: '/student/home' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentHomeLinks} />
        <div className='classCodeInput'></div>
        <div className='studentCard'>
          <h2>Uploaded Assignments</h2>
          <div className='assignmentCards'>
            {assignments.map((assignment, index) => (
              <div key={index} className='assignmentCard'>
                <h3>{assignment.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StudentHome;
