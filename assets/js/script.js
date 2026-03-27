// Initialize EmailJS
(function() {
    emailjs.init("k-YjYv5upGanCSCDN"); // Emailjs public key
})();

// Listen for form submit
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Stop page refresh

    emailjs.sendForm("service_ud0r6zr", "template_vio1ce7", this)
         .then(() => {
        // Reset form fields
        document.getElementById("contact-form").reset();

        // Show success message
        document.getElementById("success-message").style.display = "block";

        // Hide after 5 seconds (optional)
        setTimeout(() => {
            document.getElementById("success-message").style.display = "none";
        }, 5000);
    })
    .catch((error) => {
        alert("Failed to send message. Error: " + JSON.stringify(error));
    });
});


