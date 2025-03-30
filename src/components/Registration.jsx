import React from 'react';

function Registration() {
  return (
    <div>
      <h1>Register for an Event</h1>
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Registration; 