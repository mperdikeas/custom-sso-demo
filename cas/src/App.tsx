import React from 'react';
import { Outlet, Link } from 'react-router-dom';




function App() {
  return (
    <div>
      <h1>CAS &hellip; Central Authentication Server</h1>
      <nav>
        <ul>
          <li>
            <Link to={`/login`}>Login</Link>
          </li>
          <li>
            <Link to={`/change-password`}>Change password</Link>
          </li>
        </ul>
      </nav>
      <Outlet/>
    </div>
  );
}

export default App;
