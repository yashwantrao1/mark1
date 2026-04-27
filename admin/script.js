const LOGIN_STATUS_KEY = "adminDemoLoggedIn";
const DEMO_NUMBER = "1111";
const DEMO_PASSWORD = "1111";
const ADMIN_PAGE_PATH = "./admin.html";

const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const numberInput = document.getElementById("numberInput");
const passwordInput = document.getElementById("passwordInput");
const msg = document.getElementById("msg");
const welcomeText = document.getElementById("welcomeText");
const adminContent = document.getElementById("adminContent");

function isLoggedIn() {
    return localStorage.getItem(LOGIN_STATUS_KEY) === "true";
}

function setLoggedInStatus(value) {
    localStorage.setItem(LOGIN_STATUS_KEY, value ? "true" : "false");    
}

async function loadAdminPage() {
    if (!adminContent) return;

    try {
        const response = await fetch(ADMIN_PAGE_PATH, { cache: "no-store" });
        if (!response.ok) {
            throw new Error("Failed to load admin page.");
        }

        const htmlText = await response.text();
        const parsed = new DOMParser().parseFromString(htmlText, "text/html");
        adminContent.innerHTML = parsed.body ? parsed.body.innerHTML : htmlText;
        adminContent.classList.remove("hidden");
    } catch (error) {
        adminContent.classList.remove("hidden");
        adminContent.innerHTML = `<p class="msg error">Could not load admin.html</p>`;
    }
}

async function showLoggedInView() {
    if (loginOverlay) loginOverlay.classList.add("hidden");
    if (welcomeText) welcomeText.textContent = "Welcome, demo admin.";
    await loadAdminPage();
}

function showLoginView() {
    if (loginOverlay) loginOverlay.classList.remove("hidden");
    if (adminContent) {
        adminContent.classList.add("hidden");
        adminContent.innerHTML = "";
    }
}

if (isLoggedIn()) {
    showLoggedInView();
    const demoPanel = document.querySelector(".route-panel");
    const demoPanelDiv = document.querySelector(".demo-panel");
    if (demoPanel) demoPanel.classList.add("active");
    if (demoPanelDiv) demoPanelDiv.classList.add("active");
} else {
    showLoginView();
}

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const numberValue = numberInput ? numberInput.value.trim() : "";
        const passwordValue = passwordInput ? passwordInput.value.trim() : "";

        if (numberValue === DEMO_NUMBER && passwordValue === DEMO_PASSWORD) {
            setLoggedInStatus(true);

            if (msg) {
                msg.textContent = "Login successful!";
                msg.className = "msg success";
            }

            await showLoggedInView();
            return;
        }

        if (msg) {
            msg.textContent = "Invalid number or password.";
            msg.className = "msg error";
        }
    });
}
