"use strict";

(function () {
  const NEW_COMMENTS_BATCH = 5;
  const AVATAR_SIZE = 35;
  const TIMEOUT = 7000;


  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const bigPicture = document.querySelector(`.big-picture`);
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img img `);
  const bigPictureLikesCount = bigPicture.querySelector(`.likes-count`);
  const bigPictureCommentsCount = bigPicture.querySelector(`.comments-count`);
  const bigPictureComments = bigPicture.querySelector(`.social__comments`);
  const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
  const bigPictureCommentsCountParagraph = bigPicture.querySelector(`.social__comment-count`);
  const bigPictureCommentsLoader = bigPicture.querySelector(`.comments-loader`);
  const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);

  const picturesContainer = document.querySelector(`.pictures`);

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /   */

  let picturesData = [];
  let currentBigPicIndex;

  // Генерирует DOM-элемент превью поста
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

  // Генерирует HTML-фрагмент превью постов из объектов picturesArray
  const generateDomPicturesFragment = (picturesArray) => {
    const newFragment = document.createDocumentFragment();
    const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
    for (let i = 0; i < picturesArray.length; i++) {
      const newChildElement = createDomPictureElement(pictureTemplate, picturesArray[i], i);
      newFragment.appendChild(newChildElement);
    }
    return newFragment;
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /   */

  const commentTemplate = document.querySelector(`.social__comment`).cloneNode(true);

  const closeBigPicture = function () {
    bigPicture.classList.add(`hidden`);
    toggleBigPictureListeners(`off`);
  };

  const closeBigPictureOnEsc = function (evt) {
    if (evt.key === `Escape`) {
      closeBigPicture();
    }
  };

  const toggleBigPictureListeners = function (direction) {
    const method = direction === `on` ? `addEventListener` : `removeEventListener`;
    bigPictureCloseButton[method](`click`, closeBigPicture);
    bigPictureCommentsLoader[method](`click`, getNewComments);
    document[method](`keydown`, closeBigPictureOnEsc);
  };

  const getNewComments = function () {
    const commentsArray = picturesData[currentBigPicIndex].comments;
    const newCommentsFragment = document.createDocumentFragment();
    let newCommentIndex = bigPictureComments.children.length;
    const lastCommentIndex = Math.min(newCommentIndex + NEW_COMMENTS_BATCH, commentsArray.length);

    for (; newCommentIndex < lastCommentIndex; newCommentIndex += 1) {
      const currentComment = commentsArray[newCommentIndex];
      const commentsItem = commentTemplate.cloneNode(true);
      const commentsAvatar = commentsItem.querySelector(`.social__picture`);
      const commentsParagraph = commentsItem.querySelector(`.social__text`);

      commentsAvatar.src = currentComment.avatar;
      commentsAvatar.alt = currentComment.name;
      commentsAvatar.width = AVATAR_SIZE;
      commentsAvatar.height = AVATAR_SIZE;
      commentsParagraph.textContent = currentComment.message;

      newCommentsFragment.appendChild(commentsItem);
    }

    // console.log(`actual length: `, bigPictureComments.children.length, `max length: `, commentsArray.length);
    bigPictureComments.appendChild(newCommentsFragment);
    if (bigPictureComments.children.length >= commentsArray.length) {
      bigPictureCommentsLoader.classList.add(`hidden`);
    } else {
      bigPictureCommentsLoader.classList.remove(`hidden`);
    }
  };

  const showBigPicture = function (evt) {
    const target = evt.composedPath()[1];
    if (!target.classList.contains(`picture`)) {
      return;
    }

    currentBigPicIndex = target.dataset.index;

    bigPictureComments.innerHTML = ``;
    const bigPictureObject = picturesData[currentBigPicIndex];
    getNewComments();

    bigPictureImg.src = bigPictureObject.url;
    bigPictureLikesCount.textContent = bigPictureObject.likes;
    bigPictureCommentsCount.textContent = bigPictureObject.comments.length;
    bigPictureCaption.textContent = bigPictureObject.description;

    bigPictureCommentsCountParagraph.classList.add(`hidden`);
    bigPicture.classList.remove(`hidden`);
    document.body.classList.add(`modal-open`);

    toggleBigPictureListeners(`on`);
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const populatePreviews = function (data) {
    const previewsFragment = generateDomPicturesFragment(data);
    picturesContainer.appendChild(previewsFragment);
    picturesContainer.addEventListener(`click`, showBigPicture);
  };

  const showError = function (message) {
    const errorFragment = window.errorTemplate.content.cloneNode(true);
    errorFragment.querySelector(`.error__title`).textContent = message;
    errorFragment.querySelector(`.error__button`).textContent = `Понятно ;(`;
    window.pageMain.appendChild(errorFragment);
    window.toggleNotificationListeners(`on`);
  };

  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `https://21.javascript.pages.academy/kekstagram/data`);
  xhr.timeout = TIMEOUT;

  xhr.addEventListener(`load`, function () {
    if (xhr.status < 400) {
      picturesData = JSON.parse(xhr.response);
      populatePreviews(picturesData);
    } else {
      showError(`Что-то пошло не так 😱`);
    }
  });

  xhr.addEventListener(`error`, showError.bind(null, `Ошибка соединения 🤪`));
  xhr.addEventListener(`timeout`, showError.bind(null, `Ваше время истекло 💀`));

  xhr.send();
})();
