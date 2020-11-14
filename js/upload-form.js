"use strict";

const XHR_UPLOAD_IMAGE_URL = `https://21.javascript.pages.academy/kekstagram`;
const XHR_UPLOAD_IMAGE_METHOD = `POST`;
const XHR_UPLOAD_IMAGE_TIMEOUT = 7000;

const {
  overlayNode,
  imagePreview,
  effectsValueNode,
  scaleSmallerNode, scaleBiggerNode,
  commentInputNode,
} = window.uploadForm;

const {
  clearFormData,
  setScale, setEffectType, applyEffect, movePin,
} = window.uploadForm.photoEdit;

const {
  getHashtagsValidityMessage,
  checkCommentValidity,
  checkFormValidity,
  reportHashtagsValidity
} = window.uploadForm.validation;

const uploadPhotoInput = document.querySelector(`#upload-file`);

const uploadForm = document.querySelector(`.img-upload__form`);
const overlayCloseButton = overlayNode.querySelector(`#upload-cancel`);
const overlayEffectsFieldset = overlayNode.querySelector(`.img-upload__effects`);

const hashtagsInputNode = document.querySelector(`.text__hashtags`);

const blockingInputs = [hashtagsInputNode, commentInputNode];


const onDocumentKeyDown = (evt) => {
  if (evt.key === `Escape` && !blockingInputs.includes(document.activeElement)) {
    closeUploadFileForm();
  }
};

const showNotification = (isSuccessful) => {
  const notificationFragment = (
    isSuccessful ? window.successTemplate : window.errorTemplate
  ).content.cloneNode(true);
  window.pageMainNode.appendChild(notificationFragment);
  window.toggleNotificationListeners(`on`);
};

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

const onPostFormWithXHRLoad = (xhr) => {
  const isSuccessful = xhr.status < 400;
  showNotification(isSuccessful);
  closeUploadFileForm();
};

const onPostFormWithXHRError = () => {
  showNotification(false);
  closeUploadFileForm();
};

const onPostFormWithXHRTimeout = () => {
  showNotification(false);
  closeUploadFileForm();
};

const postFormWithXHR = (formData) => {
  window.sendXMLHttpRequest(
      XHR_UPLOAD_IMAGE_URL,
      XHR_UPLOAD_IMAGE_METHOD,
      onPostFormWithXHRLoad,
      onPostFormWithXHRError,
      onPostFormWithXHRTimeout,
      XHR_UPLOAD_IMAGE_TIMEOUT,
      formData
  );
};

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

const onScaleSmallerNodeClick = (evt) => {
  setScale(evt);
};

const onScaleBiggerNodeClick = (evt) => {
  setScale(evt);
};

const onOverlayEffectsFieldsetChange = (evt) => {
  setEffectType(evt);
};

const onEffectsValueNodeChange = () => {
  applyEffect();
};

const onEffectsPinNodeMouseDown = (evt) => {
  movePin(evt);
};

const onHashtagsInputFieldInput = () => {
  const validityMessage = getHashtagsValidityMessage();
  reportHashtagsValidity(validityMessage);
};

const onHashtagsInputFieldBlur = (evt) => {
  checkFormValidity(evt);
};

const onUploadFormSubmit = (evt) => {
  evt.preventDefault();

  const formData = new FormData(uploadForm);
  postFormWithXHR(formData);
};

const onCommentInputNodeInput = () => {
  checkCommentValidity();
};

const onOverlayCloseButton = () => {
  closeUploadFileForm();
};

const toggleUploadFormListeners = (addListeners) => {
  const method = addListeners ? `addEventListener` : `removeEventListener`;
  scaleSmallerNode[method](`click`, onScaleSmallerNodeClick);
  scaleBiggerNode[method](`click`, onScaleBiggerNodeClick);
  overlayEffectsFieldset[method](`change`, onOverlayEffectsFieldsetChange);
  effectsValueNode[method](`change`, onEffectsValueNodeChange);
  window.uploadForm.effectsPinNode[method](`mousedown`, onEffectsPinNodeMouseDown);
  hashtagsInputNode[method](`input`, onHashtagsInputFieldInput);
  hashtagsInputNode[method](`blur`, onHashtagsInputFieldBlur);
  uploadForm[method](`submit`, onUploadFormSubmit);
  commentInputNode[method](`input`, onCommentInputNodeInput);
  overlayCloseButton[method](`click`, onOverlayCloseButton);
  document[method](`keydown`, onDocumentKeyDown);
};

const openUploadFileForm = () => {
  clearFormData();

  const reader = new FileReader();
  reader.addEventListener(`load`, (event) => {
    imagePreview.src = event.target.result;
    overlayNode.classList.remove(`hidden`);
    document.body.classList.add(`modal-open`);

    toggleUploadFormListeners(true);
  });

  reader.readAsDataURL(uploadPhotoInput.files[0]);
};

const closeUploadFileForm = () => {
  overlayNode.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);
  uploadPhotoInput.value = ``;

  toggleUploadFormListeners(false);
};

const onUploadPhotoInputChange = () => {
  openUploadFileForm();
};

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

uploadPhotoInput.addEventListener(`change`, onUploadPhotoInputChange);

