/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const messageListElement = document.getElementById('messages');
const messageFormElement = document.getElementById('message-form');
const messageInputElement = document.getElementById('message');
const submitButtonElement = document.getElementById('submit');
const imageButtonElement = document.getElementById('submitImage');
const imageFormElement = document.getElementById('image-form');
const mediaCaptureElement = document.getElementById('mediaCapture');
const clearmessage = document.getElementById('clear');
const userPicElement = document.getElementById('user-pic');
const userNameElement = document.getElementById('user-name');
const signInButtonElement = document.getElementById('sign-in');
const signOutButtonElement = document.getElementById('sign-out');
const signInSnackbarElement = document.getElementById('must-signin-snackbar');
const chatrooms = document.getElementById('chatrooms');
let roomElement = document.getElementsByClassName('rooms');

addbuttonevent();
let collections = ["messages-A", "messages-B", "messages-C"];
let currentRoom = 1;
let numRooms = 3;
roomElement[currentRoom].style.backgroundColor = 'yellow';
roomElement[currentRoom].style.color = 'rgb(18, 205, 205)';
roomElement[currentRoom].style["border-color"] = 'rgb(18, 205, 205)';



// Signs-in Friendly Chat.
function signIn() {
  console.log("sign in");
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

// Signs-out of Friendly Chat.
function signOut() {
    firebase.auth().signOut();
}

//Initialize firebase.
function initFirebase(){
  // TODO
  firebase.initializeApp({
    apiKey: "AIzaSyCGqIQqnCx-Hg2Bnx-__cVWFBnuv6sGffk",
    authDomain: "selam-7ae8f.firebaseapp.com",
    databaseURL: "https://selam-7ae8f.firebaseio.com",
    projectId: "selam-7ae8f",
    storageBucket: "selam-7ae8f.appspot.com",
    messagingSenderId: "804364333100",
    appId: "1:804364333100:web:55ddb72596a3c946d5a189",
    measurementId: "G-EF1FEK7TZ2"
  });
}
// Initiate firebase auth.
function initFirebaseAuth() {
  // TODO 3: Initialize Firebase.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  // TODO 4: Return the user's profile pic URL.
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  // TODO 5: Return the user's display name.
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  // TODO 6: Return true if a user is signed-in.
  return !!firebase.auth().currentUser;
}

function changeroom(i){
  currentRoom = parseInt(i);
 
  messageListElement.innerHTML="";

  if(i != 0){
    loadMessages();
  }
  else if(numRooms>5 && i==0){

    alert("Maximum amount of room reached.");
  }
  else{
    //chatroom
    const newbtn = document.createElement('button');
    newbtn.setAttribute("id", `room${String.fromCharCode(65+numRooms)}`);
    newbtn.setAttribute("class", "rooms");
    newbtn.innerHTML = `Room ${String.fromCharCode(65+numRooms)}`;
    chatrooms.appendChild(newbtn);
    collections.push(`messages-${String.fromCharCode(65+numRooms)}`);
    
    numRooms+=1;
    currentRoom = numRooms;
    addbuttonevent();
    loadMessages();

  }

  Object.keys(roomElement).forEach(function(key){
    if(key==currentRoom){
      roomElement[key].style.backgroundColor = 'yellow';
      roomElement[key].style.color = 'rgb(18, 205, 205)';
      roomElement[key].style["border-color"] = 'rgb(18, 205, 205)';
    }
    else{
      roomElement[key].style.backgroundColor = 'rgb(18, 205, 205)';
      roomElement[key].style.color = 'yellow';
      roomElement[key].style["border-color"] = 'yellow';
    }
  });

  
}
// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // TODO 7: Push a new message to Firebase.
  return firebase.firestore().collection(collections[currentRoom-1]).add({
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  
  var query = firebase.firestore()
                .collection(collections[currentRoom-1])
                .orderBy('timestamp', 'desc')
                .limit(12);

  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    let tsToMillis = firebase.firestore.Timestamp.now().toMillis();
    let compareDate = new Date(tsToMillis - (24 * 60 * 60 * 1000));
    snapshot.docChanges().forEach(function(change) {
      console.log(Date.parse(compareDate), change.doc.data().timestamp.toMillis());
      if (change.type === 'removed' || (change.doc.data().timestamp.toMillis() < Date.parse(compareDate)) ) {
          deleteMessage(change.doc.id);
      } else {
          var message = change.doc.data();
          displayMessage(change.doc.id, message.timestamp, message.name,message.text, message.profilePicUrl, message.imageUrl);
      }
    });
  });
}

function clearout(e){
  console.log("clearing");
  
  firebase.firestore().collection(collections[currentRoom-1]).get()
  .then(function(querySnapshot) {
        // Once we get the results, begin a batch
        var batch = firebase.firestore().batch();

        querySnapshot.forEach(function(doc) {
            // For each doc, add a delete operation to the batch
            batch.delete(doc.ref);
        });

        // Commit the batch
        batch.commit();
  }).then(function() {
      // Delete completed!
      // ...
  }); 
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
function saveImageMessage(file) {
  // TODO 9: Posts a new image as a message.
  // 1 - We add a message with a loading icon that will get updated with the shared image.
  firebase.firestore().collection(collections[currentRoom-1]).add({
    name: getUserName(),
    imageUrl: LOADING_IMAGE_URL,
    profilePicUrl: getProfilePicUrl(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(function(messageRef) {
    // 2 - Upload the image to Cloud Storage.
    var filePath = firebase.auth().currentUser.uid + '/' + messageRef.id + '/' + file.name;
    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image's URL.
        return messageRef.update({
          imageUrl: url,
          storageUri: fileSnapshot.metadata.fullPath
        });
      });
    });
  }).catch(function(error) {
    console.error('There was an error uploading a file to Cloud Storage:', error);
  });
}

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
  // TODO 10: Save the device token in the realtime datastore
}

// Requests permissions to show notifications.
function requestNotificationsPermissions() {
  // TODO 11: Request permissions to send notifications.
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

function createAndInsertMessage(id, timestamp) {
  const container = document.createElement('div');
  container.innerHTML = MESSAGE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }

  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');

  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}
// Shortcuts to DOM Elements.



// initialize Firebase
initFirebase();
// Checks that Firebase has been imported.
checkSetup();

function addbuttonevent()
{
  Object.keys(roomElement).forEach(function(key){
    if (roomElement[key].getAttribute('listener') !== 'true') {
      roomElement[key].addEventListener('click', function (e) {
          const elementClicked = e.target;
          elementClicked.setAttribute('listener', 'true');
          changeroom(key);
        } );
    }
  });
}

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

//delets messages
clearmessage.addEventListener('click', clearout);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase Auth
initFirebaseAuth();

// TODO: Enable Firebase Performance Monitoring.

// We load currently existing chat messages and listen to new ones.
loadMessages();


// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }

