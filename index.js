import appendParams from "./auth.js";
let localStorageData = [];
let limit = 50;
let offset = 0;
let searchText = "";
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
prevBtn.disabled = true;
const fetchCharactersByLimitAndPage = async () => {
  try {
    let url =
      "https://gateway.marvel.com/v1/public/characters?" +
      appendParams +
      "&limit=" +
      limit +
      "&offset=" +
      offset;
    url = searchText.length ? url + "&nameStartsWith=" + searchText : url;
    const allCharactersResponse = await fetch(url);
    localStorageData = (await allCharactersResponse.json()).data.results;
    localStorage.setItem("page_characters", JSON.stringify(localStorageData));

    renderCharacters();
  } catch (ex) {
    console.log(ex);
    nextBtn.disabled = true;
  }
};

const renderCharacters = () => {
  localStorageData = JSON.parse(localStorage.getItem("page_characters"));

  if (localStorageData && localStorageData.length) {
    const superherosContainer = document.getElementById("superherosContainer");
    superherosContainer.innerHTML = "";
    localStorageData.forEach((character) => {
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
      let localStorageDataFav = localStorage.getItem("favourites");
      if (localStorageDataFav) {
        localStorageDataFav = JSON.parse(localStorageDataFav);
      } else {
        localStorageDataFav = [];
      }
      if (localStorageDataFav.includes(characterId)) {
        favButton.classList.add("btn", "btn-danger");
        favButton.textContent = "Remove from Favourites";
      } else {
        favButton.classList.add("btn", "btn-primary");
        favButton.textContent = "Add to Favourites";
      }

      favButton.addEventListener("click", (e) => {
        let localStorageDataFav = localStorage.getItem("favourites");
        if (localStorageDataFav) {
          localStorageDataFav = JSON.parse(localStorageDataFav);
        } else {
          localStorageDataFav = [];
        }
        if (favButton.classList.contains("btn-primary")) {
          localStorageDataFav.push(characterId);
          localStorage.setItem(
            "favourites",
            JSON.stringify(localStorageDataFav)
          );
          favButton.classList.remove("btn-primary");
          favButton.classList.add("btn-danger");
          favButton.textContent = "Remove from Favourites";
        } else {
          localStorageDataFav.splice(
            localStorageDataFav.indexOf(characterId),
            1
          );
          favButton.classList.remove("btn-danger");
          favButton.classList.add("btn-primary");
          favButton.textContent = "Add to Favourites";
          localStorage.setItem(
            "favourites",
            JSON.stringify(localStorageDataFav)
          );
        }
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
  } else {
    alert("Character search returned 0 results!");
    offset -= 50;
  }
};
fetchCharactersByLimitAndPage();

nextBtn.addEventListener("click", () => {
  offset += limit;
  fetchCharactersByLimitAndPage();
  prevBtn.disabled = false;
});

prevBtn.addEventListener("click", () => {
  offset -= limit;
  fetchCharactersByLimitAndPage();
  nextBtn.disabled = false;
  if (offset == 0) prevBtn.disabled = true;
});
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  const inputElem = document.getElementById("searchText");
  searchText = inputElem.value;
  console.log(searchText);
  fetchCharactersByLimitAndPage(searchText);
});
