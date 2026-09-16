export const isValidUserName = (name) => {
    return Boolean(name) && name.length > 0
}

export const isValidEmail = (email) => {
    if (!email) return false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
}

export const validateEmail = (email) => {
    if (!email?.trim()) {
        return 'O e-mail é obrigatório.'
    } else if (!isValidEmail(email)) {
        return 'Informe um e-mail válido.'
    }

    return ''
}

export const isValidPassword = (password) => {
    return Boolean(password) && password.length >= 6
}

export const isPasswordConfirmationValid = (password, confirmPassword) => {
    return password === confirmPassword
}