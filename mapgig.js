//When App starts you will be brought to the reg page
Router.route('/', function () {
  this.render('register');
});
// Set up of routes for each page created
Router.route('/map');
Router.route('/gigs');
Router.route('/home');
Router.route('/login');

// The setting up of the mongodb which will store data
Markers = new Mongo.Collection('markers');
if (Meteor.isClient) {

  //On startup google maps will load
  Meteor.startup(function () {
    GoogleMaps.load();
});

  //when the map loads it will focus in on Dublin
    Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(53.3478,-6.2597),
          zoom: 8
        };
      }
    }
  });

  //The click function to drop markers on the map
  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
       Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
//Preset marker
      var marker = new google.maps.Marker({
    position: (53.3489,-6.2432),
    map: map,
    title: "MapGig HQ"
  });

      var markers = {};
  //Turned off allowing the marker to be draggable could set to true at a later date
      Markers.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: false,

            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });
 var marker = new google.maps.Marker({
    position: new google.maps.LatLng(53.3489,-6.2432),
    map: map.instance,
     title: 'MapGig HQ',
  });


         google.maps.event.addListener(marker, 'dragend', function(event) {
           Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          markers[document._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
        removed: function (oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }


      });
    });
  });
//Click button to bring you to gigs page
  Template.home.events({
  'click .gigs': function() {
     Router.go("gigs");
  }
});
//Click button to bring you to map page
  Template.home.events({
  'click .map': function() {
     Router.go("map");
  }
});
//Click button to bring you to login page
  Template.map.events({
    'click .logout': function(){
      event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});
//Click button to bring you to login page at different template
  Template.home.events({
    'click .logout': function(){
      event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});
//Click button to bring you to map page at different template
Template.logout_btn.events({
  'click .gig_btn': function() {
     Router.go("map");
  }
});
//Click button to bring you to gigs page at different template
Template.logout_btn.events({
  'click .create_btn': function() {
     Router.go("gigs");
  }
});
//Click button to bring you to map page at different template
  Template.gigs.events({
  'click .gig_btn': function() {
     Router.go("map");
  }
});
//Click button to bring you to gigs page at different template
  Template.map.events({
  'click .create_btn': function() {
     Router.go("gigs");
  }
});
//setting up of reg form
  Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
      Router.go('home');
    }
});
//setting up of login form
  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
    if(error){
        console.log(error.reason);
    } else {
        Router.go("home");
    }
});

//setting up pf gigs form
   Template.gigs.events({
    "submit form": function(event, template) {
        event.preventDefault();
        Markers.insert({
            venueName: template.find(".venueName").value,
            bandName: template.find(".bandName").value,
            date: template.find(".date").value,
            time: template.find(".time").value,
            price: template.find(".price").value
       })
 }
   });




}
  });
}

