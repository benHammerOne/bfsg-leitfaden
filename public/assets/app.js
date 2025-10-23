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
})();
