import { isValidPassword, isPasswordConfirmationValid, validateEmail, isValidUserName } from './commonFields'

export const validateCurrentPassword = (currentPassword) => {
    if (!currentPassword) {
        return 'A senha atual é obrigatória.'
    }
    if (!isValidPassword(currentPassword)) {
        return 'A senha atual deve ter pelo menos 6 caracteres.'
    }
    return ''
}

export const validateNewPassword = (newPassword) => {
    if (!newPassword) {
        return 'A nova senha é obrigatória.'
    }
    if (!isValidPassword(newPassword)) {
        return 'A nova senha deve ter pelo menos 6 caracteres.'
    }
    return ''
}

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'A confirmação de senha é obrigatória.'
    }
    if (!isValidPassword(confirmPassword)) {
        return 'A confirmação de senha deve ter pelo menos 6 caracteres.'
    }
    if (!isPasswordConfirmationValid(password, confirmPassword)) {
        return 'As senhas não coincidem.'
    }
    return ''
}

export const validateProfileForm = ({ name, email }) => {
    const errors = {}

    if (!name?.trim()) {
        errors.name = 'O nome do usuário é obrigatório.'
    } else if (!isValidUserName(name)) {
        errors.name = 'O nome do usuário deve ter pelo menos um caractere'
    }

    errors.email = validateEmail(email)

    Object.keys(errors).forEach(key => {
        if (!errors[key]) delete errors[key]
    })

    return errors
}

export const validateChangePasswordForm = ({ currentPassword, newPassword, confirmPassword }) => {
    const errors = {}

    errors.currentPassword = validateCurrentPassword(currentPassword)
    errors.newPassword = validateNewPassword(newPassword)
    errors.confirmPassword = validateConfirmPassword(newPassword, confirmPassword)

    Object.keys(errors).forEach(key => {
        if (!errors[key]) delete errors[key]
    })

    return errors
}