"use strict";

const COMMENTS_BATCH_SIZE = 5;
const AVATAR_SIZE = 35;
const TIMEOUT = 7000;

const XHR_PICTURES_DATA_URL = `https://21.javascript.pages.academy/kekstagram/data`;
const XHR_PICTURES_DATA_METHOD = `GET`;

const DATA_LOAD_ERROR_MESSAGE = `Ошибка соединения 🤪`;
const DATA_LOAD_TIMEOUT_MESSAGE = `Ваше время истекло 💀`;

const UNKNOWN_ERROR_MESSAGE = `Что-то пошло не так 😱`;
const CLOSE_ERROR_BUTTON_TEXT = `Понятно ;(`;

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

const closeBigPicture = () => {
  bigPicture.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);
  toggleBigPictureListeners(`off`);
};

const getNewComments = () => {
  const commentsArray = window.filteredPicturesData[currentBigPicIndex].comments;
  let newCommentIndex = bigPictureComments.children.length;
  const lastCommentIndex = Math.min(newCommentIndex + COMMENTS_BATCH_SIZE, commentsArray.length);

  const newComments = [];
  for (; newCommentIndex < lastCommentIndex; newCommentIndex += 1) {
    newComments.push(commentsArray[newCommentIndex]);
  }
  return newComments;
};

const onbBigPictureLoadComentsButtonClick = () => {
  const newComments = getNewComments();
  renderCommentsBatch(newComments);
};

const onBigPictureCloseButtonClick = () => {
  closeBigPicture();
};

const onDocumentEscKeyDown = (evt) => {
  if (evt.key === `Escape`) {
    closeBigPicture();
  }
};

const toggleBigPictureListeners = (direction) => {
  const method = direction === `on` ? `addEventListener` : `removeEventListener`;
  bigPictureCloseButton[method](`click`, onBigPictureCloseButtonClick);
  bigPictureLoadComentsButton[method](`click`, onbBigPictureLoadComentsButtonClick);
  document[method](`keydown`, onDocumentEscKeyDown);
};

const getCommentsFragment = (commentsArray) => {
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

  return newCommentsFragment;
};

const renderCommentsBatch = (commentsArray) => {
  const newCommentsFragment = getCommentsFragment(commentsArray);

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


const showBigPicture = (evt) => {
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

const onPicturesContainerNodeClick = (evt) => {
  showBigPicture(evt);
};

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

const populatePreviews = (data) => {
  const previewsFragment = generateDomPicturesFragment(data);
  picturesContainerNode.appendChild(previewsFragment);
  picturesContainerNode.addEventListener(`click`, onPicturesContainerNodeClick);
};

const showError = (message) => {
  const errorFragment = window.errorTemplate.content.cloneNode(true);
  errorFragment.querySelector(`.error__title`).textContent = message;
  errorFragment.querySelector(`.error__button`).textContent = CLOSE_ERROR_BUTTON_TEXT;
  window.pageMainNode.appendChild(errorFragment);
  window.toggleNotificationListeners(`on`);
};

const onDataLoadSuccess = (xhr) => {
  if (xhr.status < 400) {
    window.filteredPicturesData = window.picturesData = JSON.parse(xhr.response);
    populatePreviews(window.picturesData);
    window.filters.filtersNode.classList.remove(`img-filters--inactive`);
    window.filters.addListener();
  } else {
    showError(UNKNOWN_ERROR_MESSAGE);
  }
};

const onDataLoadError = () => showError(DATA_LOAD_ERROR_MESSAGE);

const onDataLoadTimeout = () => showError(DATA_LOAD_TIMEOUT_MESSAGE);

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

window.sendXMLHttpRequest(
    XHR_PICTURES_DATA_URL,
    XHR_PICTURES_DATA_METHOD,
    onDataLoadSuccess,
    onDataLoadError,
    onDataLoadTimeout,
    TIMEOUT
);
