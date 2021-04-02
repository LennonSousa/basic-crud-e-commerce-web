import { useRouter } from 'next/router';
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import api from '../services/api';

interface User {
    id: number,
    name: string;
    email: string;
    active: boolean;
    created_at: Date;
}

interface AuthContextData {
    user: User | null;
    signed: boolean;
    loading: boolean;
    handleLogin(email: string, password: string): Promise<boolean | "error">;
    handleLogout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storagedUser = Cookies.get('user');
            const storagedToken = Cookies.get('token');

            if (storagedUser && storagedToken) {
                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                setUser(JSON.parse(storagedUser));
                setSigned(true);

                setLoading(false);
            }

            setLoading(false);
        }
        catch {
            handleLogout();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleLogin(emailLogin: string, password: string) {
        try {
            const res = await api.post('users/authenticate', {
                email: emailLogin,
                password
            },
                {
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    }
                }
            );

            if (res.status === 201) {
                const { user, token } = res.data;

                setUser(user);

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                Cookies.set('user', JSON.stringify(user), { expires: 1 });
                Cookies.set('token', token, { expires: 1 });

                setSigned(true);
                setLoading(false);

                router.push('/dashboard/products');

                return true;
            }

            return false;
        }
        catch {
            return "error";
        }
    }

    async function handleLogout() {
        setSigned(false);
        Cookies.remove('user');
        Cookies.remove('token');
        api.defaults.headers.Authorization = undefined;

        router.replace('/');

        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ user, signed, loading, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };