import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../../components/Input/Input'
import { Button } from '../../components/Button/Button'
import { validateLoginForm } from '../../utils/validation/authValidation'
import { getErrorMessage } from '../../utils/error'
import './LoginPage.css'

export const LoginPage = () => {
    const navigate = useNavigate()

    const { login, loginLoading, loginError, } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value, }))

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '', }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newErrors = validateLoginForm(formData)

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        await login(formData)

        navigate('/dashboard')
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>ACE</h1>
                    <p>Bem-vindo!</p>
                </div>

                {loginError && (
                    <div className="auth-error">
                        {getErrorMessage(loginError)}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        name="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loginLoading}
                        className="auth-button"
                    >
                        {loginLoading
                            ? 'Entrando...'
                            : 'Entrar'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
