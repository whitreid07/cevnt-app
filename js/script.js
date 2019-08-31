//Object array
eventsApp = {};

eventsApp.url = "https://app.ticketmaster.com/discovery/v2/events.json";
eventsApp.apiKey = "ftYfSGG92vqF6hHoXIE25YwqEXwj0jhe";

eventsApp.userPickDate = '',
eventsApp.userPickCity = '',
eventsApp.userPickEvents = '',

eventsApp.eventsArray = [],

//Function to make API call to Ticketmaster
eventsApp.getEvents = () => {
  $.ajax({
    method: "GET",
    url: eventsApp.url,
    dataType: "json",
    data: {
      apikey: eventsApp.apiKey,
      startDateTime: `${eventsApp.userPickDate}T00:00:00Z`,
      endDateTime: `${eventsApp.userPickDate}T23:00:00Z`,
      city: eventsApp.userPickCity,
      segmentName: eventsApp.userPickEvents
    }
  }).then ((res) => {
    console.log("Then result", res);
    eventsApp.displayEvents(res._embedded.events);
  })
  // .catch(error => {
  //     // error is a variable whose value is 
  //     // whatever we defined in the reject function when we created the promise
  //     console.log("ERROR", error);
  //  })
},

//Function to get user selection of city and date     
eventsApp.getUserInput = () => {
  //Gets the value of selected city
  $('.dropdownCityContent').on('click', 'li', function (e) {
    e.stopPropagation();
    eventsApp.userPickCity = $(this).text();
    $('.dropbtn1').text(eventsApp.userPickCity);
  });

  //Gets the value of selected event
  $('.dropdownEventContent').on('click', 'li', function (e) {
    e.stopPropagation();
    eventsApp.userPickEvents = $(this).text();
    $('.dropbtn2').text(eventsApp.userPickEvents);
    });

   eventsApp.calendar();
},

//Function to display the events 
eventsApp.displayEvents = (result) => {
  $('.displayEvents').show();
  $('.displayEvents').empty();

  //Stores the API data into an array
  result.forEach(function (events) {
    eventsApp.eventsArray.push(events);
  });
  
  if (eventsApp.eventsArray.length < 3) {
    //Display all  3 events when there is only 3 events
    eventsApp.eventsArray.forEach(function (events) {

      const imageSize = events.images.find(image => image.width === 1024);
      $('.displayEvents')
        .append(`<div>
                    <img src="${imageSize.url}" alt=""/>
                    <h2>${events.name}</h2>
                    <p>${events._embedded.venues[0].name}</p>
                    <p>${events.dates.start.localTime}</p>
                    
                    <a href="${events.url}">get tickets</a>
                </div>`);
    })
  } else {
      //Display the first 3 events when there are more than 3 events
      for (let i = 0; i < 3; i++) {
        // const index = eventsApp.getRandomEvents();
        const imageSize = eventsApp.eventsArray[i].images.find(image => image.width === 1024);

        $('.displayEvents')
          .append(`<div>
                        <img src="${imageSize.url}" alt=""/>
                        <h2>${eventsApp.eventsArray[i].name}</h2>
                        <p>${eventsApp.eventsArray[i]._embedded.venues[0].name}</p>
                        <p>${eventsApp.eventsArray[i].dates.start.localTime}</p>

                        <a href="${eventsApp.eventsArray[i].url}">get tickets</a>
                    </div>`);
        } 
    }
    //Empty the events array
    eventsApp.eventsArray = [];
  },

//Function to display the calendar plugin 
eventsApp.calendar = () => {
  $('.myCalendar').empty();  
    $('.myCalendar').calendar({
      date: new Date(),
      autoSelect: false, // false by default
      select: function (date) {
        
        //Change of date format to yyyy-mm-dd
        const formatPickDate = new Date(date);
        const selectedDate = new Date(formatPickDate.getTime() - (formatPickDate.getTimezoneOffset() * 60000))
          .toISOString()
          .split("T")[0];
        
        const formatTodayDate = new Date();
        const todayDate = new Date(formatTodayDate.getTime() - (formatTodayDate.getTimezoneOffset() * 60000))
          .toISOString()
          .split("T")[0];
      
       //Condition statements to make sure user pick a city, type of event and specific date
        if (todayDate > selectedDate) {
            alert('That day is gone');
        } else if (eventsApp.userPickCity === '' && eventsApp.userPickEvents === '') {
          alert("Pick a city and event")
        } else if (eventsApp.userPickCity === '') {
          alert('Pick a city');
        } else if (eventsApp.userPickEvents === '') {
          alert('Pick an event');
        } else {
          eventsApp.userPickDate = selectedDate;
          eventsApp.getEvents();
        }
      },
      toggle: function (y, m) { }
    })
},

eventsApp.init = () => {
  //Loads the calendar
  $('.myCalendar').calendar();

  eventsApp.getUserInput();
  
}

//Start of doc ready
$(document).ready(function () {
  eventsApp.init();

});

