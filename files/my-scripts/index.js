$(document).ready(function () {
    // $("#sidebar").load("sidebar.html");
    $("#header").load("header.html");
    $('.handelActive').removeClass('active');
    $("#sidebar").load("sidebar.html", function () {
      // After loading, add the 'active' class to the #dashboard element
      $('#dashboard').addClass('active');
      console.log('Updated classes:', $('#dashboard').attr('class'));
  });

   
  });
