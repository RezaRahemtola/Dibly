![Dibly logo](https://github.com/RezaRahemtola/Dibly/raw/master/public/dibly.png "Dibly")

A simple, modern and complete blog management system to allow everyone to start blogging.  
No need for programming knowledge or learning to use a large CMS overloaded with options that make it difficult to master and are unnecessary for novice users.

Publication and management of articles, comment space to interact with visitors, customizable design, attendance statistics and much more...
It has all the essential features for a blog.

Dibly benefits from completely free hosting (with Heroku, MongoDB and Dropbox).

## Installation:

After cloning this repository, you need to install the required modules with
```
npm install
```

You also need to create a `settings.json` file (to set up email sending & admin list) with the following content :
```json
{
    "smtp": {
        "isSecure": "Boolean, set to true if your smtp service provides a secure connexion (https), else (http) set to false",
        "username": "With SendGrid it's generally apikey",
        "password": "With SendGrid it generally starts with SG.",
        "host": "With SendGrid it's generally smtp.sendgrid.net",
        "port": "Integer, with SendGrid it's generally 465"
    },
    "email": {
        "verifyEmail": {
            "sender": "Sender for account verification emails (must match the one used for smtp)"
        },
        "resetPassword": {
            "sender": "Sender for reset password emails (must match the one used for smtp)"
        },
        "contactForm": {
            "sender": "Sender for contact form emails (must match the one used for contact API key)",
            "receiver": "The email on which you want to receive the contact form submissions"
        }
    },
    "sendgridContactApiKey": "API Key provided by SendGrid & used to send contact emails (you can use the same that in smtp if you want)",
    "giphyApiKey": "API key given at https://developers.giphy.com/ and used to allow GIF in articles"
}
```

If you fork this project, I strongly recommend to add this file in a `.gitignore` as it contains sensitive data.

The app can then be run with those settings like that :
```
meteor --settings path/to/settings.json
```

## Support this project:

- [One-time donation via PayPal](https://paypal.me/RezaRahemtola)
- If you're using [Brave Browser](https://brave.com/rez051), you can tip me with [BAT](https://basicattentiontoken.org/)
