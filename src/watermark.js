export default watermark;

function watermark(_option) {
  _w(_option);

  // 当页面大小变化时，重绘水印
  window.addEventListener(
    "resize",
    debounce((e) => {
      _w(_option);
    })
  );
}

function _w(_option) {
  const option = {
    fontSize: 40,
    fontFamliy: "serif",

    textAlign: "start",
    textBaseline: "top",
    direction: "ltr",

    text: "hello wrold",
    fillStyle: "#a1a1a1",

    deg: -45, // 倾斜角度
    xMargin: 20, // 水印之间的间距
    yMargin: 70,
  };

  Object.assign(option, _option);

  const body = document.body;
  let { width: wBody, height: hBody } = body.getBoundingClientRect();

  const fragment = document.createDocumentFragment();
  const canvas = document.createElement("canvas");

  canvas.setAttribute("id", "watermark");
  canvas.width = wBody;
  canvas.height = hBody;
  canvas.style.backgroundColor = "transparent";
  canvas.style.display = "block";
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.userSelect = "none";
  canvas.style.pointerEvents = "none";

  const ctx = canvas.getContext("2d");
  ctx.font = `${option.fontSize}px ${option.fontFamliy}`;
  const { width: wText } = ctx.measureText(option.text);
  const hText = option.fontSize;

  // 根据水印之间的间距计算需要生成多少个水印
  const rowTotal = Math.ceil(wBody / (wText + option.xMargin));
  const columnTotal = Math.ceil(hBody / (hText + option.yMargin));

  ctx.fillStyle = option.fillStyle;

  for (let i = 0; i < rowTotal; i++) {
    for (let j = 0; j < columnTotal; j++) {
      const [xText, yText] = [
        (wText + option.xMargin) * i - wText / 2,
        (hText + option.yMargin) * j,
      ];

      ctx.translate(xText + wText / 2, yText - hText / 2);
      const deg = (Math.PI / 180) * option.deg;
      ctx.rotate(deg, deg);
      ctx.fillText(option.text, -wText / 2, hText / 2);

      ctx.rotate(-deg, -deg);
      ctx.translate(-(xText + wText / 2), -(yText - hText / 2));
    }
  }

  fragment.append(canvas);

  const _watermark = document.querySelector("#watermark");
  if (_watermark) {
    body.removeChild(_watermark);
  }
  body.append(fragment);
}

/**
 * 防抖
 * @param func
 * @param delay
 * @param immediate
 */
function debounce(func, delay, immediate = false) {
  let timer = null;
  const isDone = immediate;
  return function () {
    //@ts-ignore
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    // 立即触发
    if (immediate) {
      func.apply(context, args);
      immediate = false;
    }
    timer = setTimeout(() => {
      func.apply(context, args);
      if (isDone) {
        immediate = true;
      }
    }, delay);
  };
}
