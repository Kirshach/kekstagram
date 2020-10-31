"use strict";

(function () {

  const overlayNode = document.querySelector(`.img-upload__overlay`);
  const scaleFieldSet = overlayNode.querySelector(`.img-upload__scale`);
  const effectsSlider = overlayNode.querySelector(`.img-upload__effect-level`);
  const effectsLine = effectsSlider.querySelector(`.effect-level__line`);

  window.uploadForm = {
    overlayNode,

    effectsSlider,
    effectsLine,
    effectsPin: effectsLine.querySelector(`.effect-level__pin`),
    effectsValue: effectsSlider.querySelector(`.effect-level__value`),

    scaleFieldSet,
    scaleSmaller: scaleFieldSet.querySelector(`.scale__control--smaller`),
    scaleBigger: scaleFieldSet.querySelector(`.scale__control--bigger`),

    commentInput: overlayNode.querySelector(`.text__description`),
  };
})();

