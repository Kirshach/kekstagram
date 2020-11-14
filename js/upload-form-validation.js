"use strict";

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_LENGTH = 20;
const MAX_HASHTAGS_AMOUNT = 5;

const HASHTAG_TOO_LONG_MESSAGE = `максимальная длина хэштега - ${MAX_HASHTAG_LENGTH} символов`;
const HASHTAG_NO_USEFUL_CHARACTERS_MESSAGE = `хэштег должен содержать хотя бы одну букву или цифру`;

const HASHTAGS_SHOULD_BE_SEPARATED_MESSAGE = `хэштеги должны быть разделены пробелом`;
const HASHTAGS_WRONG_CHARACTERS_MESSAGE = `хэштег должен содержать только буквы и цифры`;
const HASHTAGS_NO_HASH_SYMBOL_MESSAGE = `хэштег должен начинаться с символа "#"`;
const HASHTAGS_SHOULD_NOT_REPEAT_MESSAGE = `хэштеги не должны повторяться`;
const HASHTAGS_TOO_MANY_MESSAGE = `можно указать не более ${MAX_HASHTAGS_AMOUNT} хэштегов`;

const COMMENT_TOO_LONG_MESSAGE = `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;

/*   /    /    /    /    /    /    /    /    /    /    /    /    /    /    */

const {overlayNode, commentInputNode} = window.uploadForm;
const hashtagsInputNode = overlayNode.querySelector(`.text__hashtags`);

const setValidityStyle = (isValid) => {
  if (isValid) {
    hashtagsInputNode.style.borderColor = ``;
  } else {
    hashtagsInputNode.style.borderColor = `#cd3300`;
  }
};

const checkSingleHashtagValidity = (hashtag) => {
  const thisTagValiditySet = new Set();
  if (hashtag === ``) {
    return [];
  }
  if (!hashtag.startsWith(`#`)) {
    thisTagValiditySet.add(HASHTAGS_NO_HASH_SYMBOL_MESSAGE);
  }
  if (!/^[а-яa-z1-9#]+$/i.test(hashtag)) {
    thisTagValiditySet.add(HASHTAGS_WRONG_CHARACTERS_MESSAGE);
  }
  if (hashtag.indexOf(`#`) !== hashtag.lastIndexOf(`#`)) {
    thisTagValiditySet.add(HASHTAGS_SHOULD_BE_SEPARATED_MESSAGE);
  } else if (hashtag.length > MAX_HASHTAG_LENGTH) {
    thisTagValiditySet.add(HASHTAG_TOO_LONG_MESSAGE);
  }
  return thisTagValiditySet;
};

const checkHashtagsAmount = (hashtagsArray, hashtagsValiditySet) => {
  if (hashtagsArray.length > MAX_HASHTAGS_AMOUNT) {
    hashtagsValiditySet.add(HASHTAGS_TOO_MANY_MESSAGE);
  }
};

const checkForEmptyHashtags = (hashtagsArray, hashtagsValiditySet) => {
  if (
    hashtagsArray.includes(`#`)
    && hashtagsArray.length > 1
    && hashtagsArray.indexOf(`#`) !== (hashtagsArray.length - 1)
  ) {
    hashtagsValiditySet.add(HASHTAG_NO_USEFUL_CHARACTERS_MESSAGE);
  }
};

const checkIfHashtagsRepeat = (hashtagsArray, hashtagsValiditySet) => {
  hashtagsArray.forEach((hashtag) => {
    const validityMessages = checkSingleHashtagValidity(hashtag, hashtagsArray);
    validityMessages.forEach((validityMessage) => hashtagsValiditySet.add(validityMessage));
    if (hashtagsArray.indexOf(hashtag) !== hashtagsArray.lastIndexOf(hashtag) && hashtag !== `#`) {
      hashtagsValiditySet.add(HASHTAGS_SHOULD_NOT_REPEAT_MESSAGE);
    }
  });
};

const getHashtagsValidityMessage = () => {
  const hashtagsArray = hashtagsInputNode.value.toLowerCase().split(` `).filter((el) => el !== ``);
  let hashtagsValiditySet = new Set();

  checkHashtagsAmount(hashtagsArray, hashtagsValiditySet);
  checkForEmptyHashtags(hashtagsArray, hashtagsValiditySet); // не беспокоит пользователя, если он только начал ввод
  checkIfHashtagsRepeat(hashtagsArray, hashtagsValiditySet);

  return (Array.from(hashtagsValiditySet)).join(`, `);
};

const reportHashtagsValidity = (hashtagValidityString) => {
  hashtagsInputNode.setCustomValidity(hashtagValidityString.slice(0, 1).toUpperCase() + hashtagValidityString.slice(1));
  hashtagsInputNode.reportValidity();
  setValidityStyle(hashtagValidityString === ``);
};

const checkFormValidity = (evt) => {
  // Дополнительная проверка, ради лучшего UX производимая только при событии blur
  const hashtagsArray = hashtagsInputNode.value.toLowerCase().split(` `).filter((el) => el !== ` `);
  if (hashtagsArray.includes(`#`)) {
    evt.preventDefault();
    hashtagsInputNode.setCustomValidity(HASHTAG_NO_USEFUL_CHARACTERS_MESSAGE);
    hashtagsInputNode.reportValidity();
    setValidityStyle(false);
    return false;
  }
  setValidityStyle(true);
  return true;
};

// Валидация комментария
const checkCommentValidity = () => {
  if (commentInputNode.value.length >= MAX_COMMENT_LENGTH) {
    commentInputNode.setCustomValidity(COMMENT_TOO_LONG_MESSAGE);
    commentInputNode.reportValidity();
  } else {
    commentInputNode.setCustomValidity(``);
  }
};

window.uploadForm.validation = {
  getHashtagsValidityMessage,
  checkCommentValidity,
  checkFormValidity,
  reportHashtagsValidity
};
