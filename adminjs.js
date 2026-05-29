function logout() {
  window.location.href = "login.html";
}

function goTo(id) {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
  });
}

let currentFilter = "today";

document.querySelectorAll(".summary-btn").forEach((button) => {
  button.addEventListener("click", function () {
    currentFilter = this.dataset.filter;

    document.querySelectorAll(".summary-btn").forEach((btn) => {
      btn.classList.remove("active-summary");
    });

    this.classList.add("active-summary");

    loadAppointments();
  });
});

function filterAppointments(appointments) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (currentFilter === "today") {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate.getTime() === today.getTime();
    });
  }

  if (currentFilter === "weekly") {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    });
  }

  if (currentFilter === "all") {
    return appointments;
  }

  return appointments;
}

function getPaymentColor(status) {
  if (status === "Paid") return "green";
  if (status === "Partial") return "orange";

  return "red";
}

function updateStatus(index, value) {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments[index].status = value;

  localStorage.setItem("appointments", JSON.stringify(appointments));

  loadAppointments();
}

function updateMoney(index, value) {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments[index].amountPaid = value;

  localStorage.setItem("appointments", JSON.stringify(appointments));

  loadAppointments();
}

function updatePaymentMethod(index, value) {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments[index].paymentMethod = value;

  localStorage.setItem("appointments", JSON.stringify(appointments));

  loadAppointments();
}

function updatePaymentStatus(index, value) {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  appointments[index].paymentStatus = value;

  localStorage.setItem("appointments", JSON.stringify(appointments));

  loadAppointments();
}

function loadAppointments() {
  const allAppointments =
    JSON.parse(localStorage.getItem("appointments")) || [];

  const appointments = filterAppointments(allAppointments);

  const search = (
    document.getElementById("searchPatient")?.value || ""
  ).toLowerCase();

  const filtered = appointments.filter((appointment) =>
    (appointment.patient || "").toLowerCase().includes(search),
  );

  const appointmentTable = document.getElementById("appointmentTable");

  const recordTable = document.getElementById("recordTable");

  const billingTable = document.getElementById("billingTable");

  appointmentTable.innerHTML = `
        <tr>
            <th>Patient</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Money</th>
            <th>Payment Method</th>
        </tr>
    `;

  recordTable.innerHTML = `
        <tr>
            <th>Patient</th>
            <th>Procedure</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
        </tr>
    `;

  billingTable.innerHTML = `
        <tr>
            <th>Patient</th>
            <th>Procedure</th>
            <th>Money Record</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
        </tr>
    `;

  let confirmed = 0;
  let pending = 0;
  let arrived = 0;

  filtered.forEach((appointment) => {
    const realIndex = allAppointments.findIndex(
      (item) =>
        item.patient === appointment.patient &&
        item.date === appointment.date &&
        item.time === appointment.time,
    );

    appointmentTable.innerHTML += `
            <tr>
                <td>${appointment.patient || ""}</td>
                <td>${appointment.procedure || ""}</td>
                <td>${appointment.date || ""}</td>
                <td>${appointment.time || ""}</td>

                <td>
                    <select onchange="updateStatus(${realIndex}, this.value)">
                        <option ${
                          appointment.status === "Confirmed" ? "selected" : ""
                        }>
                            Confirmed
                        </option>

                        <option ${
                          appointment.status === "Pending" ? "selected" : ""
                        }>
                            Pending
                        </option>

                        <option ${
                          appointment.status === "Arrived" ? "selected" : ""
                        }>
                            Arrived
                        </option>
                    </select>
                </td>

                <td>
                    <input
                        type="number"
                        min="0"
                        value="${appointment.amountPaid || 0}"
                        onchange="updateMoney(${realIndex}, this.value)"
                        style="width:120px;padding:8px"
                    >
                </td>

                <td>
                    <select onchange="updatePaymentMethod(${realIndex}, this.value)">
                        <option ${
                          appointment.paymentMethod === "Cash" ? "selected" : ""
                        }>
                            Cash
                        </option>

                        <option ${
                          appointment.paymentMethod === "GCash"
                            ? "selected"
                            : ""
                        }>
                            GCash
                        </option>

                        <option ${
                          appointment.paymentMethod === "Card" ? "selected" : ""
                        }>
                            Card
                        </option>
                    </select>
                </td>
            </tr>
        `;

    recordTable.innerHTML += `
            <tr>
                <td>${appointment.patient || ""}</td>
                <td>${appointment.procedure || ""}</td>
                <td>${appointment.date || ""}</td>
                <td>${appointment.time || ""}</td>
                <td>${appointment.status || ""}</td>
            </tr>
        `;

    billingTable.innerHTML += `
            <tr>
                <td>${appointment.patient || ""}</td>
                <td>${appointment.procedure || ""}</td>
                <td>₱${appointment.amountPaid || 0}</td>
                <td>${appointment.paymentMethod || "Cash"}</td>

                <td>
                    <select
                        onchange="updatePaymentStatus(${realIndex}, this.value)"
                        style="
                            color:${getPaymentColor(appointment.paymentStatus)};
                            font-weight:bold;
                        "
                    >
                        <option ${
                          appointment.paymentStatus === "Paid" ? "selected" : ""
                        }>
                            Paid
                        </option>

                        <option ${
                          appointment.paymentStatus === "Unpaid"
                            ? "selected"
                            : ""
                        }>
                            Unpaid
                        </option>

                        <option ${
                          appointment.paymentStatus === "Partial"
                            ? "selected"
                            : ""
                        }>
                            Partial
                        </option>
                    </select>
                </td>
            </tr>
        `;

    if (appointment.status === "Confirmed") confirmed++;
    if (appointment.status === "Pending") pending++;
    if (appointment.status === "Arrived") arrived++;
  });

  document.getElementById("todayCount").innerText = filtered.length;

  document.getElementById("confirmedCount").innerText = confirmed;

  document.getElementById("pendingCount").innerText = pending;

  document.getElementById("arrivedCount").innerText = arrived;
}

window.onload = loadAppointments;
