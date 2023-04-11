import { useState, useEffect } from "react"
import { useUpdateUserMutation } from "../users/usersApiSlice"
import { useNavigate, Link } from "react-router-dom"
import useAuth from '../../hooks/useAuth.js'

import "../../App.css"
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EditUser = () => {

  const { username, email, id} = useAuth()
  const [updateUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateUserMutation()

  const navigate = useNavigate()

  const [oldUsername, setUsername] = useState(username)
  const [validUsername, setValidUsername] = useState(false)

  const [oldEmail, setEmail] = useState(email)
  const [validEmail, setValidEmail] = useState(false)

  const [userid, setUserId] = useState(id)

  const [oldPassword, setOldPassword] = useState('')
  const [validOldPassword, setValidOldPassword] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [validNewPassword, setValidNewPassword] = useState(false)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(oldUsername))
  }, [oldUsername])

  useEffect(() => {
    setValidOldPassword(PWD_REGEX.test(newPassword))
    setValidOldPassword(PWD_REGEX.test(oldPassword))
  }, [newPassword, oldPassword])

  useEffect(() => {
    if(isSuccess) {
      setUsername('')
      setOldPassword('')
      setNewPassword('')
      setEmail('')
      navigate('/log/user') 
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onOldPasswordChanged = e => setOldPassword(e.target.value)
  const onNewPasswordChanged = e => setNewPassword(e.target.value)

  const canSave = [validEmail, validUsername, validOldPassword, validNewPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e) => {
      e.preventDefault()
      if (true) {
        await updateUser({ oldUsername, oldPassword, newPassword, oldEmail, id })
      }
  }

  const errClass = isError ? "errMsg" : ''
  const validUserClass = !validUsername ? 'form_input_invalid' : ''
  const validPasswordClass = !validNewPassword ? 'form_input_invalid' : ''
  const validEmailClass = !validEmail ? 'form_input_invalid' : ''

  const content = (
    <section className="fotivity-container">
    <main className="form-container">
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveUserClicked}>
        <header>
          <h2>Sign Up</h2>
        </header>

        <label htmlFor="oldUsername">Username</label>
        <input
        className={`form__input ${validUserClass}`}
        id="oldUsername"
        name="oldUsername"
        type="text"
        autoComplete="off"
        value={oldUsername}
        onChange={onUsernameChanged}
    />

    <label htmlFor="oldUsername">Email</label>
      <input
      className={`form__input ${validUserClass}`}
      id="oldEmail"
      name="oldEmail"
      type="text"
      autoComplete="off"
      value={oldEmail}
      onChange={oldEmail}
    />

<label htmlFor="oldPassword">Old Password</label>
      <input
          className={`form__input ${validPasswordClass}`}
          id="oldPassword"
          name="oldPassword"
          type="password"
          value={oldPassword}
          onChange={onOldPasswordChanged}
      />
<label htmlFor="newPassword">New Password</label>
    <input
          className={`form__input ${validPasswordClass}`}
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={onNewPasswordChanged}
          />
        <button className="form__submit-button">Save</button>
      </form>
    </main>
    </section>
  )

  return content
}

export default EditUser