export const isValidEmail = (email) => {
    if (!email) return false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
}

export const isValidPassword = (password) => {
    return Boolean(password) && password.length >= 6
}

export const validateLoginForm = (email, password) => {
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

    return errors
}