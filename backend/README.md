# Blog Application - Server Configuration

This document provides the necessary configuration and setup instructions for running the Blog Application server.

---

## Table of Contents
- [Environment Variables](#environment-variables)
- [Setup Instructions](#setup-instructions)
- [Running the Server](#running-the-server)
- [Future Integrations](#future-integrations)

---

## Environment Variables

Create a `.env` file in the root directory of the project and include the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.aduiies.mongodb.net/blogdb

# JWT Configuration
JWT_SECRET=secret
JWT_EXPIRE=30d

# Future API Keys (Optional - for later use)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google API
GOOGLE_TTS_API_KEY=your_google_tts_key
