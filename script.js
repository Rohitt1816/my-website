"use strict";

// Initialize EmailJS with your Public Key
emailjs.init("aqNVnHyvn2dANWZiW");

// Elements
const titleElement = document.querySelector(".title");
const buttonsContainer = document.querySelector(".buttons");
const yesButton = document.querySelector(".btn--yes");
const noButton = document.querySelector(".btn--no");
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

// Configuration
const MAX_IMAGES = 5;
const ADMIN_PASSWORD = "rohit1816"; // Change this to your preferred password
const EMAILJS_SERVICE_ID = "service_96yfuby";
const EMAILJS_TEMPLATE_ID = "template_8yvwjgn";

// State
let play = true;
let noCount = 0;
let userName = "";
let responses = JSON.parse(localStorage.getItem('valentineResponses')) || [];

// Initialize
createHearts();
loadResponses();
updateTotalResponses();

// Event Listeners
startBtn.addEventListener("click", startExperience);
yesButton.addEventListener("click", handleYesClick);
noButton.addEventListener("click", handleNoClick);
adminBtn.addEventListener("click", toggleAdminPanel);
clearResponsesBtn.addEventListener("click", clearAllResponses);

// Enter key support for name input
nameInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        startExperience();
    }
});

// Functions
function startExperience() {
    userName = nameInput.value.trim();
    if (!userName) {
        alert("Please enter your name!");
        nameInput.focus();
        return;
    }
    
    nameInputContainer.classList.add("hidden");
    mainContent.classList.remove("hidden");
}

function handleYesClick() {
    console.log("✅ Yes button clicked!");
    
    // Simple test - remove email functionality
    titleElement.innerHTML = "Yayyy!! :3";
    buttonsContainer.classList.add("hidden");
    
    // Just show success message
    setTimeout(() => {
        mainContent.classList.add("hidden");
        successMessage.classList.remove("hidden");
        userNameSpan.textContent = userName;
    }, 1000);
    
    play = false;
}
    
    responses.push(response);
    saveResponses();
    updateTotalResponses();
    sendEmailNotification(response);
    
    // Show success
    titleElement.innerHTML = "Yayyy!! :3";
    buttonsContainer.classList.add("hidden");
    changeImage("yes");
    
    // Confetti and celebration
    triggerConfetti();
    showSuccessMessage();
    
    play = false;
}

function handleNoClick() {
    if (play) {
        noCount++;
        const imageIndex = Math.min(noCount, MAX_IMAGES);
        changeImage(imageIndex);
        resizeYesButton();
        updateNoButtonText();
        if (noCount === MAX_IMAGES) {
            play = false;
        }
    }
}

function showSuccessMessage() {
    setTimeout(() => {
        mainContent.classList.add("hidden");
        successMessage.classList.remove("hidden");
        userNameSpan.textContent = userName;
        
        // More confetti after delay
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
    catImg.src = `img/cat-${image}.jpg`;
}

function updateNoButtonText() {
    noButton.innerHTML = generateMessage(noCount);
}

function triggerConfetti() {
    // Main confetti burst
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#f53699', '#40c057', '#ffd43b']
    });
    
    // Left side confetti
    setTimeout(() => confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
    }), 150);
    
    // Right side confetti
    setTimeout(() => confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
    }), 300);
    
    // Additional bursts
    setTimeout(() => confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: 0.5, y: 0.5 }
    }), 500);
}

function createHearts() {
    for (let i = 0; i < 15; i++) {
        createHeart();
    }
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDelay = Math.random() * 6 + 's';
    heart.style.transform = `rotate(45deg) scale(${Math.random() * 0.5 + 0.5})`;
    heartsContainer.appendChild(heart);
    
    // Remove heart after animation and create new one
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
    
    responses.slice().reverse().forEach((response, index) => {
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
    if (confirm("Are you sure you want to clear ALL responses? This cannot be undone!")) {
        responses = [];
        saveResponses();
        updateResponseList();
        updateTotalResponses();
        alert("All responses cleared!");
    }
}

function sendEmailNotification(response) {
    const templateParams = {
        name: response.name,
        answer: response.answer,
        no_clicks: response.noClicks,
        timestamp: response.timestamp,
        total_responses: responses.length
    };
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('✅ Email sent successfully!', response.status, response.text);
        }, function(error) {
            console.log('❌ Failed to send email:', error);
            // Fallback: create mailto link
            createFallbackEmail(response);
        });
}

function createFallbackEmail(response) {
    const subject = `💖 New Valentine Response from ${response.name}`;
    const body = `
Name: ${response.name}
Answer: ${response.answer}
No Clicks: ${response.noClicks}
Date: ${response.timestamp}

Total Responses: ${responses.length}
    `.trim();
    
    const mailtoLink = `mailto:rohitpadal10@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    console.log('Fallback email link:', mailtoLink);
}

// Make sure cat images exist
function preloadImages() {
    for (let i = 1; i <= MAX_IMAGES; i++) {
        const img = new Image();
        img.src = `img/cat-${i}.jpg`;
    }
    const yesImg = new Image();
    yesImg.src = 'img/cat-yes.jpg';
}

// Preload images when page loads
window.addEventListener('load', preloadImages);
