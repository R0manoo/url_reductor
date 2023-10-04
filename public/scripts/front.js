"use strict;";

const $form = document.querySelector("#submit-link");
const $output = document.querySelector("#output");
const $input = document.querySelector("#url");
const $submitBtn = document.querySelector("#submit-btn");
const $copyButton = document.querySelector("#copy-button");
const $copyText = document.querySelector("#copy-text");

document.addEventListener("DOMContentLoaded", function () {
    $copyButton.setAttribute("data-tooltip", "Copy Link");
    $copyButton.addEventListener("click", function () {
        // Select the text in the input field
        $copyText.select();
        try {
            // Copy the selected text to the clipboard
            document.execCommand("copy");
            $copyButton.setAttribute("data-tooltip", "Link Copied");
        } catch (err) {
            console.error("Unable to copy text: ", err);
        }
    });
});

function formDataToJSON(formElt) {
    const formData = new FormData(formElt);
    return Object.fromEntries(formData.entries());
}
function showStoredUrl() {
    storedUrl = JSON.parse(localStorage.getItem("storedUrl"));
    let html = "";
    storedUrl.forEach((element) => {
        const a_class = "button is-fullwidth is-link is-small";
        const id = "shortUrl";
        const href = `${window.location.href}${element.shortUrl}`;
        html += `<div class="container is-primary">`;
        html += `<div class="columns">`;
        html += `<div class="column is-three-quarters">`;
        html += `<a class="${a_class}" href="${href}" id="${id}">${window.location.href}${element.shortUrl}</a>`;
        html += `</div>`;
        html += `<div class="column">`;
        html += `<a class="${a_class}">${element.url}</a>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
    });
    $output.innerHTML = html;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

//TODO AUSSI AJOUTER UN TRUC POUR UNE URL CUSTOM
//* CA DANS LE BACK
//* AJOUTER UN TRUC QUAND URL CHOISI DEJA UTILISE

window.addEventListener("load", async (event) => {
    showStoredUrl();
    let storedUrl = localStorage.getItem("storedUrl")
        ? localStorage.getItem("storedUrl")
        : JSON.stringify([]);
    await fetch("/local-storage", {
        method: "post",
        body: storedUrl,
        headers: {
            "Content-Type": "application/json",
        },
    });
});

//TODO AJOUTER UN TRUC QUAND L'USER ENTRE UN URL A LA CON
$form.addEventListener("submit", async (evt) => {
    evt.preventDefault(); //on empeche le formulaire de se diriger vers /submit
    try {
        if (isValidUrl($input.value)) {
            await fetch("/submit", {
                method: "post",
                body: JSON.stringify(formDataToJSON(evt.target)),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedData = await fetch("/local-storage", {
                method: "get",
            });
            const json = await updatedData.json();
            localStorage.setItem("storedUrl", JSON.stringify(json));
            const truc = JSON.parse(localStorage.getItem("storedUrl"));
            length = truc.length;
            latest_link = truc[length - 1].shortUrl;
            console.log(latest_link);
            console.log($copyText.value);
            $copyText.value = `${window.location}${latest_link}`;
            showStoredUrl();
        } else {
            
        }
    } catch (error) {
        console.error(error);
    }
});
