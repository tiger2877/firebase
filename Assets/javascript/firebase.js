  /*-- FIREBASE -->
  <!-- ================================================================ -->
  <!-- initialize Firebase                                              -->
  <!-- grab user inputs and upload data to the database                 -->
  <!-- create firebase events for adding data to the database           -->
  <!-- ================================================================ -->*/

/* global moment firebase */

    // Initialize Firebase
    // Make sure to match the configuration to the script version number in the HTML
    // (Ex. 3.0 != 3.7.0)        
    var config = {
    apiKey: "AIzaSyAVNjWwdfUIfCP78rjCZFX1rSIZ4yL5VF0",
    authDomain: "train-time-f4e2b.firebaseapp.com",
    databaseURL: "https://train-time-f4e2b.firebaseio.com",
    projectId: "train-time-f4e2b",
    storageBucket: "train-time-f4e2b.appspot.com",
    messagingSenderId: "270008603629"
  };

    firebase.initializeApp(config);

    // VARIABLES
    // --------------------------------------------------------------------------------

    // Get a reference to the database service
    var database = firebase.database();
 
    // FUNCTIONS + EVENTS
    // --------------------------------------------------------------------------------
  // Button for adding train schedule
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  var firstTime = $("#arrival-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    frequency: trainFrequency,
    time: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  // Uploads train data to the database by using database.ref().push
    database.ref().push({
    name: trainName,
    destination: trainDestination,
    frequency: trainFrequency,
    time: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.frequency);
  console.log(newTrain.time);
  console.log(newTrain.dateAdded);
 
 // after push show alert
  alert("Train Schedule successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#arrival-input").val("");

});

 // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
 // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(snapshot) {
 
  console.log(snapshot.val());

  // Store everything into a variable.
  var trainName = snapshot.val().name;
  var trainDestination = snapshot.val().destination;
  var trainFrequency = snapshot.val().frequency;
  var firstTime = snapshot.val().time;
  
    // Get current date and time
    var currentTime = moment(); 

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("First Train Time: " + moment(firstTimeConverted).format("h:mm a"));

    // Calculate the next train arrival
     // Difference between the times
  
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes")
 
    console.log("Difference in time: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("Minutes till train: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("h:mm a"));

    // Prettify the next train time
    var nextTrainPretty = moment(nextTrain).format("h:mm a");

  // Create the new row aappend the result
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainPretty),     
    $("<td>").text(tMinutesTillTrain), 
   
  );

  // Append the new row to the table
  $("#train-table").append(newRow);
});
