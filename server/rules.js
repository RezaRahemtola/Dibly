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
    }
};
