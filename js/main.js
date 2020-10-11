"use strict";

//    //    //    //    //    //    //    //    //    //
//                                                    //
//                       КОНСТАНТЫ                    //
//                                                    //
//    //    //    //    //    //    //    //    //    //

const PHOTOS_AMOUNT = 25;
const AVATARS_AMOUNT = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 235;
const MAX_COMMENTS = 5;
const MAX_EFFECT_VALUE = 100;

const COMMENTS_ARRAY = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`,
];

const NAMES_ARRAY = [
  `Сергей Волосатый`,
  `Михаил Шептун`,
  `Дмитрий Киршанов`,
  `Денис Байдаров`,
  `Василиса Прекрасная`,
  `Эммануэль Макрон`,
  `Батька Махно`,
  `Вадим Макеев`,
  `Кекс`,
];


//    //    //    //    //    //    //    //    //    //    //
//                                                          //
//                 ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ                   //
//                                                          //
//    //    //    //    //    //    //    //    //    //    //

const bigPicture = document.querySelector(`.big-picture`);
const bigPictureImg = bigPicture.querySelector(`.big-picture__img img `);
const bigPictureLikesCount = bigPicture.querySelector(`.likes-count`);
const bigPictureCommentsCount = bigPicture.querySelector(`.comments-count`);
const bigPictureComments = bigPicture.querySelector(`.social__comments`);
const bigPictureCaption = bigPicture.querySelector(`.social__caption`);
const bigPictureCommentsCountParagraph = bigPicture.querySelector(`.social__comment-count`);
const bigPictureCommentsLoader = bigPicture.querySelector(`.comments-loader`);


//    //    //    //    //    //    //    //    //    //    //
//                                                          //
//                 ПЕРВООЧЕРЕДНЫЕ ОПЕРАЦИИ                  //
//                                                          //
//    //    //    //    //    //    //    //    //    //    //

const picturesPreviewContainer = document.querySelector(`.pictures`);

const getRandomNumber = (max, min = 0, includeMax = false) => {
  const increment = includeMax ? 1 : 0;
  return min + Math.floor(Math.random() * (max - min + increment));
};

const MockupPhotoObject = function (url, description, likes, comments) {
  this.url = url;
  this.description = description;
  this.likes = likes;
  this.comments = comments;
};

const generateCommentContent = () => {
  const commentNum = getRandomNumber(COMMENTS_ARRAY.length);
  let commentContent = COMMENTS_ARRAY[commentNum];

  if (Math.random() < 0.5) {
    const secondCommentNum = getRandomNumber(COMMENTS_ARRAY.length);
    commentContent += ` ` + COMMENTS_ARRAY[secondCommentNum];
  }
  return commentContent;
};

const MockupComment = function () {
  const avatarNum = getRandomNumber(AVATARS_AMOUNT, 1, true);
  const nameNum = getRandomNumber(NAMES_ARRAY.length);
  const message = generateCommentContent();

  this.avatar = `img/avatar-${avatarNum}.svg`;
  this.message = message;
  this.name = NAMES_ARRAY[nameNum];
};

const createPhotoArray = (arrayLength) => {
  const photoArray = [];
  for (let i = 1; i <= arrayLength; i++) {
    const likesAmount = getRandomNumber(MAX_LIKES, MIN_LIKES, true);
    const commentsAmount = getRandomNumber(MAX_COMMENTS);
    const comments = [];
    for (let j = 0; j < commentsAmount; j++) {
      comments.push(new MockupComment());
    }
    const newPhotoObject = new MockupPhotoObject(
        `photos/${i}.jpg`,
        `Тестовое фото №${i}`,
        likesAmount,
        comments
    );
    photoArray.push(newPhotoObject);
  }
  return photoArray;
};

const createDomPictureElement = (template, pictureObject) => {
  const newPictureElement = template.cloneNode(true);
  const imgElement = newPictureElement.querySelector(`.picture__img`);
  const likesAmountElement = newPictureElement.querySelector(`.picture__likes`);
  const commentsAmountElement = newPictureElement.querySelector(`.picture__comments`);

  imgElement.src = pictureObject.url;
  likesAmountElement.textContent = pictureObject.likes;
  commentsAmountElement.textContent = pictureObject.comments.length;
  return newPictureElement;
};

const generateDomPicturesFragment = (picturesArray) => {
  const newFragment = document.createDocumentFragment();
  const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
  for (let i = 0; i < picturesArray.length; i++) {
    const newChildElement = createDomPictureElement(pictureTemplate, picturesArray[i]);
    newFragment.appendChild(newChildElement);
  }
  return newFragment;
};

// Генерируем объекты превью фотографий и заполняем их контентом
const mockupPhotosArray = createPhotoArray(PHOTOS_AMOUNT);
const mockupPhotosFragment = generateDomPicturesFragment(mockupPhotosArray);

// Добавляем  превью фотографий в разметку
picturesPreviewContainer.appendChild(mockupPhotosFragment);


//    //    //    //    //    //    //    //    //    //    //
//                                                          //
//           ОБРАБОТЧИКИ ПОЛНОЭКРАННОГО РЕЖИМА              //
//                                                          //
//    //    //    //    //    //    //    //    //    //    //

// Находим шаблон комментария в разметке
const commentTemplate = document.querySelector(`.social__comment`).cloneNode(true);

// Берём для теста первую фотографию из массива мокап-фотографий
const bigPictureTestObject = mockupPhotosArray[0];

// Задаём функцию наполнения окна полноэкранного режима
const showBigPicture = function (bigPictureObject) {
  // Готовим комментарии к размещению в разметке
  const bigPictureCommentsFragment = document.createDocumentFragment();

  for (let i = 0; i < bigPictureObject.comments.length; i++) {
    // Достаём текущий комментарий из массива комментариев
    const currentComment = bigPictureObject.comments[i];
    // Клонируем шаблон комментария и находим его элементы
    const commentsItem = commentTemplate.cloneNode(true);
    const commentsAvatar = commentsItem.querySelector(`.social__picture`);
    const commentsParagraph = commentsItem.querySelector(`.social__text`);
    // Наполняем элементы нового комментария
    commentsAvatar.src = currentComment.avatar;
    commentsAvatar.alt = currentComment.name;
    commentsAvatar.width = 35;
    commentsAvatar.height = 35;
    commentsParagraph.textContent = currentComment.message;
    // Добавляем комментарий во фрагмент
    bigPictureCommentsFragment.appendChild(commentsItem);
  }

  // Очищаем секцию комментариев
  bigPictureComments.innerHTML = ``;
  // Добавляем фрагмент с комментариями в разметку
  bigPictureComments.appendChild(bigPictureCommentsFragment);
  // Наполняем содержанием пост
  bigPictureImg.src = bigPictureObject.url;
  bigPictureLikesCount.textContent = bigPictureObject.likes;
  bigPictureCommentsCount.textContent = bigPictureObject.comments.length;
  bigPictureCaption.textContent = bigPictureObject.description;
  // Прячем блоки счётчика комментариев и загрузки новых комментариев
  bigPictureCommentsCountParagraph.classList.add(`hidden`);
  bigPictureCommentsLoader.classList.add(`hidden`);
  // Делаем полноэкранный режим видимым и блокируем прокрутку окна браузера
  setTimeout(() => {
    bigPicture.classList.remove(`hidden`);
    document.body.classList.add(`modal-open`);
  });
};


//    //    //    //    //    //    //    //    //    //    //
//                                                          //
//            ОБРАБОТЧИКИ ЗАГРУЗКИ ФОТОГРАФИЙ               //
//                                                          //
//    //    //    //    //    //    //    //    //    //    //

const uploadPhotoForm = document.querySelector(`.img-upload__overlay`);
const uploadPhotoInput = document.querySelector(`#upload-file`);
const uploadPhotoCloseForm = uploadPhotoForm.querySelector(`#upload-cancel`);
const uploadPhotoImagePreview = uploadPhotoForm.querySelector(`.img-upload__preview img`);
const uploadPhotoEffectsFieldset = uploadPhotoForm.querySelector(`.img-upload__effects`);
const uploadPhotoEffectLevelSlider = uploadPhotoForm.querySelector(`.img-upload__effect-level`);
const uploadPhotoEffectLevelValue = uploadPhotoEffectLevelSlider.querySelector(`.effect-level__value`);
const uploadPhotoEffectLevelPin = uploadPhotoEffectLevelSlider.querySelector(`.effect-level__pin`);
const uploadPhotoEffectLevelDepth = uploadPhotoEffectLevelSlider.querySelector(`.effect-level__depth`);

