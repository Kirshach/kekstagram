"use strict";

(function () {
  const filterIdToFilterFunction = {
    'filter-default': function () {},
    'filter-random': function () {},
    'filter-discussed': function () {},
  };
  window.filters.addListener = function () {
    const filtersForm = this.filtersNode.querySelector(`.img-filters__form`);
    filtersForm.addEventListener(`click`, (evt) => {
      const previousFilterButton = filtersForm.querySelector(`.img-filters__button--active`);
      const {target} = evt;
      if (previousFilterButton === target) {
        return;
      }
      previousFilterButton.classList.remove(`img-filters__button--active`);
      target.classList.add(`img-filters__button--active`);
    });
  };
})();
