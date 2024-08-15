const doms = {
  audio: document.querySelector(".audioDom"),
  container: document.querySelector(".container"),
  ul: document.querySelector(".container ul"),
};

/**
 * 格式化时间
 * @params {string} time 时间
 * @returns 秒数
 */
const formatTime = (time) => {
  if (!time) return 0;
  const arr = time.split(":");
  return +(arr[0] * 60) + +arr[1];
};

/**
 * 格式化歌词
 * @param { String } lrc 歌词数据
 * @returns 返回歌词对象数组 包含当前歌词时间和歌词内容
 */
const formatLrc = (lrc) => {
  const licList = lrc?.split("\n");
  const result = licList.reduce((list, cur) => {
    const lrcItem = cur.split("]");
    const time = formatTime(lrcItem[0].slice(1));
    const words = lrcItem[1];
    list.push({
      time,
      words,
    });
    return list;
  }, []);

  return result;
};

const lrcData = formatLrc(lrc);

/**
 * 生成歌词
 * @param {Array} data 歌词数组
 */
const createLiLrc = (data) => {
  const f = document.createDocumentFragment();
  for (let i = 0; i < data.length; i++) {
    const li = document.createElement("li");
    li.textContent = data[i].words;
    f.appendChild(li);
  }

  doms.ul.appendChild(f);
};

/**
 * 判断当前播放时间应该是哪一句歌词
 * @param { Array } data 歌词数组
 * @returns 返回当前高亮歌词索引
 */
const isPlayWords = (data) => {
  const currentTime = doms.audio.currentTime;
  for (let i = 0; i < data.length; i++) {
    /**
     * 如果当前播放的时间小于歌词的设定时间 那他的上一句就是正在播放的歌词
     * 如果当前播放时间都小于歌词的设定时间说明还没到一句歌词播放时间 返回-1
     * 如果当前播放时间都大于歌词的设定时间说明已经到一句歌词播放时间 返回当前歌词索引
     */
    if (data[i].time > currentTime) {
      return i - 1;
    }
  }

  return data.length - 1;
};

// 先生成元素
createLiLrc(lrcData);

// 在计算各个元素高度
const liHeight = doms.ul.children[0].clientHeight;
const ulHeight = doms.ul.clientHeight;
const containerHeight = doms.container.clientHeight;
const maxOffset = ulHeight - containerHeight;
/**
 * 设定ul的偏移量
 */
const setOffset = (lrcData) => {
  const index = isPlayWords(lrcData);
  /**
   * 前面的歌词 * 每一行的高度 - 大容器高度的一半 + 自身高度的一半
   */
  let offset = index * liHeight - containerHeight / 2 + liHeight / 2;

  if (offset < 0) offset = 0;
  if (offset > maxOffset) offset = maxOffset;
  doms.ul.style.transform = `translateY(${-offset}px)`;
  const li = doms.ul.querySelector(".active");
  if (li) {
    li.classList.remove("active");
  }
  const lis = doms.ul.children;
  lis[index] && lis[index].classList.add("active");
};

doms.audio.addEventListener("timeupdate", () => {
  setOffset(lrcData);
});
