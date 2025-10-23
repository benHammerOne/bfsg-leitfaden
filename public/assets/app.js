(function initLeitfaden() {
  console.log("[Leitfaden] Boot startet...");

  try {
    const qp = new URLSearchParams(window.location.search);
    const domain = qp.get("domain");
    const domainText = domain && domain.trim() ? domain.trim() : "— (kein Parameter übergeben)";
    const elDomain = document.getElementById("js-domain");

    if (elDomain) {
      elDomain.textContent = domainText;
      console.log("[Leitfaden] Domain gesetzt:", domainText);
    } else {
      console.error("[Leitfaden] Element #js-domain fehlt im DOM.");
    }

    // === Struktur-Check ===
    checkLandmarks();
    checkHeadings();
  } catch (err) {
    console.error("[Leitfaden] Unerwarteter Fehler:", err);
  }

  function checkLandmarks() {
    const roles = ["banner", "navigation", "main", "contentinfo"];
    console.groupCollapsed("[A11y-Check] Landmarks");
    roles.forEach(role => {
      const el = document.querySelector(`[role='${role}']`);
      console.log(` • ${role}:`, el ? "✔ vorhanden" : "❌ fehlt");
      if (!el) console.warn(`[A11y] Fehlendes Landmark-Element: ${role}`);
    });
    console.groupEnd();
  }

  function checkHeadings() {
    const h1 = document.querySelectorAll("h1").length;
    const h2 = document.querySelectorAll("h2").length;
    const h3 = document.querySelectorAll("h3").length;
    console.groupCollapsed("[A11y-Check] Headings");
    console.log(` • h1: ${h1} | h2: ${h2} | h3: ${h3}`);
    if (h1 !== 1) console.warn("[A11y] Es sollte genau ein h1 geben.");
    if (h2 < 1) console.warn("[A11y] Keine h2-Überschriften gefunden.");
    console.groupEnd();
  }

  console.log("[Leitfaden] Boot abgeschlossen.");

// === Tastatur-Selbstcheck ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Tastatur-Check] Initialisierung gestartet.");

  const startBtn = document.getElementById("btn-start-tastatur");
  const testArea = document.getElementById("tastatur-testarea");
  const fertigBtn = document.getElementById("btn-fertig-tastatur");
  const result = document.getElementById("result-tastatur");
  const progressFill = document.getElementById("progress-fill");
  const progressCount = document.getElementById("progress-count");

  let completedChecks = 0;

  if (!startBtn || !testArea || !fertigBtn || !result) {
    console.error("[Tastatur-Check] DOM-Elemente fehlen.");
    return;
  }

  startBtn.addEventListener("click", () => {
    console.log("[Tastatur-Check] Gestartet durch Nutzer.");
    testArea.hidden = false;
    startBtn.disabled = true;
    testArea.querySelector("button").focus();
    result.textContent = "Check läuft – nutzen Sie die TAB-Taste …";
    result.className = "result";
  });

  fertigBtn.addEventListener("click", () => {
    console.log("[Tastatur-Check] Vom Nutzer als abgeschlossen markiert.");
    testArea.hidden = true;
    result.textContent = "Tastatur-Navigation erfolgreich geprüft ✔";
    result.className = "result ok";

    // Fortschritt aktualisieren
    completedChecks = Math.min(completedChecks + 1, 3);
    updateProgress();

    console.log("[Tastatur-Check] Erfolg! Fortschritt jetzt:", completedChecks);
  });

  // === Kontrasteindruck-Check (A/B-Vergleich) ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("[Kontrast-Check] Initialisierung gestartet.");

  // DOM-Hooks
  const btnGood   = document.getElementById("btn-contrast-good");
  const btnPoor   = document.getElementById("btn-contrast-poor");
  const feedback  = document.getElementById("contrast-feedback");
  const badge     = document.getElementById("contrast-badge");
  const progressFill  = document.getElementById("progress-fill");
  const progressCount = document.getElementById("progress-count");

  // Wir greifen auf die gleiche Fortschritts-Logik zu wie beim Tastatur-Check,
  // d. h. wir halten eine globale/übergreifende Zählung in window.
  // Falls sie noch nicht existiert, initialisieren wir sie hier.
  if (typeof window.__bfsgCompletedChecks === "undefined") {
    window.__bfsgCompletedChecks = 0;
    console.warn("[Kontrast-Check] __bfsgCompletedChecks war nicht gesetzt – initialisiere auf 0.");
  }

  function updateProgressUI() {
    const percent = (window.__bfsgCompletedChecks / 3) * 100;
    progressFill.style.width = percent + "%";
    progressCount.textContent = `${window.__bfsgCompletedChecks} / 3 abgeschlossen`;
  }

  function setFeedback(msg, ok = true) {
    feedback.textContent = msg;
    feedback.className = "result " + (ok ? "ok" : "warn");
  }

  function showBadge() {
    badge.hidden = false;
    badge.setAttribute("aria-hidden", "false");
    badge.classList.add("show");
    setTimeout(() => badge.classList.remove("show"), 600);
  }

  function completeCheckIfNeeded() {
    // Verhindern, dass mehrfach gezählt wird
    if (!btnGood.disabled || !btnPoor.disabled) {
      window.__bfsgCompletedChecks = Math.min(window.__bfsgCompletedChecks + 1, 3);
      console.log("[Kontrast-Check] Check als abgeschlossen gezählt. Gesamt:", window.__bfsgCompletedChecks);
      // Buttons deaktivieren, um Doppelzählung zu verhindern
      btnGood.disabled = true;
      btnPoor.disabled = true;
      updateProgressUI();
    } else {
      console.log("[Kontrast-Check] Bereits abgeschlossen – kein erneutes Zählen.");
    }
  }

  if (!btnGood || !btnPoor || !feedback || !badge) {
    console.error("[Kontrast-Check] DOM-Elemente fehlen. Abbruch.");
    return;
  }

  // Event: Nutzer wählt "Gut lesbar" (A)
  btnGood.addEventListener("click", () => {
    console.log("[Kontrast-Check] Auswahl: A – Gut lesbar (Nutzer empfindet Seite eher klar).");
    setFeedback("Gut erkannt: Hoher Kontrast ist ein Kernfaktor für Lesbarkeit.", true);
    showBadge();
    completeCheckIfNeeded();
  });

  // Event: Nutzer wählt "Schwer lesbar" (B)
  btnPoor.addEventListener("click", () => {
    console.log("[Kontrast-Check] Auswahl: B – Schwer lesbar (Nutzer empfindet Seite eher problematisch).");
    setFeedback("Wichtig: Prüfen Sie echte Text-Kontraste. Sie haben ein gutes Gefühl für potenzielle Risiken.", true);
    showBadge();
    completeCheckIfNeeded();
  });

  // UI initial setzen
  updateProgressUI();
  console.log("[Kontrast-Check] Initialisierung abgeschlossen.");
});


  function updateProgress() {
    const percent = (completedChecks / 3) * 100;
    progressFill.style.width = percent + "%";
    progressCount.textContent = `${completedChecks} / 3 abgeschlossen`;
  }

  console.log("[Tastatur-Check] Initialisierung abgeschlossen.");
});

  
})();
