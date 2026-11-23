// ================= INITIAL BOOK DATABASE (50 QUANTITY EACH) =================
const defaultBooks = [
    {
        id: 1,
        title: "Introduction to Algorithms (CLRS)",
        author: "Thomas H. Cormen",
        course: "B.Tech CSE",
        section: "Section A - Programming & AI",
        shelf: "Shelf A-101",
        quantity: 50
    },
    {
        id: 2,
        title: "Hands-On Machine Learning",
        author: "Aurélien Géron",
        course: "B.Tech CSE",
        section: "Section A - Programming & AI",
        shelf: "Shelf A-104",
        quantity: 50
    },
    {
        id: 3,
        title: "Clean Code",
        author: "Robert C. Martin",
        course: "B.Tech CSE",
        section: "Section A - Programming & AI",
        shelf: "Shelf A-109",
        quantity: 50
    },
    {
        id: 4,
        title: "Microelectronic Circuits",
        author: "Adel S. Sedra",
        course: "B.Tech ECE",
        section: "Section B - Core Electronics",
        shelf: "Shelf B-202",
        quantity: 50
    },
    {
        id: 5,
        title: "Digital Logic and Computer Design",
        author: "M. Morris Mano",
        course: "B.Tech ECE",
        section: "Section B - Core Electronics",
        shelf: "Shelf B-208",
        quantity: 50
    },
    {
        id: 6,
        title: "Principles of Marketing",
        author: "Philip Kotler",
        course: "BBA / MBA",
        section: "Section C - Management & Finance",
        shelf: "Shelf C-301",
        quantity: 50
    },
    {
        id: 7,
        title: "Financial Management",
        author: "I.M. Pandey",
        course: "BBA / MBA",
        section: "Section C - Management & Finance",
        shelf: "Shelf C-305",
        quantity: 50
    },
    {
        id: 8,
        title: "Higher Engineering Mathematics",
        author: "B.S. Grewal",
        course: "B.Sc Sciences",
        section: "Section D - Applied Mathematics",
        shelf: "Shelf D-401",
        quantity: 50
    },
    // ===== 5 CIVIL ENGINEERING BOOKS UNDER SECTION E =====
    {
        id: 9,
        title: "Strength of Materials",
        author: "R.K. Bansal",
        course: "Civil Engineering",
        section: "Section E - Civil & Structural Engineering",
        shelf: "Shelf E-501",
        quantity: 50
    },
    {
        id: 10,
        title: "Reinforced Concrete Design",
        author: "S. Unnikrishna Pillai & Devdas Menon",
        course: "Civil Engineering",
        section: "Section E - Civil & Structural Engineering",
        shelf: "Shelf E-502",
        quantity: 50
    },
    {
        id: 11,
        title: "Soil Mechanics and Foundation Engineering",
        author: "K.R. Arora",
        course: "Civil Engineering",
        section: "Section E - Civil & Structural Engineering",
        shelf: "Shelf E-503",
        quantity: 50
    },
    {
        id: 12,
        title: "Surveying (Vol. 1 & 2)",
        author: "B.C. Punmia",
        course: "Civil Engineering",
        section: "Section E - Civil & Structural Engineering",
        shelf: "Shelf E-504",
        quantity: 50
    },
    {
        id: 13,
        title: "Structural Analysis",
        author: "R.C. Hibbeler",
        course: "Civil Engineering",
        section: "Section E - Civil & Structural Engineering",
        shelf: "Shelf E-505",
        quantity: 50
    }
];

// Load books & sync any newly added defaultBooks into existing localStorage
let savedBooks = JSON.parse(localStorage.getItem("libraryBooks"));
let books;
if (savedBooks && Array.isArray(savedBooks)) {
    defaultBooks.forEach(defBook => {
        if (!savedBooks.some(b => b.id === defBook.id)) {
            savedBooks.push(defBook);
        }
    });
    books = savedBooks;
} else {
    books = defaultBooks;
}

let allBookings = JSON.parse(localStorage.getItem("libraryBookings")) || [];
let currentStudent = null;

