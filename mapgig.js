Router.route('/', function () {
  this.render('register');
});
Router.route('/map');
Router.route('/gigs');
Router.route('/home');
Router.route('/login');
Markers = new Mongo.Collection('markers');

if (Meteor.isClient) {

  Meteor.startup(function () {
    GoogleMaps.load();
});

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

  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

      var markers = {};

      Markers.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
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

  Template.home.events({
  'click .gigs': function() {
     Router.go("gigs");
  }
});

  Template.home.events({
  'click .map': function() {
     Router.go("map");
  }
});

  Template.map.events({
    'click .logout': function(){
      event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

Template.logout_btn.events({
  'click .gig_btn': function() {
     Router.go("map");
  }
});

Template.logout_btn.events({
  'click .create_btn': function() {
     Router.go("gigs");
  }
});



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

  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
      google.maps.event.addListener(map.instance, 'click', function(event) {
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

      var markers = {};

      Markers.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
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

Template.gigs.events({
    'submit form': function(){
        Router.go("map");
  }
});

 GigsList = new Mongo.Collection('gigs');

  //Accounts.ui.config({
    //passwordSignupFields: "USERNAME_ONLY"
  //});

  //Meteor.startup(function() {
    //GoogleMaps.load();
  //});


}
  });
}

