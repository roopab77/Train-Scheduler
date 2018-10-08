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
        $("#display-train-details").empty();
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

      //This will clear all the text in the input fields
      function clearText()
      {
       $("#input-train-name").val("");
       $("#input-train-destination").val("");
       $("#input-first-train").val("");    
       $("#input-frequency").val("");

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
        frequencyforFB = $("#input-frequency").val();

        // console.log(trainNameforFB, destinationforFB, firstTraintimeforFB, frequencyforFB);
        var train = {

          trainName: trainNameforFB,
          destination: destinationforFB,
          firstTraintime: firstTraintimeforFB,
          frequency: frequencyforFB
        };
        database.ref().push(train);
        clearText();
        fillTablewithTrainDetails();
        

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
        $("#btn-submit").attr("style", "display:none");
        $("#btn-update").attr("style", "display:block");

        var trainInfo = "";
        var keytoUpdate = $(this).attr("value");
        $("#btn-update").attr("value", keytoUpdate);
        database.ref(keytoUpdate).once("value", trainInfo => {
          $("#input-train-name").val(trainInfo.val().trainName);
          $("#input-train-destination").val(trainInfo.val().destination);
          $("#input-first-train").val(trainInfo.val().firstTraintime);
          $("#input-frequency").val(trainInfo.val().frequency);
        });
      });

      //Updates the exisiting entries in firebase
      $("#btn-update").on("click", function (event) {
          var keytoUpdate = $(this).attr("value");
          var trainNameforFB = $("#input-train-name").val();
          var destinationforFB = $("#input-train-destination").val();
          var firstTraintimeforFB = $("#input-first-train").val();
          var frequencyforFB = $("#input-frequency").val();

          database.ref(keytoUpdate).set({
              trainName: trainNameforFB,
              destination: destinationforFB,
              firstTraintime: firstTraintimeforFB,
              frequency: frequencyforFB
            });
            clearText();
            fillTablewithTrainDetails();
            $("#btn-update").attr("style", "display:none");
            $("#btn-submit").attr("style", "display:block");
          });
      

        fillTablewithTrainDetails();

        setTimeout(function () {
          window.location.reload(1);
        }, 5000 * 200);


      });