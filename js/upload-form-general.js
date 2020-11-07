"use strict";

const overlayNode = document.querySelector(`.img-upload__overlay`);
const scaleFieldSetNode = overlayNode.querySelector(`.img-upload__scale`);
const effectsSliderNode = overlayNode.querySelector(`.img-upload__effect-level`);
const effectsLineNode = effectsSliderNode.querySelector(`.effect-level__line`);
const imagePreview = overlayNode.querySelector(`.img-upload__preview img`);

window.uploadForm = {
  overlayNode,
  imagePreview,

  effectsSliderNode,
  effectsLineNode,
  effectsPinNode: effectsLineNode.querySelector(`.effect-level__pin`),
  effectsValueNode: effectsSliderNode.querySelector(`.effect-level__value`),

  scaleFieldSetNode,
  scaleSmallerNode: scaleFieldSetNode.querySelector(`.scale__control--smaller`),
  scaleBiggerNode: scaleFieldSetNode.querySelector(`.scale__control--bigger`),

  commentInputNode: overlayNode.querySelector(`.text__description`),
};
