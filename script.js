"use strict";

// Elements
const titleElement = document.querySelector(".title");
const buttonsContainer = document.querySelector(".buttons");
const yesButton = document.getElementById("yesBtn");
const noButton = document.getElementById("noBtn");
const catImg = document.querySelector(".cat-img");
const nameInputContainer = document.getElementById("nameInputContainer");
const mainContent = document.getElementById("mainContent");
const successMessage = document.getElementById("successMessage");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const userNameSpan = document.getElementById("userName");
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const responseList = document.getElementById("responseList");
const heartsContainer = document.querySelector(".hearts-container");
const totalResponsesSpan = document.getElementById("totalResponses");
const clearResponsesBtn = document.getElementById("clearResponses");

// Config
const MAX_IMAGES = 5;
const ADMIN_PASSWORD = "loveyou";
const EMAILJS_SERVICE_ID = "service_96yfuby";
const EMAILJS_TEMPLATE_ID = "template_8yvwjgn";
const EMAILJS_PUBLIC_KEY = "aqNVnHyvn2dANWZiW";

// State
let play = true;
let noCount = 0;
let userName = "";
let responses = JSON.parse(localStorage.getItem('valentineResponses')) || [];

// Init EmailJS
function initializeEmailJS() {
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log("✅ EmailJS initialized successfully");
    } else {
      console.log("❌ EmailJS not loaded");
    }
  } catch (error) {
    console.log("❌ EmailJS initialization failed:", error);
  }
}

// DOM Ready
window.addEventListener('DOMContentLoaded', function () {
  initializeEmailJS();
  createHearts();
  loadResponses();
  updateTotalResponses();

  startBtn.addEventListener("click", startExperience);
  yesButton.addEventListener("click", handleYesClick);
  noButton.addEventListener("click", handleNoClick);
  adminBtn.addEventListener("click", toggleAdminPanel);
  clearResponsesBtn.addEventListener("click", clearAllResponses);

  nameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") startExperience();
  });

  console.log("✅ Website initialized successfully");
});

function startExperience() {
  console.log("🎯 Start button clicked!");

  userName = nameInput.value.trim();
  if (!userName) {
    alert("Please enter your name!");
    nameInput.focus();
    return;
  }

  nameInputContainer.classList.add("hidden");
  mainContent.classList.remove("hidden");
  console.log("✅ User started:", userName);
}

function handleYesClick() {
  console.log("💖 Yes button clicked for user:", userName);

  if (!play) return;
  if (!userName) {
    alert("Please enter your name first!");
    return;
  }

  const response = {
    name: userName,
    answer: "Yes",
    noClicks: noCount,
    timestamp: new Date().toLocaleString(),
    date: new Date().toISOString()
  };

  responses.push(response);
  saveResponses();
  updateTotalResponses();

  titleElement.innerHTML = "Yayyy!! :3";
  buttonsContainer.classList.add("hidden");
  changeImage("yes");
  triggerConfetti();
  play = false;

  sendEmailNotification(response);
  showSuccessMessage();

  console.log("✅ Response recorded:", response);
}

function handleNoClick() {
  console.log("❌ No button clicked, count:", noCount + 1);

  if (play) {
    noCount++;
    const imageIndex = Math.min(noCount, MAX_IMAGES);
    changeImage(imageIndex);
    resizeYesButton();
    updateNoButtonText();

    if (noCount === MAX_IMAGES) {
      play = false;
      console.log("❌ Maximum no clicks reached");
    }
  }
}

function showSuccessMessage() {
  setTimeout(() => {
    mainContent.classList.add("hidden");
    successMessage.classList.remove("hidden");
    userNameSpan.textContent = userName;

    setTimeout(triggerConfetti, 1000);
    setTimeout(triggerConfetti, 2000);
  }, 1500);
}

function resizeYesButton() {
  const computedStyle = window.getComputedStyle(yesButton);
  const fontSize = parseFloat(computedStyle.getPropertyValue("font-size"));
  const newFontSize = fontSize * 1.6;
  yesButton.style.fontSize = `${newFontSize}px`;
}

