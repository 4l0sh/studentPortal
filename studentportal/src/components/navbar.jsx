import { Fragment } from 'react';

const Navbar = () => {
  return (
    <Fragment>
      <div className='navBar'>
        <div className='navBarTitle'>
          <h2>Student Portal</h2>
        </div>
        <div className='navBarLinks'>
          <a href='#'>Login as a Teacher</a>
          <a href='#'>Home</a>
          <a href='/about'>About</a>
          <a href='#'>Contact</a>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
