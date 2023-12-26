# Custom URL Shortener 🚀

![Custom URL Shortener](https://github.com/groot737/custom-url-shortener/blob/main/image/banner.png)

Welcome to the Custom URL Shortener project! This web application provides a robust and customizable URL shortening service, allowing users to create shortened versions of long URLs. Built using HTML, CSS, EJS, Node.js, Express.js, JavaScript, Mongoose, MongoDB, Passport.js, and Swagger, this project combines various technologies to deliver a powerful and user-friendly experience.

## Features 🌟

### User Registration & Authorization
- **Secure Registration:** Users can create accounts with a unique username and password.
- **Authentication:** Implemented with Passport.js for secure and easy user authentication.

### Swagger Documentation
- **API Documentation:** Swagger integration provides clear and comprehensive documentation for the API endpoints.
- **Interactive Interface:** Easily explore and test API functionalities through the Swagger UI.

### URL Shortener
- **Shorten URLs:** Quickly generate short URLs for long links.
- **Customizable Short URLs:** Users can create custom short URLs for their links.

### RESTful API
- **RESTful Architecture:** Adheres to REST principles for a standardized and scalable API.
- **CRUD Operations:** Perform Create, Read, Update, and Delete operations on URLs.

### API Authorization
- **Secure API Access:** API endpoints are protected, requiring proper authorization for access.
- **Token-based Authorization:** Utilizes tokens for secure and controlled API interactions.

### URL History
- **User-specific History:** Users can view their URL shortening history, providing insights into their past activities.

## Installation ⚙️

To run the Custom URL Shortener locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/custom-url-shortener.git`
2. Navigate to the project directory: `cd custom-url-shortener`
3. Install dependencies: `npm install axios bcrypt dotenv ejs express express-session isomorphic-fetch mongodb mongoose passport passport-local swagger-jsdoc swagger-ui-express`
4. Set up your MongoDB
5. Write env variable: `USERNAME = '' PASSWORD = ''`
6. Change connectionString in ./models/db.js
7. Start the application: `node app`
8. Access the application in your web browser at `http://localhost:3000`

## Usage 🖥️

1. Register for an account or log in if you already have one.
2. Use the Swagger documentation to explore available API endpoints.
3. Shorten URLs and manage them through the user interface.
4. Access your URL history to review and manage your shortened links.

## License 📄

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as needed.

Thank you for using the Custom URL Shortener! If you have any questions or feedback, please don't hesitate to contact us. 📧
