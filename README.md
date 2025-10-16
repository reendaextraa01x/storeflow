# StoreFlow

Welcome to StoreFlow, your personal online dashboard for managing product inventory, sales, and profits. Built with Next.js, Firebase, and ShadCN/UI, this application provides a real-time, spreadsheet-like experience to keep your business data organized and accessible.

## Features

- **Secure Authentication**: User sign-up and login with Firebase Authentication (email & password).
- **Dashboard Overview**: A central hub to navigate to your products and reports.
- **Real-time Product Management**: An interactive table to add, view, edit, and delete products. All changes are saved instantly to Firestore.
- **Automated Financial Tracking**: Automatic, real-time calculation of total revenue, costs, and net profit.
- **Data-driven Insights**: Visual reports and charts to analyze product performance.
- **CSV Export**: Easily export your product data to a CSV file.
- **Modern UI**: A clean, responsive, and aesthetically pleasing interface built with Tailwind CSS and ShadCN/UI.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Google account to create a Firebase project.

### 1. Firebase Project Setup

Before you can run the application, you need to create a Firebase project to handle authentication and the database.

1.  **Go to the Firebase Console**:
    -   Navigate to [https://console.firebase.google.com/](https://console.firebase.google.com/).
    -   Click on "**Add project**" and follow the on-screen instructions to create a new project. Give it a name like "StoreFlow".

2.  **Enable Authentication**:
    -   In your new project's console, go to the **Build** > **Authentication** section.
    -   Click "**Get started**".
    -   Under the **Sign-in method** tab, select **Email/Password** from the list.
    -   Enable it and click **Save**.

3.  **Set up Firestore Database**:
    -   Go to the **Build** > **Firestore Database** section.
    -   Click "**Create database**".
    -   Choose to start in **Test mode**. This allows open read/write access for easy development.
        > **Important**: For a production application, you must configure security rules to protect your data.
    -   Select a location for your database and click **Enable**.

4.  **Register Your Web App & Get Config Keys**:
    -   Go to your **Project Overview** page by clicking the gear icon ⚙️ next to "Project Overview" and selecting **Project settings**.
    -   In the **General** tab, scroll down to the "Your apps" section.
    -   Click the web icon (`</>`) to add a new web app.
    -   Give your app a nickname (e.g., "StoreFlow Web") and click "**Register app**".
    -   Firebase will provide you with a `firebaseConfig` object. **Copy these keys**. You will need them for the next step.

### 2. Local Project Configuration

Now, let's configure your local project to connect to your new Firebase project.

1.  **Clone the Repository (if you haven't already)**:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Create Environment File**:
    -   In the root of the project, create a new file named `.env.local`.
    -   Paste the Firebase config keys you copied earlier into this file, formatting them as shown below. Make sure to prefix each key with `NEXT_PUBLIC_`.

    ```env
    # .env.local

    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    ```

### 3. Run the Development Server

You're all set! Start the development server to see the app in action.

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:9002](http://localhost:9002) (or the port specified in your terminal) with your browser to see the result. You should be able to sign up for a new account and start using the dashboard.
# plataforma
# plataforma
# plataforma
