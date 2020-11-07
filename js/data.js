"use strict";

const COMMENTS_BATCH_SIZE = 5;
const AVATAR_SIZE = 35;
const TIMEOUT = 7000;

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

const bigPicture = document.querySelector(`.big-picture`);
const bigPictureImg = bigPicture.querySelector(`.big-picture__img img `);
const bigPictureLikesCount = bigPicture.querySelector(`.likes-count`);
const bigPictureComments = bigPicture.querySelector(`.social__comments`);
const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
const bigPictureCommentsCountParagraph = bigPicture.querySelector(`.social__comment-count`);
const bigPictureCommentsCountSpan = bigPictureCommentsCountParagraph.querySelector(`.comments-count`);
const bigPictureLoadComentsButton = bigPicture.querySelector(`.comments-loader`);
const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);

const {picturesContainerNode, generateDomPicturesFragment} = window;


/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /   */

let currentBigPicIndex;

const commentTemplate = document.querySelector(`.social__comment`).cloneNode(true);

const closeBigPicture = function () {
  bigPicture.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);
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
  bigPictureLoadComentsButton[method](`click`, getAndRenderNewComments);
  document[method](`keydown`, closeBigPictureOnEsc);
};

const renderCommentsBatch = function (commentsArray) {
  const newCommentsFragment = document.createDocumentFragment();

  for (let i = 0; i < commentsArray.length; i += 1) {
    const currentComment = commentsArray[i];
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
  const overallCommentsAmount = window.filteredPicturesData[currentBigPicIndex].comments.length;
  if (bigPictureComments.children.length >= overallCommentsAmount) {
    bigPictureLoadComentsButton.classList.add(`hidden`);
  } else {
    bigPictureLoadComentsButton.classList.remove(`hidden`);
  }

  const commentsParagraphFirstTextNode = bigPictureCommentsCountParagraph.childNodes[0];
  commentsParagraphFirstTextNode.data = `${bigPictureComments.children.length} из `;
};

const getAndRenderNewComments = function () {
  const commentsArray = window.filteredPicturesData[currentBigPicIndex].comments;
  let newCommentIndex = bigPictureComments.children.length;
  const lastCommentIndex = Math.min(newCommentIndex + COMMENTS_BATCH_SIZE, commentsArray.length);

  const newComments = [];
  for (; newCommentIndex < lastCommentIndex; newCommentIndex += 1) {
    newComments.push(commentsArray[newCommentIndex]);
  }
  renderCommentsBatch(newComments);

};

const showBigPicture = function (evt) {
  const target = evt.composedPath()[1];

  if (!target.classList.contains(`picture`)) {
    return;
  }

  currentBigPicIndex = target.dataset.index;

  bigPictureComments.innerHTML = ``;
  const bigPictureObject = window.filteredPicturesData[currentBigPicIndex];
  const initialCommentsArray = bigPictureObject.comments.slice(0, COMMENTS_BATCH_SIZE);
  renderCommentsBatch(initialCommentsArray);

  bigPictureImg.src = bigPictureObject.url;
  bigPictureLikesCount.textContent = bigPictureObject.likes;
  bigPictureCaption.textContent = bigPictureObject.description;

  bigPictureCommentsCountSpan.textContent = bigPictureObject.comments.length;

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
    window.filteredPicturesData = window.picturesData = JSON.parse(xhr.response);
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
