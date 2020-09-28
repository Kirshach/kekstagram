"use strict";

const PHOTOS_AMOUNT = 25;
const AVATARS_AMOUNT = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 235;

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

//
// Вспомогательные функции для генерации данных в js-прдедставлении
//

const getRandomNumber = (max, min = 0) => {
  // Не включая max
  return min + Math.floor(Math.random() * max);
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
  const avatarNum = getRandomNumber(AVATARS_AMOUNT + 1, 1);
  const nameNum = getRandomNumber(NAMES_ARRAY.length);
  const message = generateCommentContent();

  this.avatar = `img/avatar-${avatarNum}.svg`;
  this.message = message;
  this.name = NAMES_ARRAY[nameNum];
};

const createPhotoArray = (arrayLength) => {
  const photoArray = [];
  for (let i = 0; i < arrayLength; i++) {
    const likesAmount = getRandomNumber(MAX_LIKES + 1, MIN_LIKES);
    const commentsAmount = Math.floor(Math.random() * 5);
    const comments = [];
    for (let j = 0; j < commentsAmount; j++) {
      comments.push(new MockupComment());
    }
    const newPhotoObject = new MockupPhotoObject(
        `photos/${i + 1}.jpg`,
        `Тестовое фото №${i}`,
        likesAmount,
        comments
    );
    photoArray.push(newPhotoObject);
  }
  return photoArray;
};

//
// Вспомогательные функции для генерации DOM-элементов
//

const createDomPictureElement = (template, pictureObject) => {
  const newPictureElement = template.cloneNode(true);
  const imgElement = newPictureElement.querySelector('.picture__img');
  const likesAmountElement = newPictureElement.querySelector('.picture__likes');
  const commentsAmountElement = newPictureElement.querySelector('.picture__comments');

  imgElement.src = pictureObject.url;
  likesAmountElement.textContent = pictureObject.likes;
  commentsAmountElement.textContent = pictureObject.comments.length;
  return newPictureElement;
};

const generateDomPicturesFragment = (picturesArray) => {
  const newFragment = document.createDocumentFragment();
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  for (let i = 0; i < picturesArray.length; i++) {
    const newChildElement = createDomPictureElement(pictureTemplate, picturesArray[i]);
    newFragment.appendChild(newChildElement);
  }
  return newFragment;
};

//
// Выполняем код
//

// Находим нужные элементы
const picturesParentElement = document.querySelector('.pictures');

// Генерируем объекты и заполняем их контентом
const mockupPhotosArray = createPhotoArray(PHOTOS_AMOUNT);
const mockupPhotosFragment = generateDomPicturesFragment(mockupPhotosArray);
picturesParentElement.appendChild(mockupPhotosFragment);

