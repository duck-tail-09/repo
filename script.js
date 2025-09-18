//Sample Data
//Sample Data

const patients = [
  {
    name: "John Doe",
    problems: ["Hypertension", "Headaches"],
    medications: ["Atenolol 50mg daily"],
    encounters: [
      "2025-09-10: Reports headache & dizziness",
      "2025-08-25: BP checkup – elevated",
      "2025-08-01: Routine follow-up"
    ],
    vitals: [130, 135, 145, 150, 160, 165, 170]
  },
  {
    name: "Mary Smith",
    problems: ["Diabetes Type 2"],
    medications: ["Metformin 500mg"],
    encounters: [
      "2025-09-12: Blood sugar check – 180 mg/dL",
      "2025-08-20: Eye exam scheduled"
    ],
    vitals: [110, 115, 120, 118, 117, 116, 115]
  },
  {
    name: "Rajesh Kumar",
    problems: ["Asthma"],
    medications: ["Inhaler – Salbutamol"],
    encounters: [
      "2025-09-15: Wheezing and shortness of breath",
      "2025-08-28: Routine checkup – stable"
    ],
    vitals: [98, 100, 102, 105, 107, 110, 108]
  },
  {
    name: "Aisha Khan",
    problems: ["Thyroid Disorder"],
    medications: ["Levothyroxine 75 mcg"],
    encounters: [
      "2025-09-05: Fatigue reported",
      "2025-08-10: TSH test conducted – borderline"
    ],
    vitals: [120, 118, 117, 116, 119, 121, 122]
  },
  {
    name: "Michael Johnson",
    problems: ["Obesity", "High Cholesterol"],
    medications: ["Atorvastatin 20mg"],
    encounters: [
      "2025-09-02: Diet counseling session",
      "2025-08-12: Lipid profile check"
    ],
    vitals: [135, 138, 140, 142, 145, 148, 150]
  },
  {
    name: "Sophia Lee",
    problems: ["Anemia"],
    medications: ["Iron supplements"],
    encounters: [
      "2025-09-08: Complains of weakness",
      "2025-08-22: Blood test – low hemoglobin"
    ],
    vitals: [95, 92, 94, 96, 98, 100, 97]
  },
  {
    name: "Carlos Martinez",
    problems: ["Chronic Kidney Disease"],
    medications: ["ACE inhibitors"],
    encounters: [
      "2025-09-11: Follow-up – mild swelling in feet",
      "2025-08-18: Kidney function test"
    ],
    vitals: [130, 132, 134, 133, 135, 137, 140]
  },
  
];

// Elements
const patientList = document.getElementById("patientList");
const summary = document.getElementById("summary");
const encounterList = document.getElementById("encounterList");
const alertList = document.getElementById("alertList");

let chart;
document.getElementById("addPatientBtn").addEventListener("click", async () => {
  const name = prompt("Patient name:");
  if (!name) return;

  const payload = {
    name,
    dob: prompt("DOB (YYYY-MM-DD):"),
    gender: prompt("Gender:"),
    mrn: prompt("MRN:")
  };

  const res = await fetch("http://127.0.0.1:8000/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Error: " + err.detail);
  }

  const patient = await res.json();
  patients.push(patient); // update local list
  renderPatients();
});
async function loadPatients() {
  const res = await fetch("http://127.0.0.1:8000/patients");
  const data = await res.json();
  patients = data; // replace in-memory list with server data
  renderPatients();
}

// call it once at startup
loadPatients();

// Render Patients
function renderPatients() {
  patientList.innerHTML = "";
  patients.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    li.onclick = () => showPatient(index);
    patientList.appendChild(li);
  });
}

// Show Patient Summary
function showPatient(index) {
  const p = patients[index];

  summary.innerHTML = `
    <h2>Patient Summary</h2>
    <p><strong>Problems:</strong> ${p.problems.join(", ")}</p>
    <p><strong>Medications:</strong> ${p.medications.join(", ")}</p>
  `;

  // Encounters
  encounterList.innerHTML = "";
  p.encounters.forEach(e => {
    const li = document.createElement("li");
    li.textContent = e;
    encounterList.appendChild(li);
  });

  // Alerts (basic rules)
  alertList.innerHTML = "";
  const lastVital = p.vitals[p.vitals.length - 1];
  if (lastVital > 160) {
    alertList.innerHTML += `<li class="alert-red">⚠️ Severe Hypertension detected (BP ${lastVital})</li>`;
  } else if (lastVital > 140) {
    alertList.innerHTML += `<li class="alert-yellow">⚠️ Elevated Blood Pressure (${lastVital})</li>`;
  } else {
    alertList.innerHTML += `<li class="alert-green">✅ Stable Condition</li>`;
  }

  // Chart
  renderChart(p.vitals);
}

