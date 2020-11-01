"use strict";

(function () {
  const createDomPictureElement = (template, pictureObject, index) => {
    const newPictureElement = template.cloneNode(true);
    const imgElement = newPictureElement.querySelector(`.picture__img`);
    const likesAmountElement = newPictureElement.querySelector(`.picture__likes`);
    const commentsAmountElement = newPictureElement.querySelector(`.picture__comments`);

    newPictureElement.dataset.index = index;
    imgElement.src = pictureObject.url;
    likesAmountElement.textContent = pictureObject.likes;
    commentsAmountElement.textContent = pictureObject.comments.length;
    return newPictureElement;
  };

  const closeNotificationOnEsc = function (evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      const notificationNode = window.pageMainNode.querySelector(`.success`) || window.pageMainNode.querySelector(`.error`);
      notificationNode.remove();
      window.toggleNotificationListeners(`off`);
    }
  };

  const closeNotificationOnClick = function (evt) {
    const notificationNode = window.pageMainNode.querySelector(`.success`) || window.pageMainNode.querySelector(`.error`);
    if (
      evt.target === notificationNode
      || evt.target === notificationNode.querySelector(`button`)
    ) {
      notificationNode.remove();
      window.toggleNotificationListeners(`off`);
    }
  };

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  window.pageMainNode = document.querySelector(`main`);
  window.successTemplate = document.querySelector(`#success`);
  window.errorTemplate = document.querySelector(`#error`);
  window.picturesContainerNode = document.querySelector(`.pictures`);
  window.pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`)
  window.filters = {
    filtersNode: document.querySelector(`.img-filters`),
  };

  window.generateDomPicturesFragment = (picturesArray) => {
    const newFragment = document.createDocumentFragment();
    for (let i = 0; i < picturesArray.length; i++) {
      const newChildElement = createDomPictureElement(window.pictureTemplate, picturesArray[i], i);
      newFragment.appendChild(newChildElement);
    }
    return newFragment;
  };

  window.toggleNotificationListeners = function (direction) {
    const method = direction === `on` ? `addEventListener` : `removeEventListener`;
    document[method](`keydown`, closeNotificationOnEsc);
    document[method](`click`, closeNotificationOnClick);
  };
})();
