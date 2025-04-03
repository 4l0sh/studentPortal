import { Fragment } from 'react';

const Navbar = ({ links }) => {
  return (
    <Fragment>
      <div className='navBar'>
        <div className='navBarTitle'>
          <h2>Student Portal</h2>
        </div>
        <div className='navBarLinks'>
          {links.map((link, index) => (
            <a key={index} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
