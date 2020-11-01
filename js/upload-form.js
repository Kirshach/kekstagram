"use strict";

(function () {

  const {
    overlayNode,
    effectsValueNode,
    scaleSmallerNode, scaleBiggerNode,
    commentInputNode,
  } = window.uploadForm;

  const {
    resetForm,
    setScale, setEffectType, applyEffect, movePin,
  } = window.uploadForm.photoEdit;

  const {
    checkHashtagsValidity,
    checkCommentValidity,
    checkFormValidity,
  } = window.uploadForm.validation;

  const uploadPhotoInput = document.querySelector(`#upload-file`);

  const uploadForm = document.querySelector(`.img-upload__form`);
  const overlayCloseButton = overlayNode.querySelector(`#upload-cancel`);
  const overlayEffectsFieldset = overlayNode.querySelector(`.img-upload__effects`);

  const hashtagsInput = document.querySelector(`.text__hashtags`);

  const blockingInputs = [hashtagsInput, commentInputNode];


  const closeUploadFormOnEsc = function (evt) {
    if (evt.key === `Escape` && !blockingInputs.includes(document.activeElement)) {
      closeUploadFileForm();
    }
  };

  // Функция добавления/снятия обработчиков событий
  const toggleUploadFormListeners = function (addListeners) {
    const method = addListeners ? `addEventListener` : `removeEventListener`;
    scaleSmallerNode[method](`click`, setScale);
    scaleBiggerNode[method](`click`, setScale);
    overlayEffectsFieldset[method](`change`, setEffectType);
    effectsValueNode[method](`change`, applyEffect);
    window.uploadForm.effectsPinNode[method](`mousedown`, movePin);
    hashtagsInput[method](`input`, checkHashtagsValidity);
    hashtagsInput[method](`blur`, checkFormValidity);
    uploadForm[method](`submit`, submitForm);
    commentInputNode[method](`input`, checkCommentValidity);
    overlayCloseButton[method](`click`, closeUploadFileForm);
    document[method](`keydown`, closeUploadFormOnEsc);
  };

  const openUploadFileForm = function () {
    resetForm();
    overlayNode.classList.remove(`hidden`);
    document.body.classList.add(`modal-open`);

    toggleUploadFormListeners(true);
  };

  const closeUploadFileForm = function () {
    overlayNode.classList.add(`hidden`);
    document.body.classList.remove(`modal-open`);
    uploadPhotoInput.value = ``;

    toggleUploadFormListeners(false);
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const showNotificationAndCloseForm = function (isSuccessful) {
    const notificationFragment = (
      isSuccessful ? window.successTemplate : window.errorTemplate
    ).content.cloneNode(true);
    closeUploadFileForm();
    window.pageMainNode.appendChild(notificationFragment);
    window.toggleNotificationListeners(`on`);
  };

  const submitForm = function (evt) {
    evt.preventDefault();

    const formData = new FormData(uploadForm);
    let xhr = new XMLHttpRequest();
    xhr.addEventListener(`load`, function () {
      showNotificationAndCloseForm(xhr.status < 400);
    });
    xhr.addEventListener(`error`, function () {
      showNotificationAndCloseForm(false);
    });
    xhr.addEventListener(`timeout`, function () {
      showNotificationAndCloseForm(false);
    });
    xhr.open(`POST`, `https://21.javascript.pages.academy/kekstagram`);
    xhr.send(formData);
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  uploadPhotoInput.addEventListener(`change`, function () {
    openUploadFileForm();
  });

})();
