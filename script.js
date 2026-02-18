const SHOWS_DATA_URL = "https://api.tvmaze.com/shows";

function getShowEpisodesUrl(showId) {
  return `https://api.tvmaze.com/shows/${showId}/episodes`;
}

const showList = [];
const showEpisodesMap = new Map();

let selectedShowId = null;
let currentview = "shows";

//region setup
function setupPage() {
  setupShowSelect();
  setupEpisodeSelect();
  setupSearchInput();
  backButton();
  setupShowsData();
}

function backButton() {
  document.getElementById("btn").addEventListener("click", () => {
    loadShows();
  });
}

function setupShowSelect() {
  document
    .getElementById("show-select")
    .addEventListener("input", onInputShowSelect);
}

function setupEpisodeSelect() {
  document
    .getElementById("episode-select")
    .addEventListener("input", onInputEpisodeSelect);
}

function setupSearchInput() {
  document
    .getElementById("search-input")
    .addEventListener("input", onInputSearchInput);
}

async function loadShows() {
  showLoadingDataMessage();

  try {
    const response = await fetch(SHOWS_DATA_URL);
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    const data = await response.json();

    data.sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
    );

    showList.push(...data);
    renderAllShows(showList);
  } catch (error) {
    console.error("Error fetching:", error);
    showLoadingErrorMessage();
  }
}

async function setupShowsData() {
  showLoadingDataMessage();

  try {
    const response = await fetch(SHOWS_DATA_URL);
    const data = await response.json();

    showList.push(...data.sort(showComparatorByName));
    renderAllShows(showList);
  } catch (error) {
    showLoadingErrorMessage();
  }
}

//endregion

//region event listeners
function onInputShowSelect(event) {
  selectedShowId = event.target.value;
  if (showEpisodesMap.has(selectedShowId)) {
    render(showEpisodesMap.get(selectedShowId));
  } else {
    fetchShowEpisodes();
  }
}

function onInputEpisodeSelect(event) {
  document.getElementById(event.target.value).scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function onInputSearchInput(event) {
  const searchString = event.target.value.toLowerCase();
  const filteredEpisodeList = showEpisodesMap
    .get(selectedShowId)
    .filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchString) ||
        (episode.summary || "").toLowerCase().includes(searchString) ||
        getEpisodeCode(episode).toLocaleLowerCase().includes(searchString),
    );

  render(filteredEpisodeList);
}
//endregion

//region fetch logic
async function fetchShowEpisodes() {
  showLoadingDataMessage();

  try {
    const response = await fetch(getShowEpisodesUrl(selectedShowId));
    const data = await response.json();
    showEpisodesMap.set(selectedShowId, data);
    render(showEpisodesMap.get(selectedShowId));
  } catch (error) {
    showLoadingErrorMessage;
  }
}

//endregion

//region render logic

function renderAllShows(showList) {
  renderShowSelect(showList);
  renderShowSearchLabel(showList);
  renderShowCards(showList);
}

function renderShowSelect(showList) {
  const showSelectElement = document.getElementById("show-select");

  showSelectElement.options.length = 0;

  showList.forEach((show) => {
    showSelectElement.add(new Option(show.name, show.id));
  });

  showSelectElement.dispatchEvent(new Event("input"));
}

function renderShowSearchLabel(showList) {
  console.log("setup show data called");

  const searchLabel = document.getElementById("search-label");

  searchLabel.textContent = `Displaying ${showList.length} shows`;
}

function renderShowCards(showList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  showList.forEach((show) => {
    const card = document.createElement("section");
    card.classList.add("card");

    const title = document.createElement("h3");
    title.textContent = show.name;
    
    const img = document.createElement("img");
    img.src = show.image?.medium || "";
    img.alt = show.name;

    const summary = document.createElement("p");
    summary.innerHTML = show.summary || "";

    const genres = document.createElement("p");
    genres.textContent = `Genres: ${show.genres.join(", ")}`;

    const info = document.createElement("p");
    info.textContent = `Status: ${show.status}, Rating: ${show.rating?.average}, Runtime: ${show.runtime} min`;

    card.append(title, img, summary, genres, info);
    rootElem.append(card);
  });
}

function render(episodeList) {
  renderEpisodeSelect(episodeList);
  renderSearchLabel(episodeList);
  renderEpisodeCards(episodeList);
}

function renderEpisodeSelect(episodeList) {
  const episodeSelectElement = document.getElementById("episode-select");

  episodeSelectElement.options.length = 0;

  episodeList.forEach((episode) => {
    const code = getEpisodeCode(episode);
    episodeSelectElement.add(new Option(`${code} – ${episode.name}`, code));
  });
}

function renderSearchLabel(episodeList) {
  const searchLabel = document.getElementById("search-label");

  searchLabel.textContent = `Displaying ${episodeList.length}/
    ${showEpisodesMap.get(selectedShowId).length}
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
    title.textContent = `${episode.name} - ${getEpisodeCode(episode)}`;

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
  document.getElementById("root").textContent =
    "Loading episodes... Please wait";
}

function showLoadingErrorMessage() {
  document.getElementById("root").textContent =
    "Failed to load data. Please try again later";
}

function showComparatorByName(show1, show2) {
  return show1.name.toLowerCase().localeCompare(show2.name.toLowerCase());
}
//endregion

window.onload = setupPage;
