import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, error, isLoading } = useAuthStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register({ username, email, password });
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light">
            <div className="w-full max-w-md p-8 space-y-8 bg-background-dark rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary">Join MockGovSim</h1>
                    <p className="mt-2 text-text-secondary">Create your account to get started</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            placeholder="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="peer w-full p-4 text-lg bg-background-light border-2 border-border rounded-md placeholder-transparent focus:outline-none focus:border-primary"
                        />
                        <label className="absolute left-4 -top-3.5 text-sm text-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm">
                            Username
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full p-4 text-lg bg-background-light border-2 border-border rounded-md placeholder-transparent focus:outline-none focus:border-primary"
                        />
                        <label className="absolute left-4 -top-3.5 text-sm text-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm">
                            Email
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full p-4 text-lg bg-background-light border-2 border-border rounded-md placeholder-transparent focus:outline-none focus:border-primary"
                        />
                        <label className="absolute left-4 -top-3.5 text-sm text-text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-text-secondary peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm">
                            Password
                        </label>
                    </div>
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 text-lg font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="font-medium text-primary hover:underline">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage; 