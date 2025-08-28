/**
 * A lightweight Hindi/English virtual keyboard UI for web applications.
 * https://github.com/jsvibe/vkbd
 * 
 * Date: 27-08-2025 10:55
 */
(function(global, factory) {

'use strict';

const vkbd = factory(global);
typeof module === 'object' && module.exports
  ? module.exports = vkbd
  : global.vkbd = vkbd;

}) (typeof window !== 'undefined' ? window : this, function(window) {

'use strict';

let openedVkbd, activeLang, activeElem;
let keyLocker = {};

const keys = [
  {
    "Digit1": {hi: {shift: "ऍ", alt: "",  as: "\u200D", value: "1"}, en: {shift: "!", alt: "", value: "1"}},
    "Digit2": {hi: {shift: "ॅ", alt: "", as: "\u200C", value: "2"}, en: {shift: "@", alt: "", value: "2"}},
    "Digit3": {hi: {shift: "्र", alt: "", as: "", value: "3"}, en: {shift: "#", alt: "", value: "3"}},
    "Digit4": {hi: {shift: "र्", alt: "₹", as: "", value: "4"}, en: {shift: "$", alt: "", value: "4"}},
    "Digit5": {hi: {shift: "ज्ञ", alt: "", as: "", value: "5"}, en: {shift: "%", alt: "", value: "5"}},
    "Digit6": {hi: {shift: "त्र", alt: "", as: "", value: "6"}, en: {shift: "^", alt: "", value: "6"}},
    "Digit7": {hi: {shift: "क्ष", alt: "", as: "", value: "7"}, en: {shift: "&", alt: "", value: "7"}},
    "Digit8": {hi: {shift: "श्र", alt: "", as: "", value: "8"}, en: {shift: "*", alt: "", value: "8"}},
    "Digit9": {hi: {shift: "(", alt: "", as: "", value: "9"}, en: {shift: "(", alt: "", value: "9"}},
    "Digit0": {hi: {shift: ")", alt: "", as: "", value: "0"}, en: {shift: ")", alt: "", value: "0"}},
    "Minus": {hi: {shift: "ः", alt: "ॄ", as: "", value: "-"}, en: {shift: "_", alt: "", value: "-"}},
    "Equal": {hi: {shift: "ऋ", alt: "", as: "ॠ", value: "ृ"}, en: {shift: "+", alt: "", value: "="}},
    "Backspace": "Del"
  },
  {
    "Tab": "Tab",
    "KeyQ": {hi: {shift: "औ", alt: "", as: "", value: "ौ"}, en: {shift: "Q", alt: "", value: "q"}},
    "KeyW": {hi: {shift: "ऐ", alt: "", as: "", value: "ै"}, en: {shift: "W", alt: "", value: "w"}},
    "KeyE": {hi: {shift: "आ", alt: "\u0951", as: "", value: "ा"}, en: {shift: "E", alt: "", value: "e"}},
    "KeyR": {hi: {shift: "ई", alt: "ॣ", as: "ॡ", value: "ी"}, en: {shift: "R", alt: "", value: "r"}},
    "KeyT": {hi: {shift: "ऊ", alt: "", as: "", value: "ू"}, en: {shift: "T", alt: "", value: "t"}},
    "KeyY": {hi: {shift: "भ", alt: "", as: "", value: "ब"}, en: {shift: "Y", alt: "", value: "y"}},
    "KeyU": {hi: {shift: "ङ", alt: "", as: "", value: "ह"}, en: {shift: "U", alt: "", value: "u"}},
    "KeyI": {hi: {shift: "घ", alt: "ग़", as: "", value: "ग"}, en: {shift: "I", alt: "", value: "i"}},
    "KeyO": {hi: {shift: "ध", alt: "", as: "", value: "द"}, en: {shift: "O", alt: "", value: "o"}},
    "KeyP": {hi: {shift: "झ", alt: "ज़", as: "", value: "ज"}, en: {shift: "P", alt: "", value: "p"}},
    "BracketLeft": {hi: {shift: "ढ", alt: "ड़", as: "ढ़", value: "ड"}, en: {shift: "{", alt: "", value: "["}},
    "BracketRight": {hi: {shift: "ञ", alt: "", as: "", value: "़"}, en: {shift: "}", alt: "", value: "]"}},
    "Backslash": {hi: {shift: "ऑ", alt: "", as: "", value: "ॉ"}, en: {shift: "|", alt: "", value: "\\"}},
  },
  {
    "CapsLock": "Caps",
    "KeyA": {hi: {shift: "ओ", alt: "", as: "", value: "ो"}, en: {shift: "A", alt: "", value: "a"}},
    "KeyS": {hi: {shift: "ए", alt: "", as: "", value: "े"}, en: {shift: "S", alt: "", value: "s"}},
    "KeyD": {hi: {shift: "अ", alt: "\u0952", as: "", value: "्"}, en: {shift: "D", alt: "", value: "d"}},
    "KeyF": {hi: {shift: "इ", alt: "ॢ", as: "ऌ", value: "ि"}, en: {shift: "F", alt: "", value: "f"}},
    "KeyG": {hi: {shift: "उ", alt: "", as: "", value: "ु"}, en: {shift: "G", alt: "", value: "g"}},
    "KeyH": {hi: {shift: "फ", alt: "", as: "फ़", value: "प"}, en: {shift: "H", alt: "", value: "h"}},
    "KeyJ": {hi: {shift: "", alt: "", as: "", value: "र"}, en: {shift: "J", alt: "", value: "j"}},
    "KeyK": {hi: {shift: "ख", alt: "क़", as: "ख़", value: "क"}, en: {shift: "K", alt: "", value: "k"}},
    "KeyL": {hi: {shift: "थ", alt: "", as: "", value: "त"}, en: {shift: "L", alt: "", value: "l"}},
    "Semicolon": {hi: {shift: "छ", alt: "", as: "", value: "च"}, en: {shift: ":", alt: "", value: ";"}},
    "Quote": {hi: {shift: "ठ", alt: "", as: "", value: "ट"}, en: {shift: "\"", alt: "", value: "'"}},
    "Enter": {hi: {shift: "\n", alt: "", as: "", value: "\n"}, en: {shift: "\n", alt: "", value: "\n"}},
  },
  {
    "ShiftLeft": "Shift",
    "KeyZ": {hi: {shift: "", alt: "", as: "", value: ""}, en: {shift: "Z", alt: "", value: "z"}},
    "KeyX": {hi: {shift: "ँ", alt: "", as: "ॐ", value: "ं"}, en: {shift: "X", alt: "", value: "x"}},
    "KeyC": {hi: {shift: "ण", alt: "", as: "", value: "म"}, en: {shift: "C", alt: "", value: "c"}},
    "KeyV": {hi: {shift: "", alt: "", as: "", value: "न"}, en: {shift: "V", alt: "", value: "v"}},
    "KeyB": {hi: {shift: "", alt: "", as: "", value: "व"}, en: {shift: "B", alt: "", value: "b"}},
    "KeyN": {hi: {shift: "", alt: "", as: "ळ", value: "ल"}, en: {shift: "N", alt: "", value: "n"}},
    "KeyM": {hi: {shift: "श", alt: "", as: "", value: "स"}, en: {shift: "M", alt: "", value: "m"}},
    "Comma": {hi: {shift: "ष", alt: "॰", as: "", value: ","}, en: {shift: "<", alt: "", value: ","}},
    "Period": {hi: {shift: "।", alt: "॥", as: "ऽ", value: "."}, en: {shift: ">", alt: "", value: "."}},
    "Slash": {hi: {shift: "", alt: "", as: "", value: "य"}, en: {shift: "?", alt: "", value: "/"}},
    "ShiftRight": "Shift",
  },
  {
    "AltLeft": "Alt",
    "Space": {hi: {shift: " ", alt: "", value: " "}, en: {shift: " ", alt: "", value: " "}},
    "AltRight": "Alt",
    "switch": "EN",
  }
];

const rSpecialKey = /^(Backspace|Tab|Backslash|CapsLock|Enter|Shift(Left|Right)|Space)$/i;
const rLockableKey = /^(Shift(Left|Right)|Alt(Left|Right)|CapsLock)$/i;
const rKeyHighlight = /^(Digit(5|6|7|8)|Alt(Left|Right)|switch)$/i;

const $ = function(selector, context) {
  return (context || document).querySelector(selector);
};

function vkbd(options) {
  return new vkbd.prototype.init(options || {});
}

vkbd.prototype = {
  init: function({lang, theme, themeVariant}) {
    this.lang = lang || "hi";
    this.theme = theme || "light";
    this.themeVariant = themeVariant || 1;
    activeLang = this.lang;
  },
  open: function(elem) {
    const vkbd = document.createElement("dialog");
    const cover = document.createElement("div");

    cover.classList.add("vkbd-outer-cover");
    vkbd.dataset["theme"] = this.theme;
    vkbd.open = true;
    vkbd.id = 'vkbd';

    activeElem = !elem.nodeType ? $(elem) : elem;

    document.querySelectorAll("input, textarea").forEach(function(el) {
      el.addEventListener("focus", function() {
        if (openedVkbd) {
          this.readOnly = true;
          activeElem = this;
        }
      });
    });

    // Close all previous opened virtual keyboard
    this.close();

    // Auto switch theme depend on system-themes
    if (this.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const setAutoTheme = function(media) {
        vkbd.dataset["theme"] = media.matches ? "dark" : "light";
      };

      mediaQuery.addEventListener("change", setAutoTheme);
      setAutoTheme(mediaQuery);
    }

    const wrapper = document.createElement("div");
    const topBar = wrapper.cloneNode();
    const kbdLayout = wrapper.cloneNode();
    
    kbdLayout.classList.add("keyboard-layouts");
    topBar.classList.add("top-bar");
    wrapper.classList.add("wrapper");

    topBar.innerHTML = 
      '<div class="themes">' +
        '<label for="variant1"><input type="radio" name="theme" id="variant1" hidden></label>' +
        '<label for="variant2"><input type="radio" name="theme" id="variant2" hidden></label>' +
        '<label for="variant3"><input type="radio" name="theme" id="variant3" hidden></label>' +
      '</div>' +
      '<div class="close">' +
        '<svg viewBox="0 0 24 24">' +
          '<line x1="18" y1="6" x2="6" y2="18"/>' +
          '<line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</div>';

    // Manipulating or Rendering Elements
    wrapper.append(topBar, kbdLayout);
    vkbd.appendChild(wrapper);
    cover.appendChild(vkbd);
    document.body.appendChild(cover);

    $(".close", vkbd).onclick = this.close;
    $("#variant" + this.themeVariant, vkbd).checked = true;

    // Creates a virtual keyboard layouts and key-structure
    createVkbdLayout(kbdLayout);
    createMovableVKbd(topBar, vkbd);

    activeElem.readOnly = true;
    openedVkbd = cover;
  },
  close: function() {
    document.querySelectorAll("input, textarea").forEach(function(el) {
      el.readOnly = false;
    });
    openedVkbd && openedVkbd.remove();
    openedVkbd = null;
  }
};

vkbd.prototype.init.prototype = vkbd.prototype;

function createVkbdLayout(vkbdLayout) {
  let i = 0, value, row, src, key, isSpecialKey;
  vkbdLayout.innerHTML = "";
  
  while((row = keys[i++])) {
    const kbdRow = document.createElement("div");
    kbdRow.classList.add("keyboard-row");

    for(key in row) {
      const lockableKey = key.replace(/(left|right)$/i, '').toLowerCase();
      const button = document.createElement("button");
      button.id = key;
      button.tabIndex = -1;
      src = row[key];

      if (keyLocker[lockableKey]) {
        button.classList.add("active");
      }

      if (typeof src === 'string') {
        button.innerHTML = src;
      } else {
        value = src[activeLang];

        if (activeLang === "hi") {
          value = keyLocker.shift && keyLocker.alt
            ? value.as
            : keyLocker.shift
              ? value.shift
              : keyLocker.alt
                ? value.alt
                : value.value;

          button.value = button.innerHTML = value;

        } else {
          value = keyLocker.capslock
            ? value.value.toUpperCase()
            : keyLocker.shift
              ? value.shift
              : value.value;

          button.value = button.innerHTML = value;
        }

        if (value === "\n") button.innerHTML = key;
      }

      if ((isSpecialKey = rSpecialKey.test(key)) || rKeyHighlight.test(key)) {
        isSpecialKey && button.classList.add("fg-1");
        button.classList.add("special-key");
      }

      button.addEventListener("click", function() {
        adjustVkbdLayout(this.id, this);
      });

      kbdRow.appendChild(button);
    }
    vkbdLayout.appendChild(kbdRow);
  }

  $("#switch", openedVkbd).innerHTML = ("EN ⇄ HI");
}

function adjustVkbdLayout(key, button) {

  if (rLockableKey.test(key) || key === "switch") {
    if (key === "switch") {
      activeLang = activeLang === "hi" ? "en" : "hi";
    } else {
      const lockableKey = key.replace(/(left|right)$/i, '').toLowerCase();
      const keyLocked = keyLocker[lockableKey];
      keyLocker[lockableKey] = keyLocked ? false : true;
    }
    createVkbdLayout($(".keyboard-layouts", openedVkbd));
  } else {
    key === "Backspace"
      ? backspaceAtCaret(activeElem)
      : insertAtCaret(activeElem, button.value);
  }
}

window.addEventListener("keyup", function({code}) {
  let activeBtn;
  if (openedVkbd && !rLockableKey.test(code) && (activeBtn = $("#" + code, openedVkbd))) {
    activeBtn.classList.remove("active");
  }
});

window.addEventListener("keydown", function(e) {
  let btn;

  if (openedVkbd) {

    // Hide keyboard when clicked escape button
    if (e.code === 'Escape') openedVkbd.remove();

    if ((btn = $("#" + e.code, openedVkbd))) btn.classList.add("active");
    adjustVkbdLayout(e.code, btn);
  }
});

function createMovableVKbd(target, vkbd) {
  function ready2Move(e) {
    const style = window.getComputedStyle(vkbd);
    const rectX = parseInt(style.left);
    const rectY = parseInt(style.top);

    e = e.touches && e.touches[0] || e;
    let x = e.clientX;
    let y = e.clientY;

    function startMove(e) {
      e.preventDefault();
      e = e.touches && e.touches[0] || e;

      let dx = e.clientX - x;
      let dy = e.clientY - y;

      vkbd.style.left = (rectX + dx) + 'px';
      vkbd.style.top = (rectY + dy) + 'px';
    }

    function cancelMove() {
      document.removeEventListener("mousemove", startMove);
      document.removeEventListener("touchmove", startMove);
      document.removeEventListener("mouseup", cancelMove);
      document.removeEventListener("touchend", cancelMove);
    }

    document.addEventListener("mousemove", startMove);
    document.addEventListener("touchmove", startMove, {passive: false});
    document.addEventListener("mouseup", cancelMove);
    document.addEventListener("touchend", cancelMove);
  }

  target.addEventListener("mousedown", ready2Move);
  target.addEventListener("touchstart", ready2Move);
}

function insertAtCaret(el, text){
  const [start, end] = [el.selectionStart ?? el.value.length, el.selectionEnd ?? el.value.length];
  const before = el.value.slice(0, start);
  const after  = el.value.slice(end);
  el.value = before + text + after;
  const newPos = start + text.length;
  el.setSelectionRange(newPos, newPos);
  el.dispatchEvent(new Event('input', {bubbles:true}));
  el.focus();
}

function backspaceAtCaret(el){
  const start = el.selectionStart ?? 0, end = el.selectionEnd ?? 0;
  if(start !== end){ // delete selection
    insertAtCaret(el, "");
  } else if(start > 0){
    el.setSelectionRange(start-1, end);
    insertAtCaret(el, "");
  }
}

return vkbd;
});