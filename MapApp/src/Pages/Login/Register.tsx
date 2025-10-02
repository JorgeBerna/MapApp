import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../Services/AuthService';
import { userService } from '../../Services/UserService';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();
  const intl = useIntl();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const userCredential = await authService.signUp(email, password);
      console.log("Usuario registrado:", userCredential.user);
      
      await userService.setUserRoles(userCredential.user.uid, {
        email: userCredential.user.email,
        roles: { admin: false }
      });
      
      setSuccess('Registro exitoso. Redirigiendo al Mapa...');
      setTimeout(() => {
        navigate('/map');
      }, 2000);
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8 border border-white/10 w-full max-w-md">
        <form onSubmit={handleRegister} className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            <FormattedMessage id="auth.register.title" defaultMessage="Register" />
          </h2>
          
          <div>
            <input
              type="email"
              placeholder={intl.formatMessage({ id: 'auth.email', defaultMessage: 'Email' })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder={intl.formatMessage({ id: 'auth.password', defaultMessage: 'Password' })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {intl.formatMessage({ id: 'auth.register.button', defaultMessage: 'Register' })}
          </button>
          
          {error && (
            <p className="text-red-400 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </p>
          )}
          
          {success && (
            <p className="text-green-400 text-center text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              {intl.formatMessage({ id: 'success.register', defaultMessage: 'Registration successful' })}
            </p>
          )}
          
          <div className="text-center">
            <p className="text-white/70">
              <FormattedMessage id="auth.alreadyHave" defaultMessage="Already have an account?" />{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 underline focus:outline-none"
              >
                {intl.formatMessage({ id: 'auth.login.button', defaultMessage: 'Login' })}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
