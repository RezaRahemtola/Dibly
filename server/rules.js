export const Rules = {
    user: {
        password: {
            minLength: 6,
            maxLength: 100,
            forbiddenChars: [' ']
        }
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
