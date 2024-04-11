import appendParams from "./auth.js";
let locationUrl = window.location;
let params = new URLSearchParams(locationUrl.search);
let superheroId = params.get("id");
console.log(superheroId);
if (!superheroId) {
  const bodyElem = document.querySelector("body");
  bodyElem.innerHTML = "404 No page found here..";
} else {
  const url = `https://gateway.marvel.com/v1/public/characters/${superheroId}?${appendParams}`;
  (async function () {
    const response = await fetch(url);
    const data = (await response.json()).data.results[0];
    console.log(data);
    const characterNameElems = document.getElementsByClassName("superheroName");
    for (let elem of characterNameElems) {
      elem.textContent = data.name;
    }
    const descriptionElem = document.getElementById("heroDescription");
    descriptionElem.textContent = data.description;

    //Populate Comics DOM
    data.comics.items.forEach(async (comic, i) => {
      const comicName = comic.name;
      const resourceURIComic = comic.resourceURI + "?" + appendParams;
      const responseComic = await fetch(
        resourceURIComic.replace("http:", "https:")
      );
      const responseComicData = (await responseComic.json()).data.results[0];
      const imageComic =
        responseComicData.thumbnail.path +
        "." +
        responseComicData.thumbnail.extension;
      const comicDescription = responseComicData.description;
      const printPriceData = responseComicData.prices.filter(
        (e) => e.type == "printPrice"
      );
      const printPriceComic = printPriceData
        ? printPriceData[0]?.price
          ? "$" + printPriceData[0]?.price
          : "N/A"
        : "N/A";
      const digitalPrintPriceData = responseComicData.prices.filter(
        (e) => e.type == "digitalPurchasePrice"
      );

      const digitalPriceComic = digitalPrintPriceData
        ? digitalPrintPriceData[0]?.price
          ? "$" + digitalPrintPriceData[0]?.price
          : "N/A"
        : "N/A";
      const purchaseLinkComic = responseComicData.urls.filter(
        (e) => e.type == "detail"
      )[0].url;
      const carouselInner = document.querySelector(".carousel-inner");
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item", "text-center");
      if (i == 0) carouselItem.classList.add("active");
      const img = document.createElement("img");
      img.classList.add("w-75");
      img.alt = comicName;
      img.src = imageComic;
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("carousel-caption");
      const h5Elem = document.createElement("h5");
      h5Elem.textContent = comicName;
      const pElem1 = document.createElement("p");
      pElem1.textContent = comicDescription;
      const divPriceElem = document.createElement("div");
      divPriceElem.classList.add("float-start", "text-start");
      const span1Price = document.createElement("span");
      span1Price.textContent = `Print: ${printPriceComic}`;
      const brElem = document.createElement("br");
      const span2Price = document.createElement("span");
      span2Price.textContent = `Digital: ${digitalPriceComic}`;
      divPriceElem.append(span1Price, brElem, span2Price);
      const aElemPurcase = document.createElement("a");
      aElemPurcase.classList.add("btn", "btn-success", "float-end");
      aElemPurcase.target = "_blank";
      aElemPurcase.textContent = "Purchase";
      aElemPurcase.href = purchaseLinkComic;
      innerDiv.append(h5Elem, pElem1, divPriceElem, aElemPurcase);
      carouselItem.append(img, innerDiv);
      carouselInner.appendChild(carouselItem);
    });

    //Populate Series DOM
    data.series.items.forEach(async (series) => {
      const seriesResponse = await fetch(
        series.resourceURI.replace("http:", "https:") + "?" + appendParams
      );
      const seriesData = (await seriesResponse.json()).data.results[0];
      const seriesContainer = document.getElementById("seriesContainer");
      const divCol = document.createElement("div");
      divCol.classList.add("col-4", "mb-5", "storyElem");
      const divCard = document.createElement("div");
      divCard.classList.add("card", "mb-3", "text-light");
      const img = document.createElement("img");
      img.src =
        seriesData.thumbnail.path + "." + seriesData.thumbnail.extension;
      img.style.height = "300px";
      const divElem1 = document.createElement("div");
      divElem1.classList.add("card-body");
      const h5Elem = document.createElement("h5");
      h5Elem.classList.add("card-title");
      h5Elem.textContent = seriesData.title;
      const comicsCount = seriesData.comics.items.length;
      const storiesCount = seriesData.stories.items.length;
      const charactersCount = seriesData.characters.items.length;
      const pElem1 = document.createElement("p");
      pElem1.classList.add("card-text");
      pElem1.textContent = `Comics: ${comicsCount}, Characters: ${charactersCount}, Stories: ${storiesCount}}`;
      const aElems = [];
      seriesData.characters.items.forEach((character) => {
        const resourceURISplit = character.resourceURI.split("/");
        const idCharacter = resourceURISplit[resourceURISplit.length - 1];
        const aElemCharacter = document.createElement("a");
        aElemCharacter.classList.add("me-2");
        aElemCharacter.href = `./superhero.html?id=${idCharacter}`;
        aElemCharacter.textContent = character.name;
        aElems.push(aElemCharacter);
      });
      divElem1.append(h5Elem, pElem1, ...aElems);
      divCard.append(img, divElem1);
      divCol.appendChild(divCard);
      seriesContainer.appendChild(divCol);
    });
  })();
}
