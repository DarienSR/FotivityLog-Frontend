import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import "../../App.css"
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login] = useLoginMutation()

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/log/dashboard')
        } catch (err) {
            setErrMsg("Unable to authenticate user.")
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)

    const content = (
        <section className="fotivity-container">
            <main className="form-container">
                <p style={styles.error}>{errMsg}</p>

                <form className="form" onSubmit={handleSubmit}>
                    <header>
                        <h1>Login</h1>
                    </header>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    <button>Login</button>
                    <div style={styles.links}>
                        <Link to="/reset">Forgot your password?</Link>
                        <Link to="/signup">Create account</Link>
                    </div>
                </form>
            </main>
            <footer>

            </footer>
        </section>
    )

    return content
}

let styles = {
    error: {
        textAlign: 'center',
        fontSize: '2rem',
        color: 'red'
    },
    links: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}
export default Login