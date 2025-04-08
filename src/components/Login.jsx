// src/components/Login.jsx
const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);
        localStorage.setItem('token', response.data.token);
        alert('¡Bienvenido!');
      } catch (error) {
        alert('Credenciales incorrectas');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Iniciar Sesión</button>
      </form>
    );
  };