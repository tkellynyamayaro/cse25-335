document.addEventListener("DOMContentLoaded", function () {

    /* BOOKING PAGE */

    var seatMap = document.getElementById("seat-map");
    var selectedSeats = [];

    /* FORM INPUTS */

    var movieSelect = document.getElementById("movie");
    var dateInput = document.getElementById("date");
    var showtimeSelect = document.getElementById("showtime");
    var ticketsSelect = document.getElementById("tickets");

    /* SET MINIMUM DATE */

    if (dateInput) {
        var today = new Date();
        dateInput.setAttribute("min",
            today.getFullYear() + "-" +
            String(today.getMonth() + 1).padStart(2, "0") + "-" +
            String(today.getDate()).padStart(2, "0")
        );
    }

    /* UPDATE BOOKING SUMMARY */

    function updateSummary() {

        var sumMovie = document.getElementById("sum-movie");
        if (!sumMovie) return;

        var movieOption = movieSelect ? movieSelect.options[movieSelect.selectedIndex] : null;
        var price = movieOption ? parseInt(movieOption.getAttribute("data-price") || "0") : 0;
        var tickets = ticketsSelect ? parseInt(ticketsSelect.value) : 1;

        sumMovie.textContent = (movieOption && movieOption.value) ? movieOption.value : "—";
        document.getElementById("sum-date").textContent = dateInput ? (dateInput.value || "—") : "—";
        document.getElementById("sum-time").textContent = showtimeSelect ? (showtimeSelect.value || "—") : "—";
        document.getElementById("sum-seats").textContent = selectedSeats.length > 0 ? selectedSeats.join(", ") : "—";
        document.getElementById("sum-tickets").textContent = tickets;
        document.getElementById("sum-total").textContent = price > 0 ? "BWP " + (price * tickets) : "BWP —";
    }

    /* SEAT SELECTION */

    if (seatMap) {

        seatMap.addEventListener("click", function (e) {

            var seat = e.target;

            if (!seat.classList.contains("seat") || seat.classList.contains("taken")) {
                return;
            }

            var seatId = seat.getAttribute("data-seat");
            var maxSeats = ticketsSelect ? parseInt(ticketsSelect.value) : 1;

            if (seat.classList.contains("selected")) {

                seat.classList.remove("selected");
                seat.classList.add("available");
                selectedSeats = selectedSeats.filter(function (s) { return s !== seatId; });

            } else {

                if (selectedSeats.length >= maxSeats) {
                    alert("You can only select " + maxSeats + " seat(s).");
                    return;
                }

                seat.classList.remove("available");
                seat.classList.add("selected");
                selectedSeats.push(seatId);
            }

            updateSummary();
        });
    }

    /* UPDATE SUMMARY WHEN INPUTS CHANGE */

    [movieSelect, dateInput, showtimeSelect].forEach(function (el) {
        if (el) { el.addEventListener("change", updateSummary); }
    });

    if (ticketsSelect) {

        ticketsSelect.addEventListener("change", function () {

            var maxSeats = parseInt(ticketsSelect.value);

            while (selectedSeats.length > maxSeats) {
                var removedSeat = seatMap.querySelector('[data-seat="' + selectedSeats.pop() + '"]');
                if (removedSeat) {
                    removedSeat.classList.remove("selected");
                    removedSeat.classList.add("available");
                }
            }

            updateSummary();
        });
    }

    /* ERROR FUNCTIONS */

    function showError(id, message) {
        var element = document.getElementById(id);
        if (element) { element.textContent = message; }
    }

    function clearError(id) {
        var element = document.getElementById(id);
        if (element) { element.textContent = ""; }
    }

    /* BOOKING FORM VALIDATION */

    function validateBooking() {

        var valid = true;
        var requiredSeats = ticketsSelect ? parseInt(ticketsSelect.value) : 1;
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        var checks = [
            ["err-movie",    !movieSelect || !movieSelect.value,                                          "Please select a movie."],
            ["err-date",     !dateInput || !dateInput.value,                                              "Please select a date."],
            ["err-showtime", !showtimeSelect || !showtimeSelect.value,                                    "Please select a showtime."],
            ["err-seats",    selectedSeats.length < requiredSeats,                                        "Please select " + requiredSeats + " seat(s)."],
            ["err-name",     !document.getElementById("fullname") || document.getElementById("fullname").value.trim().length < 2,   "Please enter your full name."],
            ["err-email",    !document.getElementById("email") || !emailPattern.test(document.getElementById("email").value.trim()), "Please enter a valid email address."],
            ["err-phone",    !document.getElementById("phone") || document.getElementById("phone").value.trim().length < 7,         "Please enter a valid phone number."]
        ];

        checks.forEach(function (check) {
            clearError(check[0]);
            if (check[1]) {
                showError(check[0], check[2]);
                valid = false;
            }
        });

        return valid;
    }

    /* CONFIRM BOOKING */

    var confirmBtn = document.getElementById("confirm-btn");

    if (confirmBtn) {

        confirmBtn.addEventListener("click", function () {

            if (validateBooking()) {

                confirmBtn.style.display = "none";

                var bookingSuccess = document.getElementById("booking-success");

                if (bookingSuccess) {
                    bookingSuccess.style.display = "block";
                    bookingSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    }

    /* CONTACT PAGE */

    var contactForm = document.getElementById("contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (e) {

            e.preventDefault();

            var valid = true;
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var phoneInput = document.getElementById("phone");

            var checks = [
                ["err-name",    !document.getElementById("fullname") || document.getElementById("fullname").value.trim().length < 2,    "Please enter your full name."],
                ["err-email",   !document.getElementById("email") || !emailPattern.test(document.getElementById("email").value.trim()),  "Please enter a valid email address."],
                ["err-phone",   phoneInput && phoneInput.value.trim() !== "" && phoneInput.value.trim().length < 7,                      "Please enter a valid phone number."],
                ["err-subject", !document.getElementById("subject") || !document.getElementById("subject").value,                       "Please select a subject."],
                ["err-message", !document.getElementById("message") || document.getElementById("message").value.trim().length < 10,     "Your message must be at least 10 characters."]
            ];

            checks.forEach(function (check) {
                clearError(check[0]);
                if (check[1]) {
                    showError(check[0], check[2]);
                    valid = false;
                }
            });

            if (valid) {

                contactForm.style.display = "none";

                var formSuccess = document.getElementById("form-success");

                if (formSuccess) {
                    formSuccess.style.display = "block";
                    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
        });
    }

});