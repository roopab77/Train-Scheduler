$(document).ready(function () {

  //Initialising fire base
  var config = {
    apiKey: "AIzaSyBsVVoU2zL4m1Y7R7pe79wDyyhbleCOQqw",
    authDomain: "train-schedule-2fc06.firebaseapp.com",
    databaseURL: "https://train-schedule-2fc06.firebaseio.com",
    projectId: "train-schedule-2fc06",
    storageBucket: "",
    messagingSenderId: "968463198916"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  //Function will fill table with train details
  function fillTablewithTrainDetails() {
    database.ref().on("child_added", function (childSnapshot) {
      //console.log(childSnapshot.val());
      var trainNamefromFB = childSnapshot.val().trainName;
      var destinationfromFB = childSnapshot.val().destination;
      var firstTraintimefromFB = childSnapshot.val().firstTraintime;
      var frequencyfromFB = childSnapshot.val().frequency;
      var keyinFB = childSnapshot.key;

      var trTag = $("<tr class='train-row'>");
      var tdTagTrainName = $("<td class='td-trainname'>");
      var tdTagDestination = $("<td>").attr("scope", "col");
      var tdTagFrequency = $("<td>").attr("scope", "col");
      var tdTagNextArrival = $("<td>").attr("scope", "col");
      var tdTagMinutesAway = $("<td>").attr("scope", "col");
      var tdTagUpdate = $("<td> <img src='images/update.png' id='train-update' value = '" + keyinFB + "' >").attr("scope", "col");
      var tdTagDelete = $("<td> <img src='images/delete.png' id='train-delete' value = '" + keyinFB + "' >").attr("scope", "col");

      // Assumptions
      var tFrequency = parseInt(frequencyfromFB);

      // Time is 3:30 AM
      var firstTime = firstTraintimefromFB;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      // console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      //console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      //console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      //console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

      tdTagTrainName.text(trainNamefromFB);
      tdTagDestination.text(destinationfromFB);
      tdTagFrequency.text(frequencyfromFB);
      tdTagNextArrival.text(moment(nextTrain).format("hh:mm A"));
      tdTagMinutesAway.text(tMinutesTillTrain);

      trTag.append(tdTagTrainName, tdTagDestination, tdTagFrequency, tdTagNextArrival, tdTagMinutesAway, tdTagUpdate, tdTagDelete);




      $("#display-train-details").append(trTag);

    });
  }

  //On button Submit 

  $("#btn-submit").on("click", function (event) {

    var trainNameforFB = "";
    var destinationforFB = "";
    var firstTraintimeforFB = "";
    var frequencyforFB = 0;

    trainNameforFB = $("#input-train-name").val();
    destinationforFB = $("#input-train-destination").val();
    firstTraintimeforFB = $("#input-first-train").val();
    
    console.log($("#input-first-train"));
   // console.log(firstTraintimeforFB);
    frequencyforFB = $("#input-frequency").val();

    // console.log(trainNameforFB, destinationforFB, firstTraintimeforFB, frequencyforFB);
    var train = {

      trainName: trainNameforFB,
      destination: destinationforFB,
      firstTraintime: firstTraintimeforFB,
      frequency: frequencyforFB
    };

    database.ref().push(train);
    // fillTablewithTrainDetails();

  });

  //When delete clicked will delete in firebase

  $(document).on("click", "#train-delete", function (event) {
    // alert("deleting");
    event.preventDefault();
    var keytoDelete = $(this).attr("value");
    database.ref(keytoDelete).remove();
    $(this).parent().parent().empty();

  });



  //When update clicked this will update the info on firebase
  $(document).on("click", "#train-update", function (event) {

    



  });


  fillTablewithTrainDetails();

  setTimeout(function () {
    window.location.reload(1);
  }, 5000 * 200);


});