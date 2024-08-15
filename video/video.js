/*
 * @Date: 2024-07-31 09:16:54
 * @LastEditors: e_liujianlong e_liujianlong@enn.cn
 * @LastEditTime: 2024-08-01 09:04:48
 * @FilePath: \javaScript\video.js
 * @Description: Do not edit
 */
const doms = {
  play: document.querySelector(".btnplay"),
  video: document.querySelector("video"),
  process: {
    processRange: document.querySelector(".processRange"),
    current: document.querySelector(".current"),
    total: document.querySelector(".total"),
  },
  rate: document.querySelector(".rate"),
  volume: {
    volumeRange: document.querySelector(".volumeRange"),
    volumeTxt: document.querySelector(".volumeTxt"),
  },
  save: {
    save: document.querySelector(".save"),
    load: document.querySelector(".load"),
  },
};

const formatTime = (sec) => {
  const h = Math.floor(sec / 3600);
  sec -= h * 3600;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec - m * 60);

  function _supplement0(val) {
    if (val < 10) {
      return "0" + val;
    }
    return val;
  }

  return `${_supplement0(h)}:${_supplement0(m)}:${_supplement0(s)}`;
};

const setProcess = () => {
  doms.process.current.textContent = formatTime(doms.video.currentTime);
  doms.process.total.textContent = formatTime(doms.video.duration);
  doms.process.processRange.value =
    (doms.video.currentTime / doms.video.duration) * 100;
};

const setRate = () => {
  const rate = doms.video.playbackRate;
  const btns = document.querySelectorAll(".rate button");
  for (let i = 0; i < btns.length; i++) {
    const r = +btns[i].dataset.rate;
    if (r === rate) {
      btns[i].classList.add("active");
    } else {
      btns[i].classList.remove("active");
    }
  }
};

const setVolume = () => {
  const volume = doms.video.volume;
  console.log(volume);
  doms.volume.volumeRange.value = volume * 100;
  doms.volume.volumeTxt.textContent = Math.floor(volume * 100) + "%";
};

const init = () => {
  setProcess();
  setRate();
  setVolume();
};

// 初始化
doms.video.addEventListener("loadeddata", () => {
  init();
});

doms.play.addEventListener("click", () => {
  if (doms.video.paused) {
    doms.video.play();
  } else {
    doms.video.pause();
  }
});

// 交互
doms.process.processRange.addEventListener("input", () => {
  doms.video.currentTime =
    (doms.process.processRange.value / 100) * doms.video.duration;
});

doms.video.addEventListener("timeupdate", () => {
  setProcess();
});

const btns = document.querySelectorAll(".rate button");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", () => {
    const rate = +btns[i].dataset.rate;
    doms.video.playbackRate = rate;
    setRate();
  });
}

doms.volume.volumeRange.addEventListener("input", () => {
  const volume = doms.volume.volumeRange.value / 100;
  doms.video.volume = volume;
  setVolume();
});

doms.save.save.addEventListener("click", () => {
  const videoInfo = {
    currentTime: doms.video.currentTime,
    volume: doms.video.volume,
    playbackRate: doms.video.playbackRate,
  };

  localStorage.setItem("videoInfo", JSON.stringify(videoInfo));
});

doms.save.load.addEventListener("click", () => {
  const videoInfo = JSON.parse(localStorage.getItem("videoInfo"));
  if (videoInfo) {
    doms.video.currentTime = videoInfo.currentTime;
    doms.video.volume = videoInfo.volume;
    doms.video.playbackRate = videoInfo.playbackRate;
    init();
  }
});
