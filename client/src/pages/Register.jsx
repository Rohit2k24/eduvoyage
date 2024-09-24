import React from 'react'
import RegistrationForm from '../components/RegisterForm/RegistrationForm';
import Header from '../components/Header/Header';

function Register() {
  return (
    <div className="register-page">
      <Header/>
      <RegistrationForm/>
    </div>
  )
}

export default Register
