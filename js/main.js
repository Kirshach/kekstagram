"use strict";

const PHOTOS_AMOUNT = 25;
const AVATARS_AMOUNT = 6;
const MIN_LIKES = 15;
const MAX_LIKES = 235;
const MAX_COMMENTS = 5;

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

// // // // // // // // // // // // // // // // // // // // // // //
//    Задаём функции для генерации данных в js-прдедставлении     //
// // // // // // // // // // // // // // // // // // // // // // //

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

// // // // // // // // // // // // // // // // // // //
//     Задаём функции для генерации DOM-элементов     //
// // // // // // // // // // // // // // // // // // //

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


// // // // // // // // // // // // // // // // // //
//   Готовимся тестировать полноэкранный режим     //
// // // // // // // // // // // // // // // // // //

// Генерируем объекты превью фотографий и заполняем их контентом
const mockupPhotosArray = createPhotoArray(PHOTOS_AMOUNT);
const mockupPhotosFragment = generateDomPicturesFragment(mockupPhotosArray);

// Берём для теста первую фотографию из массива мокап-фотографий
const bigPictureTestObject = mockupPhotosArray[0];

// Создаём html-фрагмент для добавления новых комментариев
const bigPictureCommentsFragment = document.createDocumentFragment();

for (let i = 0; i < bigPictureTestObject.comments.length; i++) {
  // Достаём текущий комментарий из массива комментариев к фотографии
  const currentComment = bigPictureTestObject.comments[i];
  // Создаём новые элементы для комментария
  const commentsNewItem = document.createElement('li');
  const commentsAvatar = document.createElement('img');
  const commentsParagraph = document.createElement('p');
  // Добавляем им классы
  commentsNewItem.className = 'social__comment';
  commentsAvatar.className = 'social__picture';
  commentsParagraph.className = 'social__text';
  // Наполняем элементы нового комментария
  commentsAvatar.src = currentComment.avatar;
  commentsAvatar.alt = currentComment.name;
  commentsAvatar.width = 35;
  commentsAvatar.height = 35;
  commentsParagraph.textContent = currentComment.message;
  // Вкладываем элементы нового комментария в их родительский объект
  commentsNewItem.appendChild(commentsAvatar);
  commentsNewItem.appendChild(commentsParagraph);
  // Родительский объект добавляем во фрагмент
  bigPictureCommentsFragment.appendChild(commentsNewItem);
}


// // // // // // // // // // // // // // // // // //
//    Проводим операции над разметкой страницы     //
// // // // // // // // // // // // // // // // // //

// //
// Находим элементы, которые будем модифицировать
// //

// Находим контейнер превью изображений
const picturesParentElement = document.querySelector('.pictures');

// Находим элементы полноэкранного режима
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img');
const bigPictureLikesCount = bigPicture.querySelector('.likes-count');
const bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
const bigPictureComments = bigPicture.querySelector('.social__comments');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureCommentsCountParagraph = bigPicture.querySelector('.social__comment-count');
const bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

// //
// Модифицируем содержание страницы
// //

// Добавляем  превью фотографий в разметку
picturesParentElement.appendChild(mockupPhotosFragment);

// Заполняем содержание окна полноэкранного режима
bigPictureImg.src = bigPictureTestObject.url;
bigPictureLikesCount.textContent = bigPictureTestObject.likes;
bigPictureCommentsCount.textContent = bigPictureTestObject.comments.length;
bigPictureCaption.textContent = bigPictureTestObject.description;
// Добавляем фрагмент с тестовыми комментариями в разметку
console.log(bigPictureCommentsFragment);
bigPictureComments.appendChild(bigPictureCommentsFragment);
// Делаем полноэкранный режим видимым по умолчанию
bigPicture.classList.remove('hidden');
// Прячем блоки счётчика комментариев и загрузки новых комментариев
bigPictureCommentsCountParagraph.classList.add('hidden');
bigPictureCommentsLoader.classList.add('hidden');
// Блокируем прокрутку страницы при открытом модальном окне;
document.body.classList.add('modal-open');
