$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyACHinstEQgEmnH_YdhjkJPagDCvC3WrvA",
        authDomain: "trainscheduler-70a21.firebaseapp.com",
        databaseURL: "https://trainscheduler-70a21.firebaseio.com",
        projectId: "trainscheduler-70a21",
        storageBucket: "trainscheduler-70a21.appspot.com",
        messagingSenderId: "554139441056"
      };
      firebase.initializeApp(config);
    var url = "https://trainscheduler-70a21.firebaseio.com";
    var database = firebase.database();
    
    var name ='';
    var destination = '';
    var firstTrainTime = '';
    var frequency = '';
    var nextTrain = '';
    var nextTrainFormatted = '';
    var minutesAway = '';
    var firstTimeConverted = '';
    var currentTime = '';
    var diffTime = '';
    var timeRemainder = '';
    var minutesUntilTrain = '';
    var keyHolder = '';
    var getKey = '';
    //capture button click
    $("#submit").on("click", function() {
    
    //link variable to rel html val 
        name = $('#inputTrainName').val().trim();
        destination = $('#inputDestination').val().trim();
        time = $('#inputFirstTrain').val().trim();
        frequency = $('#inputTrainFrequency').val().trim();
    
    //push data to firebase database
        database.ref().push({
            name: name,
            destination : destination,
            time : time,
            frequency : frequency,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
        //Do not refresh
        $("input").val('');
             return false;
    });
    //reaction to child element being clicked
    database.ref().on("child_added", function(childSnapshot) {
        var name = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().frequency;
    console.log("Name: "+name);
    console.log("Dest: "+destination);
    console.log("Time"+time);
    console.log("frequency"+frequency);
    
    //time conversion
    var freq = parseInt(freq);
    
    //get current time
        currentTime = moment();
        console.log("Current Time: "+ moment().format('HH:mm'))
        firstTimeConverted = moment(childSnapshot.val().time,'HH:mm').subtract(1, "years");
        console.log("First Time converted: "+firstTimeConverted);
        var trainTime = moment(firstTimeConverted).format('HH:mm');
        console.log("Train Time: " + trainTime);
    
    //calculate time difference
        var tConverted = moment(trainTime, 'HH:mm').subtract(1,'years');
        var tDifference = moment().diff(moment(tConverted),'minutes');
        console.log("time difference: "+tDifference);
    
    //calculate remainder
        var tRemainder = tDifference % freq;
        console.log("Time remaining: "+tRemainder);
        
    //Mins till next train
        var minsAway = freq - tRemainder;
        console.log ("Mins till next train: "+minsAway);
    
    //Next Train
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("Arrival Time: "+moment(nextTrain).format('HH:mm A'));
    
    //Table Data
    //Append to display 
    $('#currentTime').text(currentTime.format("YYYY-MM-DD HH:mm"))
    
    $('#trainInfo').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().destination +
            "</td><td id='freqDisplay'>" + childSnapshot.val().frequency +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },
    
    // Handle errors
    function(errorObject){
        console.log("Errors handled: " + errorObject.code)
    });
    });