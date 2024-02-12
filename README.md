# Bitspeed Identity Reconciliation
This project is a backend server for Bitspeed Identity Reconciliation, providing an endpoint for identifying and consolidating customer contacts.

## Getting Started
To get started with the project, follow these steps:

#### Clone the repository:
```
git clone <repository-url>
```
#### Install dependencies:
```
npm install
```
#### Start the server:
```
npm start
```
The server will start running on port 8000 by default.

## Endpoint
The server provides the following endpoint:

- `/identify`: This endpoint receives HTTP POST requests with JSON body containing customer contact information and returns the consolidated contact details.
## Deployment
The server is deployed on Render at the following link:

https://bitspeed-identity-reconciliation.onrender.com/identify

## Technologies Used
- Node.js
- TypeScript
- MySQL
- Express.js

## License
This project is licensed under the MIT License - see the LICENSE file for details.

