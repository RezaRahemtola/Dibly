export const Rules = {
    user: {
        password: {
            minLength: 6,
            maxLength: 100,
            forbiddenChars: [' ']
        },
        roles: [
            'admin',
            'author',
            'designer'
        ]
    },
    image: {
        maxMbSize: 5
    },
    email: {
        verifyEmail: {
            sender: "Plexar <accounts@plexar.fr>"
        },
        resetPassword: {
            sender: "Plexar <accounts@plexar.fr>"
        },
        contactForm: {
            sender: "Plexar <contact@plexar.fr>",
            receiver: "Plexar <plexar.app@gmail.com>"
        }
    }
};
