
async function loadComponent(selector, file) {
  const target = document.querySelector(selector);

  if (!target) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.status}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    target.innerHTML = "";
  }
}

function initializeNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (!menuToggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

async function initializeSite() {
  await Promise.all([
    loadComponent("#site-header", "components/header.html"),
    loadComponent("#site-footer", "components/footer.html")
  ]);

  initializeNavigation();

  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

initializeSite();
