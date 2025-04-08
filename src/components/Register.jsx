// src/components/Register.jsx
import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    captchaToken: 'test_token' // Reemplaza con token real de reCAPTCHA
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('¡Registro exitoso! Verifica tu email.');
    } catch (error) {
      alert(error.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};