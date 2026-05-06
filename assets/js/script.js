// Initialize EmailJS with your public key
(function() {
    emailjs.init("k-YjYv5upGanCSCDN");
})();

// Recipient email configuration
const RECIPIENT_EMAIL = "eshan152randunu@gmail.com";

// Listen for form submit
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Add recipient email to form data
    const formData = new FormData(this);
    const templateParams = {
        to_email: RECIPIENT_EMAIL,
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs.send("service_ud0r6zr", "template_vio1ce7", templateParams)
        .then(() => {
            document.getElementById("contact-form").reset();
            document.getElementById("success-message").style.display = "block";
            setTimeout(() => {
                document.getElementById("success-message").style.display = "none";
            }, 5000);
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            // Fallback: Open mailto link
            const subject = `Portfolio Contact from ${templateParams.from_name}`;
            const body = `Name: ${templateParams.from_name}%0D%0AEmail: ${templateParams.from_email}%0D%0A%0D%0AMessage:%0D%0A${templateParams.message}`;
            window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
        });
});


