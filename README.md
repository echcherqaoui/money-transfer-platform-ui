# Money Transfer Platform UI

A modern, responsive, and secure frontend for a microservices-based Money Transfer Platform. Built with **Angular 18**, **Tailwind CSS**, and designed for seamless financial transactions.

---

## Key Features

-   **📊 Dashboard Overview**: Real-time view of account status, recent activities, and quick actions.
-   **💳 Money Transfers**: Effortless peer-to-peer money transfers with validation and status tracking.
-   **💼 Wallet Management**: Detailed view of wallet balances, transaction history, and account details.
-   **🛡️ Admin Controls**: Secure administration interface for managing deposits and platform-wide monitoring.
-   **🔐 Role-Based Access Control (RBAC)**: Secure routing and UI elements restricted based on user permissions (User/Admin).
-   **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing using Tailwind CSS.
-   **⚡ Real-time Notifications**: Integrated notification handling for transaction updates.

---

## Tech Stack

-   **Framework**: [Angular 18](https://angular.dev/)
-   **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
-   **State Management**: RxJS & Angular Signals
-   **Deployment**: Docker, Nginx, Docker Compose
-   **Architecture**: Clean Architecture (Core/Features/Shared)

---

## Project Structure

```text
src/app/
├── core/       # Singleton services, guards, interceptors, and models
├── features/   # Lazy-loaded feature modules (Admin, Dashboard, Transfers, Wallet)
├── shared/     # Reusable components, pipes, and directives
├── app.config.ts  # Application-wide configuration
└── app.routes.ts  # Main routing configuration
```

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20 or later)
-   [npm](https://www.npmjs.com/)
-   [Angular CLI](https://angular.dev/tools/cli)

### Local Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/money-transfer-ui.git
    cd money-transfer-ui
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Docker Deployment

The project is fully containerized and ready for production.

1.  **Build and run using Docker Compose**:
    ```bash
    docker-compose up --build -d
    ```

2.  **Build the Docker image manually**:
    ```bash
    docker build -t money-transfer-ui .
    ```

---

## Configuration

Environment settings are located in `src/environments/`.

-   `apiUrl`: The base URL for the backend API gateway.
-   `gatewayUrl`: URL for the microservices gateway.


