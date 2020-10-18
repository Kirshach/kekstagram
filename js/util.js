"use strict";

(function () {
  window.getRandomNumber = (max, min = 0, includeMax = false) => {
    const increment = includeMax ? 1 : 0;
    return min + Math.floor(Math.random() * (max - min + increment));
  };
})();
