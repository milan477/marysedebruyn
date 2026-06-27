/* Gallery → artwork detail page.
   Clicking a work opens artwork.html, passing the image + optional
   metadata through sessionStorage (same-tab navigation keeps it).

   To give an artwork a title / description, add data-* attributes to its
   <figure> (or <img>), e.g.:
     <figure class="work" data-title="Zoektocht" data-year="2023"
             data-details="Oil on canvas, 100 × 70 cm.">
*/
(function () {
  function titleFromSrc(src) {
    if (!src || src.indexOf("data:") === 0) return "";
    try {
      var file = decodeURIComponent(src.split("/").pop().split("?")[0]);
      file = file.replace(/\.[a-z0-9]+$/i, "");           // drop extension
      file = file.replace(/-scaled.*$/i, "");             // drop WP suffixes
      file = file.replace(/-\d+x\d+$/i, "");
      file = file.replace(/[-_]+/g, " ").trim();
      if (!file) return "";
      return file.charAt(0).toUpperCase() + file.slice(1);
    } catch (e) {
      return "";
    }
  }

  function openArtwork(img) {
    var fig = img.closest("figure") || img;
    var data = {
      src: img.currentSrc || img.src,
      alt: img.getAttribute("alt") || "",
      title: fig.dataset.title || img.dataset.title ||
             img.getAttribute("alt") || titleFromSrc(img.src) || "Untitled",
      year: fig.dataset.year || img.dataset.year || "",
      details: fig.dataset.details || img.dataset.details || ""
    };
    try {
      sessionStorage.setItem("mdb_artwork", JSON.stringify(data));
      window.location.href = "artwork.html";
    } catch (e) {
      // sessionStorage failed (e.g. image too large) — show it directly.
      window.location.href = data.src;
    }
  }

  document.addEventListener("click", function (e) {
    // Home page: the hero links to works.html — open the shown work instead.
    var hero = e.target.closest(".hero-link, .hero img");
    if (hero) {
      var heroImg = document.getElementById("heroImage") ||
                    document.querySelector(".hero img");
      if (heroImg && heroImg.src) {
        e.preventDefault();
        openArtwork(heroImg);
        return;
      }
    }
    var img = e.target.closest(".work img");
    if (img) {
      e.preventDefault();
      openArtwork(img);
    }
  });
})();
