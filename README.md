# DeviceInfo


## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Demo](#demo)
4. [Technologies Used](#technologies-used)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Development Server](#running-the-development-server)
6. [Usage](#usage)
   - [Searching Device Information](#searching-device-information)
   - [Downloading JSON](#downloading-json)
   - [Downloading PDF](#downloading-pdf)
   - [Fetching Clipboard Data](#fetching-clipboard-data)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)
10. [Contact](#contact)
11. [Additional Resources](#additional-resources)
12. [Troubleshooting](#troubleshooting)

---

## Introduction

**DeviceInfo** is a professional and responsive web application built with **Next.js 15** and **Tailwind CSS**. It provides comprehensive information about the user's device, including hardware specifications, browser details, network information, and more. Users can search through the device information, download it as JSON or a professionally formatted PDF, and fetch clipboard data directly from the application.

Access the live version of the application here: [DeviceInfo Live](https://your-info.sahinur.dev/)

---

## Features

- **Comprehensive Device Information**: Displays detailed information categorized into sections like Basic Information, Hardware, Screen, Network, Browser Details, and Additional Information.
- **Search Functionality**: Real-time search to filter through device information seamlessly.
- **Download Options**:
  - **JSON**: Download device information in JSON format.
  - **PDF**: Generate and download a professionally formatted PDF report with a cover page, headers, footers, and well-structured tables.
- **Fetch Clipboard Data**: Retrieve and display data from the user's clipboard.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- **Accessible**: Designed with accessibility best practices in mind, including ARIA labels and keyboard navigation support.
- **Dark Mode** *(Optional)*: Toggle between light and dark themes for better user experience.

---

## Demo

![DeviceInfo Screenshot](https://i.ibb.co.com/y4yvDjr/your-info.png)

*Replace the above image with a screenshot of your application.*

Access the live demo here: [https://your-info.sahinur.dev/](https://your-info.sahinur.dev/)

---

## Technologies Used

- **Next.js 15**: React framework for building server-side rendered applications.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **jsPDF**: Library to generate PDFs in the browser.
- **jspdf-autotable**: Plugin for jsPDF to create advanced tables in PDFs.
- **Heroicons**: Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.
- **React Hooks**: For managing state and side effects within functional components.

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
- **npm or Yarn**: Package managers to install dependencies.

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/deviceinfo.git