function saveToStorage() {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
    localStorage.setItem("libraryBookings", JSON.stringify(allBookings));
}

// ================= 1. ROLE SWITCHER & LOGIN =================
function switchRole(role) {
    const studentForm = document.getElementById("student-login-form");
    const adminForm = document.getElementById("admin-login-form");
    const tabStudent = document.getElementById("tab-student");
    const tabAdmin = document.getElementById("tab-admin");

    if (role === "student") {
        studentForm.classList.remove("hidden");
        adminForm.classList.add("hidden");
        tabStudent.classList.add("active");
        tabAdmin.classList.remove("active");
    } else {
        adminForm.classList.remove("hidden");
        studentForm.classList.add("hidden");
        tabAdmin.classList.add("active");
        tabStudent.classList.remove("active");
    }
}

function handleStudentLogin(event) {
    event.preventDefault();
    const name = document.getElementById("student-name").value.trim();
    const regNo = document.getElementById("student-reg").value.trim();

    if (!name || !regNo) return;

    currentStudent = { name, regNo };

    // Hide Login, Show Dashboard
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("student-dashboard").classList.remove("hidden");

    // Update Navbar Info
    document.getElementById("nav-user-info").innerHTML = 
        `<i class="fa-solid fa-user"></i> <strong>${name}</strong> (Reg: ${regNo})`;

    // Trigger Welcome Popup
    document.getElementById("welcome-student-details").innerText = 
        `Hello ${name} (Reg No: ${regNo}), you have successfully logged in.`;
    document.getElementById("welcome-popup").classList.remove("hidden");

    renderBooks();
    renderStudentRecord();
}

function closeWelcomePopup() {
    document.getElementById("welcome-popup").classList.add("hidden");
}

function handleAdminLogin(event) {
    event.preventDefault();
    const id = document.getElementById("admin-id").value.trim();
    const pass = document.getElementById("admin-pass").value.trim();

    if (id === "admin" && pass === "admin123") {
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("admin-dashboard").classList.remove("hidden");
        renderAdminDashboard();
    } else {
        alert("Invalid Admin Credentials! Use ID: admin | Password: admin123");
    }
}

function logout() {
    currentStudent = null;
    document.getElementById("student-dashboard").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
    document.getElementById("student-login-form").reset();
    document.getElementById("admin-login-form").reset();
}

