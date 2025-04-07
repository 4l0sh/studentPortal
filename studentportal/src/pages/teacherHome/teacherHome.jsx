'use client';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './teacherHome.css';
import M from 'materialize-css';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export const assignments = [
  { title: 'assignment 1' },
  { title: 'assignment 2' },
  { title: 'assignment3' },
];

const TeacherHome = () => {
  const navigate = useNavigate();
  const teacherHomeLinks = [
    { label: 'Student Login', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [isAddAssignment, setIsAddAssignment] = useState(false);
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showSubmittions, setShowSubmittions] = useState({});
  const [message, setMessage] = useState('');
  const addDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:3000/api/assignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAssignments(data);
      })
      .catch((error) => {
        console.log(error);
        setMessage('Something went wrong while fetching assignments');
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('assignmentName', assignmentName);
    formData.append('dueDate', dueDate);
    formData.append('addDate', addDate);
    formData.append('classCode', sessionStorage.getItem('classCode'));
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('assignmentFile', fileInput.files[0]);

    fetch('http://localhost:3000/api/addAssignment', {
      method: 'POST',
      headers: {
        token: sessionStorage.getItem('token'),
      },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setAssignments(data);
          setIsAddAssignment(false);
          setAssignmentName('');
          setDueDate('');
          setMessage('Assignment added successfully');
          window.location.reload();
        });
      } else {
        setMessage('Something went wrong while adding the assignment');
      }
    });
  };

  const handleGradeSubmit = (e, submissionId, assignmentId) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/gradeSubmission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        assignmentId,
        submissionId,
        grade,
        feedback,
      }),
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setMessage('Grade submitted successfully');
        });
      } else {
        setMessage('Something went wrong while submitting the grade');
      }
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>
            <span className="logo">U</span>
            University Portal
          </h1>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-item active">
            <i className="fas fa-th-large"></i>
            Dashboard
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-text">
            <h1>Teacher Dashboard</h1>
            <p>Manage your assignments and grades here</p>
          </div>
          <div className="header-actions">
            <button 
              className="action-button"
              onClick={() => setIsAddAssignment(!isAddAssignment)}
            >
              <i className="fas fa-plus"></i>
              New Assignment
            </button>
          </div>
        </div>

        {message && (
          <div className={`message-banner ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Add Assignment Modal */}
        {isAddAssignment && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Assignment</h2>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Assignment Name</label>
                  <input
                    type="text"
                    placeholder="Enter assignment name"
                    onChange={(e) => setAssignmentName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Assignment File</label>
                  <input type="file" name="assignmentFile" required />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-button">
                    Add
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsAddAssignment(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments Grid */}
        <div className="assignments-grid">
          {assignments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <h2>No Assignments Found</h2>
              <p>Add a new assignment to get started</p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-header">
                  <h3>{assignment.assignmentName}</h3>
                  <span className="date-badge">
                    Added on: {assignment.addDate}
                  </span>
                </div>
                
                <div className="assignment-content">
                  <div className="assignment-info">
                    <p>
                      <i className="fas fa-clock"></i>
                      Due: {assignment.dueDate}
                    </p>
                    <a
                      href={`http://localhost:3000/${assignment.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-file"
                    >
                      <i className="fas fa-file-alt"></i>
                      View Assignment
                    </a>
                  </div>

                  <div className="assignment-actions">
                    <button
                      className="action-button"
                      onClick={() => {
                        setShowSubmittions((prev) => ({
                          ...prev,
                          [assignment._id]: !prev[assignment._id],
                        }));
                      }}
                    >
                      <i className="fas fa-users"></i>
                      View Submissions
                    </button>
                  </div>
                </div>

                {/* Submissions Modal */}
                {showSubmittions[assignment._id] && (
                  <div className="modal-overlay">
                    <div className="modal-content submissions-modal">
                      <h2>Submissions for {assignment.assignmentName}</h2>
                      <div className="submissions-list">
                        {assignment.submissions.length === 0 ? (
                          <p className="no-submission">
                            No submissions for this assignment yet.
                          </p>
                        ) : (
                          assignment.submissions.map((submission) => (
                            <div key={submission.submissionID} className="submission-card">
                              <div className="submission-header">
                                <h4>{submission.studentName}</h4>
                                <span className="date-badge">
                                  Submitted on: {submission.submissionDate}
                                </span>
                              </div>
                              
                              <div className="submission-content">
                                <a
                                  href={`http://localhost:3000/${submission.filePath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-file"
                                >
                                  <i className="fas fa-file-alt"></i>
                                  View Submission
                                </a>

                                {!submission.grade ? (
                                  <form 
                                    className="grade-form"
                                    onSubmit={(e) => handleGradeSubmit(e, submission.submissionID, assignment._id)}
                                  >
                                    <div className="form-group">
                                      <label>Grade</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        step="0.1"
                                        placeholder="Enter grade"
                                        onChange={(e) => setGrade(e.target.value)}
                                        required
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label>Feedback</label>
                                      <textarea
                                        placeholder="Enter feedback"
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                      ></textarea>
                                    </div>
                                    <button type="submit" className="submit-button">
                                      Submit Grade
                                    </button>
                                  </form>
                                ) : (
                                  <div className="grade-details">
                                    <div className="grade-value">
                                      <span>Grade</span>
                                      <h3>{submission.grade}</h3>
                                    </div>
                                    <div className="grade-feedback">
                                      <span>Feedback</span>
                                      <p>{submission.feedback}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <button
                        className="close-button"
                        onClick={() => {
                          setShowSubmittions((prev) => ({
                            ...prev,
                            [assignment._id]: false,
                          }));
                        }}
                      >
                        Close
                      </button>
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

export default TeacherHome;
