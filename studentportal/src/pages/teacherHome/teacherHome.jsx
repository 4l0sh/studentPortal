'use client';
import { Fragment, useEffect, useState } from 'react';
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
  const addDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchAssignments = async () => {
      fetch('http://localhost:3000/api/assignments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: sessionStorage.getItem('token'),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAssignments(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchAssignments();
  }, []);

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
          M.toast({ html: 'Assignment Added', classes: 'green' });
          window.location.reload();
        });
      } else {
        M.toast({ html: 'Something went wrong', classes: 'red' });
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
          setAssignments(data);
          setGrade('');
          setFeedback('');
          M.toast({ html: 'Grade Submitted', classes: 'green' });
        });
      } else {
        M.toast({ html: 'Something went wrong', classes: 'red' });
      }
    });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <Navbar links={teacherHomeLinks} />
        <div className='assignmentsHeader'>
          <h2>Your Assignments</h2>
          <button
            className='addAssignmentButton'
            onClick={() => setIsAddAssignment(!isAddAssignment)}
          >
            Add Assignment
          </button>
        </div>

        {isAddAssignment && (
          <div className='addAssignmentContainer'>
            <form
              className='addAssignmentForm'
              onSubmit={(e) => handleSubmit(e)}
              encType='multipart/form-data'
            >
              <input
                type='text'
                placeholder='Assignment Name '
                onChange={(e) => setAssignmentName(e.target.value)}
              />
              <label htmlFor='date'>Select due date</label>
              <input
                type='date'
                placeholder='Select due date'
                onChange={(e) => setDueDate(e.target.value)}
              />
              <label htmlFor='description'>Select a description file</label>
              <input type='file' name='assignmentFile' />
              <button className='addAssignmentButton'>Add Assignment</button>
              <button
                className='closeButton'
                onClick={() => setIsAddAssignment(!isAddAssignment)}
              >
                cancel
              </button>
            </form>
          </div>
        )}

        <div className='assignmentsContainer'>
          {assignments.map((assignment) => {
            return (
              <div key={assignment._id} className='assignmentCard'>
                <h3>{assignment.assignmentName}</h3>
                <p>
                  <strong>Due: </strong>
                  {assignment.dueDate}
                </p>
                <p>
                  <strong>Added: </strong>
                  {assignment.addDate}
                </p>
                {assignment.filePath && (
                  <a
                    href={`http://localhost:3000/${assignment.filePath}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    View Description File
                  </a>
                )}
                <button
                  className='loginButton'
                  onClick={() => {
                    setShowSubmittions((prev) => ({
                      ...prev,
                      [assignment._id]: !prev[assignment._id],
                    }));
                  }}
                >
                  Show Submittions{' '}
                </button>

                {showSubmittions[assignment._id] && (
                  <div className='submittionsCard'>
                    <h3>Submissions</h3>
                    <div className='submissionsContent'>
                      {assignment.submissions.length === 0 && (
                        <p>No Submissions Yet</p>
                      )}
                      {assignment.submissions.map((submission) => {
                        return (
                          <div
                            key={submission.submissionID}
                            className='submissionCard'
                          >
                            <p>
                              <strong>Submitted By:</strong>{' '}
                              {submission.studentName}
                            </p>
                            <p>
                              <strong>Submitted On:</strong>{' '}
                              {submission.submissionDate}
                            </p>
                            {submission.filePath && (
                              <a
                                href={`http://localhost:3000/${submission.filePath}`}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                View Submission File
                              </a>
                            )}
                            {!submission.grade ? (
                              <form
                                className='marksForm'
                                onSubmit={(e) =>
                                  handleGradeSubmit(
                                    e,
                                    submission.submissionID,
                                    assignment._id
                                  )
                                }
                              >
                                <label htmlFor='marks'>Grade</label>
                                <input
                                  type='number'
                                  name='marks'
                                  placeholder='Enter Marks'
                                  onChange={(e) => setGrade(e.target.value)}
                                />
                                <label htmlFor='feedback'>Feedback</label>
                                <textarea
                                  name='feedback'
                                  placeholder='Enter Feedback'
                                  onChange={(e) => setFeedback(e.target.value)}
                                ></textarea>
                                <button type='submit' className='loginButton'>
                                  Submit Grade
                                </button>
                              </form>
                            ) : (
                              <div className='marksCard'>
                                <p>
                                  <strong>Grade: </strong>
                                  {submission.grade}
                                </p>
                                <p>
                                  <strong>Feedback: </strong>
                                  {submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <button
                        className='submissionButton'
                        onClick={() =>
                          setShowSubmittions((prev) => ({
                            ...prev,
                            [assignment._id]: false,
                          }))
                        }
                      >
                        close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default TeacherHome;
