const SHOWS_DATA_URL = "https://api.tvmaze.com/shows";

const showList = [];
let allEpisodeList = [];


//region setup
function setupPage() {
  setupShowSelect();
  setupEpisodeSelect();
  setupSearchInput();
  //fetchEpisode();
  setupShowsData();
}

function setupShowSelect() {
  document.getElementById("show-select").addEventListener("input", onInputShowSelect);
}

function setupEpisodeSelect() {
  document.getElementById("episode-select").addEventListener("input", onInputEpisodeSelect);
}

function setupSearchInput() {
  document.getElementById("search-input").addEventListener("input", onInputSearchInput);
}

function setupShowsData() {
  showLoadingDataMessage();
  fetch(SHOWS_DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      showList.push(...data);
      renderShowSelect();
    })
    .catch(showLoadingErrorMessage);
}
//endregion


//region event listeners
function onInputShowSelect(event) {
  console.log(event.target.value);
}

function onInputEpisodeSelect(event) {
  document.getElementById(event.target.value).scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function onInputSearchInput(event) {
  const searchString = event.target.value.toLowerCase();
  const filteredEpisodeList = allEpisodeList.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchString) ||
      (episode.summary || "").toLowerCase().includes(searchString),
  );

  render(filteredEpisodeList);
}
//endregion


//region fetch logic
function renderShowSelect() {
  
}

function fetchEpisode() {
  showLoadingDataMessage();

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((res) => res.json())
    .then((data) => {
      allEpisodeList = data;
      render(allEpisodeList);
    })
    .catch(showLoadingErrorMessage);
}
//endregion


//region render logic
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

  rootElem.innerHTML = "";

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
//endregion


//region utilities
function getEpisodeCode(episode) {
  return `S${(episode.season + "").padStart(2, "0")}E${(episode.number + "").padStart(2, "0")}`;
}

function showLoadingDataMessage() {
  document.getElementById("root").textContent = "Loading episodes... Please wait";  
}

function showLoadingErrorMessage() {
  document.getElementById("root").textContent = "Failed to load data. Please try again later";
}
//endregion


window.onload = setupPage;