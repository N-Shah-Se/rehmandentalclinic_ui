$(document).ready(function () {
    // Toggle individual menu items
    $(".nav-link.dropdown-toggle").on("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior
  
      const targetId = $(this).attr("data-bs-target"); // Get the target collapse ID
      const $targetMenu = $(targetId);
  
      // Collapse or expand the menu
      if ($targetMenu.hasClass("show")) {
        $targetMenu.slideUp(300).removeClass("show");
      } else {
        $targetMenu.slideDown(300).addClass("show");
      }
  
      // Adjust aria-expanded attribute
      $(this).attr("aria-expanded", $targetMenu.hasClass("show"));
    });
  
    // Highlight active menu item
    $(".nav-link").on("click", function () {
      // Remove active state from all links
      $(".nav-link").removeClass("active");
  
      // Add active state to the clicked link
      $(this).addClass("active");
    });
  
    // Toggle full sidebar visibility
    $(".js-navbar-vertical-aside-toggle-invoker").on("click", function () {
      const $sidebar = $(".js-navbar-vertical-aside");
  
      // Toggle the collapsed state
      if ($sidebar.hasClass("collapsed")) {
        $sidebar.removeClass("collapsed").addClass("expanded");
      } else {
        $sidebar.removeClass("expanded").addClass("collapsed");
      }
    });
  });
  