# ☀️Selam

Selam is a chat application that allows user to send texts and images that can be viewed by others.  

## User Stories

The following functionality is complete:

* [x] User can login using their google account
* [x] User can send text messages
* [x] User can send images
* [x] User can view messages sent in the last 24 hours
* [x] User can create multiple chatrooms
* [x] User can clear all the messages in a chatroom

The following functionality will be implemented:

* [ ] User can rename chatrooms

## Main functions

### ← signIn(), signOut(), initFirbase(), initFirebaseAut(), getProfileURl(), getUserName() 

These functions are responsible for connecting to firbase, and signing the user in and retriving their name and profile picture.

### ← addbuttonevent()

This function associates room with its own collection of messages.

### ← changeroom(), loadrooms(), displayrooms(), saveRoom(), saveMessage(), saveImageMessage(), loadMessages(), createAndInsertMessage(), displayMessage() 

These functions are responsible for keeping track of the messages sent in each room and displaying it appropriately.

## Tools used
**📜Language**
- Vaniela JS
- HTML/CSS
- Material Design

**🚀Platform**
- Firebase

**👩🏾‍💻IDE**
- VS

## Video Walkthrough 

Here's a walkthrough of implemented user stories:

<img src="/selam.gif" width="100%"/>

GIF created with [cloudconvert](https://cloudconvert.com).

## Getting Started 
- Fork and clone the repo on your local machine.  
- Open the terminal and navigate to the root folder. 
- Run `firebase serve --only hosting` on the command line to start serving the app from [http://localhost:5000](http://localhost:5000/), and then open it in your browser."

[Deployed app](https://selam-7ae8f.web.app/) 

## Credits
Tutorial adapted from Google Codelab. 