const scaleFieldSet = document.querySelector(`.img-upload__scale`);
const scaleSmaller = scaleFieldSet.querySelector(`.scale__control--smaller`);
const scaleBigger = scaleFieldSet.querySelector(`.scale__control--bigger`);
const scaleValue = scaleFieldSet.querySelector(`.scale__control--value`);

const hashtagsInput = document.querySelector(`.text__hashtags`);

//     Обработчики изменения размера изображения
const setScale = function (evt, explicitScale) {
  if (explicitScale) {
    scaleValue.value = explicitScale;
  } else if (evt.target === scaleSmaller) {
    scaleValue.value = `${Math.max(parseInt(scaleValue.value, 10) - 25, 25)}%`;
  } else if (evt.target === scaleBigger) {
    scaleValue.value = `${Math.min(parseInt(scaleValue.value, 10) + 25, 100)}%`;
  }
  uploadPhotoImagePreview.style.transform = `scale(${scaleValue.value})`;
};

//     Обработчики фильтров
const setSliderVisibility = function (effect) {
  if (effect === `none`) {
    uploadPhotoEffectLevelSlider.classList.add(`hidden`);
  } else if (uploadPhotoEffectLevelSlider.classList.contains(`hidden`)) {
    uploadPhotoEffectLevelSlider.classList.remove(`hidden`);
  }
};

