export const isValidEmail = (email) => {
    if (!email) return false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
}

export const isValidPassword = (password) => {
    return Boolean(password) && password.length >= 6
}
