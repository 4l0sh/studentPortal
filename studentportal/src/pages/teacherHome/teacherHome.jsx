import { Fragment, useEffect, useState } from 'react';
import './teacherHome.css';

const TeacherHome = () => {
  const [assignments, setAssignments] = useState([]);
  const [isAddAssignment, setIsAddAssignment] = useState(false);
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const addDate = new Date().toISOString().split('T')[0];
  const teacherId = sessionStorage.getItem('teacherId');

  useEffect(() => {
    fetch('http://localhost:3000/api/assignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        teacherId: teacherId,
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
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(assignmentName, dueDate);
    console.log(addDate);
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
                <p>{assignment.dueDate}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherHome;
