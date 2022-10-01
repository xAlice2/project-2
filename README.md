# `Flourish`

Flourish is an productivity app designed to have everything a person could need to start their day and do their work in one place.

## Live Preview
https://flourish-helenaw.herokuapp.com/

## Features
* Music
* Pomodoro Timer
* Todo list
* Quick access links
* Motivation station

## Technologies included
* Sequelize user model / migration
* Settings for PostgreSQL
* Passport and passport-local for authentication
* Sessions to keep user logged in between pages
* Flash messages for errors and successes
* Passwords that are hashed with BCrypt
* EJS Templating and EJS Layouts
* Bootstrap
* JQuery

## Entity Relationship Diagram
![tables erd](https://user-images.githubusercontent.com/86327883/193395538-d357cd1e-35bf-42cd-95ef-50d995c4ec06.png)

## Planning
I'm not a very visual person, I require being able to visually see things together in order to implement the code for it. Everytime I hit a backend roadblock, I came back to chip away at this mountain. You can see the wireframe evolve as I try to visualize things I'm looking to do while I was coding the front end.

### Idea
* To get away from the idea of 'work' by removing as many instances of words relating to it as possible
* Visually pleasing theme that is also generally gender neutral
* User interactive - in order to add tasks to the todo list or shortcuts

### Wireframe
![wireframe v1](https://user-images.githubusercontent.com/86327883/193395641-c14fd4a2-f0ae-4ea9-9af7-fee56ba01ce4.png)

![wireframe v2](https://user-images.githubusercontent.com/86327883/193395688-7db7055b-f56e-4f15-8834-f95281d9feda.png)

![wireframe v3](https://user-images.githubusercontent.com/86327883/193395730-eab3eebd-7cfb-40e9-9bb9-3ff59200e1b5.png)


## Roadmap
- [ ] Major Bugs: 
    - [ ] User sign up broken: does not redirect to user account main &
    - [ ] Need to pre-populate todo list at sign up in order for account main to render

- [ ] Minor Features:
    - [ ] Tidy up responsive design, tablet breakpoint works, cellphone breakpoint does not
    - [ ] Minor ui discrepancies in production
    - [ ] Ability to pick different playlists or songs in spotify
    - [ ] Calendar implementation
    - [ ] Actual Motivation station with an api for jokes
   
- [x] ReadMe


## Install
No external dependencies. `npm install` will install all dependencies listed in package.json


## Major roadblocks
I thought by creating a productivity app with various features would help me portion out features I can implement depending on time allowed for this project. Unfortunately, each feature that were intended to meet the criteria for this project broke in unexpected ways. 

### The Todo list
The idea behind this feature is that it renders a list of tasks the user needs to do. When tasks are complete, the user clicks on the checkmarks which sends a boolean where if complete, it is removed from the list. And of course, a textbox with a submit button to add more items to the list. 

Turns out, checkmarks are not a submit function. This became a major bug we (myself + instructional resources) were not able to overcome due to limitations with ejs & HTML. Possibly, React would be a better tool to bridge this gap. 

### The Pomodoro Widget
The pomodoro timer was another obstacle because it requires JQuery and JavaScript in order to run main functions such as Start/Pause, Reset and increasing the break time or work time. 

As it turns out, you cannot import a custom JS file as a partial `<%- include('../partials/something.js') %>` and I learned that the way around this roadblock was to include the `<script></script>` tags including the jquery link in the footer partial and import that into the page that requires it. 
