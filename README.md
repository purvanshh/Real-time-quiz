# Real time quiz website

This real-time quiz application, built with **Next.js**, **Socket.io** and **Prisma**, offers real time communication.It shows a leaderboard with the highest ratings and gives you the chance to compete with others.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Project](#running-the-project)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)
9. [License](#license)

## Features
- **Answer Question**: Answer questions in real time.
- **Competition**: Compete with people around the world.
- **View Leaderboard**: View people who are ahead of you.
- **Save Info**: Preserve information for future games.
- **Improve Skills**: Improve logical reasoning.
  
## Sample Image: 

<div style="display: flex; justify-content: space-between;">
  
![image](https://github.com/user-attachments/assets/8100c004-fdec-4fd4-a63d-5dd2e497dd6c)

</div>

## Tech Stack

- **Next.js**
- **TypeScript**
- **Socket.io**
- **Prisma**
- **PostgreSQL**
- **Tailwind CSS**

## Getting Started

Follow the instructions below to set up the project locally on your machine.

### Prerequisites

- **Node.js** (v16 or later): [Download Node.js](https://nodejs.org/)
- **Git**: [Download Git](https://git-scm.com/)
- **PostgreSQL**: [Install PostgreSQL](https://www.postgresql.org/download/) (Not Necessary)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/centauricoder01/real-time-quiz-website.git
   
2. **Navigate to the project directory:**
   ```bash
   cd real-time-quiz-website

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory of your project and add the following environment variables:

  ```bash
 DATABASE_URL=postgresql://user:password@localhost:5432/quiz-website
 NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### Running Migrations

  ```bash
   npx prisma migrate dev
  ```

### Running the Project

  ```bash
    npm run dev
  ```

### Build for production:
  ```bash
    npm run build
  ```
### Folder Structure

  ```ruby
ai-plagiarism-detector/
├── public/         # Static assets
├── src/            # Source files
│   ├── app/
        ├── api/     #All APIs
        ├── other_page/     #Other Pages
│   ├── components/  # Reusable components
│   ├── hooks/      # custom hooks
│   └── libs/      # Utility functions
├── .env.local      # Environment variables
├── next.config.js  # Next.js configuration
├── package.json    # Dependencies and scripts
├── README.md       # Project documentation
└── tsconfig.json   # TypeScript configuration
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are welcome.

1. **Fork the repository**:

   Go to the repository on GitHub and click the "Fork" button at the top right corner.

2. **Create a feature branch**:

   ```bash
   git checkout -b feature-name

3. ***Commit your changes**:
     ```bash
     git commit -m 'Add some feature'
     
4. **Push to the branch**:
     ```bash
     git push origin feature-name
     ```

## Thank you for your contribution! If you found this project helpful, please consider giving it a star ⭐.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
