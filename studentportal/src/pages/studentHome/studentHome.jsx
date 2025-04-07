import { Fragment, useState, useEffect } from 'react';
import Navbar from '../../components/navbar';
import './studentHome.css';

const StudentHome = () => {
  const studentHomeLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const [Assignments, setAssignments] = useState([]);
  const [noAssignments, setNoAssignments] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [homeworkFormOpen, setHomeworkFormOpen] = useState({});
  const [viewGrade, setViewGrade] = useState(false);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/joinClass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        classCode: classCode,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Class joined successfully') {
          setFormOpen(false);
          setMessage(
            'Class joined successfully login again to see assignments'
          );
        }
      });
  };
  const handleHomeworkSubmit = (e, assignmentId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('homework', e.target.homework.files[0]);
    formData.append('assignmentId', assignmentId);
    fetch('http://localhost:3000/api/submitHomework', {
      method: 'POST',
      headers: {
        token: sessionStorage.getItem('token'),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Homework submitted successfully') {
          setMessage('Homework submitted successfully');
          setHomeworkFormOpen((prev) => ({
            ...prev,
            [assignmentId]: false,
          }));
        } else {
          setMessage(data.message || 'Something went wrong');
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Something went wrong');
      });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={studentHomeLinks} />
        <div className='studentHomeContainer'>
          <div className='joinClass'>
            <h1>Your Assignments</h1>
            <p
              style={{
                color:
                  message ===
                  'Class joined successfully login again to see assignments'
                    ? 'green'
                    : 'red',
                fontSize: '1.2rem',
              }}
            >
              {message}
            </p>
            <button
              className='joinClassButton loginButton'
              onClick={() => setFormOpen(!formOpen)}
            >
              Join A Class
            </button>
          </div>
          {formOpen && (
            <div className='joinClassFormContainer'>
              <form className='joinClassForm' onSubmit={(e) => handleSubmit(e)}>
                <h2>Join A Class</h2>
                <input
                  type='text'
                  placeholder='Class Code'
                  onChange={(e) => setClassCode(e.target.value)}
                />
                <button type='submit' className='joinButton'>
                  Join
                </button>
                <button
                  className='close'
                  onClick={() => setFormOpen(!formOpen)}
                >
                  Close{' '}
                </button>
              </form>
            </div>
          )}

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
                <button
                  className='loginButton'
                  onClick={() => {
                    setHomeworkFormOpen((prev) => ({
                      ...prev,
                      [assignment._id]: !prev[assignment._id],
                    }));
                  }}
                >
                  Submit Homework
                </button>

                {homeworkFormOpen[assignment._id] && (
                  <form
                    className='homeworkForm'
                    onSubmit={(e) => handleHomeworkSubmit(e, assignment._id)}
                  >
                    <input type='file' name='homework' />
                    <button type='submit'>Upload</button>
                    <button
                      className='close'
                      onClick={() => {
                        setHomeworkFormOpen((prev) => ({
                          ...prev,
                          [assignment._id]: false,
                        }));
                      }}
                    >
                      close
                    </button>
                  </form>
                )}
                <button
                  className='loginButton'
                  onClick={() => {
                    setViewGrade((prev) => ({
                      ...prev,
                      [assignment._id]: !prev[assignment._id],
                    }));
                  }}
                >
                  See Grade
                </button>
                {viewGrade[assignment._id] && (
                  <div className='homeworkForm'>
                    <h3>Grade</h3>
                    {assignment.submissions &&
                    assignment.submissions.some(
                      (submission) =>
                        submission.studentId ===
                        sessionStorage.getItem('studentId')
                    ) ? (
                      assignment.submissions
                        .filter(
                          (submission) =>
                            submission.studentId ===
                            sessionStorage.getItem('studentId')
                        )
                        .map((submission, i) => (
                          <div key={i}>
                            <p>
                              <strong>Grade:</strong> {submission.grade}
                            </p>
                            <p>
                              <strong>Feedback:</strong> {submission.feedback}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p>You have not submitted this assignment yet.</p>
                    )}
                    <button
                      className='close'
                      onClick={() => {
                        setViewGrade((prev) => ({
                          ...prev,
                          [assignment._id]: false,
                        }));
                      }}
                    >
                      close
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default StudentHome;
