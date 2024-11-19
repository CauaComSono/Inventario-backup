
import React, { useState } from 'react';
import { useAuth } from './auth-context-provider';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate()

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(username, password);
            setMessage('Login bem-sucedido!');
            navigate("/home")
        } catch (error) {
            setMessage('Usuário ou senha inválidos. Tente novamente.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
                <p>Não possui conta?<a href="/register">Registre-se</a></p>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
