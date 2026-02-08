let allEpisodeList = [];
function fetchEpisode() {
fetch("https://api.tvmaze.com/shows/82/episodes")
.then(res => res.json())
.then(data => {
  allEpisodeList = data;
  setupEpisodeSelect();
  setupSearchInput();
  render(allEpisodeList);
  });
}

function setupEpisodeSelect() {
  document.getElementById("episode-select").addEventListener("input", onInputEpisode);
}

function onInputEpisode(event) {
  const selectedCode = event.target.value;
  const filteredEpisodeList = allEpisodeList.filter(
    episode => getEpisodeCode(episode) === selectedCode
  );

  render(filteredEpisodeList);
}

function setupSearchInput() {
  
  document.getElementById("search-input").addEventListener("input", onSearchInput);
}

function onSearchInput(event) {
  const searchString = event.target.value.toLowerCase();
  
  const filteredEpisodeList = allEpisodeList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchString) ||
      episode.summary.toLowerCase().includes(searchString)
  );

  render(filteredEpisodeList);
}

function render(episodeList) {
  renderSelect(episodeList);
  renderSearchLabel(episodeList);
  renderEpisodeCards(episodeList);
}

function renderSelect(episodeList) {
  const selectElement = document.getElementById("episode-select");

  selectElement.options.length = 0;

  episodeList.forEach(episode => {
    const code = getEpisodeCode(episode);
    selectElement.add(new Option(`${code} – ${episode.name}`, code));
  });
}

function renderSearchLabel(episodeList) {
  const searchLabel = document.getElementById("search-label");
  searchLabel.textContent = `Displaying ${episodeList.length}/${allEpisodeList.length}
    episode${episodeList.length > 1 ? "s" : ""}`;
}

function renderEpisodeCards(episodeList) {
  const rootElem = document.getElementById("root");


  episodeList.forEach((episode) => {
    const card = document.createElement("section");
    card.classList.add("card");
    card.id = getEpisodeCode(episode);

    const title = document.createElement("h3");
    title.textContent = episode.name;

    const createImg = document.createElement("img");
    createImg.src = episode.image.medium;
    createImg.alt = episode.name;

    const desc = document.createElement("p");
    desc.innerHTML = episode.summary || "";

    card.append(title, createImg, desc);
    rootElem.append(card);
  });
}

function getEpisodeCode(episode) {
  return `S${(episode.season + "").padStart(2, "0")}E${(episode.number + "").padStart(2, "0")}`;
}

window.onload = fetchEpisode;