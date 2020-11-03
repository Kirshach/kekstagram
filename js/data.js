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

  const {picturesContainerNode, generateDomPicturesFragment} = window;


  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /   */

  let currentBigPicIndex;

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
    const commentsArray = window.picturesData[currentBigPicIndex].comments;
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
    const bigPictureObject = window.filteredPicturesData[currentBigPicIndex];
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
    picturesContainerNode.appendChild(previewsFragment);
    picturesContainerNode.addEventListener(`click`, showBigPicture);
  };

  const showError = function (message) {
    const errorFragment = window.errorTemplate.content.cloneNode(true);
    errorFragment.querySelector(`.error__title`).textContent = message;
    errorFragment.querySelector(`.error__button`).textContent = `Понятно ;(`;
    window.pageMainNode.appendChild(errorFragment);
    window.toggleNotificationListeners(`on`);
  };

  const xhr = new XMLHttpRequest();
  xhr.open(`GET`, `https://21.javascript.pages.academy/kekstagram/data`);
  xhr.timeout = TIMEOUT;

  xhr.addEventListener(`load`, function () {
    if (xhr.status < 400) {
      window.picturesData = JSON.parse(xhr.response);
      populatePreviews(window.picturesData);
      window.filters.filtersNode.classList.remove(`img-filters--inactive`);
      window.filters.addListener();
    } else {
      showError(`Что-то пошло не так 😱`);
    }
  });

  xhr.addEventListener(`error`, showError.bind(null, `Ошибка соединения 🤪`));
  xhr.addEventListener(`timeout`, showError.bind(null, `Ваше время истекло 💀`));

  xhr.send();
})();
