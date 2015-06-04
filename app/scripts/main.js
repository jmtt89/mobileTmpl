'use strict';


var owl;
var geofences = [];

function resetGeofences(){

  for(var i=geofences.length - 1; i>=0 ;i--){
    $('.add-remove').slick('slickRemove',i);
  }
  $('.add-remove').slick('slickRemove', 0);

  geofences = [];
  var html = '';
  html += '<div class="card">';
  html += '  <div class="content text-center">';
  html += '    <p id="instrunction1">There are no geofences yet.</p>';
  html += '    <p id="instrunction2">Once you receive a geofence it will appear in this section.</p>';
  html += '    <p>Location: <span id="latitude">NULL</span>,<span id="longitude">NULL</span> (<span id="provider">NULL</span>)</p>';
  html += '    <p>Accuracy:<span id="accuracy">NULL</span> meters</p>';
  html += '  </div>';
  html += '</div>';
  $('.carousel').slick('slickAdd',html);
}

function addNotification(jsonNotify){
  var html = '';
  html +='<li class="card" id="'+jsonNotify.id+'">';
  html +='  <h4 class="title clearfix"><small class="date pull-right">'+moment(jsonNotify.date).format('MMM, D')+'</small><div class="truncate">'+jsonNotify.title+'</div></h4>';
  html +='  <div class="content">';
  html +=     jsonNotify.content;
  html +='  </div>';
  html +='</li>';
  $('#notifications').prepend(html);
}

function updateLocation(jsonLocation){
  $('#latitude').html(jsonLocation.latitude);
  $('#longitude').html(jsonLocation.longitude);
  $('#provider').html(jsonLocation.provider);
  $('#accuracy').html(jsonLocation.accuracy);
}

function updateDistances(jsonLocation){
  var jsonGeofence; 
  for(var g=0 ; g<geofences.length ; g++){
    jsonGeofence = geofences[g];
    $('#'+jsonGeofence.id+' .distance').html(distance(jsonLocation.latitude, jsonLocation.longitude, jsonGeofence.latitude, jsonGeofence.longitude, 'K')*1000);
  }
}

function addGeofence(jsonGeofence){
  geofences.push(jsonGeofence);
  if (geofences.length > 0){
    $('#instrunction1').html('There are '+geofences.length+' geofences.');
    $('#instrunction2').html('Swipe right to view the status');
  }else{
    $('#instrunction1').html('There are no geofences yet.');
    $('#instrunction2').html('Once you receive a geofence it will appear in this section');
  }

  var html = '';
  html += '<div class="card" id="'+jsonGeofence.id+'">';
  html += '  <div class="content text-center">';
  html += '    <p>Geofence type '+jsonGeofence.type+'</p>';
  html += '    <p>The Center is ('+jsonGeofence.latitude+','+jsonGeofence.longitude+')</p>';
  html += '    <p>Radius is '+jsonGeofence.radius+' meters</p>';
  html += '    <p>You are a <span class="distance">UNDEFINED</span> meters from the Center</p>';
  html += '  </div>';
  html += '</div>';

  $('.carousel').slick('slickAdd',html);
}

function removeNotification(id){
  $('#'+id).remove();
}

function init(jsonNotifications,jsonGeofences,jsonLocation,beaconsSupported,version){
  var html = '';
  updateLocation(jsonLocation);

  var jsonGeofence; 
  geofences = jsonGeofences;
  for(var g=0 ; g<jsonGeofences.length ; g++){
    jsonGeofence = jsonGeofences[g];
    html += '<div class="card">';
    html += '  <div class="content text-center">';
    html += '    <p>Geofence type '+jsonGeofence.type+'</p>';
    html += '    <p>The Center is ('+jsonGeofence.latitude+','+jsonGeofence.longitude+')</p>';
    html += '    <p>Radius is '+jsonGeofence.radius+' meters</p>';
    html += '  </div>';
    html += '</div>';
  }

  $('.carousel').slick({
    dots: true
  })

  html = '';
  var jsonNotify; 
  for(var i=0 ; i<jsonNotifications.length ; i++){
    jsonNotify = jsonNotifications[i];
    html +='<li class="card">';
    html +='  <h4 class="title">'+jsonNotify.title+'<small class="date pull-right">'+moment(jsonNotify.date).format('MMM, D')+'</small></h4>';
    html +='  <div class="content">';
    html +=     jsonNotify.content;
    html +='  </div>';
    html +='</li>';
  }

  html +='<li class="card">';
  html +='  <h4 class="title">Welcome to Messangi demo app</h4>';
  html +='  <div class="content">';
  html +='    <p>You have not received any push notifications</p>';
  html +='    <p>New messages will be shown in this area. Messages can include rich text and images</p>';
  html +='    <p>Please go to messangi.com to send push notifications</p>';
  html +='    <p>Beacons are '+beaconsSupported ?'':'NOT'+' supported by this device</p>';
  html +='    <p>Version are '+version+'</p>';
  html +='  </div>';
  html +='</li>';

  $('#notifications').html(html);
}

$(document).ready(function(){
  init([],[],{latitude:0.0,longitude:0.0,accuracy:0,provider:'NULL'},true,0.5);

  $('#addGeofence').click(function() {
    addGeofence({
      type: Math.random() > 0.5 ? 'ENTER' : 'EXIT',
      latitude: Math.random() * 25,
      longitude: Math.random() * 25,
      radius: Math.random()*300 +200
    });
  });

  $('#addNotification').click(function() {
    addNotification({
      id: Math.floor(Math.random()*100),
      title: 'Lorem ipsum Deserunt aute in do in.',
      date: moment().format('MMM, D'),
      content: '<p>Lorem ipsum Et aliquip velit in ad pariatur ea id id fugiat elit deserunt in reprehenderit eu est dolor nostrud anim aliquip mollit sed nisi commodo quis et laborum aliquip dolore.</p>'
    });
  });
});