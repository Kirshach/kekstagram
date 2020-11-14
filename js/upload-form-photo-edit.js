"use strict";

const SCALING_STEP = 25;
const MAX_SCALE = 100;
const MIN_SCALE = 25;
const MAX_EFFECT_VALUE = 100;
const DEFAULT_EFFECT_VALUE = MAX_EFFECT_VALUE;
const DEFAULT_SCALE_VALUE = 100;

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

const {uploadForm} = window;

const {
  overlayNode,
  effectsSliderNode, effectsLineNode, effectsPinNode, effectsValueNode,
  scaleFieldSetNode, scaleSmallerNode, scaleBiggerNode
} = uploadForm;

const {imagePreview} = window.uploadForm;
const effectsFill = overlayNode.querySelector(`.effect-level__depth`);
const scaleInputValue = scaleFieldSetNode.querySelector(`.scale__control--value`);

const resetScale = () => {
  setScale(null, DEFAULT_SCALE_VALUE);
};

const resetEffects = () => {
  setEffectType(null, `none`);
};

const resetSlider = () => {
  effectsPinNode.style.left = `${DEFAULT_EFFECT_VALUE}%`;
  effectsFill.style.width = `${DEFAULT_EFFECT_VALUE}%`;
  effectsValueNode.value = DEFAULT_EFFECT_VALUE;
};

const clearFormData = () => {
  resetScale();
  resetEffects();
  resetSlider();
};

//  Обработчик изменения размера изображения
const setScale = (evt, explicitValue) => {
  let scaleValue;
  if (explicitValue) {
    scaleValue = `${explicitValue}%`;
  } else if (evt.target === scaleSmallerNode) {
    scaleValue = `${Math.max(parseInt(scaleInputValue.value, 10) - SCALING_STEP, MIN_SCALE)}%`;
  } else if (evt.target === scaleBiggerNode) {
    scaleValue = `${Math.min(parseInt(scaleInputValue.value, 10) + SCALING_STEP, MAX_SCALE)}%`;
  }
  scaleInputValue.value = scaleValue;
  imagePreview.style.transform = `scale(${parseInt(scaleInputValue.value, 10) / 100})`;
};

//  Обработчики фильтров
const getEffectValueString = (effect, value) => {
  let output;
  if (effect !== `none`) {
    const effectObject = effectsMap[effect];
    const effectName = effectObject.name;
    const effectValue = (effectObject.max - effectObject.min) * (value / 100) + effectObject.min;
    const effectUnit = effectObject.unit;
    output = `${effectName}(${effectValue}${effectUnit})`;
  } else {
    output = `none`;
  }
  return output;
};

const setSliderVisibility = (effect) => {
  if (effect === `none`) {
    effectsSliderNode.classList.add(`hidden`);
  } else if (effectsSliderNode.classList.contains(`hidden`)) {
    effectsSliderNode.classList.remove(`hidden`);
  }
};

const setEffectType = (evt, explicitEffect) => {
  let newEffect = explicitEffect ? explicitEffect : evt.target.value;
  imagePreview.className = `effects__preview--${newEffect}`;
  imagePreview.dataset.effect = newEffect;

  setEffectValue(DEFAULT_EFFECT_VALUE);
  applyEffect();
  resetSlider();
  setSliderVisibility(newEffect);
};

const setEffectValue = (value) => {
  effectsValueNode.value = value;
};

const applyEffect = () => {
  const effect = imagePreview.dataset.effect;
  const value = effectsValueNode.value;
  imagePreview.style.filter = getEffectValueString(effect, value);
};

const movePin = (mouseDownEvt) => {
  mouseDownEvt.preventDefault();
  const startPinOffsetX = effectsPinNode.offsetLeft;
  const maxOffsetX = effectsLineNode.offsetWidth;
  const startClientX = mouseDownEvt.clientX;

  const onMouseMove = (mouseMoveEvt) => {
    mouseDownEvt.stopPropagation();
    const shiftX = mouseMoveEvt.clientX - startClientX;
    const newPinOffsetX = Math.min(Math.max(0, startPinOffsetX + shiftX), maxOffsetX);
    effectsPinNode.style.left = `${newPinOffsetX}px`;
    effectsFill.style.width = `${newPinOffsetX}px`;
    setEffectValue(Math.round((newPinOffsetX / maxOffsetX) * 100));
    applyEffect();
  };
  const onMouseUp = () => {
    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };
  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
};

window.uploadForm.photoEdit = {
  resetScale, resetEffects, resetSlider, clearFormData,
  setScale, setEffectType, applyEffect, movePin,
};

