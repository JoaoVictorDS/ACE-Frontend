import { isValidPassword, validateEmail } from './commonFields'

export const validateLoginForm = ({ email, password }) => {
    const errors = {}

    errors.email = validateEmail(email)

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