import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "../users/usersApiSlice"
import { useNavigate, Link } from "react-router-dom"
import "../../App.css"
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const NewUserForm = () => {

  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    if(isSuccess) {
      setUsername('')
      setPassword('')
      setEmail('')
      navigate('/log/dashboard') 
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)

  const canSave = [validEmail, validUsername, validPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e) => {
      e.preventDefault()
    //  if (canSave) {
      await addNewUser({ username, password, email })
     // }
  }

  const errClass = isError ? "errMsg" : ''
  const validUserClass = !validUsername ? 'form_input_invalid' : ''
  const validPasswordClass = !validPassword ? 'form_input_invalid' : ''
  const validEmailClass = !validEmail ? 'form_input_invalid' : ''

  const content = (
    <section className="fotivity-container">
    <main className="form-container">
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveUserClicked}>
        <header>
          <h2>Sign Up</h2>
        </header>

        <label htmlFor="username">Username</label>
        <input
        className={`form__input ${validUserClass}`}
        id="username"
        name="username"
        type="text"
        autoComplete="off"
        value={username}
        onChange={onUsernameChanged}
    />

    <label htmlFor="username">Email</label>
      <input
      className={`form__input ${validUserClass}`}
      id="email"
      name="email"
      type="text"
      autoComplete="off"
      value={email}
      onChange={onEmailChanged}
    />

<label htmlFor="password">Password</label>
      <input
          className={`form__input ${validPasswordClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
      />
        <button className="form__submit-button">Sign Up</button>
        <div className='form-links'>
            <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </main>
    </section>
  )

  return content
}

export default NewUserForm