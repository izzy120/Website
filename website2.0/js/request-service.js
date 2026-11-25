/* ========================================
   INKYSHAMAN — REQUEST SERVICE FORM
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#service-request-form");
    const serviceSelect = document.querySelector("#service-category");
    const methodSelect = document.querySelector("#service-method");
    const statusMessage = document.querySelector("#request-status");

    if (!form || !serviceSelect || !methodSelect || !statusMessage) {
        console.error("InkyShaman: Request form elements were not found.");
        return;
    }

    const addressFields = {
        street: document.querySelector("#customer-street"),
        city: document.querySelector("#customer-city"),
        state: document.querySelector("#customer-state"),
        zip: document.querySelector("#customer-zip")
    };

    // Services that can be preselected through a URL query parameter.
    const allowedServices = new Set(
        Array.from(serviceSelect.options)
            .map(option => option.value)
            .filter(Boolean)
    );

    // Example: request-service.html?service=computer-repair
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");

    if (requestedService && allowedServices.has(requestedService)) {
        serviceSelect.value = requestedService;
    }

    // Require a service address for on-site appointments.
    function updateAddressRequirements() {
        const isOnSite = methodSelect.value === "on-site";

        Object.values(addressFields).forEach(field => {
            if (!field) return;

            field.required = isOnSite;

            if (isOnSite) {
                field.setAttribute("aria-required", "true");
            } else {
                field.removeAttribute("aria-required");
            }
        });

        if (isOnSite) {
            addressFields.street?.setAttribute("autocomplete", "street-address");
        }

        // ZIP codes are text, not numbers, so leading zeros are preserved.
        if (addressFields.zip) {
            addressFields.zip.setAttribute("inputmode", "numeric");
            addressFields.zip.setAttribute("autocomplete", "postal-code");
        }
    }

    methodSelect.addEventListener("change", updateAddressRequirements);
    updateAddressRequirements();

    // Keep status updates accessible to screen readers.
    function showStatus(message, type = "info") {
        statusMessage.textContent = message;
        statusMessage.dataset.type = type;
        statusMessage.style.display = "block";
    }

    // Clear old messages when the customer changes the form.
    form.addEventListener("input", () => {
        statusMessage.textContent = "";
        delete statusMessage.dataset.type;
    });

    // Validate ZIP code when an on-site address is required.
    function validateOnSiteAddress() {
        if (methodSelect.value !== "on-site") {
            return true;
        }

        const zip = addressFields.zip?.value.trim() ?? "";

        if (!/^\d{5}(?:-\d{4})?$/.test(zip)) {
            showStatus(
                "Please enter a valid 5-digit ZIP code, or ZIP+4, for the on-site appointment.",
                "error"
            );
            addressFields.zip?.focus();
            return false;
        }

        return true;
    }

   

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    statusMessage.textContent = "";

    if (!form.reportValidity()) {
        return;
    }

    if (!validateOnSiteAddress()) {
        return;
    }

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    if (!submitButton || submitButton.disabled) {
        return;
    }

    // Match the PHP endpoint's expected field names.
    const request = {
        full_name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: form.querySelector('[name="phone"]').value.trim(),
        service_type: serviceSelect.value,
        service_method: methodSelect.value,
        device_details: form.querySelector('[name="device"]').value.trim(),
        problem_description: form.querySelector('[name="description"]').value.trim(),
        street_address: addressFields.street.value.trim(),
        city: addressFields.city.value.trim(),
        state: addressFields.state.value.trim(),
        zip_code: addressFields.zip.value.trim(),
        contact_consent: form.querySelector(
            '[name="contact_consent"]'
        ).checked
    };

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Sending request…";
    submitButton.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(
            "/api/service-request.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(request)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Your request could not be submitted. Please try again."
            );
        }

        showStatus(
            `${result.message} Your reference number is ${result.reference_code}.`,
            "success"
        );

        form.reset();
        updateAddressRequirements();

    } catch (error) {
        console.error("Service request submission failed:", error);

        showStatus(
            error.message ||
            "We couldn't send your request. Please try again later.",
            "error"
        );

        } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.innerHTML = originalButtonHTML;
    }
    }); // Closes the form submit listener
});     // Closes the DOMContentLoaded listener