// Chart.js Vitals Chart
function renderChart(data) {
  const ctx = document.getElementById("vitalsChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
      datasets: [{
        label: "Blood Pressure",
        data: data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

// Init
renderPatients();
// Tab navigation
const sections = document.querySelectorAll(".section");
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.id.replace("Link", "Section");

    // hide all sections
    sections.forEach(sec => sec.classList.remove("active"));

    // show selected section
    document.getElementById(targetId).classList.add("active");
  });
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("You have been logged out.");
});
// Sample Data for Analytics

// Vitals Trend Chart (Line Chart)
const vitalsCtx = document.getElementById('vitalsTrendChart').getContext('2d');
const vitalsTrendChart = new Chart(vitalsCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Heart Rate (bpm)',
                data: [75, 78, 80, 77, 79, 76],
                borderColor: '#6d28d9',
                backgroundColor: 'rgba(109, 40, 217, 0.2)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'BP Systolic (mmHg)',
                data: [120, 125, 122, 130, 128, 124],
                borderColor: '#4c1d95',
                backgroundColor: 'rgba(76, 29, 149, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
            y: { beginAtZero: false }
        }
    }
});

// Encounters Chart (Bar Chart)
const encountersCtx = document.getElementById('encountersChart').getContext('2d');
const encountersChart = new Chart(encountersCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Number of Encounters',
            data: [12, 15, 10, 20, 18, 14],
            backgroundColor: '#7c3aed'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});
document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const clostBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatBotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  chatbotIcon.addEventListener("click", () => {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none";
  });
  clostBtn.addEventListener("click", () => {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex";
  });

  sendBtn.addEventListener("click", sendMessage);

  chatBotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

function sendMessage() {
  const userMessage = document.getElementById("chatbot-input").value.trim();
  if (userMessage) {
    appendMessage("user", userMessage);
    document.getElementById("chatbot-input").value.trim();
    getBotResponse(userMessage);
  }
}

function appendMessage(sender, message) {
  const messageContainer = document.getElementById("chatbot-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function getBotResponse(userMessage) {
  const API_KEY = "AIzaSyB5D6cMgaNH3SWAk-HDaUaxx9mA-m_wtqw";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates.length) {
      throw new Error("No response from Gemini API");
    }
let patients = [
  {
    name: "John Doe",
    problems: ["Hypertension", "Headaches"],
    medications: ["Atenolol 50mg daily"],
    encounters: [
      "2025-09-10: Reports headache & dizziness",
      "2025-08-25: BP checkup – elevated",
      "2025-08-01: Routine follow-up"
    ],
    vitals: [130, 135, 145, 150, 160, 165, 170]
  },
  {
    name: "Mary Smith",
    problems: ["Diabetes Type 2"],
    medications: ["Metformin 500mg"],
    encounters: [
      "2025-09-12: Blood sugar check – 180 mg/dL",
      "2025-08-20: Eye exam scheduled"
    ],
    vitals: [110, 115, 120, 118, 117, 116, 115]
  },
  {
    name: "Rajesh Kumar",
    problems: ["Asthma"],
    medications: ["Inhaler – Salbutamol"],
    encounters: [
      "2025-09-15: Wheezing and shortness of breath",
      "2025-08-28: Routine checkup – stable"
    ],
    vitals: [98, 100, 102, 105, 107, 110, 108]
  },
  {
    name: "Aisha Khan",
    problems: ["Thyroid Disorder"],
    medications: ["Levothyroxine 75 mcg"],
    encounters: [
      "2025-09-05: Fatigue reported",
      "2025-08-10: TSH test conducted – borderline"
    ],
    vitals: [120, 118, 117, 116, 119, 121, 122]
  },
  {
    name: "Michael Johnson",
    problems: ["Obesity", "High Cholesterol"],
    medications: ["Atorvastatin 20mg"],
    encounters: [
      "2025-09-02: Diet counseling session",
      "2025-08-12: Lipid profile check"
    ],
    vitals: [135, 138, 140, 142, 145, 148, 150]
  },
  {
    name: "Sophia Lee",
    problems: ["Anemia"],
    medications: ["Iron supplements"],
    encounters: [
      "2025-09-08: Complains of weakness",
      "2025-08-22: Blood test – low hemoglobin"
    ],
    vitals: [95, 92, 94, 96, 98, 100, 97]
  },
  {
    name: "Carlos Martinez",
    problems: ["Chronic Kidney Disease"],
    medications: ["ACE inhibitors"],
    encounters: [
      "2025-09-11: Follow-up – mild swelling in feet",
      "2025-08-18: Kidney function test"
    ],
    vitals: [130, 132, 134, 133, 135, 137, 140]
  }
];

    const botMessage = data.candidates[0].content.parts[0].text;
    appendMessage("bot", botMessage);
  } catch (error) {
    console.error("Error:", error);
    appendMessage(
      "bot",
      "Sorry, I'm having trouble responding. Please try again."
    );
  }
}
