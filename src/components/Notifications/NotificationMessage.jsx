export const NotificationMessage = ({ message }) => {
    const parts = message.split(/(\*\*.*?\*\*)/g)

    return (
        <span>
            {parts.map((part, index) => {
                const isBold =
                    part.startsWith('**') &&
                    part.endsWith('**')

                if (!isBold) {
                    return (
                        <span key={index}>
                            {part}
                        </span>
                    )
                }

                return (
                    <strong key={index}>
                        {part.slice(2, -2)}
                    </strong>
                )
            })}
        </span>
    )
}