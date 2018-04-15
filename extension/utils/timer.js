// 节流： 连续发生函数的触发事件时不立刻执行
export const throttle = (fn, delay = 500) => {
  if (!fn) return;
  let timer = null;
  // 返回被反复执行的函数
  return (...rest) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...rest), delay);
  };
};

// 去抖： 在节流的基础上设定最长等待时间，在这段时间内至少执行一次函数
export const debounce = (fn, delay = 500, mustRunDelay = 1000) => {
  if (!fn) return;
  let timer = null;
  let t_start;
  return (...rest) => {
    const t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) t_start = t_curr;
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(null, rest);
      t_start = t_curr;
    } else {
      timer = setTimeout(fn.bind(null, ...rest), delay);
    }
  };
};
