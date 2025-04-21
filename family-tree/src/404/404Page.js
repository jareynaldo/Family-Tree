import React from 'react';

const PageNotFound = () => {
  const API_URL = 'http://localhost:3000/api';

  return (
    <div style={styles.container}>
      <h1>404 Error</h1>
      <h1>Page Not Found</h1>
      <script>
        console.error(`Page not found`);
      </script>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'HK Grotesk',
    textAlign: 'center',
    padding: '50px',
    backgroundColor: '#FFFFFF',
    color: '#EC5F65', 
    
  },
};

export default PageNotFound;
