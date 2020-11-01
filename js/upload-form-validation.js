"use strict";

(function () {
  const MAX_COMMENT_LENGTH = 140;

  const {overlayNode, commentInputNode} = window.uploadForm;
  const hashtagsInput = overlayNode.querySelector(`.text__hashtags`);

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
    // Дополнительная проверка, ради лучшего UX производимая только при событии blur
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
    if (commentInputNode.value.length >= MAX_COMMENT_LENGTH) {
      commentInputNode.setCustomValidity(`Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`);
      commentInputNode.reportValidity();
    } else {
      commentInputNode.setCustomValidity(``);
    }
  };

  window.uploadForm.validation = {
    checkHashtagsValidity,
    checkCommentValidity,
    checkFormValidity
  };
})();
