"use strict";

(function () {
  window.pageMain = document.querySelector(`main`);
  window.successTemplate = document.querySelector(`#success`);
  window.errorTemplate = document.querySelector(`#error`);

  const closeNotificationOnEsc = function (evt) {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      const notificationNode = window.pageMain.querySelector(`.success`) || window.pageMain.querySelector(`.error`);
      notificationNode.remove();
      window.toggleNotificationListeners(`off`);
    }
  };

  const closeNotificationOnClick = function (evt) {
    const notificationNode = window.pageMain.querySelector(`.success`) || window.pageMain.querySelector(`.error`);
    if (
      evt.target === notificationNode
      || evt.target === notificationNode.querySelector(`button`)
    ) {
      notificationNode.remove();
      window.toggleNotificationListeners(`off`);
    }
  };

  window.toggleNotificationListeners = function (direction) {
    const method = direction === `on` ? `addEventListener` : `removeEventListener`;
    document[method](`keydown`, closeNotificationOnEsc);
    document[method](`click`, closeNotificationOnClick);
  };
})();
