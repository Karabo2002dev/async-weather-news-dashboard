# Async-Weather-News-Dashboard

# Description

A simple console driven project illustration of callback, promises, async/await functionallities built with **Node.js** and **TypeScript** for fetching weather and news headlines using API's from real time.

# Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [License](#license)

# Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Karabo2002dev/async-weather-news-dashboard.git
   cd async-weather-news-dashboard
   code .

2. Install dependencies
    ```bash
    npm install

# Usage

## Running the  Project

**NB : Comment out the Promise.all functionallity in promiseVersion.ts to avoid data duplicates**

1. Run the Callback Version.
    ```bash
    npm run callback

2. Run the Promise Version 
    ```bash
    npm run promise

3. Run Async/Await Version
    ```bash
    npm run async
---

## Data Screenshot

### Weather & News
![Weather and News Data](src/images/Screenshot%202025-09-05%20154549.png)  

# Project Structure
    ```bash
    src/
    ├── imgages/   # screenshot of the console
    ├── asyncAwaitVersion.ts  # async version functionallity
    ├── callbackVersion.ts    # callback version functionallity
    └── promiseVersion.ts     # promise version functionallity
    ```

# Technologies
- Node.js
- TypeScript
- console (for testing and data / response visualization)

# License
MIT License © 2025 Karabo Kgaphola











