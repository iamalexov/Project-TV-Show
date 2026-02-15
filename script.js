const SHOWS_DATA_URL = "https://api.tvmaze.com/shows";
const SHOW_EPISODES_DATA_URL_TEMPLATE = "https://api.tvmaze.com/shows/{id}/episodes";
const ID_TOKEN = "{id}";

const showList = [];
const showEpisodesMap = new Map();

let selectedShowId = "1";


//region setup
function setupPage() {
  setupShowSelect();
  setupEpisodeSelect();
  setupSearchInput();
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
  console.log("setup show data called")
  showLoadingDataMessage();
  fetch(SHOWS_DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      showList.push(...data.sort(showComparatorByName));
      renderShowSelect();
    })
    .catch(showLoadingErrorMessage);
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
  const filteredEpisodeList = showEpisodesMap.get(selectedShowId).filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchString) ||
      (episode.summary || "").toLowerCase().includes(searchString) ||
      getEpisodeCode(episode).toLocaleLowerCase().includes(searchString)
  );

  render(filteredEpisodeList);
}
//endregion


//region fetch logic
function fetchShowEpisodes() {
  showLoadingDataMessage();

  fetch(SHOW_EPISODES_DATA_URL_TEMPLATE.replace(ID_TOKEN, selectedShowId))
    .then((response) => response.json())
    .then((data) => {
      showEpisodesMap.set(selectedShowId, data);
      render(showEpisodesMap.get(selectedShowId));
    })
    .catch(showLoadingErrorMessage);
}
//endregion


//region render logic
function renderShowSelect() {
  const showSelectElement = document.getElementById("show-select");

  showSelectElement.options.length = 0;

  showList.forEach((show) => {
    showSelectElement.add(new Option(show.name, show.id))
  });

  showSelectElement.dispatchEvent(new Event("input"));
}

function render(episodeList) {
  renderEpisodeSelect(episodeList);
  renderSearchLabel(episodeList);
  renderEpisodeCards(episodeList);
}

function renderEpisodeSelect(episodeList) {
  const episodeSelectElement = document.getElementById("episode-select");

  episodeSelectElement.options.length = 0;

  episodeList.forEach(episode => {
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
  document.getElementById("root").textContent = "Loading episodes... Please wait";  
}

function showLoadingErrorMessage() {
  document.getElementById("root").textContent = "Failed to load data. Please try again later";
}

function showComparatorByName(show1, show2) {
  return show1.name.toLowerCase().localeCompare(show2.name.toLowerCase());
}
//endregion


window.onload = setupPage;