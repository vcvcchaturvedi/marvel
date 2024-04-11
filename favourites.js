import appendParams from "./auth.js";
let localStorageData = localStorage.getItem("favourites");
if (localStorageData) localStorageData = JSON.parse(localStorageData);
let charactersData = [];
const fetchAndRenderCharacters = async () => {
  charactersData = [];
  const charactersFetchCalls = [];
  localStorageData.forEach(async (characterId) => {
    let url =
      "https://gateway.marvel.com/v1/public/characters/" +
      characterId +
      "?" +
      appendParams;
    const characterFetchCall = fetch(url);
    charactersFetchCalls.push(characterFetchCall);
  });
  try {
    const charactersFetchData = await Promise.all(charactersFetchCalls);
    console.log(charactersFetchData);
    for (let i = 0; i < charactersFetchData.length; i++) {
      const response = charactersFetchData[i];
      const data = (await response.json()).data.results[0];
      console.log(data);
      charactersData.push(data);
    }
  } catch (ex) {
    console.log(ex);
  }
  renderFavCharacters();
};
if (localStorageData && localStorageData.length) {
  fetchAndRenderCharacters();
} else {
  const bodyElem = document.querySelector("body");
  bodyElem.innerHTML = "No favourites added to list yet!";
}
const renderFavCharacters = () => {
  if (!charactersData.length) {
    const bodyElem = document.querySelector("body");
    bodyElem.innerHTML = "No favourites added to list yet!";
    return;
  }
  const superherosContainer = document.getElementById("superherosContainer");
  superherosContainer.innerHTML = "";
  charactersData.forEach((character) => {
    const characterId = character.id;
    const characterName = character.name;
    const characterDescription = character.description;
    const imgSrc =
      character.thumbnail.path + "." + character.thumbnail.extension;
    const stats = `comics: ${character.comics.items.length} series: ${character.series.items.length} stories: ${character.stories.items.length}`;
    const divHero = document.createElement("div");
    divHero.classList.add("col-3", "mb-5", "superHeroContainer", "offset-1");
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("card", "card-height");
    const imgElem = document.createElement("img");
    imgElem.src = imgSrc;
    imgElem.alt = characterName;
    imgElem.classList.add("card-img-top");
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add("card-body");
    const h5Elem = document.createElement("h5Elem");
    h5Elem.classList.add("card-title", "text-white");
    h5Elem.textContent = characterName;
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("scrollable");
    const descriptionPElem = document.createElement("p");
    descriptionPElem.classList.add("card-text", "text-white");
    descriptionPElem.textContent = characterDescription;
    descriptionDiv.appendChild(descriptionPElem);
    const statsPElem = document.createElement("p");
    statsPElem.classList.add("card-text");
    const smallElem = document.createElement("small");
    smallElem.classList.add("text-white");
    smallElem.textContent = stats;
    statsPElem.appendChild(smallElem);
    const favButton = document.createElement("button");
    favButton.classList.add("btn", "btn-danger");
    favButton.textContent = "Remove from Favourites";
    favButton.addEventListener("click", (e) => {
      localStorageData.splice(localStorageData.indexOf(characterId), 1);
      localStorage.setItem("favourites", JSON.stringify(localStorageData));
      fetchAndRenderCharacters();
    });
    const viewDetailsBtn = document.createElement("a");
    viewDetailsBtn.classList.add("btn", "btn-primary", "float-end");
    viewDetailsBtn.textContent = "View Details";
    viewDetailsBtn.href = "./superhero.html?id=" + characterId;
    cardBodyDiv.append(
      h5Elem,
      descriptionDiv,
      statsPElem,
      favButton,
      viewDetailsBtn
    );
    innerDiv.append(imgElem, cardBodyDiv);
    divHero.appendChild(innerDiv);
    superherosContainer.appendChild(divHero);
  });
};
