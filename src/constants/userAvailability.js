export const USER_AVAILABILITY = {
    AVAILABLE: 'AVAILABLE',
    BREAK: 'BREAK',
    EXTERNAL_ACTIVITIES: 'EXTERNAL_ACTIVITIES',
    END_OF_ACTIVITIES: 'END_OF_ACTIVITIES'
}

export const USER_AVAILABILITY_OPTIONS = [
    {
        value: USER_AVAILABILITY.AVAILABLE,
        label: 'Disponível'
    },
    {
        value: USER_AVAILABILITY.BREAK,
        label: 'Intervalo'
    },
    {
        value: USER_AVAILABILITY.EXTERNAL_ACTIVITIES,
        label: 'Em atividades externas'
    },
    {
        value: USER_AVAILABILITY.END_OF_ACTIVITIES,
        label: 'Fim das atividades'
    }
]

export const getUserAvailabilityOption = (value) => {
    return USER_AVAILABILITY_OPTIONS.find((option) => option.value === value) ?? USER_AVAILABILITY_OPTIONS[0]
}