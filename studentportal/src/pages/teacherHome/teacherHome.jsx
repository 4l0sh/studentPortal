import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import './teacherHome.css';
import M from 'materialize-css';

const TeacherHome = () => {
  const [assignments, setAssignments] = useState([]);
  const [isAddAssignment, setIsAddAssignment] = useState(false);
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
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
    console.log(assignmentName, dueDate);
    console.log(addDate);
    fetch('http://localhost:3000/api/addAssignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        assignmentName,
        dueDate,
        addDate,
      }),
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
      } else if (response.status === 400) {
        M.toast({ html: 'Assignment already exists', classes: 'red' });
      } else {
        M.toast({ html: 'Something went wrong', classes: 'red' });
      }
    });
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='navBar'>
          <div className='navBarTitle'>
            <h2>Your Class </h2>
          </div>
          <div className='navBarLinks'>
            <a href='/about'>About</a>
            <a href='#'>Contact</a>
          </div>
        </div>
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
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherHome;
