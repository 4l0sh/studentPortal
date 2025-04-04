import { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import './studentHome.css';

const StudentHome = () => {
  const studentHomeLinks = [
    { label: 'Home', href: '/student/home' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const [Assignments, setAssignments] = useState([]);
  const [noAssignments, setNoAssignments] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/student/login';
    }
    fetch('http://localhost:3000/api/studentAssignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'No assignments found') {
          setAssignments([]);
          setNoAssignments(true);
        } else {
          setAssignments(data);
        }
      });
  }, []);

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentHomeLinks} />
        <div className='studentHomeContainer'>
          <div className='joinClass'>
            <h1>Your Assignments</h1>
            <button className='joinClassButton loginButton'>
              Join A Class
            </button>
          </div>
          <div className='assignmentsContainer'>
            {noAssignments && (
              <div className='noAssignments'>
                <h2>No Assignments Found</h2>
                <p>Try joining a class to see assignments</p>
              </div>
            )}
            {Assignments.map((assignment, index) => (
              <div className='studentAssignmentCard' key={index}>
                <h3>{assignment.assignmentName}</h3>
                <p>
                  Assignment added on: <strong>{assignment.addDate}</strong>{' '}
                </p>
                <p>
                  Due Date: <strong>{assignment.dueDate}</strong>{' '}
                </p>
                <p>
                  <a
                    href={`http://localhost:3000/${assignment.filePath}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View Assignment File
                  </a>
                </p>
                <button className='loginButton'>Submit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StudentHome;
