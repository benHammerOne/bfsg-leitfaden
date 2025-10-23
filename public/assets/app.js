(function init() {
  try {
    console.log("[Leitfaden] App boot gestartet.");

    // Query-Parameter auslesen
    const qp = new URLSearchParams(window.location.search);
    const domain = qp.get("domain");

    if (!domain || !String(domain).trim()) {
      console.warn("[Leitfaden] Kein ?domain= Parameter gefunden. Fallback auf '—'.");
      setDomainText("— (kein Parameter übergeben)");
    } else {
      console.log("[Leitfaden] Übergebene Domain:", domain);
      setDomainText(domain.trim());
    }

    // Weitere Boot-Checks
    checkCriticalElements(["js-domain", "main"]);

    console.log("[Leitfaden] App boot abgeschlossen – Seite funktionsbereit.");
  } catch (err) {
    console.error("[Leitfaden] Unerwarteter Fehler im Init:", err);
  }

  function setDomainText(value) {
    const el = document.getElementById("js-domain");
    if (!el) {
      console.error("[Leitfaden] #js-domain nicht gefunden – DOM stimmt nicht mit Erwartung überein.");
      return;
    }
    el.textContent = value;
  }

  function checkCriticalElements(ids) {
    ids.forEach((id) => {
      const ok = !!document.getElementById(id);
      console.log(`[Leitfaden] DOM-Check #${id}:`, ok ? "OK" : "FEHLT");
      if (!ok) {
        console.error(`[Leitfaden] Kritisches Element #${id} fehlt. Bitte index.html prüfen.`);
      }
    });
  }
})();
