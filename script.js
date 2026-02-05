let allEpisodeList = [];

function setup() {
  allEpisodeList = getAllEpisodes();
  setupSearchInput();
  render(allEpisodeList);
}

function setupSearchInput() {
  document.getElementById("search-input").addEventListener("input", onSearchInput);
}

function onSearchInput(event) {
  console.log(event.target.value);
}

function render(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("section");
    card.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = episode.name;

    const createImg = document.createElement("img");
    createImg.src = episode.image.medium;
    createImg.alt = episode.name;

    const desc = document.createElement("p");
    desc.innerHTML = episode.summary;

    card.append(title, createImg, desc);
    root.append(card);
  });
}

window.onload = setup;