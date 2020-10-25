"use strict";

(function () {
  const SCALING_STEP = 25;
  const MAX_SCALE = 100;
  const MIN_SCALE = 25;
  const MAX_EFFECT_VALUE = 100;
  const DEFAULT_EFFECT_VALUE = MAX_EFFECT_VALUE;
  const DEFAULT_SCALE_VALUE = 100;
  const MAX_COMMENT_LENGTH = 140;

  const effectsMap = {
    chrome: {
      min: 0, max: 1, name: `grayscale`, unit: ``,
    },
    sepia: {
      min: 0, max: 1, name: `sepia`, unit: ``,
    },
    marvin: {
      min: 0, max: 100, name: `invert`, unit: `%`,
    },
    phobos: {
      min: 0, max: 3, name: `blur`, unit: `px`,
    },
    heat: {
      min: 1, max: 3, name: `brightness`, unit: ``,
    },
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const uploadPhotoInput = document.querySelector(`#upload-file`);

  const uploadForm = document.querySelector(`.img-upload__form`);
  // const uploadFormSubmit = document.querySelector(`.img-upload__submit`);
  const overlay = document.querySelector(`.img-upload__overlay`);
  const overlayCloseButton = overlay.querySelector(`#upload-cancel`);
  const overlayImagePreview = overlay.querySelector(`.img-upload__preview img`);
  const overlayEffectsFieldset = overlay.querySelector(`.img-upload__effects`);
  const overlayEffectsSlider = overlay.querySelector(`.img-upload__effect-level`);
  const overlayEffectsLine = overlayEffectsSlider.querySelector(`.effect-level__line`);
  const overlayEffectsPin = overlayEffectsLine.querySelector(`.effect-level__pin`);
  const overlayEffectsFill = overlayEffectsLine.querySelector(`.effect-level__depth`);
  const overlayEffectsValue = overlayEffectsSlider.querySelector(`.effect-level__value`);

  const scaleFieldSet = document.querySelector(`.img-upload__scale`);
  const scaleSmaller = scaleFieldSet.querySelector(`.scale__control--smaller`);
  const scaleBigger = scaleFieldSet.querySelector(`.scale__control--bigger`);
  const scaleInputValue = scaleFieldSet.querySelector(`.scale__control--value`);

  const hashtagsInput = document.querySelector(`.text__hashtags`);
  const commentInput = document.querySelector(`.text__description`);

  const blockingInputs = [hashtagsInput, commentInput];

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const resetScale = function () {
    setScale(null, DEFAULT_SCALE_VALUE);
  };

  const resetEffects = function () {
    setEffectType(null, `none`);
  };

  const resetSlider = function () {
    overlayEffectsPin.style.left = `${DEFAULT_EFFECT_VALUE}%`;
    overlayEffectsFill.style.width = `${DEFAULT_EFFECT_VALUE}%`;
    overlayEffectsValue.value = DEFAULT_EFFECT_VALUE;
  };

  const resetForm = function () {
    resetScale();
    resetEffects();
    resetSlider();
  };

  //  Обработчик изменения размера изображения

  const setScale = function (evt, explicitValue) {
    let scaleValue;
    if (explicitValue) {
      scaleValue = `${explicitValue}%`;
    } else if (evt.target === scaleSmaller) {
      scaleValue = `${Math.max(parseInt(scaleInputValue.value, 10) - SCALING_STEP, MIN_SCALE)}%`;
    } else if (evt.target === scaleBigger) {
      scaleValue = `${Math.min(parseInt(scaleInputValue.value, 10) + SCALING_STEP, MAX_SCALE)}%`;
    }
    scaleInputValue.value = scaleValue;
    overlayImagePreview.style.transform = `scale(${parseInt(scaleInputValue.value, 10) / 100})`;
  };

  //  Обработчики фильтров
  const getEffectValueString = function (effect, value) {
    if (effect !== `none`) {
      const effectObject = effectsMap[effect];
      const effectName = effectObject.name;
      const effectValue = (effectObject.max - effectObject.min) * (value / 100) + effectObject.min;
      const effectUnit = effectObject.unit;
      return `${effectName}(${effectValue}${effectUnit})`;
    } else {
      return `none`;
    }
  };

  const setSliderVisibility = function (effect) {
    if (effect === `none`) {
      overlayEffectsSlider.classList.add(`hidden`);
    } else if (overlayEffectsSlider.classList.contains(`hidden`)) {
      overlayEffectsSlider.classList.remove(`hidden`);
    }
  };

  const setEffectType = function (evt, explicitEffect) {
    let newEffect = explicitEffect ? explicitEffect : evt.target.value;
    overlayImagePreview.className = `effects__preview--${newEffect}`;
    overlayImagePreview.dataset.effect = newEffect;

    setEffectValue(DEFAULT_EFFECT_VALUE);
    applyEffect();
    resetSlider();
    setSliderVisibility(newEffect);
  };

  const setEffectValue = function (value) {
    overlayEffectsValue.value = value;
  };

  const applyEffect = function () {
    const effect = overlayImagePreview.dataset.effect;
    const value = overlayEffectsValue.value;
    overlayImagePreview.style.filter = getEffectValueString(effect, value);
  };

  const movePin = function (mouseDownEvt) {
    mouseDownEvt.preventDefault();
    const startPinOffsetX = overlayEffectsPin.offsetLeft;
    const maxOffsetX = overlayEffectsLine.offsetWidth;
    const startClientX = mouseDownEvt.clientX;

    const onMouseMove = function (mouseMoveEvt) {
      mouseDownEvt.stopPropagation();
      const shiftX = mouseMoveEvt.clientX - startClientX;
      const newPinOffsetX = Math.min(Math.max(0, startPinOffsetX + shiftX), maxOffsetX);
      overlayEffectsPin.style.left = `${newPinOffsetX}px`;
      overlayEffectsFill.style.width = `${newPinOffsetX}px`;
      setEffectValue(Math.round((newPinOffsetX / maxOffsetX) * 100));
      applyEffect();
    };
    const onMouseUp = function () {
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };
    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  };

  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  // Установка стилей валидации
  const setValidationStyles = function (isValid) {
    if (isValid) {
      hashtagsInput.style.borderColor = ``;
    } else {
      hashtagsInput.style.borderColor = `#cd3300`;
    }
  };

  // Валидация одного хэштега
  const checkSingleHashtagValidity = function (hashtag) {
    const thisTagValiditySet = new Set();
    if (hashtag === ``) {
      return [];
    }
    if (!hashtag.startsWith(`#`)) {
      thisTagValiditySet.add(`хэштег должен начинаться с символа "#"`);
    }
    if (!/^[а-яa-z1-9#]+$/i.test(hashtag)) {
      thisTagValiditySet.add(`хэштег должен содержать только буквы и цифры`);
    }
    if (hashtag.indexOf(`#`) !== hashtag.lastIndexOf(`#`)) {
      thisTagValiditySet.add(`хэштеги должны быть разделены пробелом`);
    } else if (hashtag.length > 20) {
      thisTagValiditySet.add(`максимальная длина хэштега - 20 символов`);
    }
    return thisTagValiditySet;
  };

  // Валидация строки из нескольких хэштегов
  const checkHashtagsValidity = function () {
    const hashtagsArray = hashtagsInput.value.toLowerCase().split(` `).filter((el) => el !== ``);
    let validitiesSet = new Set();
    if (hashtagsArray.length > 5) {
      validitiesSet.add(`можно указать не более 5 хэштегов`);
    }
    // Проверяем на наличие пустого хэштега `#`, но не беспокоим пользователя, если он только начал ввод
    if (
      hashtagsArray.includes(`#`)
      && hashtagsArray.length > 1
      && hashtagsArray.indexOf(`#`) !== (hashtagsArray.length - 1)
    ) {
      validitiesSet.add(`хэштег должен содержать хотя бы одну букву или цифру`);
    }
    for (let i = 0; i < hashtagsArray.length; i += 1) {
      const hashtag = hashtagsArray[i];
      const validityMessages = checkSingleHashtagValidity(hashtag, hashtagsArray);
      validityMessages.forEach((validityMessage) => validitiesSet.add(validityMessage));
      if (hashtagsArray.indexOf(hashtag) !== hashtagsArray.lastIndexOf(hashtag) & hashtag !== `#`) {
        validitiesSet.add(`хэштеги не должны повторяться`);
      }
    }
    let validityStr = (Array.from(validitiesSet)).join(`, `);
    hashtagsInput.setCustomValidity(validityStr.slice(0, 1).toUpperCase() + validityStr.slice(1));
    hashtagsInput.reportValidity();
    setValidationStyles(validityStr === ``);
  };

  const checkFormValidity = function (evt) {
    // Поскольку событие submit может состояться только если основная валидация при вводе прошла,
    // мы может осуществить дополнительные проверки, которые во благо UX не стоило осуществлять при вводе
    const hashtagsArray = hashtagsInput.value.toLowerCase().split(` `).filter((el) => el !== ` `);
    if (hashtagsArray.includes(`#`)) {
      evt.preventDefault();
      hashtagsInput.setCustomValidity(`Хэштег должен содержать хотя бы одну букву или цифру`);
      hashtagsInput.reportValidity();
      setValidationStyles(false);
      return false;
    }
    setValidationStyles(true);
    return true;
  };

  // Валидация комментария
  const checkCommentValidity = function () {
    if (commentInput.value.length >= MAX_COMMENT_LENGTH) {
      commentInput.setCustomValidity(`Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`);
      commentInput.reportValidity();
    } else {
      commentInput.setCustomValidity(``);
    }
  };
  /*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

  const closeUploadFormOnEsc = function (evt) {
    if (evt.key === `Escape` && !blockingInputs.includes(document.activeElement)) {
      closeUploadFileForm();
    }
  };

  // Функция добавления/снятия обработчиков событий
  const toggleUploadFormListeners = function (addListeners) {
    const method = addListeners ? `addEventListener` : `removeEventListener`;
    scaleSmaller[method](`click`, setScale);
    scaleBigger[method](`click`, setScale);
    overlayEffectsFieldset[method](`change`, setEffectType);
    overlayEffectsValue[method](`change`, applyEffect);
    overlayEffectsPin[method](`mousedown`, movePin);
    hashtagsInput[method](`input`, checkHashtagsValidity);
    hashtagsInput[method](`blur`, checkFormValidity);
    uploadForm[method](`submit`, submitForm);
    commentInput[method](`input`, checkCommentValidity);
    overlayCloseButton[method](`click`, closeUploadFileForm);
    document[method](`keydown`, closeUploadFormOnEsc);
  };

  const openUploadFileForm = function () {
    resetForm();
    overlay.classList.remove(`hidden`);
    document.body.classList.add(`modal-open`);

    toggleUploadFormListeners(true);
  };

  const closeUploadFileForm = function () {
    overlay.classList.add(`hidden`);
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
    window.pageMain.appendChild(notificationFragment);
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