function generateMessage(noCount) {
  const messages = [
    "No",
    "Are you sure?",
    "Pookie please",
    "Don't do this to me :(",
    "You're breaking my heart",
    "I'm gonna cry...",
  ];
  const messageIndex = Math.min(noCount, messages.length - 1);
  return messages[messageIndex];
}

function changeImage(image) {
  const newSrc = `img/cat-${image}.jpg`;
  catImg.src = newSrc;
  console.log("✅ Image changed to:", newSrc);
}

function updateNoButtonText() {
  noButton.innerHTML = generateMessage(noCount);
}

function triggerConfetti() {
  try {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#f53699', '#40c057', '#ffd43b']
    });
  } catch (error) {
    console.log("❌ Confetti error:", error);
  }
}

function createHearts() {
  for (let i = 0; i < 15; i++) createHeart();
}

function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDelay = Math.random() * 6 + 's';
  heart.style.transform = `rotate(45deg) scale(${Math.random() * 0.5 + 0.5})`;
  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
    createHeart();
  }, 6000);
}

function saveResponses() {
  localStorage.setItem('valentineResponses', JSON.stringify(responses));
}

function loadResponses() {
  responses = JSON.parse(localStorage.getItem('valentineResponses')) || [];
  updateResponseList();
}

function updateResponseList() {
  responseList.innerHTML = '';

  if (responses.length === 0) {
    responseList.innerHTML = '<div class="response-item">No responses yet</div>';
    return;
  }

  responses.slice().reverse().forEach((response) => {
    const responseItem = document.createElement('div');
    responseItem.className = `response-item ${response.answer === 'Yes' ? 'response-yes' : 'response-no'}`;
    responseItem.innerHTML = `
      <strong>${response.name}</strong>: ${response.answer} 
      ${response.noClicks > 0 ? `(Clicked No ${response.noClicks} times)` : ''}
      <br><small>${response.timestamp}</small>
    `;
    responseList.appendChild(responseItem);
  });
}

function updateTotalResponses() {
  totalResponsesSpan.textContent = responses.length;
}

function toggleAdminPanel() {
  const password = prompt("Enter admin password:");
  if (password === ADMIN_PASSWORD) {
    adminPanel.classList.toggle("hidden");
    if (!adminPanel.classList.contains("hidden")) {
      updateResponseList();
      updateTotalResponses();
    }
  } else if (password) {
    alert("Incorrect password!");
  }
}

function clearAllResponses() {
  if (confirm("Are you sure you want to clear ALL responses?")) {
    responses = [];
    saveResponses();
    updateResponseList();
    updateTotalResponses();
    alert("All responses cleared!");
  }
}

function sendEmailNotification(response) {
  console.log("📧 Attempting to send email...");

  const templateParams = {
    from_name: response.name,
    name: response.name,
    answer: response.answer,
    no_clicks: response.noClicks,
    timestamp: response.timestamp,
    total_responses: responses.length
  };

  if (typeof emailjs === 'undefined') {
    console.log("❌ EmailJS not loaded");
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then((result) => console.log('✅ Email sent!', result))
    .catch((error) => console.log('❌ Email failed:', error));
}

function testEmailJS() {
  console.log("🔧 Testing EmailJS configuration:");
  console.log("Service ID:", EMAILJS_SERVICE_ID);
  console.log("Template ID:", EMAILJS_TEMPLATE_ID);
  console.log("Public Key:", EMAILJS_PUBLIC_KEY);
  console.log("EmailJS loaded:", typeof emailjs !== 'undefined');
}
testEmailJS();

function preloadImages() {
  const images = [];
  for (let i = 1; i <= MAX_IMAGES; i++) {
    const img = new Image();
    img.src = `img/cat-${i}.jpg`;
    images.push(img);
  }
  const yesImg = new Image();
  yesImg.src = 'img/cat-yes.jpg';
  images.push(yesImg);
}
window.addEventListener('load', preloadImages);
