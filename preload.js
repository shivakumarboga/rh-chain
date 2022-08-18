const { ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  ipcRenderer.on('screenshot:captured', (e, imageData) => {
    document.getElementById('placeholder').src = imageData;
  });





  // Global variables
  const time_el = document.querySelector('.watch .time');
  document.getElementById('start').addEventListener('click', start);
  document.getElementById('stop').addEventListener('click', stop);
  document.getElementById('reset').addEventListener('click', reset);

  let seconds = 0;
  let interval = null;

  // Update the timer
  function timer() {
    seconds++;

    // Format our time
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    let secs = seconds % 60;

    if (secs < 10) secs = '0' + secs;
    if (mins < 10) mins = "0" + mins;
    if (hrs < 10) hrs = "0" + hrs;

    time_el.innerText = `${hrs}:${mins}:${secs}`;
  }

  function start() {
    if (interval) {
      return
    }

    interval = setInterval(timer, 1000);

    tm = window.setInterval(() => {
      ipcRenderer.send('screenshot:capture', {});
    }, 1000*60*10);// Every 10 Minutes screen capture
  }

  function stop() {
    clearInterval(interval);
    interval = null;
    window.clearInterval(tm);//screenshot
  }

  function reset() {
    stop();
    seconds = 0;
    time_el.innerText = '00:00:00';
  }

})
