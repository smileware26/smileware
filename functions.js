function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

let selectedTime = "";

const previewTable = document.getElementById(
    "previewTableBody"
);

document.querySelectorAll(".slot").forEach(button => {
    button.onclick = function () {
        document.querySelectorAll(".slot").forEach(slot => {
            slot.classList.remove("selected-slot");
        });

        this.classList.add("selected-slot");

        selectedTime = this.innerText;

        updatePreview();
    };
});

[
    "patientName",
    "serviceType",
    "appointmentDate"
].forEach(id => {
    document
        .getElementById(id)
        .addEventListener("input", updatePreview);
});

function updatePreview() {
    const patient =
        document.getElementById("patientName").value || "-";

    const procedure =
        document.getElementById("serviceType").value || "-";

    const date =
        document.getElementById("appointmentDate").value || "-";

    const time = selectedTime || "-";

    previewTable.innerHTML = `
        <tr>
            <td>${patient}</td>
            <td>${procedure}</td>
            <td>${date}</td>
            <td>${time}</td>
        </tr>
    `;
}

function getCurrentUser() {
    return (
        localStorage.getItem("currentUser") || "Guest"
    );
}

function bookAppointment() {
    const patient = document
        .getElementById("patientName")
        .value
        .trim();

    const procedure =
        document.getElementById("serviceType").value;

    const date =
        document.getElementById("appointmentDate").value;

    if (!patient || !date || !selectedTime) {
        alert("Please complete booking details");
        return;
    }

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({
        patient,
        procedure,
        date,
        time: selectedTime,
        status: "Pending",
        paymentStatus: "Unpaid",
        paymentMethod: "Cash",
        amountPaid: 0,
        bookingStatus: "Active",
        owner: getCurrentUser()
    });

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

    loadHistory();
    updatePreview();

    alert("Appointment booked successfully");

    document.getElementById("patientName").value = "";
    document.getElementById("appointmentDate").value = "";

    document.querySelectorAll(".slot").forEach(slot => {
        slot.classList.remove("selected-slot");
    });

    selectedTime = "";
}

function loadHistory() {
    const historyTable =
        document.getElementById("historyTable");

    if (!historyTable) return;

    const currentUser = getCurrentUser();

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    historyTable.innerHTML = "";

    const userAppointments = appointments.filter(
        appointment => appointment.owner === currentUser
    );

    userAppointments.forEach((appointment, index) => {
        historyTable.innerHTML += `
            <tr>
                <td>${appointment.patient}</td>
                <td>${appointment.procedure}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.bookingStatus}</td>

                <td>
                    ${
                        appointment.bookingStatus === "Cancelled"
                            ? `
                                <span
                                    style="
                                        color:red;
                                        font-weight:bold;
                                    "
                                >
                                    Cancelled
                                </span>
                            `
                            : `
                                <button
                                    class="book-btn"
                                    onclick="cancelBooking(${index})"
                                >
                                    Cancel
                                </button>
                            `
                    }
                </td>
            </tr>
        `;
    });
}

function cancelBooking(index) {
    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const currentUser = getCurrentUser();

    const userAppointments = appointments.filter(
        appointment => appointment.owner === currentUser
    );

    const selectedAppointment =
        userAppointments[index];

    const realIndex = appointments.findIndex(
        appointment =>
            appointment.owner === currentUser &&
            appointment.date === selectedAppointment.date &&
            appointment.time === selectedAppointment.time &&
            appointment.patient === selectedAppointment.patient
    );

    if (realIndex !== -1) {
        appointments.splice(realIndex, 1);

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );
    }

    loadHistory();
}

window.onload = () => {
    loadHistory();
    updatePreview();
};