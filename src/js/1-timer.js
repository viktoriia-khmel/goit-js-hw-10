'use strict';

import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate.getTime() < Date.now()) {
      button.disabled = true;
      iziToast.error({
        position: 'topRight',
        messageColor: 'white',
        backgroundColor: 'red',
        message: 'Please choose a date in the future',
      });
    } else {
      button.disabled = false;
    }
  },
};

const dateTimeInput = document.querySelector('#datetime-picker');

flatpickr(dateTimeInput, options);

const button = document.querySelector('button');
const elSeconds = document.querySelector('span.value[data-seconds]');
const elMinutes = document.querySelector('span.value[data-minutes]');
const elHours = document.querySelector('span.value[data-hours]');
const elDays = document.querySelector('span.value[data-days]');

let userSelectedDate;

button.disabled = true;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  elSeconds.textContent = String(seconds).padStart(2, '0');
  elMinutes.textContent = String(minutes).padStart(2, '0');
  elHours.textContent = String(hours).padStart(2, '0');
  elDays.textContent = String(days).padStart(2, '0');
}

function handleClick(event) {
  dateTimeInput.disabled = true;
  button.disabled = true;

  const intervalId = setInterval(() => {
    let diff = userSelectedDate - Date.now();

    if (diff <= 0) {
      dateTimeInput.disabled = false;
      clearInterval(intervalId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timeLeft = convertMs(diff);

    updateTimerDisplay(timeLeft);
  }, 1000);
}

button.addEventListener('click', handleClick);
