import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create a CSS file for styling

const HomePage = () => {
  return (
    <div className="home-page">
        <div>
        <h2>Welcome to the Home Page!</h2>
        </div>
      <div className="centered-text">
        <Link to="/user" className="test-link">
          Click here for testing
        </Link>
      </div>

      <div className="wavy-background">
        <p>Made with ❤️ by Gulrez Alam and HireQuotient</p>
      </div>
    </div>
  );
};

export default HomePage;
