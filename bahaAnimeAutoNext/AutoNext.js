/*
code for bookmark

javascript:var a=document.createElement('script');a.src='https://rawgit.com/chiuhans111/whatProject/master/bahaAnimeAutoNext/AutoNext.js';document.body.appendChild(a)

*/
function hacker(target) {
  var infospan = document.createElement('span');
  function info(text) {
    infospan.textContent = [
      ...arguments
    ].map(a => a.toString()).join(' ');
    target.console.log(...arguments);
  }
  var me = this;
  this.target = target;
  function frameLoaded(frame, onload) {
    setTimeout(function () {
      try {
        info(frame.document.readyState);
        if (frame.document.readyState == 'complete') onload(frame);
        frame.document.onreadystatechange = function (event) {
          if (frame.document.readyState == 'complete') onload(frame);
        }
      } catch (exception) {
        info(exception);
      }
    }, 500);
  }
  function prepare(window, callback) {
    info('開始準備下一番');
    var nextVideo = window.document.querySelector('.playing').nextSibling;
    if (nextVideo) {
      var url = nextVideo.querySelector('a').href;
      frame = window.document.createElement('iframe');
      frame.hidden = true;
      window.document.body.appendChild(frame);
      frame.src = url;
      frameLoaded(frame.contentWindow, function (content) {
        window.setTimeout(function () {
          process(content, function () {
            frame.outerHTML = '';
            callback(url);
          }, window);
        }, 0);
      });
    }
  }
  function process(window, callback) {
    window.alert = function () {
    };
    // 分級按鈕
    try {
      window.document.querySelector('#adult').click();
    } catch (e) {
      try {
        window.document.querySelector('.choose > a').click();
      } catch (e) {
      }
    }
    // 靜音與撥放
    var muteBtn = window.document.querySelector('.vjs-mute-control');
    var playBtn = window.document.querySelector('.vjs-play-control');
    // 畫面或許未載入
    if (muteBtn == null || playBtn == null) {
      info('等待頁面載入');
      target.setTimeout(function () {
        process(window, callback);
      }, 400);
      return;
    }
    info('載入完成');
    function isMute() {
      return muteBtn.classList.contains('vjs-vol-0');
    }
    function isPlaying() {
      return playBtn.classList.contains('vjs-playing');
    }
    
    
    
    function detectADs() {
      info('偵測廣告');
      var skipBtn = window.document.querySelector('.vast-skip-button');
      if (!isMute()) muteBtn.click();
      if (!isPlaying()) playBtn.click();
      if (skipBtn == null) {
        info('無廣告');
        if (isMute()) muteBtn.click();
        if (isPlaying()) playBtn.click();
        callback();
      } else {
        info('有廣告');
        skipAd(skipBtn, function () {
          if (isMute()) muteBtn.click();
          if (isPlaying()) playBtn.click();
          callback();
        });
      }
    }
    target.setTimeout(detectADs, 1000);
  }
  function skipAd(btn, callback) {
    if (btn.href == 'http://ani.gamer.com.tw/animePay.php') target.setTimeout(function () {
      skipAd(btn, callback);
      info('等待廣告', btn.textContent);
    }, 1000);
     else {
      info('解除');
      btn.click();
      callback();
    }
  }
  this.hack = function () {
    info('hacking');
    process(target, function () {
      info('hacking start');
      inject(target);
    }, target);
  }
  function inject(window) {
    var currentTimeNode = window.document.querySelector('.vjs-current-time-display');
    var durationTimeNode = window.document.querySelector('.vjs-duration-display');
    function getPlayTime() {
      var current = currentTimeNode.childNodes[1].textContent.trim().split(':').map(x => + x).reduce((a, b) => a * 60 + b);
      var duration = durationTimeNode.childNodes[1].textContent.trim().split(':').map(x => + x).reduce((a, b) => a * 60 + b);
      return {
        current: current,
        duration: duration,
        remain: duration - current
      }
    }
    function wait(callback) {
      var time = getPlayTime();
      info(time.remain);
      if (time.duration == 0 || time.remain > 200) {
        target.setTimeout(function () {
          wait(callback);
        }, 5000);
      } else {
        callback();
      }
    }
    wait(function () {
      prepare(window, function (url) {
        var btn = window.document.createElement('button');
        btn.textContent = '點我進入下一番';
        btn.onclick = function () {
          var next = window.open(url);
          frameLoaded(next, function () {
            setTimeout(function () {
              next.eval(hacker.toString() + 'var h = new hacker(this);h.hack();');
            }, 1000);
          });
        }
        document.querySelector('.vjs-control-bar').appendChild(btn);
      })
    })
  }
}
var h = new hacker(this);
h.hack();