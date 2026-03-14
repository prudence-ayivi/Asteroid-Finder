## Asteroid Finder

## 1. Project Overview

Asteroid Finder is a web application designed to make NASA asteroid discovery data easier to explore and understand.

The project allows astronomy enthusiasts, researchers, and citizen scientists to interactively browse asteroid discoveries and quickly access essential information about individual objects.
Instead of navigating complex scientific databases, the platform provides a simplified interface where users can:

- explore asteroid discoveries by date
- search objects by name or designation
- access key orbital and physical parameters
- identify near-Earth objects (NEOs) and potentially hazardous asteroids (PHAs)
- view future close approach events with Earth

### How it works : 
- Search Near-Earth Objects by typing a name or designation or select a date to view objects discovered on that day 
- Select an object to view its details 
- If no object discovered on the day you pick, the closest objects discovored in ±5 days range will be displayed
For users who want more detailed scientific information, each object includes a direct link to the official NASA Small-Body Database.

The goal of this project is to make asteroid data more accessible while preserving the scientific integrity of the original dataset.

## 2. Project Motivation

NASA and the Minor Planet Center have discovered more than 1.5 million asteroids, and this number continues to grow rapidly thanks to automated surveys and citizen science contributions.

However, exploring these datasets directly through official interfaces can sometimes be difficult for non-specialists.

Asteroid Finder was created to :

- simplify access to asteroid discovery data
- allow users to track discoveries over time
- make asteroid data easier to explore visually and interactively
- support astronomy outreach and citizen science initiatives

The project was inspired by SpaceReference.org, which previously provided a simplified and advanced way to explore various asteroid data. 

*Asteroid Finder* aims to provide a modern, updated and lightweight alternative focused specifically on asteroid discoveries.

## 3. Data Source

The application uses data from NASA's official database:

NASA JPL Small-Body Database (SBDB)

From API :
https://ssd-api.jpl.nasa.gov

The dataset includes information such as:

- object designation
- asteroid name
- orbital parameters
- physical characteristics
- discovery and observation dates
- close approach data relative to Earth

## 4. Automated Data Processing Pipeline

Because the NASA asteroid dataset is continuously evolving, the application relies on an automated data ingestion pipeline. The platform automatically updates its asteroid dataset using a scheduled server job.

Process workflow:

- A Vercel Cron Job runs automatically at a scheduled interval.
- The job sends a request to the NASA dataset endpoint to retrieve the latest asteroid discovery data.
- The retrieved CSV dataset is parsed and converted into structured JSON.
- The processed dataset is indexed by discovery date.
- The generated JSON file is uploaded to Vercel Blob Storage.
- The application backend then reads this dataset directly from the Blob storage.

This approach ensures that the application always uses up-to-date asteroid discovery data without manual updates.

## 5. Architecture

The project uses a modern full-stack JavaScript architecture.

Frontend : 

- Next.js (React)
- Tailwind CSS

Main features:

- asteroid search interface
- object detail panels
- orbital classification display
- close approach information
- responsive UI

Backend

The backend is implemented using Next.js API Routes, which handle:

- search queries by asteroid name
- search queries by discovery date
- filtering and formatting asteroid data
- retrieving close approach data from NASA APIs

These routes interact with the stored dataset hosted in Vercel Blob Storage.


## 6. Data Storage & Performance Optimizations

The project uses Vercel Blob Storage to store the processed JSON dataset.

Advantages of this approach:

- avoids large repository files
- allows dynamic updates of the dataset
- enables serverless architecture compatibility
- improves scalability for large asteroid datasets

The asteroid dataset fetched from Blob Storage is cached in server memory, avoiding repeated downloads for each request. Search operations limit the number of results returned to prevent expensive dataset scans.


## 7. Close Approach Analysis

For each asteroid, the application can retrieve close approach data relative to Earth using NASA's SBDB API.

The system automatically:

- retrieves close approach records
- displays only future close approaches 
- limits results to the next five upcoming approaches

This allows users to quickly identify asteroids that will approach Earth in the future.


## 8. Future Improvements

Several improvements may be added in future versions of the project.

Features for v3:

- Left panel : last 10 objects discovered, graphs of objects discovery
- Add popup feature for object detail view
- Switch database between the full list of objects or only NEO 

Possible features : 

- asteroid orbit visualizations
- filtering by asteroid families or object properties (diameter, magnitude)
- integration with additional NASA datasets
- Data export in CSV 

## 9. Project Status

The project automatically integrates new asteroid discoveries through the scheduled ingestion pipeline.
As asteroid discovery programs continue to expand, the dataset is expected to grow to several million objects in the coming years.

## 10. Credits

Data provided by:

NASA Jet Propulsion Laboratory Small-Body Database (SBDB)

Inspired by:

*SpaceReference.org*

Build by : 

Prudence AYIVI




