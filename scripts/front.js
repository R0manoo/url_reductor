"use strict;";

const $form = document.querySelector("#submit-link");
const $output = document.querySelector("#output");
const $input = document.querySelector("#url");
const $submitBtn = document.querySelector("#submit-btn");
const $showUrlBtn = document.querySelector("#show-links");

function formDataToJSON(formElt) {
    const formData = new FormData(formElt);
    return Object.fromEntries(formData.entries());
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

//TODO AJOUTER UN TRUC QUAND L'USER ENTRE UN URL A LA CON
//TODO AUSSI AJOUTER UN TRUC POUR UNE URL CUSTOM
//* CA DANS LE BACK
//* AJOUTER UN TRUC QUAND URL CHOISI DEJA UTILISE

//*Quand la page a fini de charger on check les cookies
// document.cookie="url=url:'http://toto.org',shortUrl:'';expires=Thu, 30 Dec 2023 00:00:00 UTC; path=/;SameSite=None;Secure"
window.addEventListener("load", async(event) => {
    console.log(document.cookie);
    await fetch("/set-cookie",{
        method:"post",
        body:document.cookie
    })
});


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
        }
    } catch (error) {
        console.error(error);
    }
});



//! MEGA MOCHE CHANGER CA PLUS TARD
$showUrlBtn.addEventListener("click", async () => {
    const data = await fetch("/submit", {
        method: "get",
    });
    const json = await data.json();
    let html = "";
    json.forEach((element) => {
        console.log(element.url);
        html += `<li>${window.location.href}${element.shortUrl}=>${element.url}</li>`;
    });
    $output.innerHTML = html;
});




