import { MESSAGES } from '../../constants/messages'

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
        errors.email = MESSAGES.VALIDATION.REQUIRED_EMAIL
    } else if (!isValidEmail(email)) {
        errors.email = MESSAGES.VALIDATION.INVALID_EMAIL
    }

    if (!password) {
        errors.password = MESSAGES.VALIDATION.REQUIRED_PASSWORD
    } else if (!isValidPassword(password)) {
        errors.password = MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH
    }

    return errors
}