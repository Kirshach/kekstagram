"use strict";

(function () {

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
    effectsSlider, effectsLine, effectsPin, effectsValue,
    scaleFieldSet, scaleSmaller, scaleBigger
  } = uploadForm;

  const imagePreview = overlayNode.querySelector(`.img-upload__preview img`);
  const effectsFill = overlayNode.querySelector(`.effect-level__depth`);
  const scaleInputValue = scaleFieldSet.querySelector(`.scale__control--value`);

  const resetScale = function () {
    setScale(null, DEFAULT_SCALE_VALUE);
  };

  const resetEffects = function () {
    setEffectType(null, `none`);
  };

  const resetSlider = function () {
    effectsPin.style.left = `${DEFAULT_EFFECT_VALUE}%`;
    effectsFill.style.width = `${DEFAULT_EFFECT_VALUE}%`;
    effectsValue.value = DEFAULT_EFFECT_VALUE;
  };

  const resetForm = function () {
    resetScale();
    resetEffects();
    resetSlider();
  };

  //  Обработчик изменения размера изображения
  const setScale = function (evt, explicitValue) {
    let scaleValue;
    if (explicitValue) {
      scaleValue = `${explicitValue}%`;
    } else if (evt.target === scaleSmaller) {
      scaleValue = `${Math.max(parseInt(scaleInputValue.value, 10) - SCALING_STEP, MIN_SCALE)}%`;
    } else if (evt.target === scaleBigger) {
      scaleValue = `${Math.min(parseInt(scaleInputValue.value, 10) + SCALING_STEP, MAX_SCALE)}%`;
    }
    scaleInputValue.value = scaleValue;
    imagePreview.style.transform = `scale(${parseInt(scaleInputValue.value, 10) / 100})`;
  };

  //  Обработчики фильтров
  const getEffectValueString = function (effect, value) {
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

  const setSliderVisibility = function (effect) {
    if (effect === `none`) {
      effectsSlider.classList.add(`hidden`);
    } else if (effectsSlider.classList.contains(`hidden`)) {
      effectsSlider.classList.remove(`hidden`);
    }
  };

  const setEffectType = function (evt, explicitEffect) {
    let newEffect = explicitEffect ? explicitEffect : evt.target.value;
    imagePreview.className = `effects__preview--${newEffect}`;
    imagePreview.dataset.effect = newEffect;

    setEffectValue(DEFAULT_EFFECT_VALUE);
    applyEffect();
    resetSlider();
    setSliderVisibility(newEffect);
  };

  const setEffectValue = function (value) {
    effectsValue.value = value;
  };

  const applyEffect = function () {
    const effect = imagePreview.dataset.effect;
    const value = effectsValue.value;
    imagePreview.style.filter = getEffectValueString(effect, value);
  };

  const movePin = function (mouseDownEvt) {
    mouseDownEvt.preventDefault();
    const startPinOffsetX = effectsPin.offsetLeft;
    const maxOffsetX = effectsLine.offsetWidth;
    const startClientX = mouseDownEvt.clientX;

    const onMouseMove = function (mouseMoveEvt) {
      mouseDownEvt.stopPropagation();
      const shiftX = mouseMoveEvt.clientX - startClientX;
      const newPinOffsetX = Math.min(Math.max(0, startPinOffsetX + shiftX), maxOffsetX);
      effectsPin.style.left = `${newPinOffsetX}px`;
      effectsFill.style.width = `${newPinOffsetX}px`;
      setEffectValue(Math.round((newPinOffsetX / maxOffsetX) * 100));
      applyEffect();
    };
    const onMouseUp = function () {
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };
    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  };

  window.uploadForm.photoEdit = {
    resetScale, resetEffects, resetSlider, resetForm,
    setScale, setEffectType, applyEffect, movePin,
  };

})();
