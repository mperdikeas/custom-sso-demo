import React from 'react';
import { Outlet } from 'react-router-dom';




function App() {
  return (
    <div>
      <h1>CAS &hellip; Central Authentication Server</h1>
      <nav>
        <ul>
          <li>
            <a href={`/login`}>Login</a>
          </li>
          <li>
            <a href={`/change-password`}>Change password</a>
          </li>
        </ul>
      </nav>
      <Outlet/>
    </div>
  );
}

export default App;
