"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Function to hide all sections
  function hideAllSections() {
    var sections = document.querySelectorAll(".section");
    sections.forEach(function (section) {
      section.classList.add("hidden");
    });
    console.log("All sections hidden");
  }

  // Event listener for studyBtn
  document.getElementById("studyBtn").addEventListener("click", function () {
    console.log("stdbtn clicked");
    hideAllSections();
    var section1 = document.querySelector(".section1");
    section1.classList.remove("hidden");
  });

  // Event listener for myBatchesBtn
  document
    .getElementById("myBatchesBtn")
    .addEventListener("click", function () {
      console.log("mybatchbtn clicked");
      hideAllSections();
      var section2 = document.querySelector(".section2");
      section2.classList.remove("hidden");
      console.log("section2 shown");
    });
  // Event listener for testBtn
  document.getElementById("testBtn").addEventListener("click", function () {
    console.log("testBtn clicked");
    hideAllSections();
    var section3 = document.querySelector(".section3");
    section3.classList.remove("hidden");
    console.log("section3 shown");
  });
  // Event listener for libraryBtn
  document.getElementById("libraryBtn").addEventListener("click", function () {
    console.log("libraryBtn clicked");
    hideAllSections();
    var section4 = document.querySelector(".section4");
    section4.classList.remove("hidden");
    console.log("section4 shown");
  });
});
