/* ==========================================================
   MAKAHO ACADEMY — main.js
   Modifiez uniquement le bloc CONFIG pour mettre le site à jour.
   ========================================================== */

const CONFIG = {
  whatsapp: "237674172225",          // WhatsApp (sans + ni espaces)
  whatsappDisplay: "674 17 22 25",
  phone: "+237696673009",            // Appels
  phoneDisplay: "696 67 30 09",
  momo: "674 17 22 25",              // MTN Mobile Money
  om: "696 67 30 09",                // Orange Money
  beneficiaire: "",                  // Nom affiché lors du paiement (ex. "Franck Wamba"). Laisser vide pour masquer.
  email: "",                         // ex. "contact@makaho-academy.com". Laisser vide pour masquer.

  session: {
    titre: "TikTok Pro Camer : de zéro à créateur rentable",
    date: "",                        // ex. "Samedi 7 et dimanche 8 novembre 2026". Vide = "Date annoncée très bientôt"
    lieu: "Yaoundé",
    placesTotal: 30,
    placesReservees: 9,              // Valeur de secours (URL vide, réseau coupé ou cellule invalide)
    sheetUrl: ""                     // Lien CSV d'une Google Sheet publiée. La cellule A1 doit contenir le nombre de places réservées.
                                     // Vide = le site utilise placesReservees ci-dessus.
  },

  tarifs: {
    earlybird: { label: "Early bird", prix: 25000 },
    standard:  { label: "Standard",   prix: 30000 },
    groupe:    { label: "Groupe (3 personnes et plus)", prix: 22500 },
    vip:       { label: "VIP (audit + coaching 1 h)", prix: 50000 }
  },
  fraisInscription: 5000,

  reseaux: {                         // Remplacez "#" par vos liens
    TikTok: "#",
    Facebook: "#",
    Instagram: "#",
    LinkedIn: "#",
    YouTube: "#"
  }
};

const fcfa = (n) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

const ICON_WA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.3-1.9-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-1.9z" fill="currentColor" stroke="none"/></svg>';

/* ---------- Navigation mobile ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); toggle.focus();
    }
  });
}

/* ---------- Pied de page (source unique) ---------- */
function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const socials = Object.entries(CONFIG.reseaux)
    .map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${name}</a></li>`).join("");
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand-badge" href="index.html" aria-label="Makaho Academy, accueil">
            <img src="assets/makaho-icon.png" alt="" width="42" height="33">
            <span class="brand-word"><strong>MAKAHO</strong><span>ACADEMY</span></span>
          </a>
          <p>École de formation aux métiers du digital et du graphisme, à Yaoundé. Ouvrez les yeux sur le digital.</p>
        </div>
        <div>
          <h2>Navigation</h2>
          <ul>
            <li><a href="formations.html">Formations</a></li>
            <li><a href="a-propos.html">À propos</a></li>
            <li><a href="blog.html">Articles</a></li>
            <li><a href="contact.html">Inscription et contact</a></li>
          </ul>
        </div>
        <div>
          <h2>Nous contacter</h2>
          <ul>
            <li><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp : ${CONFIG.whatsappDisplay}</a></li>
            <li><a href="tel:${CONFIG.phone}">Appel : ${CONFIG.phoneDisplay}</a></li>
            ${CONFIG.email ? `<li><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></li>` : ""}
            <li>Yaoundé, Cameroun</li>
          </ul>
        </div>
        <div>
          <h2>Suivez-nous</h2>
          <ul>${socials}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Makaho Academy. Tous droits réservés.</span>
        <span><a href="mentions-legales.html">Mentions légales</a> &nbsp;|&nbsp; <a href="mentions-legales.html#donnees">Données personnelles</a> &nbsp;|&nbsp; <a href="mentions-legales.html#conditions">Conditions d'inscription</a></span>
      </div>
    </div>`;
}

