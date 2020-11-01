"use strict";

(function () {
  const RANDOM_FILTERED_IMAGES_AMOUNT = 10;
  window.filteredPicturesData = [];

  const {picturesContainerNode, generateDomPicturesFragment} = window;

  const spliceRandomElement = function (array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array.splice(randomIndex, 1);
  };

  const deleteAllImagesNodes = function () {
    const imgUploadNode = picturesContainerNode.querySelector(`.img-upload`);
    while (imgUploadNode.nextSibling) {
      imgUploadNode.nextSibling.remove();
    }
  };

  const filterIdToFilterFunction = {
    'filter-default': function () {
      window.filteredPicturesData = window.picturesData;
      return generateDomPicturesFragment(window.picturesData);
    },
    'filter-random': function () {
      const newImagesArray = [];
      const picturesDataCopy = [...window.picturesData];
      for (let i = 0; i < RANDOM_FILTERED_IMAGES_AMOUNT; i++) {
        const newImageObject = spliceRandomElement(picturesDataCopy)[0];
        newImagesArray.push(newImageObject);
      }
      window.filteredPicturesData = newImagesArray;
      return generateDomPicturesFragment(newImagesArray);
    },
    'filter-discussed': function () {
      const sortedByDiscussionsPictures = [...window.picturesData].sort(((pic1, pic2) => pic2.comments.length - pic1.comments.length));
      window.filteredPicturesData = sortedByDiscussionsPictures;
      return generateDomPicturesFragment(sortedByDiscussionsPictures);
    },
  };

  window.filters.addListener = function () {
    const filtersForm = this.filtersNode.querySelector(`.img-filters__form`);

    filtersForm.addEventListener(`click`, (evt) => {
      const previousFilterButton = filtersForm.querySelector(`.img-filters__button--active`);
      const {target} = evt;

      const generateNewFragments = filterIdToFilterFunction[target.id];
      const newPicturesFragment = generateNewFragments();

      deleteAllImagesNodes();
      picturesContainerNode.appendChild(newPicturesFragment);

      previousFilterButton.classList.remove(`img-filters__button--active`);
      target.classList.add(`img-filters__button--active`);
    });
  };
})();
