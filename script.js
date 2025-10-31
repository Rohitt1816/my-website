"use strict";

// Elements - Using IDs instead of classes to avoid confusion
const titleElement = document.querySelector(".title");
const buttonsContainer = document.querySelector(".buttons");
const yesButton = document.getElementById("yesBtn"); // Changed to ID
const noButton = document.getElementById("noBtn");   // Changed to ID
const catImg = document.querySelector(".cat-img");
const nameInputContainer = document.getElementById("nameInputContainer");
const mainContent = document.getElementById("mainContent");
const successMessage = document.getElementById("successMessage");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn"); // This is the Start button
const userNameSpan = document.getElementById("userName");
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");
const responseList = document.getElementById("responseList");
const heartsContainer = document.querySelector(".hearts-container");
const totalResponsesSpan = document.getElementById("totalResponses");
const clearResponsesBtn = document.getElementById("clearResponses");

// Configuration
const MAX_IMAGES = 5;
const ADMIN_PASSWORD = "rp1816.ADMIN";
const EMAILJS_SERVICE_ID = "service_96yfuby";
const EMAILJS_TEMPLATE_ID = "template_8yvwjgn";
const EMAILJS_PUBLIC_KEY = "aqNVnHyvn2dANWZiW";

// State
let play = true;
let noCount = 0;
let userName = "";
let responses = JSON.parse(localStorage.getItem('valentineResponses')) || [];

// Initialize EmailJS safely
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

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', function() {
    initializeEmailJS();
    createHearts();
    loadResponses();
    updateTotalResponses();
    
    // Add event listeners - VERY IMPORTANT: Different buttons!
    startBtn.addEventListener("click", startExperience); // Start button
    yesButton.addEventListener("click", handleYesClick); // Yes button (Valentine question)
    noButton.addEventListener("click", handleNoClick);   // No button (Valentine question)
    adminBtn.addEventListener("click", toggleAdminPanel);
    clearResponsesBtn.addEventListener("click", clearAllResponses);
    
    // Enter key support for name input
    nameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            startExperience();
        }
    });
    
    console.log("✅ Website initialized successfully");
    console.log("✅ Start button:", startBtn);
    console.log("✅ Yes button:", yesButton);
    console.log("✅ No button:", noButton);
});

// Function for START button (name submission)
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
    console.log("✅ Now showing Valentine question");
}

// Function for YES button (Valentine response)
function handleYesClick() {
    console.log("💖 Yes button clicked for user:", userName);
    
    if (!play) {
        console.log("❌ Game already ended");
        return;
    }
    
    if (!userName) {
        console.log("❌ No user name found");
        alert("Please enter your name first!");
        return;
    }
    
    // Record response
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
    
    // Show success UI
    titleElement.innerHTML = "Yayyy!! :3";
    buttonsContainer.classList.add("hidden");
    changeImage("yes");
    
    // Confetti and celebration
    triggerConfetti();
    showSuccessMessage();
    
    // Send email
    sendEmailNotification(response);
    
    play = false;
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
        
        console.log("✅ Updated no count to:", noCount);
        
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
        
        // More confetti after delay
        setTimeout(triggerConfetti, 1000);
        setTimeout(triggerConfetti, 2000);
        
        console.log("✅ Success message shown for:", userName);
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
        // Main confetti burst
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#f53699', '#40c057', '#ffd43b']
        });
        
        console.log("✅ Confetti triggered");
    } catch (error) {
        console.log("❌ Confetti error:", error);
    }
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
    
    setTimeout(() => {
        heart.remove();
        createHeart();
    }, 6000);
}

function saveResponses() {
    localStorage.setItem('valentineResponses', JSON.stringify(responses));
    console.log("✅ Responses saved to localStorage");
}

function loadResponses() {
    responses = JSON.parse(localStorage.getItem('valentineResponses')) || [];
    updateResponseList();
    console.log("✅ Responses loaded:", responses.length);
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
    console.log("📧 Attempting to send email...");
    
    const templateParams = {
        name: response.name,
        answer: response.answer,
        no_clicks: response.noClicks,
        timestamp: response.timestamp,
        total_responses: responses.length
    };
    
    if (typeof emailjs === 'undefined') {
        console.log("❌ EmailJS not loaded, skipping email");
        return;
    }
    
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('✅ Email sent successfully!', response.status, response.text);
        }, function(error) {
            console.log('❌ Failed to send email:', error);
        });
}

// Make sure cat images exist
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
    
    console.log("✅ Images preloaded");
}

// Preload images when page loads
window.addEventListener('load', preloadImages);
