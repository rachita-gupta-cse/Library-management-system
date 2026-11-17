document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Login Form Handling
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("username").value.trim();
            if (user !== "") {
                alert("Login successful! Welcome to the Library Portal.");
                window.location.href = "index.html"; // Redirect to dashboard
            } else {
                alert("Please enter a valid username.");
            }
        });
    }

    // 2. Reservation Form Validation & Success Alert
    const reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
        reservationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const studentName = document.getElementById("student-name").value;
            const book = document.getElementById("book-select").value;
            
            if (studentName && book) {
                alert(`Success! Book "${book}" has been reserved successfully for ${studentName}.`);
                reservationForm.reset();
            } else {
                alert("Please fill in all required fields!");
            }
        });
    }

    // 3. Live Book Search / Filter Functionality
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll("#books-table tbody tr");

            rows.forEach(row => {
                const titleText = row.cells[1].textContent.toLowerCase();
                const authorText = row.cells[2].textContent.toLowerCase();
                
                if (titleText.includes(term) || authorText.includes(term)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
});