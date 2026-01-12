document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const searchText = document.getElementById("searchText");
  const pokemonHeightEl = document.getElementById("pokemon-height");
  const progBar = document.getElementById("progBar");
  const sprite = document.getElementById("sprite");
  const measurementBar = document.querySelector(".measurement-bar");
  const personImage = document.querySelector(".person-image");

  // --- Small helper: animate an element's height (in %) over duration ---
  function animateHeightPercent(element, toPercent, duration = 2000) {
    if (!element) return;

    const start = performance.now();

    // Current height (try to read from style first, else from computed)
    const computed = getComputedStyle(element).height;
    const startPx = parseFloat(computed) || 0;

    // We want to animate to a percent height relative to parent
    const parent = element.parentElement;
    const parentPx = parent ? parent.getBoundingClientRect().height : 0;
    const targetPx = parentPx ? (toPercent / 100) * parentPx : startPx;

    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const currentPx = startPx + (targetPx - startPx) * eased;

      element.style.height = `${currentPx}px`;

      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function animateProgressBar(pokemonHeight) {
    const tallestHeight = 21;
    const pokemonHeightPercent = (pokemonHeight / tallestHeight) * 100;

    // Ensure it has a parent with a fixed height in CSS for this to look right
    animateHeightPercent(progBar, pokemonHeightPercent, 2000);
  }

  function changePokemonHeight(cap, height, userInput) {
    const percentageHeight = (height / cap) * 100;

    // NOTE: your original used http; use https to avoid mixed-content issues on https sites
    sprite.src = `https://www.pokestadium.com/sprites/xy/${userInput}.gif`;

    animateHeightPercent(sprite, percentageHeight, 2000);
  }

  function changeHumanHeight(cap, height) {
    const percentageHeight = (height / cap) * 100;
    animateHeightPercent(personImage, percentageHeight, 2000);
  }

  function setScale(cap) {
    const increase = cap / 10;

    // reset to zero each submit
    if (measurementBar) measurementBar.innerHTML = "";

    for (let i = 0; i <= cap; i = i + increase) {
      const scalePosition = (i / cap) * 100;

      const li = document.createElement("li");
      li.className = "ruler";
      li.style.bottom = `${scalePosition}%`;
      li.innerHTML = `${Math.round(i * 10)}cm`;

      measurementBar?.appendChild(li);
    }
  }

  function imgZoom() {
    // Original used: $('#sprite').okzoom({...})
    // Vanilla alternative would require a different library or custom zoom code.
    // Put your replacement here if you choose one later.
  }

  async function fetchPokemon(userInput) {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
      userInput
    )}/`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Not a pokemon");
    return res.json();
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userInput = (searchText?.value || "").toLowerCase().trim();

    try {
      const response = await fetchPokemon(userInput);

      if (userInput !== "") {
        let cap = 21; // biggest pokemon size that fits on the page (dm)
        const humanHeight = 17; // average human height (dm) ~ 175cm
        const pokemonHeight = response.height; // dm from API

        if (pokemonHeight <= 5) {
          imgZoom();
        }

        if (pokemonHeight >= cap) {
          cap = pokemonHeight;
        }

        // dm -> cm
        pokemonHeightEl.innerHTML = `${response.height * 10}cm tall!`;

        changePokemonHeight(cap, pokemonHeight, userInput);
        changeHumanHeight(cap, humanHeight);
        setScale(cap);
        animateProgressBar(response.height);

        // Original used: $('.pokemon-image').magnify();
        // Vanilla replacement would go here if you pick a magnifier approach/library.
      } else {
        pokemonHeightEl.innerHTML = "you didn't search for anything";
      }
    } catch (err) {
      pokemonHeightEl.innerHTML = "That is not a pokemon";
    }
  });
});