const setEffect = function (newEffect, previousEffect) {
  if (previousEffect) {
    uploadPhotoImagePreview.classList.remove(`effects__preview--${previousEffect}`);
  }
  setSliderVisibility(newEffect);
  uploadPhotoImagePreview.classList.add(`effects__preview--${newEffect}`);
  uploadPhotoImagePreview.dataset.effect = newEffect;
  uploadPhotoEffectLevelValue.value = MAX_EFFECT_VALUE;
  setEffectCSSRule();

  // ВРЕМЕННО
  uploadPhotoEffectLevelPin.style.left = `100%`;
  uploadPhotoEffectLevelDepth.style.width = `100%`;
};

const changeEffect = function (evt) {
  const newEffect = evt.target.value;
  const previousEffect = uploadPhotoImagePreview.dataset.effect;
  setEffect(newEffect, previousEffect);
};

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

const setEffectValueByPinPos = function () {
  uploadPhotoEffectLevelValue.value = parseInt(uploadPhotoEffectLevelPin.style.left, 10);
};

const getEffectValueString = function (effect, fraction) {
  if (effect !== `none`) {
    const effectObject = effectsMap[effect];
    const effectName = effectObject.name;
    const effectValue = (effectObject.max - effectObject.min) * fraction + effectObject.min;
    const effectUnit = effectObject.unit;
    return `${effectName}(${effectValue}${effectUnit})`;
  } else {
    return `none`;
  }
};

const setEffectCSSRule = function () {
  const effect = uploadPhotoImagePreview.dataset.effect;
  const value = uploadPhotoEffectLevelValue.value / MAX_EFFECT_VALUE;
  uploadPhotoImagePreview.style.filter = getEffectValueString(effect, value);
};

//
//     Валидация хэштегов
//

const checkSingleHashtagValidity = function (hashtag) {
  const thisTagValiditySet = new Set();
  if (hashtag === ``) {
    return [];
  }
  if (hashtag === `#`) {
    return [`хэштег должен содержать хотя бы одну букву или цифру`];
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

const checkHashtagsValidity = function () {
  const hashtagsArray = hashtagsInput.value.toLowerCase().split(` `).filter((el) => el !== ` `);
  let validitiesSet = new Set();
  if (hashtagsArray.length > 5) {
    validitiesSet.add(`можно указать не более 5 хэштегов`);
  }
  for (let i = 0; i < hashtagsArray.length; i += 1) {
    const hashtag = hashtagsArray[i];
    const validityMessages = checkSingleHashtagValidity(hashtag, hashtagsArray);
    validityMessages.forEach((validityMessage) => validitiesSet.add(validityMessage));
    if (hashtagsArray.indexOf(hashtag) !== hashtagsArray.lastIndexOf(hashtag)) {
      validitiesSet.add(`хэштеги не должны повторяться`);
    }
  }
  let validityStr = (Array.from(validitiesSet)).join(`, `);
  hashtagsInput.setCustomValidity(validityStr.slice(0, 1).toUpperCase() + validityStr.slice(1));
  hashtagsInput.reportValidity();
};


//
//     Обработчики открытия и закрытия модального окна
//

const toggleUploadFormListeners = function (addListeners) {
  const method = addListeners ? `addEventListener` : `removeEventListener`;
  uploadPhotoEffectsFieldset[method](`change`, changeEffect);
  uploadPhotoEffectLevelValue[method](`change`, setEffectCSSRule);
  uploadPhotoEffectLevelPin[method](`mouseup`, setEffectValueByPinPos);
  scaleSmaller[method](`click`, setScale);
  scaleBigger[method](`click`, setScale);
  hashtagsInput[method](`input`, checkHashtagsValidity);
};

const openUploadFileForm = function () {
  setEffect(`none`);
  setScale(null, `100%`);
  uploadPhotoForm.classList.remove(`hidden`);
  document.body.classList.add(`modal-open`);
  document.addEventListener(`keydown`, closeUploadFormOnEsc);

  toggleUploadFormListeners(true);
};

const closeUploadFileForm = function () {
  uploadPhotoForm.classList.add(`hidden`);
  document.body.classList.remove(`modal-open`);
  document.removeEventListener(`keydown`, closeUploadFormOnEsc);
  uploadPhotoInput.value = ``;

  toggleUploadFormListeners(false);
};

const closeUploadFormOnEsc = function (evt) {
  if (evt.key === `Escape` && hashtagsInput !== document.activeElement) {
    closeUploadFileForm();
  }
};

uploadPhotoInput.addEventListener(`change`, function () {
  openUploadFileForm();
});

uploadPhotoCloseForm.addEventListener(`click`, function () {
  closeUploadFileForm();
});

