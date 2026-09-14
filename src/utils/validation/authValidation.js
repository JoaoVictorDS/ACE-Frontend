import { isValidEmail, isValidPassword } from './commonFields'

export const validateLoginForm = ({ email, password }) => {
    const errors = {}

    if (!email?.trim()) {
        errors.email = 'O e-mail é obrigatório.'
    } else if (!isValidEmail(email)) {
        errors.email = 'Informe um e-mail válido.'
    }

    if (!password) {
        errors.password = 'A senha é obrigatória.'
    } else if (!isValidPassword(password)) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres.'
    }

    Object.keys(errors).forEach(key => {
        if (!errors[key]) delete errors[key]
    })

    return errors
}