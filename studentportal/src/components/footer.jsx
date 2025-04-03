import { Fragment } from 'react';

const Footer = () => {
  return (
    <Fragment>
      <div className='footerContainer'>
        <div
          className='footerContent'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '70%',
          }}
        >
          <p>&copy; 2023 Student Portal. All rights reserved.</p>
          <div
            className='socialMediaLinks'
            style={{
              display: 'flex',
              gap: '15px',
            }}
          >
            <p
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Terms and Conditions
            </p>
            <p
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