// ================= 2. DISPLAY & FILTER BOOKS =================
function renderBooks() {
    const grid = document.getElementById("books-grid");
    const searchVal = document.getElementById("search-input").value.toLowerCase();
    const courseVal = document.getElementById("course-filter").value;
    const sectionVal = document.getElementById("section-filter").value;

    grid.innerHTML = "";

    const filtered = books.filter(book => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchVal) ||
            book.author.toLowerCase().includes(searchVal) ||
            book.shelf.toLowerCase().includes(searchVal);
        const matchesCourse = courseVal === "ALL" || book.course === courseVal;
        const matchesSection = sectionVal === "ALL" || book.section === sectionVal;

        return matchesSearch && matchesCourse && matchesSection;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p>No books found matching your filter criteria.</p>`;
        return;
    }

    filtered.forEach(book => {
        const isAvailable = book.quantity > 0;
        const statusBadge = isAvailable
            ? `<span class="badge-available">Available</span>`
            : `<span class="badge-out">Out of Stock</span>`;

        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
            <span class="shelf-tag"><i class="fa-solid fa-location-dot"></i> ${book.shelf}</span>
            
            <!-- Book Icon -->
            <div class="book-icon-wrapper">
                <i class="fa-solid fa-book"></i>
            </div>

            <!-- Booking Option Just Below the Book Icon -->
            <button class="book-now-btn" ${!isAvailable ? "disabled" : ""} onclick="bookThisBook(${book.id})">
                <i class="fa-solid fa-bookmark"></i> ${isAvailable ? "Book Now (15 Days)" : "Out of Stock"}
            </button>

            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>

            <div class="book-meta">
                <div><strong>Course:</strong> ${book.course}</div>
                <div><strong>Section:</strong> ${book.section}</div>
            </div>

            <div class="stock-row">
                <span>Qty: <strong>${book.quantity} / 50</strong></span>
                ${statusBadge}
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterBooks() {
    renderBooks();
}

// ================= 3. BOOKING LOGIC (15 DAYS + ₹10/DAY LATE FEE + RECEIPT) =================
function bookThisBook(bookId) {
    if (!currentStudent) return;

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1 || books[bookIndex].quantity <= 0) {
        alert("Sorry, this book is currently Out of Stock!");
        return;
    }

    // Decrease quantity by 1
    books[bookIndex].quantity -= 1;

    // Calculate Booking Date & 15-Day Return Date
    const issueDateObj = new Date();
    const dueDateObj = new Date();
    dueDateObj.setDate(issueDateObj.getDate() + 15);

    const formatDate = (dateObj) => dateObj.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });

    const bookingRecord = {
        receiptId: "CL-" + Math.floor(100000 + Math.random() * 900000),
        studentName: currentStudent.name,
        studentReg: currentStudent.regNo,
        bookId: books[bookIndex].id,
        bookTitle: books[bookIndex].title,
        course: books[bookIndex].course,
        section: books[bookIndex].section,
        shelf: books[bookIndex].shelf,
        issueDate: formatDate(issueDateObj),
        dueDate: formatDate(dueDateObj),
        dueTimestamp: dueDateObj.getTime(),
        returned: false,
        lateFeePaid: 0,
        approvedBy: "Head Librarian"
    };

    allBookings.unshift(bookingRecord);
    saveToStorage();

    // Refresh UI & Show Official Receipt
    renderBooks();
    renderStudentRecord();
    showReceipt(bookingRecord);
}

// ================= 4. RETURN BOOK & ₹10/DAY LATE FEE CALCULATOR =================
function returnBook(receiptId) {
    const recIndex = allBookings.findIndex(b => b.receiptId === receiptId);
    if (recIndex === -1) return;

    const record = allBookings[recIndex];
    if (record.returned) return;

    // Calculate overdue days (15-day window)
    const now = new Date();
    const dueTime = record.dueTimestamp ? record.dueTimestamp : new Date(record.dueDate).getTime();

    const diffMs = now.getTime() - dueTime;
    const msPerDay = 1000 * 60 * 60 * 24;
    const overdueDays = diffMs > 0 ? Math.floor(diffMs / msPerDay) : 0;
    const lateFee = overdueDays * 10; // ₹10 per day

    // Increase book stock back by 1 (capped at 50)
    const bookIndex = books.findIndex(b => b.id === record.bookId);
    if (bookIndex !== -1 && books[bookIndex].quantity < 50) {
        books[bookIndex].quantity += 1;
    }

    // Mark booking record as returned
    allBookings[recIndex].returned = true;
    allBookings[recIndex].lateFeePaid = lateFee;
    allBookings[recIndex].returnedDate = now.toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
    });

    saveToStorage();
    renderBooks();
    renderStudentRecord();

    if (lateFee > 0) {
        alert(
            `Book Returned: "${record.bookTitle}"\n` +
            `Status: Overdue by ${overdueDays} day(s)\n` +
            `Late Fee Calculated (@ ₹10/day): ₹${lateFee}\n\n` +
            `Book stock has been increased by +1.`
        );
    } else {
        alert(
            `Book Returned On Time: "${record.bookTitle}"\n` +
            `Late Fee: ₹0\n\n` +
            `Book stock has been increased by +1.`
        );
    }
}

function showReceipt(record) {
    document.getElementById("rec-id").innerText = record.receiptId;
    document.getElementById("rec-student-name").innerText = record.studentName;
    document.getElementById("rec-student-reg").innerText = record.studentReg;
    document.getElementById("rec-book-title").innerText = record.bookTitle;
    document.getElementById("rec-course-sec").innerText = `${record.course} (${record.section})`;
    document.getElementById("rec-shelf").innerText = record.shelf;
    document.getElementById("rec-issue-date").innerText = record.issueDate;
    document.getElementById("rec-due-date").innerText = record.dueDate;

    document.getElementById("receipt-modal").classList.remove("hidden");
}

function closeReceiptModal() {
    document.getElementById("receipt-modal").classList.add("hidden");
}

// ================= 5. TOTAL BOOK RECORD & FREQUENCY TRACKER =================
function renderStudentRecord() {
    if (!currentStudent) return;

    const myBookings = allBookings.filter(b => b.studentReg === currentStudent.regNo);
    document.getElementById("record-count").innerText = myBookings.length;

    // Count how many times each book was booked by this student
    const bookFrequency = {};
    myBookings.forEach(item => {
        bookFrequency[item.bookTitle] = (bookFrequency[item.bookTitle] || 0) + 1;
    });

    const uniqueBooksCount = Object.keys(bookFrequency).length;
    document.getElementById("total-books-summary").innerHTML = 
        `Total Reservations Made: <strong>${myBookings.length}</strong> | Unique Books Borrowed: <strong>${uniqueBooksCount}</strong>`;

    const tbody = document.getElementById("record-table-body");
    tbody.innerHTML = "";

    if (myBookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No books booked yet. Click "Book Now" below any book icon above!</td></tr>`;
        return;
    }

    myBookings.forEach(rec => {
        const timesBooked = bookFrequency[rec.bookTitle];
        const statusCell = rec.returned
            ? `<span class="badge-returned">Returned (Fine: ₹${rec.lateFeePaid || 0})</span>`
            : `<span class="badge-available">Issued (Active)</span>`;

        const returnBtnHtml = !rec.returned
            ? `<button class="return-book-btn" onclick="returnBook('${rec.receiptId}')">
                   <i class="fa-solid fa-rotate-left"></i> Return Book
               </button>`
            : ``;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${rec.receiptId}</strong></td>
            <td>${rec.bookTitle}</td>
            <td>${rec.shelf}</td>
            <td>${rec.issueDate}</td>
            <td><strong>${rec.dueDate}</strong></td>
            <td><span class="badge-available">${timesBooked} Time(s)</span></td>
            <td>${statusCell}</td>
            <td>
                <div class="action-btn-group">
                    <button class="view-slip-btn" onclick='showReceipt(${JSON.stringify(rec)})'>
                        <i class="fa-solid fa-receipt"></i> Receipt
                    </button>
                    ${returnBtnHtml}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function toggleRecordSection() {
    document.getElementById("student-record-section").scrollIntoView({ behavior: "smooth" });
}

// ================= 6. ADMIN DASHBOARD FUNCTIONS =================
function renderAdminDashboard() {
    const stockBody = document.getElementById("admin-stock-body");
    stockBody.innerHTML = "";

    books.forEach(book => {
        const status = book.quantity > 0 
            ? `<span class="badge-available">Available</span>` 
            : `<span class="badge-out">Out of Stock</span>`;

        stockBody.innerHTML += `
            <tr>
                <td><strong>${book.title}</strong></td>
                <td>${book.course}</td>
                <td>${book.section}</td>
                <td>${book.shelf}</td>
                <td><strong>${book.quantity} / 50</strong></td>
                <td>${status}</td>
                <td>
                    <button class="view-slip-btn" onclick="restockBook(${book.id})">Reset to 50</button>
                </td>
            </tr>
        `;
    });

    const bookingsBody = document.getElementById("admin-bookings-body");
    bookingsBody.innerHTML = "";

    if (allBookings.length === 0) {
        bookingsBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No student reservations recorded yet.</td></tr>`;
        return;
    }

    allBookings.forEach(b => {
        const statusBadge = b.returned
            ? `<span class="badge-returned">Returned (Fine: ₹${b.lateFeePaid || 0})</span>`
            : `<span class="badge-available">Issued • Approved</span>`;

        bookingsBody.innerHTML += `
            <tr>
                <td><strong>${b.receiptId}</strong></td>
                <td>${b.studentName}</td>
                <td>${b.studentReg}</td>
                <td>${b.bookTitle} (${b.shelf})</td>
                <td>${b.issueDate}</td>
                <td>${b.dueDate}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
}

function restockBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        book.quantity = 50;
        saveToStorage();
        renderAdminDashboard();
    }
}
