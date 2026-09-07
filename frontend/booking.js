// ==============================
// BOOKING WIZARD
// ==============================

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");

const progress = document.querySelectorAll(".progress-step");

// Buttons
const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const back1 = document.getElementById("back1");
const back2 = document.getElementById("back2");

// -----------------------------
// STEP 1 -> STEP 2
// -----------------------------
next1.addEventListener("click", () => {

    step1.classList.remove("active");
    step2.classList.add("active");

    progress[0].classList.remove("active");
    progress[1].classList.add("active");

});

// -----------------------------
// STEP 2 -> STEP 1
// -----------------------------
back1.addEventListener("click", () => {

    step2.classList.remove("active");
    step1.classList.add("active");

    progress[1].classList.remove("active");
    progress[0].classList.add("active");

});

// -----------------------------
// STEP 2 -> STEP 3
// -----------------------------
next2.addEventListener("click", () => {

    document.getElementById("review-name").textContent =
        document.getElementById("name").value;

    document.getElementById("review-email").textContent =
        document.getElementById("email").value;

    document.getElementById("review-phone").textContent =
        document.getElementById("phone").value;

    document.getElementById("review-service").textContent =
        document.getElementById("service").value;

    document.getElementById("review-date").textContent =
        document.getElementById("date").value;

    document.getElementById("review-time").textContent =
        document.getElementById("time").value;

    document.getElementById("review-address").textContent =
        document.getElementById("address").value + ", " +
        document.getElementById("city").value + ", " +
        document.getElementById("state").value + " " +
        document.getElementById("zip").value;

    document.getElementById("review-problem").textContent =
        document.getElementById("problem").value;

    step2.classList.remove("active");
    step3.classList.add("active");

    progress[1].classList.remove("active");
    progress[2].classList.add("active");

});

// -----------------------------
// STEP 3 -> STEP 2
// -----------------------------
back2.addEventListener("click", () => {

    step3.classList.remove("active");
    step2.classList.add("active");

    progress[2].classList.remove("active");
    progress[1].classList.add("active");

});

// -----------------------------
// FORM SUBMIT
// -----------------------------
document.getElementById("bookingForm").addEventListener("submit", function(e){

    e.preventDefault();

    alert("Next we'll send this booking to the FastAPI backend and redirect to Stripe.");

});