/* ---------- Champs remplis depuis CONFIG ---------- */
function fillConfig() {
  document.querySelectorAll(".ico-wa").forEach((n) => (n.outerHTML = ICON_WA));
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = waLink(a.dataset.wa || "Bonjour Makaho Academy, je souhaite avoir des informations.");
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach((a) => { a.href = `tel:${CONFIG.phone}`; });
  const map = {
    "wa-display": CONFIG.whatsappDisplay, "tel-display": CONFIG.phoneDisplay,
    "momo": CONFIG.momo, "om": CONFIG.om,
    "session-titre": CONFIG.session.titre, "session-lieu": CONFIG.session.lieu,
    "session-date": CONFIG.session.date || "Date annoncée très bientôt",
    "places-total": String(CONFIG.session.placesTotal),
    "frais": fcfa(CONFIG.fraisInscription)
  };
  Object.entries(map).forEach(([k, v]) => document.querySelectorAll(`[data-fill="${k}"]`).forEach((n) => (n.textContent = v)));
  Object.entries(CONFIG.tarifs).forEach(([k, t]) =>
    document.querySelectorAll(`[data-price="${k}"]`).forEach((n) => (n.textContent = t.prix.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")))
  );
  document.querySelectorAll("[data-beneficiaire]").forEach((n) => {
    if (CONFIG.beneficiaire) n.querySelector("strong").textContent = CONFIG.beneficiaire; else n.hidden = true;
  });
}

/* ---------- Les 30 sièges ---------- */
function renderSeats(placesReservees = CONFIG.session.placesReservees) {
  const { placesTotal } = CONFIG.session;
  const left = Math.max(placesTotal - placesReservees, 0);
  document.querySelectorAll("[data-seats]").forEach((grid) => {
    grid.innerHTML = "";
    for (let i = 0; i < placesTotal; i++) {
      const s = document.createElement("span");
      s.className = "seat" + (i < placesReservees ? " taken" : "");
      grid.appendChild(s);
    }
    grid.setAttribute("aria-label", `${placesReservees} places réservées sur ${placesTotal}`);
  });
  document.querySelectorAll("[data-fill='places-left']").forEach((n) => (n.textContent = String(left)));
  document.querySelectorAll("[data-fill='places-left-label']").forEach((n) => {
    n.textContent = left === 0 ? "Session complète : inscrivez-vous sur liste d'attente"
      : placesReservees === 0 ? `places disponibles sur ${placesTotal}` : `places restantes sur ${placesTotal}`;
  });
}

/* ---------- Places réservées depuis Google Sheets ----------
   Lit la cellule A1 (première cellule de la première ligne) du CSV publié.
   Toute erreur (URL vide, réseau, délai dépassé, valeur non numérique ou hors 0–placesTotal)
   laisse l'affichage de secours basé sur CONFIG.session.placesReservees. */
async function loadSeatsFromSheet() {
  const { sheetUrl, placesTotal } = CONFIG.session;
  if (!sheetUrl) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const url = sheetUrl + (sheetUrl.includes("?") ? "&" : "?") + "_=" + Date.now();   // anti-cache
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const a1 = (await res.text()).replace(/^﻿/, "").split(/\r?\n/)[0].split(",")[0].replace(/^"|"$/g, "").trim();
    if (!/^\d+$/.test(a1)) throw new Error("A1 invalide");
    const n = parseInt(a1, 10);
    if (n > placesTotal) throw new Error("A1 hors limites");
    renderSeats(n);
  } catch (err) {
    console.warn("Compteur de places : valeur de secours utilisée (" + err.message + ").");
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- L'œil suit le regard (pointeur fin uniquement) ---------- */
function initEye() {
  const pupil = document.querySelector(".eye-pupil");
  const svg = document.querySelector(".eye-svg");
  if (!pupil || !svg) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener("pointermove", (e) => {
    const r = svg.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(d / 300, 1);
    pupil.style.transform = `translate(${(dx / d) * 26 * k}px, ${(dy / d) * 14 * k}px)`;
  }, { passive: true });
}

/* ---------- Barre mobile ---------- */
function initMobileBar() {
  const bar = document.querySelector(".mobile-bar");
  if (!bar) return;
  document.body.classList.add("has-mobile-bar");
  const hero = document.querySelector(".hero, .page-hero");
  if (!hero || !("IntersectionObserver" in window)) { bar.classList.add("show"); return; }
  new IntersectionObserver(([en]) => bar.classList.toggle("show", !en.isIntersecting), { threshold: 0.1 }).observe(hero);
}

/* ---------- Formulaire → WhatsApp ---------- */
function initForm() {
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const params = new URLSearchParams(location.search);
  if (params.get("formule") && form.formule.querySelector(`option[value="${params.get("formule")}"]`)) form.formule.value = params.get("formule");
  if (params.get("formation") && form.formation.querySelector(`option[value="${params.get("formation")}"]`)) form.formation.value = params.get("formation");

  const out = {
    formule: document.getElementById("sum-formule"),
    total: document.getElementById("sum-total"),
    now: document.getElementById("sum-now"),
    box: document.getElementById("summary")
  };
  const formuleField = document.getElementById("field-formule");
  const placesField = document.getElementById("field-places");

  function currentFormule() {
    const n = parseInt(form.places.value, 10) || 1;
    let key = form.formule.value;
    if (n >= 3 && key !== "vip") key = "groupe";
    if (n < 3 && key === "groupe") key = "standard";
    return { key, n, tarif: CONFIG.tarifs[key] };
  }

  function update() {
    const isBootcamp = form.formation.value === "bootcamp";
    formuleField.hidden = !isBootcamp;
    placesField.hidden = !isBootcamp;
    out.box.hidden = !isBootcamp;
    if (!isBootcamp) return;
    const { n, tarif } = currentFormule();
    out.formule.textContent = `${tarif.label} × ${n}`;
    out.total.textContent = fcfa(tarif.prix * n);
    out.now.textContent = fcfa(CONFIG.fraisInscription * n);
  }

  function setError(name, msg) {
    const field = form.querySelector(`[name="${name}"]`).closest(".field");
    field.classList.toggle("invalid", !!msg);
    field.querySelector(".error").textContent = msg || "";
  }

  function validate() {
    let ok = true;
    const nom = form.nom.value.trim();
    const tel = form.telephone.value.replace(/[\s.-]/g, "");
    setError("nom", nom.length < 2 ? "Indiquez votre nom et prénom." : "");
    if (nom.length < 2) ok = false;
    const telOk = /^(\+?237)?6\d{8}$/.test(tel) || /^\+\d{8,15}$/.test(tel);
    setError("telephone", telOk ? "" : "Indiquez un numéro WhatsApp valide, par exemple 6 70 00 00 00.");
    if (!telOk) ok = false;
    const consent = form.consentement.checked;
    setError("consentement", consent ? "" : "Cochez cette case pour envoyer votre demande.");
    if (!consent) ok = false;
    return ok;
  }

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) { form.querySelector(".invalid input, .invalid select")?.focus(); return; }

    const formationLabel = form.formation.options[form.formation.selectedIndex].text;
    const paiement = form.paiement.value === "om" ? `Orange Money (${CONFIG.om})` : `MTN MoMo (${CONFIG.momo})`;
    const lines = [];
    if (form.formation.value === "bootcamp") {
      const { n, tarif } = currentFormule();
      lines.push(
        "Bonjour Makaho Academy 👋",
        `Je souhaite pré-réserver ${n > 1 ? n + " places" : "ma place"} pour le bootcamp « ${CONFIG.session.titre} » (Session 1, ${CONFIG.session.lieu}).`,
        "",
        `• Nom : ${form.nom.value.trim()}`,
        `• WhatsApp : ${form.telephone.value.trim()}`,
        form.quartier.value.trim() ? `• Quartier / ville : ${form.quartier.value.trim()}` : null,
        `• Profil : ${form.profil.value}`,
        `• Formule : ${tarif.label} – ${fcfa(tarif.prix)}${n > 1 ? " / personne" : ""}`,
        `• Nombre de places : ${n}`,
        `• Total : ${fcfa(tarif.prix * n)}`,
        `• Paiement des frais d'inscription (${fcfa(CONFIG.fraisInscription * n)}) via : ${paiement}`,
        form.message.value.trim() ? `• Message : ${form.message.value.trim()}` : null,
        "",
        "Merci de me confirmer ma réservation."
      );
    } else {
      lines.push(
        "Bonjour Makaho Academy 👋",
        `Je suis intéressé(e) par : ${formationLabel}.`,
        "",
        `• Nom : ${form.nom.value.trim()}`,
        `• WhatsApp : ${form.telephone.value.trim()}`,
        form.quartier.value.trim() ? `• Quartier / ville : ${form.quartier.value.trim()}` : null,
        `• Profil : ${form.profil.value}`,
        form.message.value.trim() ? `• Message : ${form.message.value.trim()}` : null,
        "",
        "Merci de me tenir informé(e)."
      );
    }
    const text = lines.filter((l) => l !== null).join("\n");
    const url = waLink(text);
    const win = window.open(url, "_blank", "noopener");
    if (!win) window.location.href = url;
    const done = document.getElementById("form-done");
    if (done) { done.hidden = false; done.focus(); }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
  fillConfig();
  renderSeats();
  loadSeatsFromSheet();
  initNav();
  initEye();
  initMobileBar();
  initForm();
});
