import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './studentHome.css';

const StudentHome = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [noAssignments, setNoAssignments] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [message, setMessage] = useState('');
  const [homeworkFormOpen, setHomeworkFormOpen] = useState({});
  const [viewGrade, setViewGrade] = useState({});
  const [activeTab, setActiveTab] = useState('assignments');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
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
  }, [navigate]);

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
            'Class joined successfully. Please log in again to see assignments'
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
          setMessage(
            data.message || 'Something went wrong while submitting homework'
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Something went wrong while submitting homework');
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='dashboard'>
      <div className='sidebar'>
        <div className='sidebar-header'>
          <h1>
            <span className='logo'>U</span>
            University Portal
          </h1>
        </div>
        <nav className='sidebar-menu'>
          <div className='menu-item active'>
            <i className='fas fa-th-large'></i>
            Dashboard
          </div>
          <div className='menu-item' onClick={handleLogout}>
            <i className='fas fa-sign-out-alt'></i>
            Logout
          </div>
        </nav>
      </div>

      <div className='main-content'>
        <div className='dashboard-header'>
          <div className='welcome-text'>
            <h1>Dashboard</h1>
            <p>Here are your assignments and class information</p>
          </div>
          <div className='header-actions'>
            <button
              className='action-button'
              onClick={() => setFormOpen(!formOpen)}
            >
              <i className='fas fa-plus'></i>
              Join a Class
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`message-banner ${message.includes('successfully') ? 'success' : 'error'}`}
          >
            {message}
          </div>
        )}
        {formOpen && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <h2>Join a Class</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label>Class Code</label>
                  <input
                    type='text'
                    placeholder='Enter class code'
                    onChange={(e) => setClassCode(e.target.value)}
                    required
                  />
                </div>
                <div className='modal-actions'>
                  <button type='submit' className='submit-button'>
                    Join
                  </button>
                  <button
                    type='button'
                    className='cancel-button'
                    onClick={() => setFormOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className='assignments-grid'>
          {noAssignments ? (
            <div className='empty-state'>
              <i className='fas fa-book-open'></i>
              <h2>No Assignments Found</h2>
              <p>Join a class to see assignments</p>
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <div key={index} className='assignment-card'>
                <div className='assignment-header'>
                  <h3>{assignment.assignmentName}</h3>
                  <span className='date-badge'>
                    Added on: {assignment.addDate}
                  </span>
                </div>

                <div className='assignment-content'>
                  <div className='assignment-info'>
                    <p>
                      <i className='fas fa-clock'></i>
                      Due: {assignment.dueDate}
                    </p>
                    <a
                      href={`http://localhost:3000/${assignment.filePath}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='view-file'
                    >
                      <i className='fas fa-file-alt'></i>
                      View Assignment
                    </a>
                  </div>

                  <div className='assignment-actions'>
                    <button
                      className='action-button'
                      onClick={() => {
                        setHomeworkFormOpen((prev) => ({
                          ...prev,
                          [assignment._id]: !prev[assignment._id],
                        }));
                      }}
                    >
                      <i className='fas fa-upload'></i>
                      Submit Homework
                    </button>
                    <button
                      className='action-button secondary'
                      onClick={() => {
                        setViewGrade((prev) => ({
                          ...prev,
                          [assignment._id]: !prev[assignment._id],
                        }));
                      }}
                    >
                      <i className='fas fa-star'></i>
                      View Grade
                    </button>
                  </div>
                </div>

                {homeworkFormOpen[assignment._id] && (
                  <div className='modal-overlay'>
                    <div className='modal-content'>
                      <h2>Submit Homework</h2>
                      <form
                        onSubmit={(e) =>
                          handleHomeworkSubmit(e, assignment._id)
                        }
                      >
                        <div className='form-group'>
                          <label>Choose your file</label>
                          <input type='file' name='homework' required />
                        </div>
                        <div className='modal-actions'>
                          <button type='submit' className='submit-button'>
                            Submit
                          </button>
                          <button
                            type='button'
                            className='cancel-button'
                            onClick={() => {
                              setHomeworkFormOpen((prev) => ({
                                ...prev,
                                [assignment._id]: false,
                              }));
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {viewGrade[assignment._id] && (
                  <div className='modal-overlay'>
                    <div className='modal-content'>
                      <h2>Grade Overview</h2>
                      <div className='grade-info'>
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
                              <div key={i} className='grade-details'>
                                <div className='grade-value'>
                                  <span>Grade</span>
                                  <h3>{submission.grade}</h3>
                                </div>
                                <div className='grade-feedback'>
                                  <span>Feedback</span>
                                  <p>{submission.feedback}</p>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className='no-submission'>
                            You haven't submitted this assignment yet.
                          </p>
                        )}
                        <button
                          className='close-button'
                          onClick={() => {
                            setViewGrade((prev) => ({
                              ...prev,
                              [assignment._id]: false,
                            }));
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
