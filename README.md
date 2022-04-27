# This is Random Choice

Web application which aims to provide an easy way of choosing between multiple proposed activities.

Check it out [here](https://random-choice.herokuapp.com/).

## Description

Created for the laboratory of 'Methods of Software Development' it features modern tools / software development principles like:
 * MVC Architecture
 * ORM (using Sequelize)
 * Deployed in containers (using Docker)

## How to use

Create an account, earn some credits in the play section either by clicking or buying services which are earning credits in the background.

Invite some friends (or you can make it choose for you) by creating a room and creating a Random Choice game, add your options and see what was chosen.

## How to run

 * If you have a database, use the provided Dockerfile and make sure you have the following environement values
   * SESSION_SECRET
   * DATABASE_URL (connection link to a database, I used Postgres, if it's different change dialect)
   * VAPID_PUBLIC (used for notifications, use: .\node_modules\.bin\web-push generate-vapid-keys)
   * VAPID_PRIVATE
   > Optional
   * MENTENANTA < (true/false)
   * SALT_ROUNDS
   * HOSTNAME (provides better links in notifications and sets up SSL)
 * If you don't have a database, you can use the provided Docker-Compose file, make sure you have a .env file with the mentioned values
 * If you want it to run it without Docker
   * Clone the project
   * Run: npm install
   * Run your Postgres database and initialise the database with the [script](https://github.com/Ionnier/proiect-mds/blob/master/utils/InitSQL.sql)
   * Update the .env file
   
