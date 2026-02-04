//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  //You can edit ALL of the code here

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
