"use strict";

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

const onDocumentKeyDown = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    const notificationNode =
        window.pageMainNode.querySelector(`.success`) ||
        window.pageMainNode.querySelector(`.error`);
    notificationNode.remove();
    window.toggleNotificationListeners(`off`);
  }
};

const onDocumentClick = (evt) => {
  const notificationNode =
      window.pageMainNode.querySelector(`.success`) ||
      window.pageMainNode.querySelector(`.error`);
  if (
    evt.target === notificationNode ||
      evt.target === notificationNode.querySelector(`button`)
  ) {
    notificationNode.remove();
    window.toggleNotificationListeners(`off`);
  }
};

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /   */

window.pageMainNode = document.querySelector(`main`);
window.successTemplate = document.querySelector(`#success`);
window.errorTemplate = document.querySelector(`#error`);
window.picturesContainerNode = document.querySelector(`.pictures`);
window.pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
window.filters = {filtersNode: document.querySelector(`.img-filters`)};

window.generateDomPicturesFragment = (picturesArray) => {
  const newFragment = document.createDocumentFragment();
  for (let i = 0; i < picturesArray.length; i++) {
    const newChildElement = createDomPictureElement(window.pictureTemplate, picturesArray[i], i);
    newFragment.appendChild(newChildElement);
  }
  return newFragment;
};

window.toggleNotificationListeners = (direction) => {
  const method = direction === `on` ? `addEventListener` : `removeEventListener`;
  document[method](`keydown`, onDocumentKeyDown);
  document[method](`click`, onDocumentClick);
};

window.sendXMLHttpRequest = (URL, method, onLoad, onError, onTimeout, timeoutInMs, postRequestBody) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, URL);
  xhr.timeout = timeoutInMs;

  const onLoadBoundToXHR = () => onLoad(xhr);

  xhr.addEventListener(`load`, onLoadBoundToXHR);
  xhr.addEventListener(`error`, onError);
  xhr.addEventListener(`timeout`, onTimeout);

  xhr.send(postRequestBody);
};

window.debounceFunction = (functionToDebounce, debounceTime) => {
  let lastFunctionTimeoutId;

  return (...args) => {
    if (lastFunctionTimeoutId) {
      clearTimeout(lastFunctionTimeoutId);
    }
    lastFunctionTimeoutId = setTimeout(() => {
      functionToDebounce(...args);
    }, debounceTime);
  };
};
