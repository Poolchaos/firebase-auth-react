# Firebase Auth React

[![Node Version](https://img.shields.io/badge/node-v22.8.0-brightgreen.svg)](https://nodejs.org/)
[![npm Version](https://img.shields.io/badge/npm-v10.98.2-blue.svg)](https://www.npmjs.com/)
[![React Version](https://img.shields.io/badge/react-v18.3.1-blue.svg)](https://reactjs.org/)
[![Vite Version](https://img.shields.io/badge/vite-v6.0.5-blue.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A React-based app using Firebase Authentication to handle user login and registration.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)
- [License](#license)

## Installation

To install and run the Firebase Auth React application locally, follow these steps:

1. **Clone the repository:**

<code>
  git clone https://github.com/Poolchaos/firebase-auth-react
</code>

2. **Navigate to the project directory:**

<code>
  cd firebase-auth-react
</code>

3. **Install the required dependencies:**

<code>
  npm install
</code>

4. **Set up your Firebase configuration:**

- Currently, Firebase credentials are configured directly in the `firebaseConfig.ts` file. You can find this file in the root or `/src` directory and add your Firebase configuration credentials there.

<code>
  const firebaseConfig = {
    apiKey: 'your_api_key_here',
    authDomain: 'your_auth_domain_here',
    projectId: 'your_project_id_here',
    storageBucket: 'your_storage_bucket_here',
    messagingSenderId: 'your_messaging_sender_id_here',
    appId: 'your_app_id_here',
    measurementId: 'your_measurement_id_here'
  };
</code>

5. **Run the development server:**

<code>
  npm run dev
</code>

6. **Open the app in your browser by navigating to:**

[http://localhost:5173/](http://localhost:5173/)

## Usage

Once the app is running, you can interact with the login and registration forms. The app uses Firebase Authentication to manage users. You can log in with email/password, and register a new user.

## Design Decisions & Trade-offs

### 1. **Choice of Firebase for Authentication**

- **Reasoning**: Firebase Authentication is a popular and robust solution for handling user authentication. It simplifies the process of integrating login and user management, reducing the complexity of building custom authentication solutions.
- **Trade-offs**: While Firebase offers many features for free, depending on usage, there may be costs associated with higher volumes of authentication requests or additional services. Additionally, Firebase's SDKs abstract away much of the implementation, which may limit fine-grained control over some parts of the authentication flow.

### 2. **Using Vite for Development**

- **Reasoning**: Vite is used as the bundler for this project. Vite is known for its speed and efficient development experience due to its reliance on native ES modules. It's a great fit for React apps, providing faster hot module replacement (HMR) and faster build times.
- **Trade-offs**: Vite is a relatively new tool and may not have as wide community adoption as Webpack. However, its rapid development and performance benefits outweigh these concerns in most cases.

### 3. **React for UI**

- **Reasoning**: React is a powerful and widely adopted library for building user interfaces, and it allows for efficient updates and rendering through its virtual DOM mechanism. The app uses functional components and hooks, following modern React practices.
- **Trade-offs**: While React is highly performant and flexible, it requires a learning curve for newcomers, especially with advanced features like hooks and context. However, this is mitigated by the strong ecosystem and community resources available.

### 4. **State Management with Redux Toolkit**

- **Reasoning**: Redux Toolkit simplifies Redux usage by providing useful abstractions and reducing boilerplate code. It is used to handle the state for authentication, making it easier to manage the app's authentication state across components.
- **Trade-offs**: Redux Toolkit adds an additional layer of complexity, but it's well-suited for large applications where managing global state can become cumbersome. For smaller apps, a simpler state management solution could be considered.

### 5. **Persisting Authentication State**

- **Reasoning**: `redux-persist` is used to persist authentication state between page reloads, ensuring that users remain logged in even after the browser is closed and reopened.
- **Trade-offs**: Using `redux-persist` adds an additional library to the stack and increases the size of the app. However, it provides a valuable feature for retaining user sessions, which is common in most applications.

## Running Jest Tests

To run the Jest tests for this project, follow these steps:

1. Ensure that the required dependencies are installed by running:

<code>npm install</code>

2. To run the Jest tests in the terminal, use the following command:

<code>npm run test</code>

3. Make sure your test setup (e.g., mock data or mock functions) is correctly configured. For the Firebase authentication mock, ensure your `firebaseConfig.ts` and related mock files are correctly set up.

4. The tests are located in the `src/tests` directory and can be run using any of the commands listed above.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
