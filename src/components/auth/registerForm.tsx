// Register.tsx
import React, { useState, useEffect } from 'react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Verifica se já existe um usuário admin no localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const adminUser = { username: 'admin', password: 'admin123' };

        // Adiciona o usuário admin se não existir
        if (!existingUsers.some((user: { username: string }) => user.username === adminUser.username)) {
            existingUsers.push(adminUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
        }
    }, []);

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Verifica se o usuário já existe
        const userExists = existingUsers.some((user: { username: string }) => user.username === username);

        if (userExists) {
            setMessage('Usuário já existe. Escolha outro nome.');
            return;
        }

        // Adiciona novo usuário ao local storage
        const newUser = { username, password };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        setMessage('Usuário registrado com sucesso!');
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h2>Registrar</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Registrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
