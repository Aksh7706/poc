# Near Notification Protocol Backend

Welcome to the Near Notification Protocol Backend repository. This Node.js (TypeScript) backend, in conjunction with a PostgreSQL database, Redis, and RabbitMQ server, stands at the core of our notification delivery infrastructure for Decentralized Applications (dApps) within the Near Protocol ecosystem. At its essence, this backend takes on the pivotal role of orchestrating a sophisticated notification system, empowering both dApps and their users. It operates by actively listening to messages from the parser service, enabling the registration of new events, templates, and user-specific provider configurations. Additionally, it efficiently retrieves and dispatches notifications through the appropriate provider channels. This vital component forms the backbone of seamless, low-latency communication for the Near Protocol dApp community.
## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Near Notification Protocol is an end-to-end notification architecture designed exclusively for dApps running on the Near Protocol. It offers a comprehensive solution for managing and sending notifications, enabling dApps to keep their users engaged and informed. The system is built with scalability and low-latency in mind, ensuring efficient delivery of notifications.

### Features

- **Multiple Notification Channels**: Near Notification Protocol supports various notification channels, including in-app notifications, Telegram, and email, with plans to add support for push notifications and webhooks in the near future.

- **User Analytics**: The backend manages user-related services, providing dApps with valuable insights into their users' behavior. This data helps dApps make informed decisions and tailor their notifications effectively.

- **On-Chain Event Integration**: The backend interacts with the parser service to retrieve on-chain events and process them, enhancing the quality and relevance of notifications.

## Getting Started

### Prerequisites

Before you can run this project, you need to have the following software installed:

- [Node.js](https://nodejs.org/) (v16 or higher)

### Installation

1. Clone this repository to your local machine:

   ```bash
   https://github.com/nnplabs/backend.git

2. Navigate to the project directory:

   ```bash
   cd backend

3. Install the required dependencies:

   ```bash
   yarn install

4. Create a `.env` file and add the following configurations:

   ```bash
   DATABASE_URL = "your-protgress-url"
   REDIS_URL = "your-redis-url"
   RABBITMQ_URL = "your-rabbitmq-url"

5. Run the development server:
   ```bash
   yarn dev:server
   ```
   
   Now, the Near Notification Protocol Backend is up and running on your local environment.

## Project Structure
The project's source code is organized as follows:

```
- backend/
  - prisma/
    - migrations/ - Contains database migration scripts for maintaining the database schema.
    - schema.prisma/ - Prisma schema file for defining the data model and database connections.
  - src/ - Contains the application source code.
    - db/ - Handles database-related code and interactions.
    - generator/ - Contains code for generating and raising pull requests on the parser service for new dapps that register on the platform. Dapps can update this PR to provide custom logic for parsing their contract events and creating custom notification types.
    - models/ - Defines data models for the application.
    - middleware/ - Houses middleware functions for request and response handling.
    - providers/ - Contains code for notification providers. Currently supported notification providers are Pegion( InApp ), Sendgrid ( Mail ), Telegram. 
    - routes/ - Defines application routes and API endpoints.
    - static/ - Stores static files, such as images or documents.
    - types/ - Contains TypeScript type definitions.
    - utils/ - Includes utility functions and modules for various tasks.
    - helper.ts - A utility module for common helper functions.
    - rabbitmq.ts - Manages the connection and interaction with RabbitMQ for messaging.
    - redis.ts - Manages the connection and interaction with Redis for caching and data storage.
    - server.ts - Main server application file.
  - tests/ - Contains test files and configurations.
  - package.json - Lists project dependencies and scripts.
  - README.md - Project documentation, which you're currently reading.
  - LICENSE.md - Licensing information for the project.
  - tsconfig.json - TypeScript configuration file.
```

## Project Demo

Watch the demo of our project on [YouTube](https://youtu.be/EeZOyy3B3FM) to see the Near Notification Service in action. This video showcases the project's features and functionality.

## Devpost Submission

We have submitted this project to [Devpost](https://devpost.com/software/near-notification-service). You can check out our submission and learn more about the project's features, goals, and how it was built.


## Contributing
If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Test your changes thoroughly.
5. Commit and push your changes to your forked repository.
6. Submit a pull request, explaining your changes and why they should be merged.

Thank you for contributing!

## License
This project is licensed under the MIT License - see the LICENSE file for details.
