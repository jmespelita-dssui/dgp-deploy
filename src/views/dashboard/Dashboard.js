import React, { useState, useEffect } from 'react'
// import axios from 'axios'

const Dashboard = () => {
  fetch('https://jsonplaceholder.typicode.com/users/')
    .then((response) => response.json())
    .then((data) => console.log(data))

  return (
    <>
      <div>Dashboard</div>
    </>
  )
}

export default Dashboard
