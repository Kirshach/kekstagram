"use strict";

const RANDOM_FILTERED_IMAGES_AMOUNT = 10;
const FILTERS_DEBOUNCE_TIME = 500;

window.filteredPicturesData = [];

const {picturesContainerNode, generateDomPicturesFragment} = window;

const spliceRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array.splice(randomIndex, 1);
};

const deleteAllImagesNodes = () => {
  const imgUploadNode = picturesContainerNode.querySelector(`.img-upload`);
  while (imgUploadNode.nextSibling) {
    imgUploadNode.nextSibling.remove();
  }
};

const filterIdToFilterFunction = {
  "filter-default": () => {
    window.filteredPicturesData = window.picturesData;
    return generateDomPicturesFragment(window.picturesData);
  },
  "filter-random": () => {
    const newImagesArray = [];
    const picturesDataCopy = [...window.picturesData];
    for (let i = 0; i < RANDOM_FILTERED_IMAGES_AMOUNT; i++) {
      const newImageObject = spliceRandomElement(picturesDataCopy)[0];
      newImagesArray.push(newImageObject);
    }
    window.filteredPicturesData = newImagesArray;
    return generateDomPicturesFragment(newImagesArray);
  },
  "filter-discussed": () => {
    const sortedByDiscussionsPictures = [...window.picturesData].sort((pic1, pic2) => pic2.comments.length - pic1.comments.length);
    window.filteredPicturesData = sortedByDiscussionsPictures;
    return generateDomPicturesFragment(sortedByDiscussionsPictures);
  },
};

const switchFilter = (evt) => {
  const {target} = evt;
  const filtersForm = target.parentNode;
  const previousFilterButton = filtersForm.querySelector(`.img-filters__button--active`);

  const generateNewFragments = filterIdToFilterFunction[target.id];
  const newPicturesFragment = generateNewFragments();

  deleteAllImagesNodes();
  picturesContainerNode.appendChild(newPicturesFragment);

  previousFilterButton.classList.remove(`img-filters__button--active`);
  target.classList.add(`img-filters__button--active`);
};


const onFiltersFormClick = window.debounceFunction(switchFilter, FILTERS_DEBOUNCE_TIME);

window.filters.addListener = function () {
  const filtersForm = this.filtersNode.querySelector(`.img-filters__form`);
  filtersForm.addEventListener(`click`, onFiltersFormClick);
};
