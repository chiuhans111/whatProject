function scrollBottomDistance() {
    return $("#contents").height() - ($("#main").scrollTop() + $("#main").height())
}
function scrollToBottomDistance(e) {
    return e.children().height() - (e.scrollTop() + e.height())
}
function scrollToBottom(e) {
    value = e.children().height() - e.height() - 1,
        setTimeout(function () {
            e.scrollTop(value)
        })
}
function scrollToMainBottom(e) {
    beLeave ? $("#main").stop(!0, !0) : $("#main").stop(),
        setTimeout(function () {
            scrollTarget = $("#contents").height() - $("#main").height() - 1,
                e ? $("#main").animate({
                    scrollTop: scrollTarget
                }, e, "easeOutCirc") : $("#main").scrollTop(scrollTarget)
        })
}
function wssChecker() {
    var e = window.WebSocket || window.MozWebSocket;
    return !(!e || 2 !== e.CLOSING)
}
function updateState(e) {
    "typing" in e && ($(".typing")[0] || ($("#messages").append("<div class='" + sender_class[2] + " typing'>\u6253\u5b57\u4e2d...</div>"),
        scrollBottomDistance() < 110 && scrollToMainBottom(200)),
        clearTimeout(typing_end),
        typing_end = setTimeout(function () {
            $(".typing").slideDown(200, function () {
                $(".typing").remove()
            })
        }, 6e3)),
        "last_read" in e && e.last_read >= last_send_msg_time && $(".read").last().html("\u5df2\u9001\u9054<br/>").show()
}
function genNewMessageID() {
    return Math.random().toString(36).substr(2, 9)
}
function newMessage(e) {
    if (!beLeave) {
        Array.isArray(e) || (e = [e]);
        var t = scrollBottomDistance()
            , n = ""
            , o = [];
        if (console.log("#message:", e.length),
            e.forEach(function (t) {
                if (text = t.message,
                    u = new Date(parseInt(t.time)),
                    0 != t.sender && "image" != t.type && "audio" != t.type) {
                    if (text = text.replace(/https?:\/\/[-a-zA-Z0-9@:%_\+.~#?&=]{2,256}\.[a-z]{2,63}(\/[\/-a-zA-Z0-9@:%_\+.~#?&=;]*)?/gi, "<a target='_blank' href='$&'>$&</a>").trim(),
                        text = text.replace(/  /g, "&nbsp;&nbsp;"),
                        text = text.replace(/&nbsp; /g, "&nbsp;&nbsp;"),
                        lineCount = (text.match(/\n/g) || []).length,
                        10 > lineCount)
                        text = text.replace(/\n/g, "<br>");
                    else
                        for (i = 0; 10 > i; i++)
                            text = text.replace(/\n/, "<br>");
                    if ("id" in t && t.id in messageHistory)
                        return void console.log("message duplicate:", t);
                    "id" in t && (messageHistory[t.id] = sender_name[t.sender] + ": " + t.message)
                } else
                    "chat_otherleave" == t.status && (beLeave = !0,
                        $("#sendButton>input").val("\u56de\u5831"));
                if ("image" == t.type && !t.local) {
                    var r = 1 == e.length ? "scrollToMainBottom(200);" : "";
                    text = '<a href="' + t.original + '" class="image"><img class="userImage" onload="' + r + '" src="' + t.thumbnail + '" data-src="' + text + '" /></a>'
                }
                if ("audio" != t.type || t.local || (text = '<div onclick="playVoice(this);" class="voicePlayer" data-src="' + t.original + '"><i class="material-icons">&#xE037;</i></div>'),
                    1 != t.sender || t.local || my_msg_count++ ,
                    1 == t.sender && $("#msg" + t.msg_id)[0]) {
                    var a = $("#msg" + t.msg_id);
                    a.removeClass("local"),
                        a.attr("mid", t.id)
                } else {
                    comment_html = "",
                        0 != t.sender && (comment_html = "<div class='" + sender_class[t.sender] + " comment'>" + (1 == t.sender ? "<span class='read'>\u5df2\u9001\u51fa<br/></span>" : "") + "<span class='hidden_text'> (</span>" + ("device" in t && 2 == t.sender ? "<div class='mobile'>" + sender_device[t.device] + "</div>" : "") + '<time class="timeago" datetime="' + u.toJSON() + "\"></time><span class='hidden_text'>)<br/></span></div>"),
                        n = "<div class='" + sender_class[t.sender] + " text " + (t.local ? "local " : "") + (t.type ? t.type + " " : "") + "' " + ("msg_id" in t ? " id='msg" + t.msg_id.toString() + "'" : "") + ("id" in t ? " mid=" + t.id.toString() : "") + ">" + ("<span class='hidden_text'>" + sender_name[t.sender] + "\uff1a</span>") + text + comment_html + "</div>";
                    var s = $(n)
                        , l = $(".timeago", s).attr("datetime");
                    if (l) {
                        var c, u = new Date(l);
                        if (o.length > 0)
                            c = new Date($(".timeago", o[o.length - 1]).attr("datetime"));
                        else {
                            var d = $("[mid]").last();
                            c = new Date($(".timeago", d).attr("datetime"))
                        }
                        c && c.getDate() != u.getDate() && (o.push($("<div class='" + sender_class[0] + " text timediff'></div>")),
                            console.log("date", u, c))
                    }
                    o.push(s)
                }
                "id" in t && (id = t.id,
                    id > msgMaxID && (msgMaxID = id),
                    msgMinID > id && (msgMinID = id)),
                    last_sender = t.sender,
                    "leave" in t && (is_leave = t.leave),
                    "time" in t && (last_msg_time = t.time),
                    "time" in t && 1 == last_sender && (last_send_msg_time = t.time)
            }),
            is_typing = !!$(".typing")[0],
            $(".typing").remove(),
            $(".mobile").hide(),
            clear_messages && (messages_box.children().remove(),
                $("#messages").html('\n<div class="loadMoreButton">\n  <input type="button" value="\u8f09\u5165\u4e2d..." onclick="loadMore();" />\n</div>\n      ')),
            lastMDOM = o[o.length - 1],
            lastMid = lastMDOM ? lastMDOM.attr("mid") : null,
            console.log("lastMid", lastMid, "lastMDOM", lastMDOM, "msgMaxID", msgMaxID, o.length),
            lastMid && msgMaxID - 1 > lastMid)
            for (console.log("prepend"); o.length > 0;)
                o.pop().prependTo(messages_box);
        else {
            for (; o.length > maxShowMessage;)
                o.shift().appendTo(messages_box);
            $("#messages").append(o),
                updateMessagesCount(),
                $(".text", "blockquote").size() > maxShowMessage + maxShowMessageMargin && setTimeout(function () {
                    $(".text", "blockquote").slice(0, -maxShowMessage).appendTo(messages_box),
                        updateMessagesCount()
                }, 500),
                updateDateString(),
                $(".mobile").last().show(),
                is_typing && 2 != last_sender && $("#messages").append("<div class='" + sender_class[2] + " typing'>\u6253\u5b57\u4e2d...</div>"),
                (2 != last_sender || 100 > t || clear_messages) && scrollToMainBottom(is_reconnection ? 0 : 200),
                is_reconnection && 0 != last_sender && (is_reconnection = !1),
                clear_messages = !1,
                2 == last_sender && send_last_read(),
                windowFocused || (new_msg_count += e.length,
                    updateTitle(),
                    2 == last_sender && playAudio && 1 == e.length && audio.play()),
                $("blockquote").magnificPopup({
                    delegate: "a.image",
                    type: "image",
                    closeOnContentClick: !1,
                    closeBtnInside: !1,
                    mainClass: "mfp-with-zoom mfp-img-mobile",
                    image: {
                        verticalFit: !0
                    },
                    gallery: {
                        enabled: !0
                    },
                    zoom: {
                        enabled: !0,
                        duration: 300,
                        opener: function (e) {
                            return e.find("img")
                        }
                    }
                })
        }
    }
}
function updateMessagesCount() {
    var e = $("[mid]").first().attr("mid");
    e > 0 ? ($(".loadMoreButton > input").prop("value", "\u8f09\u5165\u4e4b\u524d\u8a0a\u606f (" + e + "\u5247)"),
        $(".loadMoreButton").show()) : $(".loadMoreButton").hide()
}
function loadMore() {
    orgHeight = $("blockquote").height(),
        $(".text", messages_box).slice(-loadMoreMessageCount).insertAfter($("div.loadMoreButton"));
    var e = $("[mid]").first();
    e.prev().hasClass("timediff") || e.before($("<div class='" + sender_class[0] + " text timediff'></div>")),
        updateMessagesCount(),
        updateDateString(),
        $("#main").scrollTop($("#main").scrollTop() + $("blockquote").height() - orgHeight),
        minShowID = $("[mid]").first().attr("mid"),
        msgMinID > 0 && 2 * loadMoreMessageCount > minShowID - msgMinID && (start = msgMinID - loadMoreMessageCount,
            start = 0 > start ? 0 : start,
            dispatcher.trigger("get_message", {
                start: start,
                end: msgMinID - 1
            }),
            console.log("minimum message id:", msgMinID)),
        ga("send", "event", "chat", "load_more", null, loadMoreCount),
        loadMoreCount++
}
function displaySystemMessage(e) {
    newMessage({
        message: e,
        sender: 0
    })
}
function displayMyMessage(e, t) {
    e = jQuery("<div/>").text(e).html(),
        newMessage({
            message: e,
            sender: 1,
            msg_id: t,
            time: Date.now(),
            local: !0
        })
}
function startChat() {
    return msgMaxID = 0,
        msgMinID = 1e6,
        last_msg_time = 0,
        last_read_send = 0,
        last_send_typing = 0,
        last_send_msg_time = 1e33,
        msg_id = 1,
        msg_count = 0,
        my_msg_count = 0,
        messages_box = $("<div>"),
        maxShowMessage = 30,
        maxShowMessageMargin = 50,
        loadMoreMessageCount = 250,
        loadMoreCount = 1,
        my_msg_count = 0,
        $("#main").scrollTop() > 1 ? void $("#main").animate({
            scrollTop: 1
        }, 500, function () {
            console.log("scroll", $("#main").scrollTop()),
                $("#help").hide(),
                startChat()
        }) : ($("#help").hide(),
            $("#sendBox,blockquote").attr("style", "display: block !important"),
            $("#startButton").fadeTo(500, 0),
            $("#main").css("height", window.innerHeight + "px"),
            $("#main").animate({
                height: window.innerHeight - 50 + 2
            }, 400, "easeInQuad", function () {
                console.log("clickStartChat5", $("#main").scrollTop()),
                    $("#main").css("height", "calc(100% - 50px)"),
                    createWebSocket(),
                    $(".buttons").hide(),
                    window.mobilecheck() || $("#messageInput").focus()
            }),
            void ga("send", "event", "chat", "start"))
}
function clickStartChat() {
    chatStarted || dispatcher || (chatStarted = !0,
        beLeave = !1,
        document.getElementById("keyInput").readOnly = !0,
        key = $("#keyInput").val(),
        Cookie.set("_key", encodeURIComponent(key)),
        ga("set", "dimension2", key),
        startChat(),
        "" != key && ga("send", "event", "chat", "key", key, 1))
}
function start_help() {
    $("#help").show(),
        $("#main").animate({
            scrollTop: $(".bg-image").height()
        }, 500),
        ga("send", "event", "chat", "openhelp")
}
function connect_watchdog() {
    !dispatcher || "disconnected" != dispatcher.state || !windowFocused && window.mobilecheck() || (is_reconnection = !0,
        createWebSocket())
}
function resetTimer() {
    clearInterval(watchdog),
        watchdog = setInterval(function () {
            connect_watchdog()
        }, 1500),
        clearInterval(updater),
        updater = setInterval(function () {
            state_updater()
        }, 1e3),
        msgMaxID = 0,
        msgMinID = 1e6
}
function state_updater() {
    windowFocused && !$(".buttons").is(":visible") ? (disconnected = !dispatcher || "connected" != dispatcher.state,
        disconnected && !$("#connecting").is(":visible") ? ($("#connecting").offset({
            top: "-40px"
        }),
            $("#connecting").fadeTo(0, 0),
            $("#connecting").show().fadeTo(200, 1)) : !disconnected && $("#connecting").is(":visible") && $("#connecting").fadeTo(200, 0, function () {
                $("#connecting").hide()
            })) : $("#connecting").hide()
}
function send_last_read() {
    dispatcher && last_read_send != last_msg_time && (dispatcher.trigger("update_state", {
        last_read: last_msg_time
    }),
        last_read_send = last_msg_time)
}
function send_typing() {
    dispatcher && Date.now() - last_send_typing > 4e3 && (last_send_typing = Date.now(),
        dispatcher.trigger("update_state", {
            typing: !0
        }))
}
function createWebSocket() {
    resetTimer(),
        dispatcher = new WebSocketRails(window.location.host + "/websocket"),
        dispatcher.on_open = function (e) {
            console.log("Connection has been established: ", e),
                clear_messages = !0,
                messageHistory = {},
                new_msg_count = 0,
                dispatcher.bind("update_state", updateState),
                dispatcher.bind("new_message", newMessage)
        }
        ,
        dispatcher._conn.on_close = function (e) {
            console.log("Connection has been closed: ", e),
                dispatcher && (dispatcher.state = "disconnected")
        }
        ,
        dispatcher._conn.on_error = function (e) {
            console.log("error: ", e)
        }
}
function sendEvents() {
    msg_count > 0 && (ga("send", "event", "chat", "send", null, msg_count),
        msg_count = 0)
}
function sendMessage() {
    if (beLeave)
        $("#messageInput").blur(),
            setTimeout(function () {
                report()
            }, 300);
    else {
        var e = $("#messageInput").val().substring(0, 500);
        dispatcher && "connected" == dispatcher.state && !is_leave && 0 != e.length && (msg_id = genNewMessageID(),
            dispatcher.trigger("new_message", {
                message: e,
                msg_id: msg_id
            }),
            $("#messageInput").val(""),
            $("#messageInput").focus(),
            last_send_typing = 0,
            displayMyMessage(e, msg_id),
            msg_count++)
    }
}
function sendImage(e, t, n, i, o) {
    beLeave || dispatcher && "connected" == dispatcher.state && !is_leave && dispatcher.trigger("new_message", {
        message: t,
        width: n,
        height: i,
        type: "image",
        deletehsah: o,
        msg_id: e
    })
}
function sendAudio(e, t, n) {
    beLeave || dispatcher && "connected" == dispatcher.state && !is_leave && dispatcher.trigger("new_message", {
        message: t,
        type: "audio",
        duration: 1e3 * n,
        msg_id: e
    })
}
function padLeft(e, t) {
    return e = "" + e,
        e.length >= t ? e : new Array(t - e.length + 1).join("0") + e
}
function changePerson() {
    beLeave ? leave() : isbluring && window.mobilecheck() ? setTimeout(function () {
        popupLeaveDialog()
    }, 500) : popupLeaveDialog()
}
function insertToolbar() {
    hasToobar = $("#messages").children().last().hasClass("toolbar"),
        activeToolbar = $(".toolbar.active"),
        activeToolbar.slideUp(200, function () {
            this.remove()
        }),
        hasToobar || ($("#messages").append($(".original").clone().removeClass("original").addClass("active")),
            scrollToMainBottom(200))
}
function upload_image(e) {
    if (e && e.type.match(/image.*/)) {
        var t = "img" + Date.now().toString();
        msgID = genNewMessageID(),
            msg_count++;
        var n = URL.createObjectURL(e)
            , i = '<div class="progress"></div><img class="userImage" onload="scrollToMainBottom(200);window.URL.revokeObjectURL(this.src);" id="' + t + '" src="' + n + '" />';
        newMessage({
            message: i,
            sender: 1,
            msg_id: msgID,
            time: Date.now(),
            local: !0,
            type: "image"
        }),
            document.body.className = "uploading";
        var o = new FormData;
        o.append("image", e);
        var r = new XMLHttpRequest;
        r.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                var n = 100 - e.loaded / e.total * 60;
                $("#" + t).prev().css("background", "linear-gradient(0deg, rgba(0,0,0,0.7) " + n + "%, rgba(0,0,0,0.0) " + n + "%)")
            }
        }
            ,
            r.onload = function () {
                if (response = JSON.parse(r.responseText),
                    200 == response.status) {
                    var e = response.data.link
                        , n = response.data.deletehash
                        , i = response.data.width
                        , o = response.data.height;
                    e = e.replace("http:", "https:"),
                        sendImage(msgID, e, i, o, n),
                        percent = 0
                } else
                    percent = 100;
                $("#" + t).prev().css("background", "linear-gradient(0deg, rgba(0,0,0,0.7) " + percent + "%, rgba(0,0,0,0.0) " + percent + "%)")
            }
            ,
            r.open("POST", "https://api.imgur.com/3/image.json", !0),
            r.setRequestHeader("Authorization", "Client-ID f049c4e4f899fd6"),
            r.send(o)
    }
}
function recordAudio() {
    return Recorder.recorder ? void stopRecording() : Recorder.isRecordingSupported() ? (recorder = new Recorder({
        encoderPath: "/js/oggopusEncoder.js"
    }),
        Recorder.recorder = recorder,
        duration = 0,
        recorder.addEventListener("dataAvailable", function (e) {
            var t = new FormData;
            t.append("audio", e.detail),
                console.log(e.detail),
                parseInt(userStatus.uploadTokenExpiration) > Date.now() + 1e4 ? (t.append("token", userStatus.uploadToken),
                    uploadVoice(t, duration)) : updateStatus(function () {
                        t.append("token", userStatus.uploadToken),
                            uploadVoice(t, duration)
                    })
        }),
        micIcon = $("#audioButton i"),
        recorder.addEventListener("duration", function (e) {
            console.log("Recorded " + e.detail.toFixed(2) + " seconds"),
                duration = e.detail,
                normalizedVolume = recorder.normalizedVolume < .5 ? .5 : recorder.normalizedVolume > 1.5 ? 1.5 : recorder.normalizedVolume,
                micIcon.css("transform", "scale(" + normalizedVolume + "," + normalizedVolume + ")")
        }),
        recorder.addEventListener("streamError", function (e) {
            console.log("Error encountered: " + e.error.name)
        }),
        recorder.addEventListener("start", function () {
            console.log("Recorder is started"),
                $("#audioMessage").text("\u3000\u50b3\u9001\u3000"),
                $("#audioButton").addClass("recording")
        }),
        recorder.addEventListener("streamReady", function () {
            recorder.start(),
                recordingTimer = setTimeout(function () {
                    stopRecording()
                }, 3e4)
        }),
        void recorder.initStream()) : alert("\u60a8\u7684\u700f\u89bd\u5668\u4e0d\u652f\u63f4\u8a9e\u97f3\u8a0a\u606f")
}
function stopRecording() {
    recordingTimer && (clearTimeout(recordingTimer),
        recordingTimer = null),
        Recorder.recorder.stop(),
        $("#audioMessage").text("\u50b3\u9001\u4e2d..."),
        $("#audioButton").removeClass("recording")
}
function uploadVoice(e, t) {
    $.ajax({
        type: "POST",
        url: "https://www.wootalk.today/sound",
        data: e,
        processData: !1,
        contentType: !1
    }).done(function (e) {
        console.log(e),
            msgID = genNewMessageID(),
            msg_count++ ,
            sendAudio(msgID, e.data.url, t),
            $("#audioMessage").text("\u8a9e\u97f3\u8a0a\u606f"),
            Recorder.recorder = null
    })
}
function decodeOgg2(e) {
    chunks = [];
    var t = new Worker("/js/oggopusDecoder.js");
    t.postMessage((new Recorder).config),
        t.addEventListener("error", function (e) {
            console.log(e)
        }),
        t.addEventListener("message", function (e) {
            console.log(e.data),
                chunks += e.data
        });
    var n = new FileReader;
    n.onload = function () {
        t.postMessage({
            command: "decode",
            pages: new Uint8Array(this.result)
        })
    }
        ,
        n.readAsArrayBuffer(e),
        setTimeout(function () {
            var e = new (window.AudioContext || window.webkitAudioContext)
                , t = e.createBufferSource();
            console.log(chunks.length),
                audioBuffer = e.createBuffer(1, chunks.length, e.sampleRate),
                audioBuffer.getChannelData(0).set(chunks),
                t.buffer = audioBuffer,
                t.connect(e.destination),
                t.start()
        }, 5e3)
}
function decodeOgg(e, t) {
    var n = new Uint8Array(e)
        , i = new Worker("/js/oggopusDecoder.js")
        , o = new Worker("/js/wavePCM.js");
    i.postMessage({
        command: "init"
    }),
        o.postMessage({
            command: "init"
        }),
        i.onmessage = function (e) {
            null === e.data ? o.postMessage({
                command: "done"
            }) : o.postMessage({
                command: "record",
                buffers: e.data
            }, e.data.map(function (e) {
                return e.buffer
            }))
        }
        ,
        o.onmessage = function (e) {
            audioURL = URL.createObjectURL(new Blob([e.data], {
                type: "audio/wav"
            })),
                console.log(audioURL),
                t(audioURL)
        }
        ,
        i.postMessage({
            command: "decode",
            pages: n
        }, [n.buffer]),
        i.postMessage({
            command: "done"
        })
}
function playAudioUrl(e, t) {
    if ("voicePlayer" in window) {
        if (voicePlayer.src == t)
            return void (voicePlayer.paused ? voicePlayer.play() : voicePlayer.pause());
        voicePlayer.src.indexOf("zero.mp3") >= 0 || (voicePlayer.pause(),
            voicePlayer.ontimeupdate = null,
            voicePlayer.onpause = null,
            voicePlayer.onended = null,
            lastElement.html('<i class="material-icons">&#xE037;</i>'),
            lastElement.css("background", "none"))
    }
    voicePlayer.ontimeupdate = function () {
        e.html('<i class="material-icons">&#xE034;</i>'),
            percent = this.currentTime / this.duration * 100,
            e.css("background", "linear-gradient(90deg, rgba(0,0,0,0.3) " + percent + "%, rgba(0,0,0,0.0) " + percent + "%)")
    }
        ,
        voicePlayer.onpause = function () {
            e.html('<i class="material-icons">&#xE037;</i>')
        }
        ,
        voicePlayer.onended = function () {
            e.html('<i class="material-icons">&#xE037;</i>'),
                e.css("background", "none")
        }
        ,
        voicePlayer.onstalled = function () {
            percent = this.currentTime / this.duration * 100,
                percent > 99 && (this.pause(),
                    e.html('<i class="material-icons">&#xE037;</i>'),
                    e.css("background", "none"),
                    this.load())
        }
        ,
        voicePlayer.onerror = function (e) {
            alert(e.currentTarget.error.code),
                console.log("jQuery error event:", e);
            var t = e.originalEvent;
            console.log("original event:", t),
                alert(t.message ? "Error:\n	" + t.message + "\nLine:\n	" + t.lineno + "\nFile:\n	" + t.filename : "Error:\n	" + t.type + "\nElement:\n	" + (t.srcElement || t.target))
        }
        ,
        voicePlayer.src = t,
        voicePlayer.load(),
        voicePlayer.play(),
        lastElement = e
}
function playVoice(e) {
    voicePlayer.src.indexOf("zero.mp3") >= 0 && (voicePlayer.play(),
        voicePlayer.pause()),
        el = $(e),
        src = el.data("src"),
        el.html('<i class="material-icons spin">&#xE028;</i>'),
        "voicePlayer" in window || (voicePlayer = new Audio),
        playAudioUrl(el, src)
}
function getTextHistory() {
    var e = "";
    for (keys = Object.keys(messageHistory).sort(),
        i = 0; i < keys.length; i++)
        e += messageHistory[keys[i]] + "\n";
    return e
}
function report() {
    $("#talk-content").val(getTextHistory()),
        $.magnificPopup.open({
            items: {
                src: "#report-popup",
                type: "inline"
            },
            type: "inline",
            midClick: !1,
            callbacks: {
                open: function () {
                    $(".report-popup input").not(":button, :submit, :reset").removeAttr("checked").removeAttr("selected").not(":checkbox, :radio, select").val(""),
                        $(".report-popup h5").first().removeClass("red"),
                        ensureLeave = !1,
                        this.content.on("click.mycustomevent", "#popup-yes", function () {
                            return reasons = [],
                                $(".text", $(".report-popup input[type=checkbox]:checked + label")).each(function () {
                                    reasons.push($(this).text())
                                }),
                                otherReason = $("#other-reason").val(),
                                "" != otherReason && reasons.push(otherReason),
                                0 == reasons.length ? void $(".report-popup h5").first().addClass("red") : ($.post("/api/report", {
                                    chatContent: $(".report-popup textarea").val(),
                                    reason: reasons
                                }, function (e) {
                                    console.log("status:", e)
                                }),
                                    ensureLeave = !0,
                                    $.magnificPopup.close(),
                                    void ga("send", "event", "chat", "report"))
                        }),
                        this.content.on("click.mycustomevent2", "#popup-cancel", function () {
                            $.magnificPopup.close()
                        })
                },
                close: function () {
                    this.content.off("click.mycustomevent"),
                        this.content.off("click.mycustomevent2")
                },
                afterClose: function () {
                    ensureLeave && leave()
                }
            },
            showCloseBtn: !1,
            removalDelay: 350,
            mainClass: "mfp-zoom-in"
        })
}
function popupLeaveDialog() {
    $.magnificPopup.open($("[mid]").last().attr("mid") > 100 ? {
        items: {
            type: "inline",
            src: $('<div class="white-popup mfp-with-anim">                        <h4>\u78ba\u5b9a\u8981\u96e2\u958b\u55ce?</h4>                        <p>\u56e0\u70ba\u60a8\u804a\u4e86\u5f88\u591a<br>                        \u82e5\u78ba\u5b9a\u8981\u96e2\u958b<br>                        \u8acb\u5728\u4e0b\u65b9\u8f38\u5165"leave"</p>                        <input type="text" id="ensureText" placeholder="\u5728\u6b64\u8f38\u5165 leave" autocomplete="off"/>                         <button class="right" id="popup-yes">\u96e2\u958b\u5c0d\u8a71</button>                        <button class="right light" id="popup-cancel">\u53d6\u6d88</button>                        </div>                        <i class="report-button material-icons mfp-with-anim" onclick="ensureReport=true;$.magnificPopup.close();">&#xE000;</i>')
        },
        type: "inline",
        midClick: !1,
        callbacks: {
            open: function () {
                ensureLeave = !1,
                    ensureReport = !1,
                    this.content.on("click.mycustomevent", "#popup-cancel", function () {
                        $.magnificPopup.close()
                    }),
                    this.content.on("click.mycustomevent2", "#popup-yes", function () {
                        if ("leave" == $("#ensureText").val().toLowerCase())
                            ensureLeave = !0,
                                $.magnificPopup.close();
                        else {
                            var e = document.getElementById("ensureText")
                                , t = e.cloneNode(!0);
                            e.parentNode.replaceChild(t, e),
                                $("#ensureText").addClass("invalid")
                        }
                    })
            },
            close: function () {
                this.content.off("click.mycustomevent"),
                    this.content.off("click.mycustomevent2")
            },
            afterClose: function () {
                ensureReport ? report() : ensureLeave && leave()
            }
        },
        showCloseBtn: !1,
        removalDelay: 350,
        mainClass: "mfp-zoom-in"
    } : {
            items: {
                type: "inline",
                src: $('<div class="white-popup mfp-with-anim">                      <h4>\u78ba\u5b9a\u8981\u96e2\u958b\u55ce?</h4>                      <p>\u96e2\u958b\u5c07\u6e05\u9664\u96d9\u65b9\u7684\u5c0d\u8a71\u7d00\u9304\uff01<br>                       \u4e14\u5c0d\u65b9\u4e0d\u6703\u770b\u5230\u60a8\u7684\u4efb\u4f55\u7559\u8a00\u3002</p>                      <button class="left light" onclick="ensureReport=true;$.magnificPopup.close();">\u56de\u5831</button>                      <button class="right" id="popup-yes">\u78ba\u5b9a\u96e2\u958b</button>                      <button class="right light" id="popup-cancel">\u53d6\u6d88</button>                      </div>')
            },
            type: "inline",
            midClick: !1,
            callbacks: {
                open: function () {
                    ensureLeave = !1,
                        ensureReport = !1,
                        this.content.on("click.mycustomevent", "#popup-cancel", function () {
                            $.magnificPopup.close()
                        }),
                        this.content.on("click.mycustomevent2", "#popup-yes", function () {
                            ensureLeave = !0,
                                $.magnificPopup.close()
                        })
                },
                close: function () {
                    this.content.off("click.mycustomevent"),
                        this.content.off("click.mycustomevent2")
                },
                afterClose: function () {
                    ensureReport ? report() : ensureLeave && leave()
                }
            },
            showCloseBtn: !1,
            removalDelay: 350,
            mainClass: "mfp-zoom-in"
        })
}
function leave() {
    is_leave = !1,
        dispatcher.trigger("change_person"),
        dispatcher.disconnect(),
        dispatcher = null,
        $("#sendButton>input").val("\u50b3\u9001"),
        $(".typing").remove(),
        $(".buttons").show(),
        $("#main").animate({
            scrollTop: 0,
            height: "100%"
        }, 500),
        $("#startButton").fadeTo(500, 1, function () {
            $("#sendBox,blockquote").attr("style", "display: none !important"),
                $("#messages").html(""),
                chatStarted = !1,
                document.getElementById("keyInput").readOnly = !1,
                msg_count > 0 && (ga("send", "event", "chat", "send", null, msg_count),
                    msg_count = 0),
                base = 2,
                1 >= my_msg_count ? label = padLeft(my_msg_count, 4) : (log_count = Math.log(my_msg_count) / Math.log(base),
                    lower_bound = Math.pow(base, Math.floor(log_count)),
                    upper_bound = Math.pow(base, Math.floor(log_count) + 1) - 1,
                    label = padLeft(Math.ceil(lower_bound), 4) + "-" + padLeft(Math.ceil(upper_bound), 4)),
                ga("send", "event", "chat", "send_histogram", label, my_msg_count),
                my_msg_count = 0,
                ga("send", "event", "chat", "changeperson")
        })
}
function enterKeyMode(e) {
    chatStarted && !e ? showMessageBox("<p>\u8acb\u5148\u96e2\u958b\u76ee\u524d\u5c0d\u8a71<br>\u624d\u80fd\u4f7f\u7528\u5bc6\u8a9e\u5594!</p>", "\u4f7f\u7528\u5bc6\u8a9e") : ($("#main").scrollTop() > 1 && $("#main").animate({
        scrollTop: 1
    }, 500),
        $("#keyPanel").css("display", "table"),
        $("#tip").removeClass("hide"),
        $("#logoContent").addClass("blurLogo"),
        $(".keybox").fadeTo(500, 1, "easeInCubic"),
        document.getElementById("keyInput").readOnly = !1,
        ga("send", "event", "chat", "enterKeyMode"))
}
function exitKeyMode() {
    chatStarted || ($("#tip").addClass("hide"),
        $("#keyInput").removeClass("onX").val("").change(),
        $(".keybox").fadeTo(500, 0, "easeOutCubic", function () {
            $("#keyPanel").hide()
        }),
        $(".header").removeClass("blurLogo"),
        document.getElementById("keyInput").readOnly = !0,
        ga("send", "event", "chat", "exitKeyMode"))
}
function updateTitle() {
    document.title = new_msg_count > 0 ? "(" + new_msg_count + ") " + org_title : org_title,
        ga("set", "title", version)
}
function generateInteval(e) {
    var t = 1e3 * (Math.pow(2, e) - 1);
    return t > 3e4 && (t = 3e4),
        Math.random() * t
}
function checkStart() {
    console.log("checkStart"),
        !chatStarted && Date.now() - lastCheckStart > 1e4 && (lastCheckStart = Date.now(),
            updateStatus(function (e) {
                e.alreadyStart && ("keyword" in e && "" != e.keyword ? ($("#keyInput").val(decodeURIComponent(e.keyword)).change(),
                    enterKeyMode(!0)) : exitKeyMode(),
                    clickStartChat())
            }))
}
function updateStatus(e) {
    $.get("/api/status", function (t) {
        userStatus = t,
            console.log("status:", t, t.uploadToken, userStatus.uploadToken),
            e && e(t)
    })
}
function updateDateString() {
    $(".timeago").timeago("refresh"),
        $("div.timediff").each(function () {
            var e = $(this).nextAll("[mid]").first()
                , t = $(this).prevAll("[mid]").last()
                , n = new Date($(".timeago", e).attr("datetime"))
                , i = new Date($(".timeago", t).attr("datetime"));
            !i || i.getDate() == n.getDate() && i.getMonth() == n.getMonth() && i.getFullYear() == n.getFullYear() ? $(this).hide() : $(this).show().text(generateDataString(n))
        })
}
function generateDataString(e) {
    var t = ""
        , n = new Date;
    n.getFullYear() != e.getFullYear() && (t += e.getFullYear() + "\u5e74"),
        t += e.getMonth() + 1 + "\u6708" + e.getDate() + "\u65e5";
    var i = Math.floor((e.getTime() - 6e4 * e.getTimezoneOffset()) / 1e3 / 86400)
        , o = Math.floor((n.getTime() - 6e4 * e.getTimezoneOffset()) / 1e3 / 86400);
    return console.log(i, o, e.getTimezoneOffset()),
        i == o ? t = "\u4eca\u65e5 (" + t + ")" : i == o - 1 && (t = "\u6628\u65e5 (" + t + ")"),
        t
}
function showMessageBox(e, t) {
    $.magnificPopup.open({
        items: {
            type: "inline",
            src: $('<div class="white-popup mfp-with-anim">                      <h4>' + t + "</h4>                      " + e + '                      <button id="popup-yes">\u78ba\u5b9a</button>                      </div>')
        },
        type: "inline",
        midClick: !1,
        callbacks: {
            open: function () {
                this.content.on("click.mycustomevent", "#popup-yes", function () {
                    $.magnificPopup.close()
                })
            },
            close: function () {
                this.content.off("click.mycustomevent")
            }
        },
        showCloseBtn: !1,
        removalDelay: 500,
        mainClass: "mfp-zoom-in"
    })
}
!function (e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
        : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
    function n(e) {
        var t = e.length
            , n = ot.type(e);
        return "function" === n || ot.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    function i(e, t, n) {
        if (ot.isFunction(t))
            return ot.grep(e, function (e, i) {
                return !!t.call(e, i, e) !== n
            });
        if (t.nodeType)
            return ot.grep(e, function (e) {
                return e === t !== n
            });
        if ("string" == typeof t) {
            if (pt.test(t))
                return ot.filter(t, e, n);
            t = ot.filter(t, e)
        }
        return ot.grep(e, function (e) {
            return ot.inArray(e, t) >= 0 !== n
        })
    }
    function o(e, t) {
        do
            e = e[t];
        while (e && 1 !== e.nodeType); return e
    }
    function r(e) {
        var t = wt[e] = {};
        return ot.each(e.match(bt) || [], function (e, n) {
            t[n] = !0
        }),
            t
    }
    function a() {
        ft.addEventListener ? (ft.removeEventListener("DOMContentLoaded", s, !1),
            e.removeEventListener("load", s, !1)) : (ft.detachEvent("onreadystatechange", s),
                e.detachEvent("onload", s))
    }
    function s() {
        (ft.addEventListener || "load" === event.type || "complete" === ft.readyState) && (a(),
            ot.ready())
    }
    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var i = "data-" + t.replace(St, "-$1").toLowerCase();
            if (n = e.getAttribute(i),
                "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Ct.test(n) ? ot.parseJSON(n) : n
                } catch (o) { }
                ot.data(e, t, n)
            } else
                n = void 0
        }
        return n
    }
    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !ot.isEmptyObject(e[t])) && "toJSON" !== t)
                return !1;
        return !0
    }
    function u(e, t, n, i) {
        if (ot.acceptData(e)) {
            var o, r, a = ot.expando, s = e.nodeType, l = s ? ot.cache : e, c = s ? e[a] : e[a] && a;
            if (c && l[c] && (i || l[c].data) || void 0 !== n || "string" != typeof t)
                return c || (c = s ? e[a] = K.pop() || ot.guid++ : a),
                    l[c] || (l[c] = s ? {} : {
                        toJSON: ot.noop
                    }),
                    ("object" == typeof t || "function" == typeof t) && (i ? l[c] = ot.extend(l[c], t) : l[c].data = ot.extend(l[c].data, t)),
                    r = l[c],
                    i || (r.data || (r.data = {}),
                        r = r.data),
                    void 0 !== n && (r[ot.camelCase(t)] = n),
                    "string" == typeof t ? (o = r[t],
                        null == o && (o = r[ot.camelCase(t)])) : o = r,
                    o
        }
    }
    function d(e, t, n) {
        if (ot.acceptData(e)) {
            var i, o, r = e.nodeType, a = r ? ot.cache : e, s = r ? e[ot.expando] : ot.expando;
            if (a[s]) {
                if (t && (i = n ? a[s] : a[s].data)) {
                    ot.isArray(t) ? t = t.concat(ot.map(t, ot.camelCase)) : t in i ? t = [t] : (t = ot.camelCase(t),
                        t = t in i ? [t] : t.split(" ")),
                        o = t.length;
                    for (; o--;)
                        delete i[t[o]];
                    if (n ? !c(i) : !ot.isEmptyObject(i))
                        return
                }
                (n || (delete a[s].data,
                    c(a[s]))) && (r ? ot.cleanData([e], !0) : nt.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }
    function p() {
        return !0
    }
    function h() {
        return !1
    }
    function f() {
        try {
            return ft.activeElement
        } catch (e) { }
    }
    function m(e) {
        var t = Rt.split("|")
            , n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;)
                n.createElement(t.pop());
        return n
    }
    function g(e, t) {
        var n, i, o = 0, r = typeof e.getElementsByTagName !== _t ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== _t ? e.querySelectorAll(t || "*") : void 0;
        if (!r)
            for (r = [],
                n = e.childNodes || e; null != (i = n[o]); o++)
                !t || ot.nodeName(i, t) ? r.push(i) : ot.merge(r, g(i, t));
        return void 0 === t || t && ot.nodeName(e, t) ? ot.merge([e], r) : r
    }
    function v(e) {
        It.test(e.type) && (e.defaultChecked = e.checked)
    }
    function y(e, t) {
        return ot.nodeName(e, "table") && ot.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }
    function b(e) {
        return e.type = (null !== ot.find.attr(e, "type")) + "/" + e.type,
            e
    }
    function w(e) {
        var t = Ut.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"),
            e
    }
    function x(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++)
            ot._data(n, "globalEval", !t || ot._data(t[i], "globalEval"))
    }
    function T(e, t) {
        if (1 === t.nodeType && ot.hasData(e)) {
            var n, i, o, r = ot._data(e), a = ot._data(t, r), s = r.events;
            if (s) {
                delete a.handle,
                    a.events = {};
                for (n in s)
                    for (i = 0,
                        o = s[n].length; o > i; i++)
                        ot.event.add(t, n, s[n][i])
            }
            a.data && (a.data = ot.extend({}, a.data))
        }
    }
    function _(e, t) {
        var n, i, o;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(),
                !nt.noCloneEvent && t[ot.expando]) {
                o = ot._data(t);
                for (i in o.events)
                    ot.removeEvent(t, i, o.handle);
                t.removeAttribute(ot.expando)
            }
            "script" === n && t.text !== e.text ? (b(t).text = e.text,
                w(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML),
                    nt.html5Clone && e.innerHTML && !ot.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && It.test(e.type) ? (t.defaultChecked = t.checked = e.checked,
                        t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }
    function C(t, n) {
        var i, o = ot(n.createElement(t)).appendTo(n.body), r = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(o[0])) ? i.display : ot.css(o[0], "display");
        return o.detach(),
            r
    }
    function S(e) {
        var t = ft
            , n = Jt[e];
        return n || (n = C(e, t),
            "none" !== n && n || (Zt = (Zt || ot("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement),
                t = (Zt[0].contentWindow || Zt[0].contentDocument).document,
                t.write(),
                t.close(),
                n = C(e, t),
                Zt.detach()),
            Jt[e] = n),
            n
    }
    function k(e, t) {
        return {
            get: function () {
                var n = e();
                if (null != n)
                    return n ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }
    function E(e, t) {
        if (t in e)
            return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, o = hn.length; o--;)
            if (t = hn[o] + n,
                t in e)
                return t;
        return i
    }
    function M(e, t) {
        for (var n, i, o, r = [], a = 0, s = e.length; s > a; a++)
            i = e[a],
                i.style && (r[a] = ot._data(i, "olddisplay"),
                    n = i.style.display,
                    t ? (r[a] || "none" !== n || (i.style.display = ""),
                        "" === i.style.display && Mt(i) && (r[a] = ot._data(i, "olddisplay", S(i.nodeName)))) : (o = Mt(i),
                            (n && "none" !== n || !o) && ot._data(i, "olddisplay", o ? n : ot.css(i, "display"))));
        for (a = 0; s > a; a++)
            i = e[a],
                i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? r[a] || "" : "none"));
        return e
    }
    function A(e, t, n) {
        var i = cn.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }
    function I(e, t, n, i, o) {
        for (var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > r; r += 2)
            "margin" === n && (a += ot.css(e, n + Et[r], !0, o)),
                i ? ("content" === n && (a -= ot.css(e, "padding" + Et[r], !0, o)),
                    "margin" !== n && (a -= ot.css(e, "border" + Et[r] + "Width", !0, o))) : (a += ot.css(e, "padding" + Et[r], !0, o),
                        "padding" !== n && (a += ot.css(e, "border" + Et[r] + "Width", !0, o)));
        return a
    }
    function N(e, t, n) {
        var i = !0
            , o = "width" === t ? e.offsetWidth : e.offsetHeight
            , r = en(e)
            , a = nt.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, r);
        if (0 >= o || null == o) {
            if (o = tn(e, t, r),
                (0 > o || null == o) && (o = e.style[t]),
                on.test(o))
                return o;
            i = a && (nt.boxSizingReliable() || o === e.style[t]),
                o = parseFloat(o) || 0
        }
        return o + I(e, t, n || (a ? "border" : "content"), i, r) + "px"
    }
    function D(e, t, n, i, o) {
        return new D.prototype.init(e, t, n, i, o)
    }
    function P() {
        return setTimeout(function () {
            fn = void 0
        }),
            fn = ot.now()
    }
    function B(e, t) {
        var n, i = {
            height: e
        }, o = 0;
        for (t = t ? 1 : 0; 4 > o; o += 2 - t)
            n = Et[o],
                i["margin" + n] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
            i
    }
    function L(e, t, n) {
        for (var i, o = (wn[t] || []).concat(wn["*"]), r = 0, a = o.length; a > r; r++)
            if (i = o[r].call(n, t, e))
                return i
    }
    function R(e, t, n) {
        var i, o, r, a, s, l, c, u, d = this, p = {}, h = e.style, f = e.nodeType && Mt(e), m = ot._data(e, "fxshow");
        n.queue || (s = ot._queueHooks(e, "fx"),
            null == s.unqueued && (s.unqueued = 0,
                l = s.empty.fire,
                s.empty.fire = function () {
                    s.unqueued || l()
                }
            ),
            s.unqueued++ ,
            d.always(function () {
                d.always(function () {
                    s.unqueued-- ,
                        ot.queue(e, "fx").length || s.empty.fire()
                })
            })),
            1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                c = ot.css(e, "display"),
                u = "none" === c ? ot._data(e, "olddisplay") || S(e.nodeName) : c,
                "inline" === u && "none" === ot.css(e, "float") && (nt.inlineBlockNeedsLayout && "inline" !== S(e.nodeName) ? h.zoom = 1 : h.display = "inline-block")),
            n.overflow && (h.overflow = "hidden",
                nt.shrinkWrapBlocks() || d.always(function () {
                    h.overflow = n.overflow[0],
                        h.overflowX = n.overflow[1],
                        h.overflowY = n.overflow[2]
                }));
        for (i in t)
            if (o = t[i],
                gn.exec(o)) {
                if (delete t[i],
                    r = r || "toggle" === o,
                    o === (f ? "hide" : "show")) {
                    if ("show" !== o || !m || void 0 === m[i])
                        continue;
                    f = !0
                }
                p[i] = m && m[i] || ot.style(e, i)
            } else
                c = void 0;
        if (ot.isEmptyObject(p))
            "inline" === ("none" === c ? S(e.nodeName) : c) && (h.display = c);
        else {
            m ? "hidden" in m && (f = m.hidden) : m = ot._data(e, "fxshow", {}),
                r && (m.hidden = !f),
                f ? ot(e).show() : d.done(function () {
                    ot(e).hide()
                }),
                d.done(function () {
                    var t;
                    ot._removeData(e, "fxshow");
                    for (t in p)
                        ot.style(e, t, p[t])
                });
            for (i in p)
                a = L(f ? m[i] : 0, i, d),
                    i in m || (m[i] = a.start,
                        f && (a.end = a.start,
                            a.start = "width" === i || "height" === i ? 1 : 0))
        }
    }
    function F(e, t) {
        var n, i, o, r, a;
        for (n in e)
            if (i = ot.camelCase(n),
                o = t[i],
                r = e[n],
                ot.isArray(r) && (o = r[1],
                    r = e[n] = r[0]),
                n !== i && (e[i] = r,
                    delete e[n]),
                a = ot.cssHooks[i],
                a && "expand" in a) {
                r = a.expand(r),
                    delete e[i];
                for (n in r)
                    n in e || (e[n] = r[n],
                        t[n] = o)
            } else
                t[i] = o
    }
    function O(e, t, n) {
        var i, o, r = 0, a = bn.length, s = ot.Deferred().always(function () {
            delete l.elem
        }), l = function () {
            if (o)
                return !1;
            for (var t = fn || P(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, r = 1 - i, a = 0, l = c.tweens.length; l > a; a++)
                c.tweens[a].run(r);
            return s.notifyWith(e, [c, r, n]),
                1 > r && l ? n : (s.resolveWith(e, [c]),
                    !1)
        }, c = s.promise({
            elem: e,
            props: ot.extend({}, t),
            opts: ot.extend(!0, {
                specialEasing: {}
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: fn || P(),
            duration: n.duration,
            tweens: [],
            createTween: function (t, n) {
                var i = ot.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                return c.tweens.push(i),
                    i
            },
            stop: function (t) {
                var n = 0
                    , i = t ? c.tweens.length : 0;
                if (o)
                    return this;
                for (o = !0; i > n; n++)
                    c.tweens[n].run(1);
                return t ? s.resolveWith(e, [c, t]) : s.rejectWith(e, [c, t]),
                    this
            }
        }), u = c.props;
        for (F(u, c.opts.specialEasing); a > r; r++)
            if (i = bn[r].call(c, e, u, c.opts))
                return i;
        return ot.map(u, L, c),
            ot.isFunction(c.opts.start) && c.opts.start.call(e, c),
            ot.fx.timer(ot.extend(l, {
                elem: e,
                anim: c,
                queue: c.opts.queue
            })),
            c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }
    function H(e) {
        return function (t, n) {
            "string" != typeof t && (n = t,
                t = "*");
            var i, o = 0, r = t.toLowerCase().match(bt) || [];
            if (ot.isFunction(n))
                for (; i = r[o++];)
                    "+" === i.charAt(0) ? (i = i.slice(1) || "*",
                        (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }
    function $(e, t, n, i) {
        function o(s) {
            var l;
            return r[s] = !0,
                ot.each(e[s] || [], function (e, s) {
                    var c = s(t, n, i);
                    return "string" != typeof c || a || r[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c),
                        o(c),
                        !1)
                }),
                l
        }
        var r = {}
            , a = e === qn;
        return o(t.dataTypes[0]) || !r["*"] && o("*")
    }
    function j(e, t) {
        var n, i, o = ot.ajaxSettings.flatOptions || {};
        for (i in t)
            void 0 !== t[i] && ((o[i] ? e : n || (n = {}))[i] = t[i]);
        return n && ot.extend(!0, e, n),
            e
    }
    function W(e, t, n) {
        for (var i, o, r, a, s = e.contents, l = e.dataTypes; "*" === l[0];)
            l.shift(),
                void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
        if (o)
            for (a in s)
                if (s[a] && s[a].test(o)) {
                    l.unshift(a);
                    break
                }
        if (l[0] in n)
            r = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    r = a;
                    break
                }
                i || (i = a)
            }
            r = r || i
        }
        return r ? (r !== l[0] && l.unshift(r),
            n[r]) : void 0
    }
    function z(e, t, n, i) {
        var o, r, a, s, l, c = {}, u = e.dataTypes.slice();
        if (u[1])
            for (a in e.converters)
                c[a.toLowerCase()] = e.converters[a];
        for (r = u.shift(); r;)
            if (e.responseFields[r] && (n[e.responseFields[r]] = t),
                !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                l = r,
                r = u.shift())
                if ("*" === r)
                    r = l;
                else if ("*" !== l && l !== r) {
                    if (a = c[l + " " + r] || c["* " + r],
                        !a)
                        for (o in c)
                            if (s = o.split(" "),
                                s[1] === r && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
                                a === !0 ? a = c[o] : c[o] !== !0 && (r = s[0],
                                    u.unshift(s[1]));
                                break
                            }
                    if (a !== !0)
                        if (a && e["throws"])
                            t = a(t);
                        else
                            try {
                                t = a(t)
                            } catch (d) {
                                return {
                                    state: "parsererror",
                                    error: a ? d : "No conversion from " + l + " to " + r
                                }
                            }
                }
        return {
            state: "success",
            data: t
        }
    }
    function q(e, t, n, i) {
        var o;
        if (ot.isArray(t))
            ot.each(t, function (t, o) {
                n || Kn.test(e) ? i(e, o) : q(e + "[" + ("object" == typeof o ? t : "") + "]", o, n, i)
            });
        else if (n || "object" !== ot.type(t))
            i(e, t);
        else
            for (o in t)
                q(e + "[" + o + "]", t[o], n, i)
    }
    function G() {
        try {
            return new e.XMLHttpRequest
        } catch (t) { }
    }
    function X() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) { }
    }
    function U(e) {
        return ot.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var K = []
        , V = K.slice
        , Q = K.concat
        , Y = K.push
        , Z = K.indexOf
        , J = {}
        , et = J.toString
        , tt = J.hasOwnProperty
        , nt = {}
        , it = "1.11.1"
        , ot = function (e, t) {
            return new ot.fn.init(e, t)
        }
        , rt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        , at = /^-ms-/
        , st = /-([\da-z])/gi
        , lt = function (e, t) {
            return t.toUpperCase()
        };
    ot.fn = ot.prototype = {
        jquery: it,
        constructor: ot,
        selector: "",
        length: 0,
        toArray: function () {
            return V.call(this)
        },
        get: function (e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : V.call(this)
        },
        pushStack: function (e) {
            var t = ot.merge(this.constructor(), e);
            return t.prevObject = this,
                t.context = this.context,
                t
        },
        each: function (e, t) {
            return ot.each(this, e, t)
        },
        map: function (e) {
            return this.pushStack(ot.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function () {
            return this.pushStack(V.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (e) {
            var t = this.length
                , n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor(null)
        },
        push: Y,
        sort: K.sort,
        splice: K.splice
    },
        ot.extend = ot.fn.extend = function () {
            var e, t, n, i, o, r, a = arguments[0] || {}, s = 1, l = arguments.length, c = !1;
            for ("boolean" == typeof a && (c = a,
                a = arguments[s] || {},
                s++),
                "object" == typeof a || ot.isFunction(a) || (a = {}),
                s === l && (a = this,
                    s--); l > s; s++)
                if (null != (o = arguments[s]))
                    for (i in o)
                        e = a[i],
                            n = o[i],
                            a !== n && (c && n && (ot.isPlainObject(n) || (t = ot.isArray(n))) ? (t ? (t = !1,
                                r = e && ot.isArray(e) ? e : []) : r = e && ot.isPlainObject(e) ? e : {},
                                a[i] = ot.extend(c, r, n)) : void 0 !== n && (a[i] = n));
            return a
        }
        ,
        ot.extend({
            expando: "jQuery" + (it + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function (e) {
                throw new Error(e)
            },
            noop: function () { },
            isFunction: function (e) {
                return "function" === ot.type(e)
            },
            isArray: Array.isArray || function (e) {
                return "array" === ot.type(e)
            }
            ,
            isWindow: function (e) {
                return null != e && e == e.window
            },
            isNumeric: function (e) {
                return !ot.isArray(e) && e - parseFloat(e) >= 0
            },
            isEmptyObject: function (e) {
                var t;
                for (t in e)
                    return !1;
                return !0
            },
            isPlainObject: function (e) {
                var t;
                if (!e || "object" !== ot.type(e) || e.nodeType || ot.isWindow(e))
                    return !1;
                try {
                    if (e.constructor && !tt.call(e, "constructor") && !tt.call(e.constructor.prototype, "isPrototypeOf"))
                        return !1
                } catch (n) {
                    return !1
                }
                if (nt.ownLast)
                    for (t in e)
                        return tt.call(e, t);
                for (t in e)
                    ;
                return void 0 === t || tt.call(e, t)
            },
            type: function (e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? J[et.call(e)] || "object" : typeof e
            },
            globalEval: function (t) {
                t && ot.trim(t) && (e.execScript || function (t) {
                    e.eval.call(e, t)
                }
                )(t)
            },
            camelCase: function (e) {
                return e.replace(at, "ms-").replace(st, lt)
            },
            nodeName: function (e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function (e, t, i) {
                var o, r = 0, a = e.length, s = n(e);
                if (i) {
                    if (s)
                        for (; a > r && (o = t.apply(e[r], i),
                            o !== !1); r++)
                            ;
                    else
                        for (r in e)
                            if (o = t.apply(e[r], i),
                                o === !1)
                                break
                } else if (s)
                    for (; a > r && (o = t.call(e[r], r, e[r]),
                        o !== !1); r++)
                        ;
                else
                    for (r in e)
                        if (o = t.call(e[r], r, e[r]),
                            o === !1)
                            break;
                return e
            },
            trim: function (e) {
                return null == e ? "" : (e + "").replace(rt, "")
            },
            makeArray: function (e, t) {
                var i = t || [];
                return null != e && (n(Object(e)) ? ot.merge(i, "string" == typeof e ? [e] : e) : Y.call(i, e)),
                    i
            },
            inArray: function (e, t, n) {
                var i;
                if (t) {
                    if (Z)
                        return Z.call(t, e, n);
                    for (i = t.length,
                        n = n ? 0 > n ? Math.max(0, i + n) : n : 0; i > n; n++)
                        if (n in t && t[n] === e)
                            return n
                }
                return -1
            },
            merge: function (e, t) {
                for (var n = +t.length, i = 0, o = e.length; n > i;)
                    e[o++] = t[i++];
                if (n !== n)
                    for (; void 0 !== t[i];)
                        e[o++] = t[i++];
                return e.length = o,
                    e
            },
            grep: function (e, t, n) {
                for (var i, o = [], r = 0, a = e.length, s = !n; a > r; r++)
                    i = !t(e[r], r),
                        i !== s && o.push(e[r]);
                return o
            },
            map: function (e, t, i) {
                var o, r = 0, a = e.length, s = n(e), l = [];
                if (s)
                    for (; a > r; r++)
                        o = t(e[r], r, i),
                            null != o && l.push(o);
                else
                    for (r in e)
                        o = t(e[r], r, i),
                            null != o && l.push(o);
                return Q.apply([], l)
            },
            guid: 1,
            proxy: function (e, t) {
                var n, i, o;
                return "string" == typeof t && (o = e[t],
                    t = e,
                    e = o),
                    ot.isFunction(e) ? (n = V.call(arguments, 2),
                        i = function () {
                            return e.apply(t || this, n.concat(V.call(arguments)))
                        }
                        ,
                        i.guid = e.guid = e.guid || ot.guid++ ,
                        i) : void 0
            },
            now: function () {
                return +new Date
            },
            support: nt
        }),
        ot.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
            J["[object " + t + "]"] = t.toLowerCase()
        });
    var ct = function (e) {
        function t(e, t, n, i) {
            var o, r, a, s, l, c, d, h, f, m;
            if ((t ? t.ownerDocument || t : $) !== D && N(t),
                t = t || D,
                n = n || [],
                !e || "string" != typeof e)
                return n;
            if (1 !== (s = t.nodeType) && 9 !== s)
                return [];
            if (B && !i) {
                if (o = yt.exec(e))
                    if (a = o[1]) {
                        if (9 === s) {
                            if (r = t.getElementById(a),
                                !r || !r.parentNode)
                                return n;
                            if (r.id === a)
                                return n.push(r),
                                    n
                        } else if (t.ownerDocument && (r = t.ownerDocument.getElementById(a)) && O(t, r) && r.id === a)
                            return n.push(r),
                                n
                    } else {
                        if (o[2])
                            return J.apply(n, t.getElementsByTagName(e)),
                                n;
                        if ((a = o[3]) && x.getElementsByClassName && t.getElementsByClassName)
                            return J.apply(n, t.getElementsByClassName(a)),
                                n
                    }
                if (x.qsa && (!L || !L.test(e))) {
                    if (h = d = H,
                        f = t,
                        m = 9 === s && e,
                        1 === s && "object" !== t.nodeName.toLowerCase()) {
                        for (c = S(e),
                            (d = t.getAttribute("id")) ? h = d.replace(wt, "\\$&") : t.setAttribute("id", h),
                            h = "[id='" + h + "'] ",
                            l = c.length; l--;)
                            c[l] = h + p(c[l]);
                        f = bt.test(e) && u(t.parentNode) || t,
                            m = c.join(",")
                    }
                    if (m)
                        try {
                            return J.apply(n, f.querySelectorAll(m)),
                                n
                        } catch (g) { } finally {
                            d || t.removeAttribute("id")
                        }
                }
            }
            return E(e.replace(lt, "$1"), t, n, i)
        }
        function n() {
            function e(n, i) {
                return t.push(n + " ") > T.cacheLength && delete e[t.shift()],
                    e[n + " "] = i
            }
            var t = [];
            return e
        }
        function i(e) {
            return e[H] = !0,
                e
        }
        function o(e) {
            var t = D.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                    t = null
            }
        }
        function r(e, t) {
            for (var n = e.split("|"), i = e.length; i--;)
                T.attrHandle[n[i]] = t
        }
        function a(e, t) {
            var n = t && e
                , i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || K) - (~e.sourceIndex || K);
            if (i)
                return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function s(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }
        function l(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }
        function c(e) {
            return i(function (t) {
                return t = +t,
                    i(function (n, i) {
                        for (var o, r = e([], n.length, t), a = r.length; a--;)
                            n[o = r[a]] && (n[o] = !(i[o] = n[o]))
                    })
            })
        }
        function u(e) {
            return e && typeof e.getElementsByTagName !== U && e
        }
        function d() { }
        function p(e) {
            for (var t = 0, n = e.length, i = ""; n > t; t++)
                i += e[t].value;
            return i
        }
        function h(e, t, n) {
            var i = t.dir
                , o = n && "parentNode" === i
                , r = W++;
            return t.first ? function (t, n, r) {
                for (; t = t[i];)
                    if (1 === t.nodeType || o)
                        return e(t, n, r)
            }
                : function (t, n, a) {
                    var s, l, c = [j, r];
                    if (a) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || o) && e(t, n, a))
                                return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || o) {
                                if (l = t[H] || (t[H] = {}),
                                    (s = l[i]) && s[0] === j && s[1] === r)
                                    return c[2] = s[2];
                                if (l[i] = c,
                                    c[2] = e(t, n, a))
                                    return !0
                            }
                }
        }
        function f(e) {
            return e.length > 1 ? function (t, n, i) {
                for (var o = e.length; o--;)
                    if (!e[o](t, n, i))
                        return !1;
                return !0
            }
                : e[0]
        }
        function m(e, n, i) {
            for (var o = 0, r = n.length; r > o; o++)
                t(e, n[o], i);
            return i
        }
        function g(e, t, n, i, o) {
            for (var r, a = [], s = 0, l = e.length, c = null != t; l > s; s++)
                (r = e[s]) && (!n || n(r, i, o)) && (a.push(r),
                    c && t.push(s));
            return a
        }
        function v(e, t, n, o, r, a) {
            return o && !o[H] && (o = v(o)),
                r && !r[H] && (r = v(r, a)),
                i(function (i, a, s, l) {
                    var c, u, d, p = [], h = [], f = a.length, v = i || m(t || "*", s.nodeType ? [s] : s, []), y = !e || !i && t ? v : g(v, p, e, s, l), b = n ? r || (i ? e : f || o) ? [] : a : y;
                    if (n && n(y, b, s, l),
                        o)
                        for (c = g(b, h),
                            o(c, [], s, l),
                            u = c.length; u--;)
                            (d = c[u]) && (b[h[u]] = !(y[h[u]] = d));
                    if (i) {
                        if (r || e) {
                            if (r) {
                                for (c = [],
                                    u = b.length; u--;)
                                    (d = b[u]) && c.push(y[u] = d);
                                r(null, b = [], c, l)
                            }
                            for (u = b.length; u--;)
                                (d = b[u]) && (c = r ? tt.call(i, d) : p[u]) > -1 && (i[c] = !(a[c] = d))
                        }
                    } else
                        b = g(b === a ? b.splice(f, b.length) : b),
                            r ? r(null, a, b, l) : J.apply(a, b)
                })
        }
        function y(e) {
            for (var t, n, i, o = e.length, r = T.relative[e[0].type], a = r || T.relative[" "], s = r ? 1 : 0, l = h(function (e) {
                return e === t
            }, a, !0), c = h(function (e) {
                return tt.call(t, e) > -1
            }, a, !0), u = [function (e, n, i) {
                return !r && (i || n !== M) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i))
            }
            ]; o > s; s++)
                if (n = T.relative[e[s].type])
                    u = [h(f(u), n)];
                else {
                    if (n = T.filter[e[s].type].apply(null, e[s].matches),
                        n[H]) {
                        for (i = ++s; o > i && !T.relative[e[i].type]; i++)
                            ;
                        return v(s > 1 && f(u), s > 1 && p(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(lt, "$1"), n, i > s && y(e.slice(s, i)), o > i && y(e = e.slice(i)), o > i && p(e))
                    }
                    u.push(n)
                }
            return f(u)
        }
        function b(e, n) {
            var o = n.length > 0
                , r = e.length > 0
                , a = function (i, a, s, l, c) {
                    var u, d, p, h = 0, f = "0", m = i && [], v = [], y = M, b = i || r && T.find.TAG("*", c), w = j += null == y ? 1 : Math.random() || .1, x = b.length;
                    for (c && (M = a !== D && a); f !== x && null != (u = b[f]); f++) {
                        if (r && u) {
                            for (d = 0; p = e[d++];)
                                if (p(u, a, s)) {
                                    l.push(u);
                                    break
                                }
                            c && (j = w)
                        }
                        o && ((u = !p && u) && h-- ,
                            i && m.push(u))
                    }
                    if (h += f,
                        o && f !== h) {
                        for (d = 0; p = n[d++];)
                            p(m, v, a, s);
                        if (i) {
                            if (h > 0)
                                for (; f--;)
                                    m[f] || v[f] || (v[f] = Y.call(l));
                            v = g(v)
                        }
                        J.apply(l, v),
                            c && !i && v.length > 0 && h + n.length > 1 && t.uniqueSort(l)
                    }
                    return c && (j = w,
                        M = y),
                        m
                };
            return o ? i(a) : a
        }
        var w, x, T, _, C, S, k, E, M, A, I, N, D, P, B, L, R, F, O, H = "sizzle" + -new Date, $ = e.document, j = 0, W = 0, z = n(), q = n(), G = n(), X = function (e, t) {
            return e === t && (I = !0),
                0
        }, U = "undefined", K = 1 << 31, V = {}.hasOwnProperty, Q = [], Y = Q.pop, Z = Q.push, J = Q.push, et = Q.slice, tt = Q.indexOf || function (e) {
            for (var t = 0, n = this.length; n > t; t++)
                if (this[t] === e)
                    return t;
            return -1
        }
            , nt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", it = "[\\x20\\t\\r\\n\\f]", ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", rt = ot.replace("w", "w#"), at = "\\[" + it + "*(" + ot + ")(?:" + it + "*([*^$|!~]?=)" + it + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + rt + "))|)" + it + "*\\]", st = ":(" + ot + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + at + ")*)|.*)\\)|)", lt = new RegExp("^" + it + "+|((?:^|[^\\\\])(?:\\\\.)*)" + it + "+$", "g"), ct = new RegExp("^" + it + "*," + it + "*"), ut = new RegExp("^" + it + "*([>+~]|" + it + ")" + it + "*"), dt = new RegExp("=" + it + "*([^\\]'\"]*?)" + it + "*\\]", "g"), pt = new RegExp(st), ht = new RegExp("^" + rt + "$"), ft = {
                ID: new RegExp("^#(" + ot + ")"),
                CLASS: new RegExp("^\\.(" + ot + ")"),
                TAG: new RegExp("^(" + ot.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + at),
                PSEUDO: new RegExp("^" + st),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + it + "*(even|odd|(([+-]|)(\\d*)n|)" + it + "*(?:([+-]|)" + it + "*(\\d+)|))" + it + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + nt + ")$", "i"),
                needsContext: new RegExp("^" + it + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + it + "*((?:-\\d)?\\d*)" + it + "*\\)|)(?=[^-]|$)", "i")
            }, mt = /^(?:input|select|textarea|button)$/i, gt = /^h\d$/i, vt = /^[^{]+\{\s*\[native \w/, yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, bt = /[+~]/, wt = /'|\\/g, xt = new RegExp("\\\\([\\da-f]{1,6}" + it + "?|(" + it + ")|.)", "ig"), Tt = function (e, t, n) {
                var i = "0x" + t - 65536;
                return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            };
        try {
            J.apply(Q = et.call($.childNodes), $.childNodes),
                Q[$.childNodes.length].nodeType
        } catch (_t) {
            J = {
                apply: Q.length ? function (e, t) {
                    Z.apply(e, et.call(t))
                }
                    : function (e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];)
                            ;
                        e.length = n - 1
                    }
            }
        }
        x = t.support = {},
            C = t.isXML = function (e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? "HTML" !== t.nodeName : !1
            }
            ,
            N = t.setDocument = function (e) {
                var t, n = e ? e.ownerDocument || e : $, i = n.defaultView;
                return n !== D && 9 === n.nodeType && n.documentElement ? (D = n,
                    P = n.documentElement,
                    B = !C(n),
                    i && i !== i.top && (i.addEventListener ? i.addEventListener("unload", function () {
                        N()
                    }, !1) : i.attachEvent && i.attachEvent("onunload", function () {
                        N()
                    })),
                    x.attributes = o(function (e) {
                        return e.className = "i",
                            !e.getAttribute("className")
                    }),
                    x.getElementsByTagName = o(function (e) {
                        return e.appendChild(n.createComment("")),
                            !e.getElementsByTagName("*").length
                    }),
                    x.getElementsByClassName = vt.test(n.getElementsByClassName) && o(function (e) {
                        return e.innerHTML = "<div class='a'></div><div class='a i'></div>",
                            e.firstChild.className = "i",
                            2 === e.getElementsByClassName("i").length
                    }),
                    x.getById = o(function (e) {
                        return P.appendChild(e).id = H,
                            !n.getElementsByName || !n.getElementsByName(H).length
                    }),
                    x.getById ? (T.find.ID = function (e, t) {
                        if (typeof t.getElementById !== U && B) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : []
                        }
                    }
                        ,
                        T.filter.ID = function (e) {
                            var t = e.replace(xt, Tt);
                            return function (e) {
                                return e.getAttribute("id") === t
                            }
                        }
                    ) : (delete T.find.ID,
                        T.filter.ID = function (e) {
                            var t = e.replace(xt, Tt);
                            return function (e) {
                                var n = typeof e.getAttributeNode !== U && e.getAttributeNode("id");
                                return n && n.value === t
                            }
                        }
                        ),
                    T.find.TAG = x.getElementsByTagName ? function (e, t) {
                        return typeof t.getElementsByTagName !== U ? t.getElementsByTagName(e) : void 0
                    }
                        : function (e, t) {
                            var n, i = [], o = 0, r = t.getElementsByTagName(e);
                            if ("*" === e) {
                                for (; n = r[o++];)
                                    1 === n.nodeType && i.push(n);
                                return i
                            }
                            return r
                        }
                    ,
                    T.find.CLASS = x.getElementsByClassName && function (e, t) {
                        return typeof t.getElementsByClassName !== U && B ? t.getElementsByClassName(e) : void 0
                    }
                    ,
                    R = [],
                    L = [],
                    (x.qsa = vt.test(n.querySelectorAll)) && (o(function (e) {
                        e.innerHTML = "<select msallowclip=''><option selected=''></option></select>",
                            e.querySelectorAll("[msallowclip^='']").length && L.push("[*^$]=" + it + "*(?:''|\"\")"),
                            e.querySelectorAll("[selected]").length || L.push("\\[" + it + "*(?:value|" + nt + ")"),
                            e.querySelectorAll(":checked").length || L.push(":checked")
                    }),
                        o(function (e) {
                            var t = n.createElement("input");
                            t.setAttribute("type", "hidden"),
                                e.appendChild(t).setAttribute("name", "D"),
                                e.querySelectorAll("[name=d]").length && L.push("name" + it + "*[*^$|!~]?="),
                                e.querySelectorAll(":enabled").length || L.push(":enabled", ":disabled"),
                                e.querySelectorAll("*,:x"),
                                L.push(",.*:")
                        })),
                    (x.matchesSelector = vt.test(F = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && o(function (e) {
                        x.disconnectedMatch = F.call(e, "div"),
                            F.call(e, "[s!='']:x"),
                            R.push("!=", st)
                    }),
                    L = L.length && new RegExp(L.join("|")),
                    R = R.length && new RegExp(R.join("|")),
                    t = vt.test(P.compareDocumentPosition),
                    O = t || vt.test(P.contains) ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e
                            , i = t && t.parentNode;
                        return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                    }
                        : function (e, t) {
                            if (t)
                                for (; t = t.parentNode;)
                                    if (t === e)
                                        return !0;
                            return !1
                        }
                    ,
                    X = t ? function (e, t) {
                        if (e === t)
                            return I = !0,
                                0;
                        var i = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return i ? i : (i = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1,
                            1 & i || !x.sortDetached && t.compareDocumentPosition(e) === i ? e === n || e.ownerDocument === $ && O($, e) ? -1 : t === n || t.ownerDocument === $ && O($, t) ? 1 : A ? tt.call(A, e) - tt.call(A, t) : 0 : 4 & i ? -1 : 1)
                    }
                        : function (e, t) {
                            if (e === t)
                                return I = !0,
                                    0;
                            var i, o = 0, r = e.parentNode, s = t.parentNode, l = [e], c = [t];
                            if (!r || !s)
                                return e === n ? -1 : t === n ? 1 : r ? -1 : s ? 1 : A ? tt.call(A, e) - tt.call(A, t) : 0;
                            if (r === s)
                                return a(e, t);
                            for (i = e; i = i.parentNode;)
                                l.unshift(i);
                            for (i = t; i = i.parentNode;)
                                c.unshift(i);
                            for (; l[o] === c[o];)
                                o++;
                            return o ? a(l[o], c[o]) : l[o] === $ ? -1 : c[o] === $ ? 1 : 0
                        }
                    ,
                    n) : D
            }
            ,
            t.matches = function (e, n) {
                return t(e, null, null, n)
            }
            ,
            t.matchesSelector = function (e, n) {
                if ((e.ownerDocument || e) !== D && N(e),
                    n = n.replace(dt, "='$1']"),
                    !(!x.matchesSelector || !B || R && R.test(n) || L && L.test(n)))
                    try {
                        var i = F.call(e, n);
                        if (i || x.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                            return i
                    } catch (o) { }
                return t(n, D, null, [e]).length > 0
            }
            ,
            t.contains = function (e, t) {
                return (e.ownerDocument || e) !== D && N(e),
                    O(e, t)
            }
            ,
            t.attr = function (e, t) {
                (e.ownerDocument || e) !== D && N(e);
                var n = T.attrHandle[t.toLowerCase()]
                    , i = n && V.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !B) : void 0;
                return void 0 !== i ? i : x.attributes || !B ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }
            ,
            t.error = function (e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }
            ,
            t.uniqueSort = function (e) {
                var t, n = [], i = 0, o = 0;
                if (I = !x.detectDuplicates,
                    A = !x.sortStable && e.slice(0),
                    e.sort(X),
                    I) {
                    for (; t = e[o++];)
                        t === e[o] && (i = n.push(o));
                    for (; i--;)
                        e.splice(n[i], 1)
                }
                return A = null,
                    e
            }
            ,
            _ = t.getText = function (e) {
                var t, n = "", i = 0, o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent)
                            return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling)
                            n += _(e)
                    } else if (3 === o || 4 === o)
                        return e.nodeValue
                } else
                    for (; t = e[i++];)
                        n += _(t);
                return n
            }
            ,
            T = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: ft,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function (e) {
                        return e[1] = e[1].replace(xt, Tt),
                            e[3] = (e[3] || e[4] || e[5] || "").replace(xt, Tt),
                            "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                    },
                    CHILD: function (e) {
                        return e[1] = e[1].toLowerCase(),
                            "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                                e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                                e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                            e
                    },
                    PSEUDO: function (e) {
                        var t, n = !e[6] && e[2];
                        return ft.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pt.test(n) && (t = S(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                            e[2] = n.slice(0, t)),
                            e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function (e) {
                        var t = e.replace(xt, Tt).toLowerCase();
                        return "*" === e ? function () {
                            return !0
                        }
                            : function (e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                    },
                    CLASS: function (e) {
                        var t = z[e + " "];
                        return t || (t = new RegExp("(^|" + it + ")" + e + "(" + it + "|$)")) && z(e, function (e) {
                            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== U && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function (e, n, i) {
                        return function (o) {
                            var r = t.attr(o, e);
                            return null == r ? "!=" === n : n ? (r += "",
                                "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r + " ").indexOf(i) > -1 : "|=" === n ? r === i || r.slice(0, i.length + 1) === i + "-" : !1) : !0
                        }
                    },
                    CHILD: function (e, t, n, i, o) {
                        var r = "nth" !== e.slice(0, 3)
                            , a = "last" !== e.slice(-4)
                            , s = "of-type" === t;
                        return 1 === i && 0 === o ? function (e) {
                            return !!e.parentNode
                        }
                            : function (t, n, l) {
                                var c, u, d, p, h, f, m = r !== a ? "nextSibling" : "previousSibling", g = t.parentNode, v = s && t.nodeName.toLowerCase(), y = !l && !s;
                                if (g) {
                                    if (r) {
                                        for (; m;) {
                                            for (d = t; d = d[m];)
                                                if (s ? d.nodeName.toLowerCase() === v : 1 === d.nodeType)
                                                    return !1;
                                            f = m = "only" === e && !f && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (f = [a ? g.firstChild : g.lastChild],
                                        a && y) {
                                        for (u = g[H] || (g[H] = {}),
                                            c = u[e] || [],
                                            h = c[0] === j && c[1],
                                            p = c[0] === j && c[2],
                                            d = h && g.childNodes[h]; d = ++h && d && d[m] || (p = h = 0) || f.pop();)
                                            if (1 === d.nodeType && ++p && d === t) {
                                                u[e] = [j, h, p];
                                                break
                                            }
                                    } else if (y && (c = (t[H] || (t[H] = {}))[e]) && c[0] === j)
                                        p = c[1];
                                    else
                                        for (; (d = ++h && d && d[m] || (p = h = 0) || f.pop()) && ((s ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++p || (y && ((d[H] || (d[H] = {}))[e] = [j, p]),
                                            d !== t));)
                                            ;
                                    return p -= o,
                                        p === i || p % i === 0 && p / i >= 0
                                }
                            }
                    },
                    PSEUDO: function (e, n) {
                        var o, r = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return r[H] ? r(n) : r.length > 1 ? (o = [e, e, "", n],
                            T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
                                for (var i, o = r(e, n), a = o.length; a--;)
                                    i = tt.call(e, o[a]),
                                        e[i] = !(t[i] = o[a])
                            }) : function (e) {
                                return r(e, 0, o)
                            }
                        ) : r
                    }
                },
                pseudos: {
                    not: i(function (e) {
                        var t = []
                            , n = []
                            , o = k(e.replace(lt, "$1"));
                        return o[H] ? i(function (e, t, n, i) {
                            for (var r, a = o(e, null, i, []), s = e.length; s--;)
                                (r = a[s]) && (e[s] = !(t[s] = r))
                        }) : function (e, i, r) {
                            return t[0] = e,
                                o(t, null, r, n),
                                !n.pop()
                        }
                    }),
                    has: i(function (e) {
                        return function (n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: i(function (e) {
                        return function (t) {
                            return (t.textContent || t.innerText || _(t)).indexOf(e) > -1
                        }
                    }),
                    lang: i(function (e) {
                        return ht.test(e || "") || t.error("unsupported lang: " + e),
                            e = e.replace(xt, Tt).toLowerCase(),
                            function (t) {
                                var n;
                                do
                                    if (n = B ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                        return n = n.toLowerCase(),
                                            n === e || 0 === n.indexOf(e + "-");
                                while ((t = t.parentNode) && 1 === t.nodeType); return !1
                            }
                    }),
                    target: function (t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function (e) {
                        return e === P
                    },
                    focus: function (e) {
                        return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function (e) {
                        return e.disabled === !1
                    },
                    disabled: function (e) {
                        return e.disabled === !0
                    },
                    checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function (e) {
                        return e.parentNode && e.parentNode.selectedIndex,
                            e.selected === !0
                    },
                    empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6)
                                return !1;
                        return !0
                    },
                    parent: function (e) {
                        return !T.pseudos.empty(e)
                    },
                    header: function (e) {
                        return gt.test(e.nodeName)
                    },
                    input: function (e) {
                        return mt.test(e.nodeName)
                    },
                    button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function (e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: c(function () {
                        return [0]
                    }),
                    last: c(function (e, t) {
                        return [t - 1]
                    }),
                    eq: c(function (e, t, n) {
                        return [0 > n ? n + t : n]
                    }),
                    even: c(function (e, t) {
                        for (var n = 0; t > n; n += 2)
                            e.push(n);
                        return e
                    }),
                    odd: c(function (e, t) {
                        for (var n = 1; t > n; n += 2)
                            e.push(n);
                        return e
                    }),
                    lt: c(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; --i >= 0;)
                            e.push(i);
                        return e
                    }),
                    gt: c(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; ++i < t;)
                            e.push(i);
                        return e
                    })
                }
            },
            T.pseudos.nth = T.pseudos.eq;
        for (w in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            T.pseudos[w] = s(w);
        for (w in {
            submit: !0,
            reset: !0
        })
            T.pseudos[w] = l(w);
        return d.prototype = T.filters = T.pseudos,
            T.setFilters = new d,
            S = t.tokenize = function (e, n) {
                var i, o, r, a, s, l, c, u = q[e + " "];
                if (u)
                    return n ? 0 : u.slice(0);
                for (s = e,
                    l = [],
                    c = T.preFilter; s;) {
                    (!i || (o = ct.exec(s))) && (o && (s = s.slice(o[0].length) || s),
                        l.push(r = [])),
                        i = !1,
                        (o = ut.exec(s)) && (i = o.shift(),
                            r.push({
                                value: i,
                                type: o[0].replace(lt, " ")
                            }),
                            s = s.slice(i.length));
                    for (a in T.filter)
                        !(o = ft[a].exec(s)) || c[a] && !(o = c[a](o)) || (i = o.shift(),
                            r.push({
                                value: i,
                                type: a,
                                matches: o
                            }),
                            s = s.slice(i.length));
                    if (!i)
                        break
                }
                return n ? s.length : s ? t.error(e) : q(e, l).slice(0)
            }
            ,
            k = t.compile = function (e, t) {
                var n, i = [], o = [], r = G[e + " "];
                if (!r) {
                    for (t || (t = S(e)),
                        n = t.length; n--;)
                        r = y(t[n]),
                            r[H] ? i.push(r) : o.push(r);
                    r = G(e, b(o, i)),
                        r.selector = e
                }
                return r
            }
            ,
            E = t.select = function (e, t, n, i) {
                var o, r, a, s, l, c = "function" == typeof e && e, d = !i && S(e = c.selector || e);
                if (n = n || [],
                    1 === d.length) {
                    if (r = d[0] = d[0].slice(0),
                        r.length > 2 && "ID" === (a = r[0]).type && x.getById && 9 === t.nodeType && B && T.relative[r[1].type]) {
                        if (t = (T.find.ID(a.matches[0].replace(xt, Tt), t) || [])[0],
                            !t)
                            return n;
                        c && (t = t.parentNode),
                            e = e.slice(r.shift().value.length)
                    }
                    for (o = ft.needsContext.test(e) ? 0 : r.length; o-- && (a = r[o],
                        !T.relative[s = a.type]);)
                        if ((l = T.find[s]) && (i = l(a.matches[0].replace(xt, Tt), bt.test(r[0].type) && u(t.parentNode) || t))) {
                            if (r.splice(o, 1),
                                e = i.length && p(r),
                                !e)
                                return J.apply(n, i),
                                    n;
                            break
                        }
                }
                return (c || k(e, d))(i, t, !B, n, bt.test(e) && u(t.parentNode) || t),
                    n
            }
            ,
            x.sortStable = H.split("").sort(X).join("") === H,
            x.detectDuplicates = !!I,
            N(),
            x.sortDetached = o(function (e) {
                return 1 & e.compareDocumentPosition(D.createElement("div"))
            }),
            o(function (e) {
                return e.innerHTML = "<a href='#'></a>",
                    "#" === e.firstChild.getAttribute("href")
            }) || r("type|href|height|width", function (e, t, n) {
                return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }),
            x.attributes && o(function (e) {
                return e.innerHTML = "<input/>",
                    e.firstChild.setAttribute("value", ""),
                    "" === e.firstChild.getAttribute("value")
            }) || r("value", function (e, t, n) {
                return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
            }),
            o(function (e) {
                return null == e.getAttribute("disabled")
            }) || r(nt, function (e, t, n) {
                var i;
                return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }),
            t
    }(e);
    ot.find = ct,
        ot.expr = ct.selectors,
        ot.expr[":"] = ot.expr.pseudos,
        ot.unique = ct.uniqueSort,
        ot.text = ct.getText,
        ot.isXMLDoc = ct.isXML,
        ot.contains = ct.contains;
    var ut = ot.expr.match.needsContext
        , dt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
        , pt = /^.[^:#\[\.,]*$/;
    ot.filter = function (e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"),
            1 === t.length && 1 === i.nodeType ? ot.find.matchesSelector(i, e) ? [i] : [] : ot.find.matches(e, ot.grep(t, function (e) {
                return 1 === e.nodeType
            }))
    }
        ,
        ot.fn.extend({
            find: function (e) {
                var t, n = [], i = this, o = i.length;
                if ("string" != typeof e)
                    return this.pushStack(ot(e).filter(function () {
                        for (t = 0; o > t; t++)
                            if (ot.contains(i[t], this))
                                return !0
                    }));
                for (t = 0; o > t; t++)
                    ot.find(e, i[t], n);
                return n = this.pushStack(o > 1 ? ot.unique(n) : n),
                    n.selector = this.selector ? this.selector + " " + e : e,
                    n
            },
            filter: function (e) {
                return this.pushStack(i(this, e || [], !1))
            },
            not: function (e) {
                return this.pushStack(i(this, e || [], !0))
            },
            is: function (e) {
                return !!i(this, "string" == typeof e && ut.test(e) ? ot(e) : e || [], !1).length
            }
        });
    var ht, ft = e.document, mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, gt = ot.fn.init = function (e, t) {
        var n, i;
        if (!e)
            return this;
        if ("string" == typeof e) {
            if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e),
                !n || !n[1] && t)
                return !t || t.jquery ? (t || ht).find(e) : this.constructor(t).find(e);
            if (n[1]) {
                if (t = t instanceof ot ? t[0] : t,
                    ot.merge(this, ot.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : ft, !0)),
                    dt.test(n[1]) && ot.isPlainObject(t))
                    for (n in t)
                        ot.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                return this
            }
            if (i = ft.getElementById(n[2]),
                i && i.parentNode) {
                if (i.id !== n[2])
                    return ht.find(e);
                this.length = 1,
                    this[0] = i
            }
            return this.context = ft,
                this.selector = e,
                this
        }
        return e.nodeType ? (this.context = this[0] = e,
            this.length = 1,
            this) : ot.isFunction(e) ? "undefined" != typeof ht.ready ? ht.ready(e) : e(ot) : (void 0 !== e.selector && (this.selector = e.selector,
                this.context = e.context),
                ot.makeArray(e, this))
    }
        ;
    gt.prototype = ot.fn,
        ht = ot(ft);
    var vt = /^(?:parents|prev(?:Until|All))/
        , yt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ot.extend({
        dir: function (e, t, n) {
            for (var i = [], o = e[t]; o && 9 !== o.nodeType && (void 0 === n || 1 !== o.nodeType || !ot(o).is(n));)
                1 === o.nodeType && i.push(o),
                    o = o[t];
            return i
        },
        sibling: function (e, t) {
            for (var n = []; e; e = e.nextSibling)
                1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }),
        ot.fn.extend({
            has: function (e) {
                var t, n = ot(e, this), i = n.length;
                return this.filter(function () {
                    for (t = 0; i > t; t++)
                        if (ot.contains(this, n[t]))
                            return !0
                })
            },
            closest: function (e, t) {
                for (var n, i = 0, o = this.length, r = [], a = ut.test(e) || "string" != typeof e ? ot(e, t || this.context) : 0; o > i; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && ot.find.matchesSelector(n, e))) {
                            r.push(n);
                            break
                        }
                return this.pushStack(r.length > 1 ? ot.unique(r) : r)
            },
            index: function (e) {
                return e ? "string" == typeof e ? ot.inArray(this[0], ot(e)) : ot.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function (e, t) {
                return this.pushStack(ot.unique(ot.merge(this.get(), ot(e, t))))
            },
            addBack: function (e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }),
        ot.each({
            parent: function (e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function (e) {
                return ot.dir(e, "parentNode")
            },
            parentsUntil: function (e, t, n) {
                return ot.dir(e, "parentNode", n)
            },
            next: function (e) {
                return o(e, "nextSibling")
            },
            prev: function (e) {
                return o(e, "previousSibling")
            },
            nextAll: function (e) {
                return ot.dir(e, "nextSibling")
            },
            prevAll: function (e) {
                return ot.dir(e, "previousSibling")
            },
            nextUntil: function (e, t, n) {
                return ot.dir(e, "nextSibling", n)
            },
            prevUntil: function (e, t, n) {
                return ot.dir(e, "previousSibling", n)
            },
            siblings: function (e) {
                return ot.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function (e) {
                return ot.sibling(e.firstChild)
            },
            contents: function (e) {
                return ot.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ot.merge([], e.childNodes)
            }
        }, function (e, t) {
            ot.fn[e] = function (n, i) {
                var o = ot.map(this, t, n);
                return "Until" !== e.slice(-5) && (i = n),
                    i && "string" == typeof i && (o = ot.filter(i, o)),
                    this.length > 1 && (yt[e] || (o = ot.unique(o)),
                        vt.test(e) && (o = o.reverse())),
                    this.pushStack(o)
            }
        });
    var bt = /\S+/g
        , wt = {};
    ot.Callbacks = function (e) {
        e = "string" == typeof e ? wt[e] || r(e) : ot.extend({}, e);
        var t, n, i, o, a, s, l = [], c = !e.once && [], u = function (r) {
            for (n = e.memory && r,
                i = !0,
                a = s || 0,
                s = 0,
                o = l.length,
                t = !0; l && o > a; a++)
                if (l[a].apply(r[0], r[1]) === !1 && e.stopOnFalse) {
                    n = !1;
                    break
                }
            t = !1,
                l && (c ? c.length && u(c.shift()) : n ? l = [] : d.disable())
        }, d = {
            add: function () {
                if (l) {
                    var i = l.length;
                    !function r(t) {
                        ot.each(t, function (t, n) {
                            var i = ot.type(n);
                            "function" === i ? e.unique && d.has(n) || l.push(n) : n && n.length && "string" !== i && r(n)
                        })
                    }(arguments),
                        t ? o = l.length : n && (s = i,
                            u(n))
                }
                return this
            },
            remove: function () {
                return l && ot.each(arguments, function (e, n) {
                    for (var i; (i = ot.inArray(n, l, i)) > -1;)
                        l.splice(i, 1),
                            t && (o >= i && o-- ,
                                a >= i && a--)
                }),
                    this
            },
            has: function (e) {
                return e ? ot.inArray(e, l) > -1 : !(!l || !l.length)
            },
            empty: function () {
                return l = [],
                    o = 0,
                    this
            },
            disable: function () {
                return l = c = n = void 0,
                    this
            },
            disabled: function () {
                return !l
            },
            lock: function () {
                return c = void 0,
                    n || d.disable(),
                    this
            },
            locked: function () {
                return !c
            },
            fireWith: function (e, n) {
                return !l || i && !c || (n = n || [],
                    n = [e, n.slice ? n.slice() : n],
                    t ? c.push(n) : u(n)),
                    this
            },
            fire: function () {
                return d.fireWith(this, arguments),
                    this
            },
            fired: function () {
                return !!i
            }
        };
        return d
    }
        ,
        ot.extend({
            Deferred: function (e) {
                var t = [["resolve", "done", ot.Callbacks("once memory"), "resolved"], ["reject", "fail", ot.Callbacks("once memory"), "rejected"], ["notify", "progress", ot.Callbacks("memory")]]
                    , n = "pending"
                    , i = {
                        state: function () {
                            return n
                        },
                        always: function () {
                            return o.done(arguments).fail(arguments),
                                this
                        },
                        then: function () {
                            var e = arguments;
                            return ot.Deferred(function (n) {
                                ot.each(t, function (t, r) {
                                    var a = ot.isFunction(e[t]) && e[t];
                                    o[r[1]](function () {
                                        var e = a && a.apply(this, arguments);
                                        e && ot.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[r[0] + "With"](this === i ? n.promise() : this, a ? [e] : arguments)
                                    })
                                }),
                                    e = null
                            }).promise()
                        },
                        promise: function (e) {
                            return null != e ? ot.extend(e, i) : i
                        }
                    }
                    , o = {};
                return i.pipe = i.then,
                    ot.each(t, function (e, r) {
                        var a = r[2]
                            , s = r[3];
                        i[r[1]] = a.add,
                            s && a.add(function () {
                                n = s
                            }, t[1 ^ e][2].disable, t[2][2].lock),
                            o[r[0]] = function () {
                                return o[r[0] + "With"](this === o ? i : this, arguments),
                                    this
                            }
                            ,
                            o[r[0] + "With"] = a.fireWith
                    }),
                    i.promise(o),
                    e && e.call(o, o),
                    o
            },
            when: function (e) {
                var t, n, i, o = 0, r = V.call(arguments), a = r.length, s = 1 !== a || e && ot.isFunction(e.promise) ? a : 0, l = 1 === s ? e : ot.Deferred(), c = function (e, n, i) {
                    return function (o) {
                        n[e] = this,
                            i[e] = arguments.length > 1 ? V.call(arguments) : o,
                            i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
                    }
                };
                if (a > 1)
                    for (t = new Array(a),
                        n = new Array(a),
                        i = new Array(a); a > o; o++)
                        r[o] && ot.isFunction(r[o].promise) ? r[o].promise().done(c(o, i, r)).fail(l.reject).progress(c(o, n, t)) : --s;
                return s || l.resolveWith(i, r),
                    l.promise()
            }
        });
    var xt;
    ot.fn.ready = function (e) {
        return ot.ready.promise().done(e),
            this
    }
        ,
        ot.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function (e) {
                e ? ot.readyWait++ : ot.ready(!0)
            },
            ready: function (e) {
                if (e === !0 ? !--ot.readyWait : !ot.isReady) {
                    if (!ft.body)
                        return setTimeout(ot.ready);
                    ot.isReady = !0,
                        e !== !0 && --ot.readyWait > 0 || (xt.resolveWith(ft, [ot]),
                            ot.fn.triggerHandler && (ot(ft).triggerHandler("ready"),
                                ot(ft).off("ready")))
                }
            }
        }),
        ot.ready.promise = function (t) {
            if (!xt)
                if (xt = ot.Deferred(),
                    "complete" === ft.readyState)
                    setTimeout(ot.ready);
                else if (ft.addEventListener)
                    ft.addEventListener("DOMContentLoaded", s, !1),
                        e.addEventListener("load", s, !1);
                else {
                    ft.attachEvent("onreadystatechange", s),
                        e.attachEvent("onload", s);
                    var n = !1;
                    try {
                        n = null == e.frameElement && ft.documentElement
                    } catch (i) { }
                    n && n.doScroll && !function o() {
                        if (!ot.isReady) {
                            try {
                                n.doScroll("left")
                            } catch (e) {
                                return setTimeout(o, 50)
                            }
                            a(),
                                ot.ready()
                        }
                    }()
                }
            return xt.promise(t)
        }
        ;
    var Tt, _t = "undefined";
    for (Tt in ot(nt))
        break;
    nt.ownLast = "0" !== Tt,
        nt.inlineBlockNeedsLayout = !1,
        ot(function () {
            var e, t, n, i;
            n = ft.getElementsByTagName("body")[0],
                n && n.style && (t = ft.createElement("div"),
                    i = ft.createElement("div"),
                    i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    n.appendChild(i).appendChild(t),
                    typeof t.style.zoom !== _t && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",
                        nt.inlineBlockNeedsLayout = e = 3 === t.offsetWidth,
                        e && (n.style.zoom = 1)),
                    n.removeChild(i))
        }),
        function () {
            var e = ft.createElement("div");
            if (null == nt.deleteExpando) {
                nt.deleteExpando = !0;
                try {
                    delete e.test
                } catch (t) {
                    nt.deleteExpando = !1
                }
            }
            e = null
        }(),
        ot.acceptData = function (e) {
            var t = ot.noData[(e.nodeName + " ").toLowerCase()]
                , n = +e.nodeType || 1;
            return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
        }
        ;
    var Ct = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
        , St = /([A-Z])/g;
    ot.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function (e) {
            return e = e.nodeType ? ot.cache[e[ot.expando]] : e[ot.expando],
                !!e && !c(e)
        },
        data: function (e, t, n) {
            return u(e, t, n)
        },
        removeData: function (e, t) {
            return d(e, t)
        },
        _data: function (e, t, n) {
            return u(e, t, n, !0)
        },
        _removeData: function (e, t) {
            return d(e, t, !0)
        }
    }),
        ot.fn.extend({
            data: function (e, t) {
                var n, i, o, r = this[0], a = r && r.attributes;
                if (void 0 === e) {
                    if (this.length && (o = ot.data(r),
                        1 === r.nodeType && !ot._data(r, "parsedAttrs"))) {
                        for (n = a.length; n--;)
                            a[n] && (i = a[n].name,
                                0 === i.indexOf("data-") && (i = ot.camelCase(i.slice(5)),
                                    l(r, i, o[i])));
                        ot._data(r, "parsedAttrs", !0)
                    }
                    return o
                }
                return "object" == typeof e ? this.each(function () {
                    ot.data(this, e)
                }) : arguments.length > 1 ? this.each(function () {
                    ot.data(this, e, t)
                }) : r ? l(r, e, ot.data(r, e)) : void 0
            },
            removeData: function (e) {
                return this.each(function () {
                    ot.removeData(this, e)
                })
            }
        }),
        ot.extend({
            queue: function (e, t, n) {
                var i;
                return e ? (t = (t || "fx") + "queue",
                    i = ot._data(e, t),
                    n && (!i || ot.isArray(n) ? i = ot._data(e, t, ot.makeArray(n)) : i.push(n)),
                    i || []) : void 0
            },
            dequeue: function (e, t) {
                t = t || "fx";
                var n = ot.queue(e, t)
                    , i = n.length
                    , o = n.shift()
                    , r = ot._queueHooks(e, t)
                    , a = function () {
                        ot.dequeue(e, t)
                    };
                "inprogress" === o && (o = n.shift(),
                    i--),
                    o && ("fx" === t && n.unshift("inprogress"),
                        delete r.stop,
                        o.call(e, a, r)),
                    !i && r && r.empty.fire()
            },
            _queueHooks: function (e, t) {
                var n = t + "queueHooks";
                return ot._data(e, n) || ot._data(e, n, {
                    empty: ot.Callbacks("once memory").add(function () {
                        ot._removeData(e, t + "queue"),
                            ot._removeData(e, n)
                    })
                })
            }
        }),
        ot.fn.extend({
            queue: function (e, t) {
                var n = 2;
                return "string" != typeof e && (t = e,
                    e = "fx",
                    n--),
                    arguments.length < n ? ot.queue(this[0], e) : void 0 === t ? this : this.each(function () {
                        var n = ot.queue(this, e, t);
                        ot._queueHooks(this, e),
                            "fx" === e && "inprogress" !== n[0] && ot.dequeue(this, e)
                    })
            },
            dequeue: function (e) {
                return this.each(function () {
                    ot.dequeue(this, e)
                })
            },
            clearQueue: function (e) {
                return this.queue(e || "fx", [])
            },
            promise: function (e, t) {
                var n, i = 1, o = ot.Deferred(), r = this, a = this.length, s = function () {
                    --i || o.resolveWith(r, [r])
                };
                for ("string" != typeof e && (t = e,
                    e = void 0),
                    e = e || "fx"; a--;)
                    n = ot._data(r[a], e + "queueHooks"),
                        n && n.empty && (i++ ,
                            n.empty.add(s));
                return s(),
                    o.promise(t)
            }
        });
    var kt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
        , Et = ["Top", "Right", "Bottom", "Left"]
        , Mt = function (e, t) {
            return e = t || e,
                "none" === ot.css(e, "display") || !ot.contains(e.ownerDocument, e)
        }
        , At = ot.access = function (e, t, n, i, o, r, a) {
            var s = 0
                , l = e.length
                , c = null == n;
            if ("object" === ot.type(n)) {
                o = !0;
                for (s in n)
                    ot.access(e, t, s, n[s], !0, r, a)
            } else if (void 0 !== i && (o = !0,
                ot.isFunction(i) || (a = !0),
                c && (a ? (t.call(e, i),
                    t = null) : (c = t,
                        t = function (e, t, n) {
                            return c.call(ot(e), n)
                        }
                    )),
                t))
                for (; l > s; s++)
                    t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)));
            return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
        }
        , It = /^(?:checkbox|radio)$/i;
    !function () {
        var e = ft.createElement("input")
            , t = ft.createElement("div")
            , n = ft.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
            nt.leadingWhitespace = 3 === t.firstChild.nodeType,
            nt.tbody = !t.getElementsByTagName("tbody").length,
            nt.htmlSerialize = !!t.getElementsByTagName("link").length,
            nt.html5Clone = "<:nav></:nav>" !== ft.createElement("nav").cloneNode(!0).outerHTML,
            e.type = "checkbox",
            e.checked = !0,
            n.appendChild(e),
            nt.appendChecked = e.checked,
            t.innerHTML = "<textarea>x</textarea>",
            nt.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue,
            n.appendChild(t),
            t.innerHTML = "<input type='radio' checked='checked' name='t'/>",
            nt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked,
            nt.noCloneEvent = !0,
            t.attachEvent && (t.attachEvent("onclick", function () {
                nt.noCloneEvent = !1
            }),
                t.cloneNode(!0).click()),
            null == nt.deleteExpando) {
            nt.deleteExpando = !0;
            try {
                delete t.test
            } catch (i) {
                nt.deleteExpando = !1
            }
        }
    }(),
        function () {
            var t, n, i = ft.createElement("div");
            for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            })
                n = "on" + t,
                    (nt[t + "Bubbles"] = n in e) || (i.setAttribute(n, "t"),
                        nt[t + "Bubbles"] = i.attributes[n].expando === !1);
            i = null
        }();
    var Nt = /^(?:input|select|textarea)$/i
        , Dt = /^key/
        , Pt = /^(?:mouse|pointer|contextmenu)|click/
        , Bt = /^(?:focusinfocus|focusoutblur)$/
        , Lt = /^([^.]*)(?:\.(.+)|)$/;
    ot.event = {
        global: {},
        add: function (e, t, n, i, o) {
            var r, a, s, l, c, u, d, p, h, f, m, g = ot._data(e);
            if (g) {
                for (n.handler && (l = n,
                    n = l.handler,
                    o = l.selector),
                    n.guid || (n.guid = ot.guid++),
                    (a = g.events) || (a = g.events = {}),
                    (u = g.handle) || (u = g.handle = function (e) {
                        return typeof ot === _t || e && ot.event.triggered === e.type ? void 0 : ot.event.dispatch.apply(u.elem, arguments)
                    }
                        ,
                        u.elem = e),
                    t = (t || "").match(bt) || [""],
                    s = t.length; s--;)
                    r = Lt.exec(t[s]) || [],
                        h = m = r[1],
                        f = (r[2] || "").split(".").sort(),
                        h && (c = ot.event.special[h] || {},
                            h = (o ? c.delegateType : c.bindType) || h,
                            c = ot.event.special[h] || {},
                            d = ot.extend({
                                type: h,
                                origType: m,
                                data: i,
                                handler: n,
                                guid: n.guid,
                                selector: o,
                                needsContext: o && ot.expr.match.needsContext.test(o),
                                namespace: f.join(".")
                            }, l),
                            (p = a[h]) || (p = a[h] = [],
                                p.delegateCount = 0,
                                c.setup && c.setup.call(e, i, f, u) !== !1 || (e.addEventListener ? e.addEventListener(h, u, !1) : e.attachEvent && e.attachEvent("on" + h, u))),
                            c.add && (c.add.call(e, d),
                                d.handler.guid || (d.handler.guid = n.guid)),
                            o ? p.splice(p.delegateCount++, 0, d) : p.push(d),
                            ot.event.global[h] = !0);
                e = null
            }
        },
        remove: function (e, t, n, i, o) {
            var r, a, s, l, c, u, d, p, h, f, m, g = ot.hasData(e) && ot._data(e);
            if (g && (u = g.events)) {
                for (t = (t || "").match(bt) || [""],
                    c = t.length; c--;)
                    if (s = Lt.exec(t[c]) || [],
                        h = m = s[1],
                        f = (s[2] || "").split(".").sort(),
                        h) {
                        for (d = ot.event.special[h] || {},
                            h = (i ? d.delegateType : d.bindType) || h,
                            p = u[h] || [],
                            s = s[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                            l = r = p.length; r--;)
                            a = p[r],
                                !o && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (p.splice(r, 1),
                                    a.selector && p.delegateCount-- ,
                                    d.remove && d.remove.call(e, a));
                        l && !p.length && (d.teardown && d.teardown.call(e, f, g.handle) !== !1 || ot.removeEvent(e, h, g.handle),
                            delete u[h])
                    } else
                        for (h in u)
                            ot.event.remove(e, h + t[c], n, i, !0);
                ot.isEmptyObject(u) && (delete g.handle,
                    ot._removeData(e, "events"))
            }
        },
        trigger: function (t, n, i, o) {
            var r, a, s, l, c, u, d, p = [i || ft], h = tt.call(t, "type") ? t.type : t, f = tt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = u = i = i || ft,
                3 !== i.nodeType && 8 !== i.nodeType && !Bt.test(h + ot.event.triggered) && (h.indexOf(".") >= 0 && (f = h.split("."),
                    h = f.shift(),
                    f.sort()),
                    a = h.indexOf(":") < 0 && "on" + h,
                    t = t[ot.expando] ? t : new ot.Event(h, "object" == typeof t && t),
                    t.isTrigger = o ? 2 : 3,
                    t.namespace = f.join("."),
                    t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
                    t.result = void 0,
                    t.target || (t.target = i),
                    n = null == n ? [t] : ot.makeArray(n, [t]),
                    c = ot.event.special[h] || {},
                    o || !c.trigger || c.trigger.apply(i, n) !== !1)) {
                if (!o && !c.noBubble && !ot.isWindow(i)) {
                    for (l = c.delegateType || h,
                        Bt.test(l + h) || (s = s.parentNode); s; s = s.parentNode)
                        p.push(s),
                            u = s;
                    u === (i.ownerDocument || ft) && p.push(u.defaultView || u.parentWindow || e)
                }
                for (d = 0; (s = p[d++]) && !t.isPropagationStopped();)
                    t.type = d > 1 ? l : c.bindType || h,
                        r = (ot._data(s, "events") || {})[t.type] && ot._data(s, "handle"),
                        r && r.apply(s, n),
                        r = a && s[a],
                        r && r.apply && ot.acceptData(s) && (t.result = r.apply(s, n),
                            t.result === !1 && t.preventDefault());
                if (t.type = h,
                    !o && !t.isDefaultPrevented() && (!c._default || c._default.apply(p.pop(), n) === !1) && ot.acceptData(i) && a && i[h] && !ot.isWindow(i)) {
                    u = i[a],
                        u && (i[a] = null),
                        ot.event.triggered = h;
                    try {
                        i[h]()
                    } catch (m) { }
                    ot.event.triggered = void 0,
                        u && (i[a] = u)
                }
                return t.result
            }
        },
        dispatch: function (e) {
            e = ot.event.fix(e);
            var t, n, i, o, r, a = [], s = V.call(arguments), l = (ot._data(this, "events") || {})[e.type] || [], c = ot.event.special[e.type] || {};
            if (s[0] = e,
                e.delegateTarget = this,
                !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (a = ot.event.handlers.call(this, e, l),
                    t = 0; (o = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem,
                        r = 0; (i = o.handlers[r++]) && !e.isImmediatePropagationStopped();)
                        (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i,
                            e.data = i.data,
                            n = ((ot.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, s),
                            void 0 !== n && (e.result = n) === !1 && (e.preventDefault(),
                                e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e),
                    e.result
            }
        },
        handlers: function (e, t) {
            var n, i, o, r, a = [], s = t.delegateCount, l = e.target;
            if (s && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (o = [],
                            r = 0; s > r; r++)
                            i = t[r],
                                n = i.selector + " ",
                                void 0 === o[n] && (o[n] = i.needsContext ? ot(n, this).index(l) >= 0 : ot.find(n, this, null, [l]).length),
                                o[n] && o.push(i);
                        o.length && a.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }),
                a
        },
        fix: function (e) {
            if (e[ot.expando])
                return e;
            var t, n, i, o = e.type, r = e, a = this.fixHooks[o];
            for (a || (this.fixHooks[o] = a = Pt.test(o) ? this.mouseHooks : Dt.test(o) ? this.keyHooks : {}),
                i = a.props ? this.props.concat(a.props) : this.props,
                e = new ot.Event(r),
                t = i.length; t--;)
                n = i[t],
                    e[n] = r[n];
            return e.target || (e.target = r.srcElement || ft),
                3 === e.target.nodeType && (e.target = e.target.parentNode),
                e.metaKey = !!e.metaKey,
                a.filter ? a.filter(e, r) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode),
                    e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, t) {
                var n, i, o, r = t.button, a = t.fromElement;
                return null == e.pageX && null != t.clientX && (i = e.target.ownerDocument || ft,
                    o = i.documentElement,
                    n = i.body,
                    e.pageX = t.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0),
                    e.pageY = t.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)),
                    !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a),
                    e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0),
                    e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    if (this !== f() && this.focus)
                        try {
                            return this.focus(),
                                !1
                        } catch (e) { }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    return this === f() && this.blur ? (this.blur(),
                        !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    return ot.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(),
                        !1) : void 0
                },
                _default: function (e) {
                    return ot.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function (e, t, n, i) {
            var o = ot.extend(new ot.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? ot.event.trigger(o, null, t) : ot.event.dispatch.call(t, o),
                o.isDefaultPrevented() && n.preventDefault()
        }
    },
        ot.removeEvent = ft.removeEventListener ? function (e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        }
            : function (e, t, n) {
                var i = "on" + t;
                e.detachEvent && (typeof e[i] === _t && (e[i] = null),
                    e.detachEvent(i, n))
            }
        ,
        ot.Event = function (e, t) {
            return this instanceof ot.Event ? (e && e.type ? (this.originalEvent = e,
                this.type = e.type,
                this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : h) : this.type = e,
                t && ot.extend(this, t),
                this.timeStamp = e && e.timeStamp || ot.now(),
                void (this[ot.expando] = !0)) : new ot.Event(e, t)
        }
        ,
        ot.Event.prototype = {
            isDefaultPrevented: h,
            isPropagationStopped: h,
            isImmediatePropagationStopped: h,
            preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = p,
                    e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = p,
                    e && (e.stopPropagation && e.stopPropagation(),
                        e.cancelBubble = !0)
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = p,
                    e && e.stopImmediatePropagation && e.stopImmediatePropagation(),
                    this.stopPropagation()
            }
        },
        ot.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function (e, t) {
            ot.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function (e) {
                    var n, i = this, o = e.relatedTarget, r = e.handleObj;
                    return (!o || o !== i && !ot.contains(i, o)) && (e.type = r.origType,
                        n = r.handler.apply(this, arguments),
                        e.type = t),
                        n
                }
            }
        }),
        nt.submitBubbles || (ot.event.special.submit = {
            setup: function () {
                return ot.nodeName(this, "form") ? !1 : void ot.event.add(this, "click._submit keypress._submit", function (e) {
                    var t = e.target
                        , n = ot.nodeName(t, "input") || ot.nodeName(t, "button") ? t.form : void 0;
                    n && !ot._data(n, "submitBubbles") && (ot.event.add(n, "submit._submit", function (e) {
                        e._submit_bubble = !0
                    }),
                        ot._data(n, "submitBubbles", !0))
                })
            },
            postDispatch: function (e) {
                e._submit_bubble && (delete e._submit_bubble,
                    this.parentNode && !e.isTrigger && ot.event.simulate("submit", this.parentNode, e, !0))
            },
            teardown: function () {
                return ot.nodeName(this, "form") ? !1 : void ot.event.remove(this, "._submit")
            }
        }),
        nt.changeBubbles || (ot.event.special.change = {
            setup: function () {
                return Nt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ot.event.add(this, "propertychange._change", function (e) {
                    "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
                }),
                    ot.event.add(this, "click._change", function (e) {
                        this._just_changed && !e.isTrigger && (this._just_changed = !1),
                            ot.event.simulate("change", this, e, !0)
                    })),
                    !1) : void ot.event.add(this, "beforeactivate._change", function (e) {
                        var t = e.target;
                        Nt.test(t.nodeName) && !ot._data(t, "changeBubbles") && (ot.event.add(t, "change._change", function (e) {
                            !this.parentNode || e.isSimulated || e.isTrigger || ot.event.simulate("change", this.parentNode, e, !0)
                        }),
                            ot._data(t, "changeBubbles", !0))
                    })
            },
            handle: function (e) {
                var t = e.target;
                return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function () {
                return ot.event.remove(this, "._change"),
                    !Nt.test(this.nodeName)
            }
        }),
        nt.focusinBubbles || ot.each({
            focus: "focusin",
            blur: "focusout"
        }, function (e, t) {
            var n = function (e) {
                ot.event.simulate(t, e.target, ot.event.fix(e), !0)
            };
            ot.event.special[t] = {
                setup: function () {
                    var i = this.ownerDocument || this
                        , o = ot._data(i, t);
                    o || i.addEventListener(e, n, !0),
                        ot._data(i, t, (o || 0) + 1)
                },
                teardown: function () {
                    var i = this.ownerDocument || this
                        , o = ot._data(i, t) - 1;
                    o ? ot._data(i, t, o) : (i.removeEventListener(e, n, !0),
                        ot._removeData(i, t))
                }
            }
        }),
        ot.fn.extend({
            on: function (e, t, n, i, o) {
                var r, a;
                if ("object" == typeof e) {
                    "string" != typeof t && (n = n || t,
                        t = void 0);
                    for (r in e)
                        this.on(r, t, n, e[r], o);
                    return this
                }
                if (null == n && null == i ? (i = t,
                    n = t = void 0) : null == i && ("string" == typeof t ? (i = n,
                        n = void 0) : (i = n,
                            n = t,
                            t = void 0)),
                    i === !1)
                    i = h;
                else if (!i)
                    return this;
                return 1 === o && (a = i,
                    i = function (e) {
                        return ot().off(e),
                            a.apply(this, arguments)
                    }
                    ,
                    i.guid = a.guid || (a.guid = ot.guid++)),
                    this.each(function () {
                        ot.event.add(this, e, i, n, t)
                    })
            },
            one: function (e, t, n, i) {
                return this.on(e, t, n, i, 1)
            },
            off: function (e, t, n) {
                var i, o;
                if (e && e.preventDefault && e.handleObj)
                    return i = e.handleObj,
                        ot(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler),
                        this;
                if ("object" == typeof e) {
                    for (o in e)
                        this.off(o, t, e[o]);
                    return this
                }
                return (t === !1 || "function" == typeof t) && (n = t,
                    t = void 0),
                    n === !1 && (n = h),
                    this.each(function () {
                        ot.event.remove(this, e, n, t)
                    })
            },
            trigger: function (e, t) {
                return this.each(function () {
                    ot.event.trigger(e, t, this)
                })
            },
            triggerHandler: function (e, t) {
                var n = this[0];
                return n ? ot.event.trigger(e, t, n, !0) : void 0
            }
        });
    var Rt = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video"
        , Ft = / jQuery\d+="(?:null|\d+)"/g
        , Ot = new RegExp("<(?:" + Rt + ")[\\s/>]", "i")
        , Ht = /^\s+/
        , $t = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi
        , jt = /<([\w:]+)/
        , Wt = /<tbody/i
        , zt = /<|&#?\w+;/
        , qt = /<(?:script|style|link)/i
        , Gt = /checked\s*(?:[^=]|=\s*.checked.)/i
        , Xt = /^$|\/(?:java|ecma)script/i
        , Ut = /^true\/(.*)/
        , Kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
        , Vt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: nt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        }
        , Qt = m(ft)
        , Yt = Qt.appendChild(ft.createElement("div"));
    Vt.optgroup = Vt.option,
        Vt.tbody = Vt.tfoot = Vt.colgroup = Vt.caption = Vt.thead,
        Vt.th = Vt.td,
        ot.extend({
            clone: function (e, t, n) {
                var i, o, r, a, s, l = ot.contains(e.ownerDocument, e);
                if (nt.html5Clone || ot.isXMLDoc(e) || !Ot.test("<" + e.nodeName + ">") ? r = e.cloneNode(!0) : (Yt.innerHTML = e.outerHTML,
                    Yt.removeChild(r = Yt.firstChild)),
                    !(nt.noCloneEvent && nt.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ot.isXMLDoc(e)))
                    for (i = g(r),
                        s = g(e),
                        a = 0; null != (o = s[a]); ++a)
                        i[a] && _(o, i[a]);
                if (t)
                    if (n)
                        for (s = s || g(e),
                            i = i || g(r),
                            a = 0; null != (o = s[a]); a++)
                            T(o, i[a]);
                    else
                        T(e, r);
                return i = g(r, "script"),
                    i.length > 0 && x(i, !l && g(e, "script")),
                    i = s = o = null,
                    r
            },
            buildFragment: function (e, t, n, i) {
                for (var o, r, a, s, l, c, u, d = e.length, p = m(t), h = [], f = 0; d > f; f++)
                    if (r = e[f],
                        r || 0 === r)
                        if ("object" === ot.type(r))
                            ot.merge(h, r.nodeType ? [r] : r);
                        else if (zt.test(r)) {
                            for (s = s || p.appendChild(t.createElement("div")),
                                l = (jt.exec(r) || ["", ""])[1].toLowerCase(),
                                u = Vt[l] || Vt._default,
                                s.innerHTML = u[1] + r.replace($t, "<$1></$2>") + u[2],
                                o = u[0]; o--;)
                                s = s.lastChild;
                            if (!nt.leadingWhitespace && Ht.test(r) && h.push(t.createTextNode(Ht.exec(r)[0])),
                                !nt.tbody)
                                for (r = "table" !== l || Wt.test(r) ? "<table>" !== u[1] || Wt.test(r) ? 0 : s : s.firstChild,
                                    o = r && r.childNodes.length; o--;)
                                    ot.nodeName(c = r.childNodes[o], "tbody") && !c.childNodes.length && r.removeChild(c);
                            for (ot.merge(h, s.childNodes),
                                s.textContent = ""; s.firstChild;)
                                s.removeChild(s.firstChild);
                            s = p.lastChild
                        } else
                            h.push(t.createTextNode(r));
                for (s && p.removeChild(s),
                    nt.appendChecked || ot.grep(g(h, "input"), v),
                    f = 0; r = h[f++];)
                    if ((!i || -1 === ot.inArray(r, i)) && (a = ot.contains(r.ownerDocument, r),
                        s = g(p.appendChild(r), "script"),
                        a && x(s),
                        n))
                        for (o = 0; r = s[o++];)
                            Xt.test(r.type || "") && n.push(r);
                return s = null,
                    p
            },
            cleanData: function (e, t) {
                for (var n, i, o, r, a = 0, s = ot.expando, l = ot.cache, c = nt.deleteExpando, u = ot.event.special; null != (n = e[a]); a++)
                    if ((t || ot.acceptData(n)) && (o = n[s],
                        r = o && l[o])) {
                        if (r.events)
                            for (i in r.events)
                                u[i] ? ot.event.remove(n, i) : ot.removeEvent(n, i, r.handle);
                        l[o] && (delete l[o],
                            c ? delete n[s] : typeof n.removeAttribute !== _t ? n.removeAttribute(s) : n[s] = null,
                            K.push(o))
                    }
            }
        }),
        ot.fn.extend({
            text: function (e) {
                return At(this, function (e) {
                    return void 0 === e ? ot.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ft).createTextNode(e))
                }, null, e, arguments.length)
            },
            append: function () {
                return this.domManip(arguments, function (e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = y(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function () {
                return this.domManip(arguments, function (e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = y(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function () {
                return this.domManip(arguments, function (e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            remove: function (e, t) {
                for (var n, i = e ? ot.filter(e, this) : this, o = 0; null != (n = i[o]); o++)
                    t || 1 !== n.nodeType || ot.cleanData(g(n)),
                        n.parentNode && (t && ot.contains(n.ownerDocument, n) && x(g(n, "script")),
                            n.parentNode.removeChild(n));
                return this
            },
            empty: function () {
                for (var e, t = 0; null != (e = this[t]); t++) {
                    for (1 === e.nodeType && ot.cleanData(g(e, !1)); e.firstChild;)
                        e.removeChild(e.firstChild);
                    e.options && ot.nodeName(e, "select") && (e.options.length = 0)
                }
                return this
            },
            clone: function (e, t) {
                return e = null == e ? !1 : e,
                    t = null == t ? e : t,
                    this.map(function () {
                        return ot.clone(this, e, t)
                    })
            },
            html: function (e) {
                return At(this, function (e) {
                    var t = this[0] || {}
                        , n = 0
                        , i = this.length;
                    if (void 0 === e)
                        return 1 === t.nodeType ? t.innerHTML.replace(Ft, "") : void 0;
                    if (!("string" != typeof e || qt.test(e) || !nt.htmlSerialize && Ot.test(e) || !nt.leadingWhitespace && Ht.test(e) || Vt[(jt.exec(e) || ["", ""])[1].toLowerCase()])) {
                        e = e.replace($t, "<$1></$2>");
                        try {
                            for (; i > n; n++)
                                t = this[n] || {},
                                    1 === t.nodeType && (ot.cleanData(g(t, !1)),
                                        t.innerHTML = e);
                            t = 0
                        } catch (o) { }
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function () {
                var e = arguments[0];
                return this.domManip(arguments, function (t) {
                    e = this.parentNode,
                        ot.cleanData(g(this)),
                        e && e.replaceChild(t, this)
                }),
                    e && (e.length || e.nodeType) ? this : this.remove()
            },
            detach: function (e) {
                return this.remove(e, !0)
            },
            domManip: function (e, t) {
                e = Q.apply([], e);
                var n, i, o, r, a, s, l = 0, c = this.length, u = this, d = c - 1, p = e[0], h = ot.isFunction(p);
                if (h || c > 1 && "string" == typeof p && !nt.checkClone && Gt.test(p))
                    return this.each(function (n) {
                        var i = u.eq(n);
                        h && (e[0] = p.call(this, n, i.html())),
                            i.domManip(e, t)
                    });
                if (c && (s = ot.buildFragment(e, this[0].ownerDocument, !1, this),
                    n = s.firstChild,
                    1 === s.childNodes.length && (s = n),
                    n)) {
                    for (r = ot.map(g(s, "script"), b),
                        o = r.length; c > l; l++)
                        i = s,
                            l !== d && (i = ot.clone(i, !0, !0),
                                o && ot.merge(r, g(i, "script"))),
                            t.call(this[l], i, l);
                    if (o)
                        for (a = r[r.length - 1].ownerDocument,
                            ot.map(r, w),
                            l = 0; o > l; l++)
                            i = r[l],
                                Xt.test(i.type || "") && !ot._data(i, "globalEval") && ot.contains(a, i) && (i.src ? ot._evalUrl && ot._evalUrl(i.src) : ot.globalEval((i.text || i.textContent || i.innerHTML || "").replace(Kt, "")));
                    s = n = null
                }
                return this
            }
        }),
        ot.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function (e, t) {
            ot.fn[e] = function (e) {
                for (var n, i = 0, o = [], r = ot(e), a = r.length - 1; a >= i; i++)
                    n = i === a ? this : this.clone(!0),
                        ot(r[i])[t](n),
                        Y.apply(o, n.get());
                return this.pushStack(o)
            }
        });
    var Zt, Jt = {};
    !function () {
        var e;
        nt.shrinkWrapBlocks = function () {
            if (null != e)
                return e;
            e = !1;
            var t, n, i;
            return n = ft.getElementsByTagName("body")[0],
                n && n.style ? (t = ft.createElement("div"),
                    i = ft.createElement("div"),
                    i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                    n.appendChild(i).appendChild(t),
                    typeof t.style.zoom !== _t && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",
                        t.appendChild(ft.createElement("div")).style.width = "5px",
                        e = 3 !== t.offsetWidth),
                    n.removeChild(i),
                    e) : void 0
        }
    }();
    var en, tn, nn = /^margin/, on = new RegExp("^(" + kt + ")(?!px)[a-z%]+$", "i"), rn = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (en = function (e) {
        return e.ownerDocument.defaultView.getComputedStyle(e, null)
    }
        ,
        tn = function (e, t, n) {
            var i, o, r, a, s = e.style;
            return n = n || en(e),
                a = n ? n.getPropertyValue(t) || n[t] : void 0,
                n && ("" !== a || ot.contains(e.ownerDocument, e) || (a = ot.style(e, t)),
                    on.test(a) && nn.test(t) && (i = s.width,
                        o = s.minWidth,
                        r = s.maxWidth,
                        s.minWidth = s.maxWidth = s.width = a,
                        a = n.width,
                        s.width = i,
                        s.minWidth = o,
                        s.maxWidth = r)),
                void 0 === a ? a : a + ""
        }
    ) : ft.documentElement.currentStyle && (en = function (e) {
        return e.currentStyle
    }
        ,
        tn = function (e, t, n) {
            var i, o, r, a, s = e.style;
            return n = n || en(e),
                a = n ? n[t] : void 0,
                null == a && s && s[t] && (a = s[t]),
                on.test(a) && !rn.test(t) && (i = s.left,
                    o = e.runtimeStyle,
                    r = o && o.left,
                    r && (o.left = e.currentStyle.left),
                    s.left = "fontSize" === t ? "1em" : a,
                    a = s.pixelLeft + "px",
                    s.left = i,
                    r && (o.left = r)),
                void 0 === a ? a : a + "" || "auto"
        }
    ),
        function () {
            function t() {
                var t, n, i, o;
                n = ft.getElementsByTagName("body")[0],
                    n && n.style && (t = ft.createElement("div"),
                        i = ft.createElement("div"),
                        i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px",
                        n.appendChild(i).appendChild(t),
                        t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",
                        r = a = !1,
                        l = !0,
                        e.getComputedStyle && (r = "1%" !== (e.getComputedStyle(t, null) || {}).top,
                            a = "4px" === (e.getComputedStyle(t, null) || {
                                width: "4px"
                            }).width,
                            o = t.appendChild(ft.createElement("div")),
                            o.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                            o.style.marginRight = o.style.width = "0",
                            t.style.width = "1px",
                            l = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight)),
                        t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>",
                        o = t.getElementsByTagName("td"),
                        o[0].style.cssText = "margin:0;border:0;padding:0;display:none",
                        s = 0 === o[0].offsetHeight,
                        s && (o[0].style.display = "",
                            o[1].style.display = "none",
                            s = 0 === o[0].offsetHeight),
                        n.removeChild(i))
            }
            var n, i, o, r, a, s, l;
            n = ft.createElement("div"),
                n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
                o = n.getElementsByTagName("a")[0],
                i = o && o.style,
                i && (i.cssText = "float:left;opacity:.5",
                    nt.opacity = "0.5" === i.opacity,
                    nt.cssFloat = !!i.cssFloat,
                    n.style.backgroundClip = "content-box",
                    n.cloneNode(!0).style.backgroundClip = "",
                    nt.clearCloneStyle = "content-box" === n.style.backgroundClip,
                    nt.boxSizing = "" === i.boxSizing || "" === i.MozBoxSizing || "" === i.WebkitBoxSizing,
                    ot.extend(nt, {
                        reliableHiddenOffsets: function () {
                            return null == s && t(),
                                s
                        },
                        boxSizingReliable: function () {
                            return null == a && t(),
                                a
                        },
                        pixelPosition: function () {
                            return null == r && t(),
                                r
                        },
                        reliableMarginRight: function () {
                            return null == l && t(),
                                l
                        }
                    }))
        }(),
        ot.swap = function (e, t, n, i) {
            var o, r, a = {};
            for (r in t)
                a[r] = e.style[r],
                    e.style[r] = t[r];
            o = n.apply(e, i || []);
            for (r in t)
                e.style[r] = a[r];
            return o
        }
        ;
    var an = /alpha\([^)]*\)/i
        , sn = /opacity\s*=\s*([^)]*)/
        , ln = /^(none|table(?!-c[ea]).+)/
        , cn = new RegExp("^(" + kt + ")(.*)$", "i")
        , un = new RegExp("^([+-])=(" + kt + ")", "i")
        , dn = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        }
        , pn = {
            letterSpacing: "0",
            fontWeight: "400"
        }
        , hn = ["Webkit", "O", "Moz", "ms"];
    ot.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = tn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": nt.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function (e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, a, s = ot.camelCase(t), l = e.style;
                if (t = ot.cssProps[s] || (ot.cssProps[s] = E(l, s)),
                    a = ot.cssHooks[t] || ot.cssHooks[s],
                    void 0 === n)
                    return a && "get" in a && void 0 !== (o = a.get(e, !1, i)) ? o : l[t];
                if (r = typeof n,
                    "string" === r && (o = un.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(ot.css(e, t)),
                        r = "number"),
                    null != n && n === n && ("number" !== r || ot.cssNumber[s] || (n += "px"),
                        nt.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                        !(a && "set" in a && void 0 === (n = a.set(e, n, i)))))
                    try {
                        l[t] = n
                    } catch (c) { }
            }
        },
        css: function (e, t, n, i) {
            var o, r, a, s = ot.camelCase(t);
            return t = ot.cssProps[s] || (ot.cssProps[s] = E(e.style, s)),
                a = ot.cssHooks[t] || ot.cssHooks[s],
                a && "get" in a && (r = a.get(e, !0, n)),
                void 0 === r && (r = tn(e, t, i)),
                "normal" === r && t in pn && (r = pn[t]),
                "" === n || n ? (o = parseFloat(r),
                    n === !0 || ot.isNumeric(o) ? o || 0 : r) : r
        }
    }),
        ot.each(["height", "width"], function (e, t) {
            ot.cssHooks[t] = {
                get: function (e, n, i) {
                    return n ? ln.test(ot.css(e, "display")) && 0 === e.offsetWidth ? ot.swap(e, dn, function () {
                        return N(e, t, i)
                    }) : N(e, t, i) : void 0
                },
                set: function (e, n, i) {
                    var o = i && en(e);
                    return A(e, n, i ? I(e, t, i, nt.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, o), o) : 0)
                }
            }
        }),
        nt.opacity || (ot.cssHooks.opacity = {
            get: function (e, t) {
                return sn.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
            },
            set: function (e, t) {
                var n = e.style
                    , i = e.currentStyle
                    , o = ot.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : ""
                    , r = i && i.filter || n.filter || "";
                n.zoom = 1,
                    (t >= 1 || "" === t) && "" === ot.trim(r.replace(an, "")) && n.removeAttribute && (n.removeAttribute("filter"),
                        "" === t || i && !i.filter) || (n.filter = an.test(r) ? r.replace(an, o) : r + " " + o)
            }
        }),
        ot.cssHooks.marginRight = k(nt.reliableMarginRight, function (e, t) {
            return t ? ot.swap(e, {
                display: "inline-block"
            }, tn, [e, "marginRight"]) : void 0
        }),
        ot.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function (e, t) {
            ot.cssHooks[e + t] = {
                expand: function (n) {
                    for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++)
                        o[e + Et[i] + t] = r[i] || r[i - 2] || r[0];
                    return o
                }
            },
                nn.test(e) || (ot.cssHooks[e + t].set = A)
        }),
        ot.fn.extend({
            css: function (e, t) {
                return At(this, function (e, t, n) {
                    var i, o, r = {}, a = 0;
                    if (ot.isArray(t)) {
                        for (i = en(e),
                            o = t.length; o > a; a++)
                            r[t[a]] = ot.css(e, t[a], !1, i);
                        return r
                    }
                    return void 0 !== n ? ot.style(e, t, n) : ot.css(e, t)
                }, e, t, arguments.length > 1)
            },
            show: function () {
                return M(this, !0)
            },
            hide: function () {
                return M(this)
            },
            toggle: function (e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                    Mt(this) ? ot(this).show() : ot(this).hide()
                })
            }
        }),
        ot.Tween = D,
        D.prototype = {
            constructor: D,
            init: function (e, t, n, i, o, r) {
                this.elem = e,
                    this.prop = n,
                    this.easing = o || "swing",
                    this.options = t,
                    this.start = this.now = this.cur(),
                    this.end = i,
                    this.unit = r || (ot.cssNumber[n] ? "" : "px")
            },
            cur: function () {
                var e = D.propHooks[this.prop];
                return e && e.get ? e.get(this) : D.propHooks._default.get(this)
            },
            run: function (e) {
                var t, n = D.propHooks[this.prop];
                return this.pos = t = this.options.duration ? ot.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e,
                    this.now = (this.end - this.start) * t + this.start,
                    this.options.step && this.options.step.call(this.elem, this.now, this),
                    n && n.set ? n.set(this) : D.propHooks._default.set(this),
                    this
            }
        },
        D.prototype.init.prototype = D.prototype,
        D.propHooks = {
            _default: {
                get: function (e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ot.css(e.elem, e.prop, ""),
                        t && "auto" !== t ? t : 0) : e.elem[e.prop]
                },
                set: function (e) {
                    ot.fx.step[e.prop] ? ot.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ot.cssProps[e.prop]] || ot.cssHooks[e.prop]) ? ot.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        },
        D.propHooks.scrollTop = D.propHooks.scrollLeft = {
            set: function (e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        },
        ot.easing = {
            linear: function (e) {
                return e
            },
            swing: function (e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        },
        ot.fx = D.prototype.init,
        ot.fx.step = {};
    var fn, mn, gn = /^(?:toggle|show|hide)$/, vn = new RegExp("^(?:([+-])=|)(" + kt + ")([a-z%]*)$", "i"), yn = /queueHooks$/, bn = [R], wn = {
        "*": [function (e, t) {
            var n = this.createTween(e, t)
                , i = n.cur()
                , o = vn.exec(t)
                , r = o && o[3] || (ot.cssNumber[e] ? "" : "px")
                , a = (ot.cssNumber[e] || "px" !== r && +i) && vn.exec(ot.css(n.elem, e))
                , s = 1
                , l = 20;
            if (a && a[3] !== r) {
                r = r || a[3],
                    o = o || [],
                    a = +i || 1;
                do
                    s = s || ".5",
                        a /= s,
                        ot.style(n.elem, e, a + r);
                while (s !== (s = n.cur() / i) && 1 !== s && --l)
            }
            return o && (a = n.start = +a || +i || 0,
                n.unit = r,
                n.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]),
                n
        }
        ]
    };
    ot.Animation = ot.extend(O, {
        tweener: function (e, t) {
            ot.isFunction(e) ? (t = e,
                e = ["*"]) : e = e.split(" ");
            for (var n, i = 0, o = e.length; o > i; i++)
                n = e[i],
                    wn[n] = wn[n] || [],
                    wn[n].unshift(t)
        },
        prefilter: function (e, t) {
            t ? bn.unshift(e) : bn.push(e)
        }
    }),
        ot.speed = function (e, t, n) {
            var i = e && "object" == typeof e ? ot.extend({}, e) : {
                complete: n || !n && t || ot.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !ot.isFunction(t) && t
            };
            return i.duration = ot.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in ot.fx.speeds ? ot.fx.speeds[i.duration] : ot.fx.speeds._default,
                (null == i.queue || i.queue === !0) && (i.queue = "fx"),
                i.old = i.complete,
                i.complete = function () {
                    ot.isFunction(i.old) && i.old.call(this),
                        i.queue && ot.dequeue(this, i.queue)
                }
                ,
                i
        }
        ,
        ot.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter(Mt).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, i)
            },
            animate: function (e, t, n, i) {
                var o = ot.isEmptyObject(e)
                    , r = ot.speed(t, n, i)
                    , a = function () {
                        var t = O(this, ot.extend({}, e), r);
                        (o || ot._data(this, "finish")) && t.stop(!0)
                    };
                return a.finish = a,
                    o || r.queue === !1 ? this.each(a) : this.queue(r.queue, a)
            },
            stop: function (e, t, n) {
                var i = function (e) {
                    var t = e.stop;
                    delete e.stop,
                        t(n)
                };
                return "string" != typeof e && (n = t,
                    t = e,
                    e = void 0),
                    t && e !== !1 && this.queue(e || "fx", []),
                    this.each(function () {
                        var t = !0
                            , o = null != e && e + "queueHooks"
                            , r = ot.timers
                            , a = ot._data(this);
                        if (o)
                            a[o] && a[o].stop && i(a[o]);
                        else
                            for (o in a)
                                a[o] && a[o].stop && yn.test(o) && i(a[o]);
                        for (o = r.length; o--;)
                            r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(n),
                                t = !1,
                                r.splice(o, 1));
                        (t || !n) && ot.dequeue(this, e)
                    })
            },
            finish: function (e) {
                return e !== !1 && (e = e || "fx"),
                    this.each(function () {
                        var t, n = ot._data(this), i = n[e + "queue"], o = n[e + "queueHooks"], r = ot.timers, a = i ? i.length : 0;
                        for (n.finish = !0,
                            ot.queue(this, e, []),
                            o && o.stop && o.stop.call(this, !0),
                            t = r.length; t--;)
                            r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0),
                                r.splice(t, 1));
                        for (t = 0; a > t; t++)
                            i[t] && i[t].finish && i[t].finish.call(this);
                        delete n.finish
                    })
            }
        }),
        ot.each(["toggle", "show", "hide"], function (e, t) {
            var n = ot.fn[t];
            ot.fn[t] = function (e, i, o) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(B(t, !0), e, i, o)
            }
        }),
        ot.each({
            slideDown: B("show"),
            slideUp: B("hide"),
            slideToggle: B("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function (e, t) {
            ot.fn[e] = function (e, n, i) {
                return this.animate(t, e, n, i)
            }
        }),
        ot.timers = [],
        ot.fx.tick = function () {
            var e, t = ot.timers, n = 0;
            for (fn = ot.now(); n < t.length; n++)
                e = t[n],
                    e() || t[n] !== e || t.splice(n--, 1);
            t.length || ot.fx.stop(),
                fn = void 0
        }
        ,
        ot.fx.timer = function (e) {
            ot.timers.push(e),
                e() ? ot.fx.start() : ot.timers.pop()
        }
        ,
        ot.fx.interval = 13,
        ot.fx.start = function () {
            mn || (mn = setInterval(ot.fx.tick, ot.fx.interval))
        }
        ,
        ot.fx.stop = function () {
            clearInterval(mn),
                mn = null
        }
        ,
        ot.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        },
        ot.fn.delay = function (e, t) {
            return e = ot.fx ? ot.fx.speeds[e] || e : e,
                t = t || "fx",
                this.queue(t, function (t, n) {
                    var i = setTimeout(t, e);
                    n.stop = function () {
                        clearTimeout(i)
                    }
                })
        }
        ,
        function () {
            var e, t, n, i, o;
            t = ft.createElement("div"),
                t.setAttribute("className", "t"),
                t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",
                i = t.getElementsByTagName("a")[0],
                n = ft.createElement("select"),
                o = n.appendChild(ft.createElement("option")),
                e = t.getElementsByTagName("input")[0],
                i.style.cssText = "top:1px",
                nt.getSetAttribute = "t" !== t.className,
                nt.style = /top/.test(i.getAttribute("style")),
                nt.hrefNormalized = "/a" === i.getAttribute("href"),
                nt.checkOn = !!e.value,
                nt.optSelected = o.selected,
                nt.enctype = !!ft.createElement("form").enctype,
                n.disabled = !0,
                nt.optDisabled = !o.disabled,
                e = ft.createElement("input"),
                e.setAttribute("value", ""),
                nt.input = "" === e.getAttribute("value"),
                e.value = "t",
                e.setAttribute("type", "radio"),
                nt.radioValue = "t" === e.value
        }();
    var xn = /\r/g;
    ot.fn.extend({
        val: function (e) {
            var t, n, i, o = this[0];
            {
                if (arguments.length)
                    return i = ot.isFunction(e),
                        this.each(function (n) {
                            var o;
                            1 === this.nodeType && (o = i ? e.call(this, n, ot(this).val()) : e,
                                null == o ? o = "" : "number" == typeof o ? o += "" : ot.isArray(o) && (o = ot.map(o, function (e) {
                                    return null == e ? "" : e + ""
                                })),
                                t = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()],
                                t && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
                        });
                if (o)
                    return t = ot.valHooks[o.type] || ot.valHooks[o.nodeName.toLowerCase()],
                        t && "get" in t && void 0 !== (n = t.get(o, "value")) ? n : (n = o.value,
                            "string" == typeof n ? n.replace(xn, "") : null == n ? "" : n)
            }
        }
    }),
        ot.extend({
            valHooks: {
                option: {
                    get: function (e) {
                        var t = ot.find.attr(e, "value");
                        return null != t ? t : ot.trim(ot.text(e))
                    }
                },
                select: {
                    get: function (e) {
                        for (var t, n, i = e.options, o = e.selectedIndex, r = "select-one" === e.type || 0 > o, a = r ? null : [], s = r ? o + 1 : i.length, l = 0 > o ? s : r ? o : 0; s > l; l++)
                            if (n = i[l],
                                !(!n.selected && l !== o || (nt.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ot.nodeName(n.parentNode, "optgroup"))) {
                                if (t = ot(n).val(),
                                    r)
                                    return t;
                                a.push(t)
                            }
                        return a
                    },
                    set: function (e, t) {
                        for (var n, i, o = e.options, r = ot.makeArray(t), a = o.length; a--;)
                            if (i = o[a],
                                ot.inArray(ot.valHooks.option.get(i), r) >= 0)
                                try {
                                    i.selected = n = !0
                                } catch (s) {
                                    i.scrollHeight
                                }
                            else
                                i.selected = !1;
                        return n || (e.selectedIndex = -1),
                            o
                    }
                }
            }
        }),
        ot.each(["radio", "checkbox"], function () {
            ot.valHooks[this] = {
                set: function (e, t) {
                    return ot.isArray(t) ? e.checked = ot.inArray(ot(e).val(), t) >= 0 : void 0
                }
            },
                nt.checkOn || (ot.valHooks[this].get = function (e) {
                    return null === e.getAttribute("value") ? "on" : e.value
                }
                )
        });
    var Tn, _n, Cn = ot.expr.attrHandle, Sn = /^(?:checked|selected)$/i, kn = nt.getSetAttribute, En = nt.input;
    ot.fn.extend({
        attr: function (e, t) {
            return At(this, ot.attr, e, t, arguments.length > 1)
        },
        removeAttr: function (e) {
            return this.each(function () {
                ot.removeAttr(this, e)
            })
        }
    }),
        ot.extend({
            attr: function (e, t, n) {
                var i, o, r = e.nodeType;
                if (e && 3 !== r && 8 !== r && 2 !== r)
                    return typeof e.getAttribute === _t ? ot.prop(e, t, n) : (1 === r && ot.isXMLDoc(e) || (t = t.toLowerCase(),
                        i = ot.attrHooks[t] || (ot.expr.match.bool.test(t) ? _n : Tn)),
                        void 0 === n ? i && "get" in i && null !== (o = i.get(e, t)) ? o : (o = ot.find.attr(e, t),
                            null == o ? void 0 : o) : null !== n ? i && "set" in i && void 0 !== (o = i.set(e, n, t)) ? o : (e.setAttribute(t, n + ""),
                                n) : void ot.removeAttr(e, t))
            },
            removeAttr: function (e, t) {
                var n, i, o = 0, r = t && t.match(bt);
                if (r && 1 === e.nodeType)
                    for (; n = r[o++];)
                        i = ot.propFix[n] || n,
                            ot.expr.match.bool.test(n) ? En && kn || !Sn.test(n) ? e[i] = !1 : e[ot.camelCase("default-" + n)] = e[i] = !1 : ot.attr(e, n, ""),
                            e.removeAttribute(kn ? n : i)
            },
            attrHooks: {
                type: {
                    set: function (e, t) {
                        if (!nt.radioValue && "radio" === t && ot.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t),
                                n && (e.value = n),
                                t
                        }
                    }
                }
            }
        }),
        _n = {
            set: function (e, t, n) {
                return t === !1 ? ot.removeAttr(e, n) : En && kn || !Sn.test(n) ? e.setAttribute(!kn && ot.propFix[n] || n, n) : e[ot.camelCase("default-" + n)] = e[n] = !0,
                    n
            }
        },
        ot.each(ot.expr.match.bool.source.match(/\w+/g), function (e, t) {
            var n = Cn[t] || ot.find.attr;
            Cn[t] = En && kn || !Sn.test(t) ? function (e, t, i) {
                var o, r;
                return i || (r = Cn[t],
                    Cn[t] = o,
                    o = null != n(e, t, i) ? t.toLowerCase() : null,
                    Cn[t] = r),
                    o
            }
                : function (e, t, n) {
                    return n ? void 0 : e[ot.camelCase("default-" + t)] ? t.toLowerCase() : null
                }
        }),
        En && kn || (ot.attrHooks.value = {
            set: function (e, t, n) {
                return ot.nodeName(e, "input") ? void (e.defaultValue = t) : Tn && Tn.set(e, t, n)
            }
        }),
        kn || (Tn = {
            set: function (e, t, n) {
                var i = e.getAttributeNode(n);
                return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)),
                    i.value = t += "",
                    "value" === n || t === e.getAttribute(n) ? t : void 0
            }
        },
            Cn.id = Cn.name = Cn.coords = function (e, t, n) {
                var i;
                return n ? void 0 : (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
            }
            ,
            ot.valHooks.button = {
                get: function (e, t) {
                    var n = e.getAttributeNode(t);
                    return n && n.specified ? n.value : void 0
                },
                set: Tn.set
            },
            ot.attrHooks.contenteditable = {
                set: function (e, t, n) {
                    Tn.set(e, "" === t ? !1 : t, n)
                }
            },
            ot.each(["width", "height"], function (e, t) {
                ot.attrHooks[t] = {
                    set: function (e, n) {
                        return "" === n ? (e.setAttribute(t, "auto"),
                            n) : void 0
                    }
                }
            })),
        nt.style || (ot.attrHooks.style = {
            get: function (e) {
                return e.style.cssText || void 0
            },
            set: function (e, t) {
                return e.style.cssText = t + ""
            }
        });
    var Mn = /^(?:input|select|textarea|button|object)$/i
        , An = /^(?:a|area)$/i;
    ot.fn.extend({
        prop: function (e, t) {
            return At(this, ot.prop, e, t, arguments.length > 1)
        },
        removeProp: function (e) {
            return e = ot.propFix[e] || e,
                this.each(function () {
                    try {
                        this[e] = void 0,
                            delete this[e]
                    } catch (t) { }
                })
        }
    }),
        ot.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function (e, t, n) {
                var i, o, r, a = e.nodeType;
                if (e && 3 !== a && 8 !== a && 2 !== a)
                    return r = 1 !== a || !ot.isXMLDoc(e),
                        r && (t = ot.propFix[t] || t,
                            o = ot.propHooks[t]),
                        void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function (e) {
                        var t = ot.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : Mn.test(e.nodeName) || An.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            }
        }),
        nt.hrefNormalized || ot.each(["href", "src"], function (e, t) {
            ot.propHooks[t] = {
                get: function (e) {
                    return e.getAttribute(t, 4)
                }
            }
        }),
        nt.optSelected || (ot.propHooks.selected = {
            get: function (e) {
                var t = e.parentNode;
                return t && (t.selectedIndex,
                    t.parentNode && t.parentNode.selectedIndex),
                    null
            }
        }),
        ot.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
            ot.propFix[this.toLowerCase()] = this
        }),
        nt.enctype || (ot.propFix.enctype = "encoding");
    var In = /[\t\r\n\f]/g;
    ot.fn.extend({
        addClass: function (e) {
            var t, n, i, o, r, a, s = 0, l = this.length, c = "string" == typeof e && e;
            if (ot.isFunction(e))
                return this.each(function (t) {
                    ot(this).addClass(e.call(this, t, this.className))
                });
            if (c)
                for (t = (e || "").match(bt) || []; l > s; s++)
                    if (n = this[s],
                        i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(In, " ") : " ")) {
                        for (r = 0; o = t[r++];)
                            i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        a = ot.trim(i),
                            n.className !== a && (n.className = a)
                    }
            return this
        },
        removeClass: function (e) {
            var t, n, i, o, r, a, s = 0, l = this.length, c = 0 === arguments.length || "string" == typeof e && e;
            if (ot.isFunction(e))
                return this.each(function (t) {
                    ot(this).removeClass(e.call(this, t, this.className))
                });
            if (c)
                for (t = (e || "").match(bt) || []; l > s; s++)
                    if (n = this[s],
                        i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(In, " ") : "")) {
                        for (r = 0; o = t[r++];)
                            for (; i.indexOf(" " + o + " ") >= 0;)
                                i = i.replace(" " + o + " ", " ");
                        a = e ? ot.trim(i) : "",
                            n.className !== a && (n.className = a)
                    }
            return this
        },
        toggleClass: function (e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(ot.isFunction(e) ? function (n) {
                ot(this).toggleClass(e.call(this, n, this.className, t), t)
            }
                : function () {
                    if ("string" === n)
                        for (var t, i = 0, o = ot(this), r = e.match(bt) || []; t = r[i++];)
                            o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                    else
                    (n === _t || "boolean" === n) && (this.className && ot._data(this, "__className__", this.className),
                            this.className = this.className || e === !1 ? "" : ot._data(this, "__className__") || "")
                }
            )
        },
        hasClass: function (e) {
            for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(In, " ").indexOf(t) >= 0)
                    return !0;
            return !1
        }
    }),
        ot.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
            ot.fn[t] = function (e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }),
        ot.fn.extend({
            hover: function (e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            },
            bind: function (e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function (e, t) {
                return this.off(e, null, t)
            },
            delegate: function (e, t, n, i) {
                return this.on(t, e, n, i)
            },
            undelegate: function (e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        });
    var Nn = ot.now()
        , Dn = /\?/
        , Pn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ot.parseJSON = function (t) {
        if (e.JSON && e.JSON.parse)
            return e.JSON.parse(t + "");
        var n, i = null, o = ot.trim(t + "");
        return o && !ot.trim(o.replace(Pn, function (e, t, o, r) {
            return n && t && (i = 0),
                0 === i ? e : (n = o || t,
                    i += !r - !o,
                    "")
        })) ? Function("return " + o)() : ot.error("Invalid JSON: " + t)
    }
        ,
        ot.parseXML = function (t) {
            var n, i;
            if (!t || "string" != typeof t)
                return null;
            try {
                e.DOMParser ? (i = new DOMParser,
                    n = i.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"),
                        n.async = "false",
                        n.loadXML(t))
            } catch (o) {
                n = void 0
            }
            return n && n.documentElement && !n.getElementsByTagName("parsererror").length || ot.error("Invalid XML: " + t),
                n
        }
        ;
    var Bn, Ln, Rn = /#.*$/, Fn = /([?&])_=[^&]*/, On = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Hn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, $n = /^(?:GET|HEAD)$/, jn = /^\/\//, Wn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, zn = {}, qn = {}, Gn = "*/".concat("*");
    try {
        Ln = location.href
    } catch (Xn) {
        Ln = ft.createElement("a"),
            Ln.href = "",
            Ln = Ln.href
    }
    Bn = Wn.exec(Ln.toLowerCase()) || [],
        ot.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Ln,
                type: "GET",
                isLocal: Hn.test(Bn[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Gn,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": ot.parseJSON,
                    "text xml": ot.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function (e, t) {
                return t ? j(j(e, ot.ajaxSettings), t) : j(ot.ajaxSettings, e)
            },
            ajaxPrefilter: H(zn),
            ajaxTransport: H(qn),
            ajax: function (e, t) {
                function n(e, t, n, i) {
                    var o, u, v, y, w, T = t;
                    2 !== b && (b = 2,
                        s && clearTimeout(s),
                        c = void 0,
                        a = i || "",
                        x.readyState = e > 0 ? 4 : 0,
                        o = e >= 200 && 300 > e || 304 === e,
                        n && (y = W(d, x, n)),
                        y = z(d, y, x, o),
                        o ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"),
                            w && (ot.lastModified[r] = w),
                            w = x.getResponseHeader("etag"),
                            w && (ot.etag[r] = w)),
                            204 === e || "HEAD" === d.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = y.state,
                                u = y.data,
                                v = y.error,
                                o = !v)) : (v = T,
                                    (e || !T) && (T = "error",
                                        0 > e && (e = 0))),
                        x.status = e,
                        x.statusText = (t || T) + "",
                        o ? f.resolveWith(p, [u, T, x]) : f.rejectWith(p, [x, T, v]),
                        x.statusCode(g),
                        g = void 0,
                        l && h.trigger(o ? "ajaxSuccess" : "ajaxError", [x, d, o ? u : v]),
                        m.fireWith(p, [x, T]),
                        l && (h.trigger("ajaxComplete", [x, d]),
                            --ot.active || ot.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (t = e,
                    e = void 0),
                    t = t || {};
                var i, o, r, a, s, l, c, u, d = ot.ajaxSetup({}, t), p = d.context || d, h = d.context && (p.nodeType || p.jquery) ? ot(p) : ot.event, f = ot.Deferred(), m = ot.Callbacks("once memory"), g = d.statusCode || {}, v = {}, y = {}, b = 0, w = "canceled", x = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (2 === b) {
                            if (!u)
                                for (u = {}; t = On.exec(a);)
                                    u[t[1].toLowerCase()] = t[2];
                            t = u[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function () {
                        return 2 === b ? a : null
                    },
                    setRequestHeader: function (e, t) {
                        var n = e.toLowerCase();
                        return b || (e = y[n] = y[n] || e,
                            v[e] = t),
                            this
                    },
                    overrideMimeType: function (e) {
                        return b || (d.mimeType = e),
                            this
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (2 > b)
                                for (t in e)
                                    g[t] = [g[t], e[t]];
                            else
                                x.always(e[x.status]);
                        return this
                    },
                    abort: function (e) {
                        var t = e || w;
                        return c && c.abort(t),
                            n(0, t),
                            this
                    }
                };
                if (f.promise(x).complete = m.add,
                    x.success = x.done,
                    x.error = x.fail,
                    d.url = ((e || d.url || Ln) + "").replace(Rn, "").replace(jn, Bn[1] + "//"),
                    d.type = t.method || t.type || d.method || d.type,
                    d.dataTypes = ot.trim(d.dataType || "*").toLowerCase().match(bt) || [""],
                    null == d.crossDomain && (i = Wn.exec(d.url.toLowerCase()),
                        d.crossDomain = !(!i || i[1] === Bn[1] && i[2] === Bn[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Bn[3] || ("http:" === Bn[1] ? "80" : "443")))),
                    d.data && d.processData && "string" != typeof d.data && (d.data = ot.param(d.data, d.traditional)),
                    $(zn, d, t, x),
                    2 === b)
                    return x;
                l = d.global,
                    l && 0 === ot.active++ && ot.event.trigger("ajaxStart"),
                    d.type = d.type.toUpperCase(),
                    d.hasContent = !$n.test(d.type),
                    r = d.url,
                    d.hasContent || (d.data && (r = d.url += (Dn.test(r) ? "&" : "?") + d.data,
                        delete d.data),
                        d.cache === !1 && (d.url = Fn.test(r) ? r.replace(Fn, "$1_=" + Nn++) : r + (Dn.test(r) ? "&" : "?") + "_=" + Nn++)),
                    d.ifModified && (ot.lastModified[r] && x.setRequestHeader("If-Modified-Since", ot.lastModified[r]),
                        ot.etag[r] && x.setRequestHeader("If-None-Match", ot.etag[r])),
                    (d.data && d.hasContent && d.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", d.contentType),
                    x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Gn + "; q=0.01" : "") : d.accepts["*"]);
                for (o in d.headers)
                    x.setRequestHeader(o, d.headers[o]);
                if (d.beforeSend && (d.beforeSend.call(p, x, d) === !1 || 2 === b))
                    return x.abort();
                w = "abort";
                for (o in {
                    success: 1,
                    error: 1,
                    complete: 1
                })
                    x[o](d[o]);
                if (c = $(qn, d, t, x)) {
                    x.readyState = 1,
                        l && h.trigger("ajaxSend", [x, d]),
                        d.async && d.timeout > 0 && (s = setTimeout(function () {
                            x.abort("timeout")
                        }, d.timeout));
                    try {
                        b = 1,
                            c.send(v, n)
                    } catch (T) {
                        if (!(2 > b))
                            throw T;
                        n(-1, T)
                    }
                } else
                    n(-1, "No Transport");
                return x
            },
            getJSON: function (e, t, n) {
                return ot.get(e, t, n, "json")
            },
            getScript: function (e, t) {
                return ot.get(e, void 0, t, "script")
            }
        }),
        ot.each(["get", "post"], function (e, t) {
            ot[t] = function (e, n, i, o) {
                return ot.isFunction(n) && (o = o || i,
                    i = n,
                    n = void 0),
                    ot.ajax({
                        url: e,
                        type: t,
                        dataType: o,
                        data: n,
                        success: i
                    })
            }
        }),
        ot.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
            ot.fn[t] = function (e) {
                return this.on(t, e)
            }
        }),
        ot._evalUrl = function (e) {
            return ot.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }
        ,
        ot.fn.extend({
            wrapAll: function (e) {
                if (ot.isFunction(e))
                    return this.each(function (t) {
                        ot(this).wrapAll(e.call(this, t))
                    });
                if (this[0]) {
                    var t = ot(e, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && t.insertBefore(this[0]),
                        t.map(function () {
                            for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;)
                                e = e.firstChild;
                            return e
                        }).append(this)
                }
                return this
            },
            wrapInner: function (e) {
                return this.each(ot.isFunction(e) ? function (t) {
                    ot(this).wrapInner(e.call(this, t))
                }
                    : function () {
                        var t = ot(this)
                            , n = t.contents();
                        n.length ? n.wrapAll(e) : t.append(e)
                    }
                )
            },
            wrap: function (e) {
                var t = ot.isFunction(e);
                return this.each(function (n) {
                    ot(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function () {
                return this.parent().each(function () {
                    ot.nodeName(this, "body") || ot(this).replaceWith(this.childNodes)
                }).end()
            }
        }),
        ot.expr.filters.hidden = function (e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !nt.reliableHiddenOffsets() && "none" === (e.style && e.style.display || ot.css(e, "display"))
        }
        ,
        ot.expr.filters.visible = function (e) {
            return !ot.expr.filters.hidden(e)
        }
        ;
    var Un = /%20/g
        , Kn = /\[\]$/
        , Vn = /\r?\n/g
        , Qn = /^(?:submit|button|image|reset|file)$/i
        , Yn = /^(?:input|select|textarea|keygen)/i;
    ot.param = function (e, t) {
        var n, i = [], o = function (e, t) {
            t = ot.isFunction(t) ? t() : null == t ? "" : t,
                i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = ot.ajaxSettings && ot.ajaxSettings.traditional),
            ot.isArray(e) || e.jquery && !ot.isPlainObject(e))
            ot.each(e, function () {
                o(this.name, this.value)
            });
        else
            for (n in e)
                q(n, e[n], t, o);
        return i.join("&").replace(Un, "+")
    }
        ,
        ot.fn.extend({
            serialize: function () {
                return ot.param(this.serializeArray())
            },
            serializeArray: function () {
                return this.map(function () {
                    var e = ot.prop(this, "elements");
                    return e ? ot.makeArray(e) : this
                }).filter(function () {
                    var e = this.type;
                    return this.name && !ot(this).is(":disabled") && Yn.test(this.nodeName) && !Qn.test(e) && (this.checked || !It.test(e))
                }).map(function (e, t) {
                    var n = ot(this).val();
                    return null == n ? null : ot.isArray(n) ? ot.map(n, function (e) {
                        return {
                            name: t.name,
                            value: e.replace(Vn, "\r\n")
                        }
                    }) : {
                            name: t.name,
                            value: n.replace(Vn, "\r\n")
                        }
                }).get()
            }
        }),
        ot.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function () {
            return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && G() || X()
        }
            : G;
    var Zn = 0
        , Jn = {}
        , ei = ot.ajaxSettings.xhr();
    e.ActiveXObject && ot(e).on("unload", function () {
        for (var e in Jn)
            Jn[e](void 0, !0)
    }),
        nt.cors = !!ei && "withCredentials" in ei,
        ei = nt.ajax = !!ei,
        ei && ot.ajaxTransport(function (e) {
            if (!e.crossDomain || nt.cors) {
                var t;
                return {
                    send: function (n, i) {
                        var o, r = e.xhr(), a = ++Zn;
                        if (r.open(e.type, e.url, e.async, e.username, e.password),
                            e.xhrFields)
                            for (o in e.xhrFields)
                                r[o] = e.xhrFields[o];
                        e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType),
                            e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                        for (o in n)
                            void 0 !== n[o] && r.setRequestHeader(o, n[o] + "");
                        r.send(e.hasContent && e.data || null),
                            t = function (n, o) {
                                var s, l, c;
                                if (t && (o || 4 === r.readyState))
                                    if (delete Jn[a],
                                        t = void 0,
                                        r.onreadystatechange = ot.noop,
                                        o)
                                        4 !== r.readyState && r.abort();
                                    else {
                                        c = {},
                                            s = r.status,
                                            "string" == typeof r.responseText && (c.text = r.responseText);
                                        try {
                                            l = r.statusText
                                        } catch (u) {
                                            l = ""
                                        }
                                        s || !e.isLocal || e.crossDomain ? 1223 === s && (s = 204) : s = c.text ? 200 : 404
                                    }
                                c && i(s, l, c, r.getAllResponseHeaders())
                            }
                            ,
                            e.async ? 4 === r.readyState ? setTimeout(t) : r.onreadystatechange = Jn[a] = t : t()
                    },
                    abort: function () {
                        t && t(void 0, !0)
                    }
                }
            }
        }),
        ot.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function (e) {
                    return ot.globalEval(e),
                        e
                }
            }
        }),
        ot.ajaxPrefilter("script", function (e) {
            void 0 === e.cache && (e.cache = !1),
                e.crossDomain && (e.type = "GET",
                    e.global = !1)
        }),
        ot.ajaxTransport("script", function (e) {
            if (e.crossDomain) {
                var t, n = ft.head || ot("head")[0] || ft.documentElement;
                return {
                    send: function (i, o) {
                        t = ft.createElement("script"),
                            t.async = !0,
                            e.scriptCharset && (t.charset = e.scriptCharset),
                            t.src = e.url,
                            t.onload = t.onreadystatechange = function (e, n) {
                                (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null,
                                    t.parentNode && t.parentNode.removeChild(t),
                                    t = null,
                                    n || o(200, "success"))
                            }
                            ,
                            n.insertBefore(t, n.firstChild)
                    },
                    abort: function () {
                        t && t.onload(void 0, !0)
                    }
                }
            }
        });
    var ti = []
        , ni = /(=)\?(?=&|$)|\?\?/;
    ot.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = ti.pop() || ot.expando + "_" + Nn++;
            return this[e] = !0,
                e
        }
    }),
        ot.ajaxPrefilter("json jsonp", function (t, n, i) {
            var o, r, a, s = t.jsonp !== !1 && (ni.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ni.test(t.data) && "data");
            return s || "jsonp" === t.dataTypes[0] ? (o = t.jsonpCallback = ot.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
                s ? t[s] = t[s].replace(ni, "$1" + o) : t.jsonp !== !1 && (t.url += (Dn.test(t.url) ? "&" : "?") + t.jsonp + "=" + o),
                t.converters["script json"] = function () {
                    return a || ot.error(o + " was not called"),
                        a[0]
                }
                ,
                t.dataTypes[0] = "json",
                r = e[o],
                e[o] = function () {
                    a = arguments
                }
                ,
                i.always(function () {
                    e[o] = r,
                        t[o] && (t.jsonpCallback = n.jsonpCallback,
                            ti.push(o)),
                        a && ot.isFunction(r) && r(a[0]),
                        a = r = void 0
                }),
                "script") : void 0
        }),
        ot.parseHTML = function (e, t, n) {
            if (!e || "string" != typeof e)
                return null;
            "boolean" == typeof t && (n = t,
                t = !1),
                t = t || ft;
            var i = dt.exec(e)
                , o = !n && [];
            return i ? [t.createElement(i[1])] : (i = ot.buildFragment([e], t, o),
                o && o.length && ot(o).remove(),
                ot.merge([], i.childNodes))
        }
        ;
    var ii = ot.fn.load;
    ot.fn.load = function (e, t, n) {
        if ("string" != typeof e && ii)
            return ii.apply(this, arguments);
        var i, o, r, a = this, s = e.indexOf(" ");
        return s >= 0 && (i = ot.trim(e.slice(s, e.length)),
            e = e.slice(0, s)),
            ot.isFunction(t) ? (n = t,
                t = void 0) : t && "object" == typeof t && (r = "POST"),
            a.length > 0 && ot.ajax({
                url: e,
                type: r,
                dataType: "html",
                data: t
            }).done(function (e) {
                o = arguments,
                    a.html(i ? ot("<div>").append(ot.parseHTML(e)).find(i) : e)
            }).complete(n && function (e, t) {
                a.each(n, o || [e.responseText, t, e])
            }
                ),
            this
    }
        ,
        ot.expr.filters.animated = function (e) {
            return ot.grep(ot.timers, function (t) {
                return e === t.elem
            }).length
        }
        ;
    var oi = e.document.documentElement;
    ot.offset = {
        setOffset: function (e, t, n) {
            var i, o, r, a, s, l, c, u = ot.css(e, "position"), d = ot(e), p = {};
            "static" === u && (e.style.position = "relative"),
                s = d.offset(),
                r = ot.css(e, "top"),
                l = ot.css(e, "left"),
                c = ("absolute" === u || "fixed" === u) && ot.inArray("auto", [r, l]) > -1,
                c ? (i = d.position(),
                    a = i.top,
                    o = i.left) : (a = parseFloat(r) || 0,
                        o = parseFloat(l) || 0),
                ot.isFunction(t) && (t = t.call(e, n, s)),
                null != t.top && (p.top = t.top - s.top + a),
                null != t.left && (p.left = t.left - s.left + o),
                "using" in t ? t.using.call(e, p) : d.css(p)
        }
    },
        ot.fn.extend({
            offset: function (e) {
                if (arguments.length)
                    return void 0 === e ? this : this.each(function (t) {
                        ot.offset.setOffset(this, e, t)
                    });
                var t, n, i = {
                    top: 0,
                    left: 0
                }, o = this[0], r = o && o.ownerDocument;
                if (r)
                    return t = r.documentElement,
                        ot.contains(t, o) ? (typeof o.getBoundingClientRect !== _t && (i = o.getBoundingClientRect()),
                            n = U(r),
                            {
                                top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                                left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
                            }) : i
            },
            position: function () {
                if (this[0]) {
                    var e, t, n = {
                        top: 0,
                        left: 0
                    }, i = this[0];
                    return "fixed" === ot.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(),
                        t = this.offset(),
                        ot.nodeName(e[0], "html") || (n = e.offset()),
                        n.top += ot.css(e[0], "borderTopWidth", !0),
                        n.left += ot.css(e[0], "borderLeftWidth", !0)),
                        {
                            top: t.top - n.top - ot.css(i, "marginTop", !0),
                            left: t.left - n.left - ot.css(i, "marginLeft", !0)
                        }
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    for (var e = this.offsetParent || oi; e && !ot.nodeName(e, "html") && "static" === ot.css(e, "position");)
                        e = e.offsetParent;
                    return e || oi
                })
            }
        }),
        ot.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function (e, t) {
            var n = /Y/.test(t);
            ot.fn[e] = function (i) {
                return At(this, function (e, i, o) {
                    var r = U(e);
                    return void 0 === o ? r ? t in r ? r[t] : r.document.documentElement[i] : e[i] : void (r ? r.scrollTo(n ? ot(r).scrollLeft() : o, n ? o : ot(r).scrollTop()) : e[i] = o)
                }, e, i, arguments.length, null)
            }
        }),
        ot.each(["top", "left"], function (e, t) {
            ot.cssHooks[t] = k(nt.pixelPosition, function (e, n) {
                return n ? (n = tn(e, t),
                    on.test(n) ? ot(e).position()[t] + "px" : n) : void 0
            })
        }),
        ot.each({
            Height: "height",
            Width: "width"
        }, function (e, t) {
            ot.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function (n, i) {
                ot.fn[i] = function (i, o) {
                    var r = arguments.length && (n || "boolean" != typeof i)
                        , a = n || (i === !0 || o === !0 ? "margin" : "border");
                    return At(this, function (t, n, i) {
                        var o;
                        return ot.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                            Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? ot.css(t, n, a) : ot.style(t, n, i, a)
                    }, t, r ? i : void 0, r, null)
                }
            })
        }),
        ot.fn.size = function () {
            return this.length
        }
        ,
        ot.fn.andSelf = ot.fn.addBack,
        "function" == typeof define && define.amd && define("jquery", [], function () {
            return ot
        });
    var ri = e.jQuery
        , ai = e.$;
    return ot.noConflict = function (t) {
        return e.$ === ot && (e.$ = ai),
            t && e.jQuery === ot && (e.jQuery = ri),
            ot
    }
        ,
        typeof t === _t && (e.jQuery = e.$ = ot),
        ot
}),
    function (e, t) {
        e.rails !== t && e.error("jquery-ujs has already been loaded!");
        var n, i = e(document);
        e.rails = n = {
            linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]",
            buttonClickSelector: "button[data-remote]:not(form button), button[data-confirm]:not(form button)",
            inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
            formSubmitSelector: "form",
            formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
            disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
            enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
            requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])",
            fileInputSelector: "input[type=file]",
            linkDisableSelector: "a[data-disable-with], a[data-disable]",
            buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
            CSRFProtection: function (t) {
                var n = e('meta[name="csrf-token"]').attr("content");
                n && t.setRequestHeader("X-CSRF-Token", n)
            },
            refreshCSRFTokens: function () {
                var t = e("meta[name=csrf-token]").attr("content")
                    , n = e("meta[name=csrf-param]").attr("content");
                e('form input[name="' + n + '"]').val(t)
            },
            fire: function (t, n, i) {
                var o = e.Event(n);
                return t.trigger(o, i),
                    o.result !== !1
            },
            confirm: function (e) {
                return confirm(e)
            },
            ajax: function (t) {
                return e.ajax(t)
            },
            href: function (e) {
                return e.attr("href")
            },
            handleRemote: function (i) {
                var o, r, a, s, l, c, u, d;
                if (n.fire(i, "ajax:before")) {
                    if (s = i.data("cross-domain"),
                        l = s === t ? null : s,
                        c = i.data("with-credentials") || null,
                        u = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType,
                        i.is("form")) {
                        o = i.attr("method"),
                            r = i.attr("action"),
                            a = i.serializeArray();
                        var p = i.data("ujs:submit-button");
                        p && (a.push(p),
                            i.data("ujs:submit-button", null))
                    } else
                        i.is(n.inputChangeSelector) ? (o = i.data("method"),
                            r = i.data("url"),
                            a = i.serialize(),
                            i.data("params") && (a = a + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (o = i.data("method") || "get",
                                r = i.data("url"),
                                a = i.serialize(),
                                i.data("params") && (a = a + "&" + i.data("params"))) : (o = i.data("method"),
                                    r = n.href(i),
                                    a = i.data("params") || null);
                    return d = {
                        type: o || "GET",
                        data: a,
                        dataType: u,
                        beforeSend: function (e, o) {
                            return o.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + o.accepts.script),
                                n.fire(i, "ajax:beforeSend", [e, o]) ? void i.trigger("ajax:send", e) : !1
                        },
                        success: function (e, t, n) {
                            i.trigger("ajax:success", [e, t, n])
                        },
                        complete: function (e, t) {
                            i.trigger("ajax:complete", [e, t])
                        },
                        error: function (e, t, n) {
                            i.trigger("ajax:error", [e, t, n])
                        },
                        crossDomain: l
                    },
                        c && (d.xhrFields = {
                            withCredentials: c
                        }),
                        r && (d.url = r),
                        n.ajax(d)
                }
                return !1
            },
            handleMethod: function (i) {
                var o = n.href(i)
                    , r = i.data("method")
                    , a = i.attr("target")
                    , s = e("meta[name=csrf-token]").attr("content")
                    , l = e("meta[name=csrf-param]").attr("content")
                    , c = e('<form method="post" action="' + o + '"></form>')
                    , u = '<input name="_method" value="' + r + '" type="hidden" />';
                l !== t && s !== t && (u += '<input name="' + l + '" value="' + s + '" type="hidden" />'),
                    a && c.attr("target", a),
                    c.hide().append(u).appendTo("body"),
                    c.submit()
            },
            formElements: function (t, n) {
                return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
            },
            disableFormElements: function (t) {
                n.formElements(t, n.disableSelector).each(function () {
                    n.disableFormElement(e(this))
                })
            },
            disableFormElement: function (e) {
                var n, i;
                n = e.is("button") ? "html" : "val",
                    i = e.data("disable-with"),
                    e.data("ujs:enable-with", e[n]()),
                    i !== t && e[n](i),
                    e.prop("disabled", !0)
            },
            enableFormElements: function (t) {
                n.formElements(t, n.enableSelector).each(function () {
                    n.enableFormElement(e(this))
                })
            },
            enableFormElement: function (e) {
                var t = e.is("button") ? "html" : "val";
                e.data("ujs:enable-with") && e[t](e.data("ujs:enable-with")),
                    e.prop("disabled", !1)
            },
            allowAction: function (e) {
                var t, i = e.data("confirm"), o = !1;
                return i ? (n.fire(e, "confirm") && (o = n.confirm(i),
                    t = n.fire(e, "confirm:complete", [o])),
                    o && t) : !0
            },
            blankInputs: function (t, n, i) {
                var o, r, a = e(), s = n || "input,textarea", l = t.find(s);
                return l.each(function () {
                    if (o = e(this),
                        r = o.is("input[type=checkbox],input[type=radio]") ? o.is(":checked") : o.val(),
                        !r == !i) {
                        if (o.is("input[type=radio]") && l.filter('input[type=radio]:checked[name="' + o.attr("name") + '"]').length)
                            return !0;
                        a = a.add(o)
                    }
                }),
                    a.length ? a : !1
            },
            nonBlankInputs: function (e, t) {
                return n.blankInputs(e, t, !0)
            },
            stopEverything: function (t) {
                return e(t.target).trigger("ujs:everythingStopped"),
                    t.stopImmediatePropagation(),
                    !1
            },
            disableElement: function (e) {
                var i = e.data("disable-with");
                e.data("ujs:enable-with", e.html()),
                    i !== t && e.html(i),
                    e.bind("click.railsDisable", function (e) {
                        return n.stopEverything(e)
                    })
            },
            enableElement: function (e) {
                e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")),
                    e.removeData("ujs:enable-with")),
                    e.unbind("click.railsDisable")
            }
        },
            n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function (e, t, i) {
                e.crossDomain || n.CSRFProtection(i)
            }),
                i.delegate(n.linkDisableSelector, "ajax:complete", function () {
                    n.enableElement(e(this))
                }),
                i.delegate(n.buttonDisableSelector, "ajax:complete", function () {
                    n.enableFormElement(e(this))
                }),
                i.delegate(n.linkClickSelector, "click.rails", function (i) {
                    var o = e(this)
                        , r = o.data("method")
                        , a = o.data("params")
                        , s = i.metaKey || i.ctrlKey;
                    if (!n.allowAction(o))
                        return n.stopEverything(i);
                    if (!s && o.is(n.linkDisableSelector) && n.disableElement(o),
                        o.data("remote") !== t) {
                        if (s && (!r || "GET" === r) && !a)
                            return !0;
                        var l = n.handleRemote(o);
                        return l === !1 ? n.enableElement(o) : l.error(function () {
                            n.enableElement(o)
                        }),
                            !1
                    }
                    return o.data("method") ? (n.handleMethod(o),
                        !1) : void 0
                }),
                i.delegate(n.buttonClickSelector, "click.rails", function (t) {
                    var i = e(this);
                    if (!n.allowAction(i))
                        return n.stopEverything(t);
                    i.is(n.buttonDisableSelector) && n.disableFormElement(i);
                    var o = n.handleRemote(i);
                    return o === !1 ? n.enableFormElement(i) : o.error(function () {
                        n.enableFormElement(i)
                    }),
                        !1
                }),
                i.delegate(n.inputChangeSelector, "change.rails", function (t) {
                    var i = e(this);
                    return n.allowAction(i) ? (n.handleRemote(i),
                        !1) : n.stopEverything(t)
                }),
                i.delegate(n.formSubmitSelector, "submit.rails", function (i) {
                    var o, r, a = e(this), s = a.data("remote") !== t;
                    if (!n.allowAction(a))
                        return n.stopEverything(i);
                    if (a.attr("novalidate") == t && (o = n.blankInputs(a, n.requiredInputSelector),
                        o && n.fire(a, "ajax:aborted:required", [o])))
                        return n.stopEverything(i);
                    if (s) {
                        if (r = n.nonBlankInputs(a, n.fileInputSelector)) {
                            setTimeout(function () {
                                n.disableFormElements(a)
                            }, 13);
                            var l = n.fire(a, "ajax:aborted:file", [r]);
                            return l || setTimeout(function () {
                                n.enableFormElements(a)
                            }, 13),
                                l
                        }
                        return n.handleRemote(a),
                            !1
                    }
                    setTimeout(function () {
                        n.disableFormElements(a)
                    }, 13)
                }),
                i.delegate(n.formInputClickSelector, "click.rails", function (t) {
                    var i = e(this);
                    if (!n.allowAction(i))
                        return n.stopEverything(t);
                    var o = i.attr("name")
                        , r = o ? {
                            name: o,
                            value: i.val()
                        } : null;
                    i.closest("form").data("ujs:submit-button", r)
                }),
                i.delegate(n.formSubmitSelector, "ajax:send.rails", function (t) {
                    this == t.target && n.disableFormElements(e(this))
                }),
                i.delegate(n.formSubmitSelector, "ajax:complete.rails", function (t) {
                    this == t.target && n.enableFormElements(e(this))
                }),
                e(function () {
                    n.refreshCSRFTokens()
                }))
    }(jQuery);
var Cookie = {
    set: function (e, t, n) {
        var i, o, r, a, s;
        n ? (r = new Date,
            r.setTime(r.getTime() + 24 * n * 60 * 60 * 1e3),
            a = "; expires=" + r.toGMTString()) : a = "",
            s = location.host.split(":")[0],
            1 === s.split(".").length ? document.cookie = e + "=" + t + a + "; path=/" : (o = s.split("."),
                o.shift(),
                i = "." + o.join("."),
                document.cookie = e + "=" + t + a + "; path=/; domain=" + i,
                (null == Cookie.get(e) || Cookie.get(e) != t) && (i = "." + s,
                    document.cookie = e + "=" + t + a + "; path=/; domain=" + i))
    },
    get: function (e) {
        for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
            for (var o = n[i]; " " == o.charAt(0);)
                o = o.substring(1, o.length);
            if (0 == o.indexOf(t))
                return o.substring(t.length, o.length)
        }
        return null
    },
    erase: function (e) {
        Cookie.set(e, "", -1)
    }
};
!function (e, t, n) {
    "use strict";
    "undefined" != typeof module && module.exports ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t[e] = n()
}("fp2", this, function () {
    "use strict";
    var e = function (e) {
        var t = {
            swfContainerId: "fpjs2",
            swfPath: "/fp.swf"
        };
        this.options = this.extend(e, t),
            this.nativeForEach = Array.prototype.forEach,
            this.nativeMap = Array.prototype.map
    };
    return e.prototype = {
        extend: function (e, t) {
            if (null == e)
                return t;
            for (var n in e)
                null != e[n] && t[n] !== e[n] && (t[n] = e[n]);
            return t
        },
        log: function (e) {
            window.console && console.log(e)
        },
        get: function (e) {
            var t = [];
            t = this.userAgentKey(t),
                t = this.languageKey(t),
                t = this.colorDepthKey(t),
                t = this.screenResolutionKey(t),
                t = this.timezoneOffsetKey(t),
                t = this.sessionStorageKey(t),
                t = this.localStorageKey(t),
                t = this.indexedDbKey(t),
                t = this.addBehaviorKey(t),
                t = this.openDatabaseKey(t),
                t = this.cpuClassKey(t),
                t = this.platformKey(t),
                t = this.doNotTrackKey(t),
                t = this.pluginsKey(t),
                t = this.canvasKey(t),
                t = this.webglKey(t);
            var n = this;
            this.fontsKey(t, function (t) {
                var i = n.x64hash128(t.join("~~~"), 31);
                return e(i)
            })
        },
        userAgentKey: function (e) {
            return this.options.excludeUserAgent || e.push(navigator.userAgent),
                e
        },
        languageKey: function (e) {
            return this.options.excludeLanguage || e.push(navigator.language),
                e
        },
        colorDepthKey: function (e) {
            return this.options.excludeColorDepth || e.push(screen.colorDepth),
                e
        },
        screenResolutionKey: function (e) {
            return this.options.excludeScreenResolution ? e : this.getScreenResolution(e)
        },
        getScreenResolution: function (e) {
            var t, n;
            return t = this.options.detectScreenOrientation ? screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height] : [screen.height, screen.width],
                "undefined" != typeof t && e.push(t),
                screen.availWidth && screen.availHeight && (n = this.options.detectScreenOrientation ? screen.availHeight > screen.availWidth ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight] : [screen.availHeight, screen.availWidth]),
                "undefined" != typeof n && e.push(n),
                e
        },
        timezoneOffsetKey: function (e) {
            return this.options.excludeTimezoneOffset || e.push((new Date).getTimezoneOffset()),
                e
        },
        sessionStorageKey: function (e) {
            return !this.options.excludeSessionStorage && this.hasSessionStorage() && e.push("sessionStorageKey"),
                e
        },
        localStorageKey: function (e) {
            return !this.options.excludeSessionStorage && this.hasLocalStorage() && e.push("localStorageKey"),
                e
        },
        indexedDbKey: function (e) {
            return !this.options.excludeIndexedDB && this.hasIndexedDB() && e.push("indexedDbKey"),
                e
        },
        addBehaviorKey: function (e) {
            return document.body && !this.options.excludeAddBehavior && document.body.addBehavior && e.push("addBehaviorKey"),
                e
        },
        openDatabaseKey: function (e) {
            return !this.options.excludeOpenDatabase && window.openDatabase && e.push("openDatabase"),
                e
        },
        cpuClassKey: function (e) {
            return this.options.excludeCpuClass || e.push(this.getNavigatorCpuClass()),
                e
        },
        platformKey: function (e) {
            return this.options.excludePlatform || e.push(this.getNavigatorPlatform()),
                e
        },
        doNotTrackKey: function (e) {
            return this.options.excludeDoNotTrack || e.push(this.getDoNotTrack()),
                e
        },
        canvasKey: function (e) {
            return !this.options.excludeCanvas && this.isCanvasSupported() && e.push(this.getCanvasFp()),
                e
        },
        webglKey: function (e) {
            return !this.options.excludeWebGL && this.isCanvasSupported() && e.push(this.getWebglFp()),
                e
        },
        fontsKey: function (e, t) {
            return this.options.excludeJsFonts ? this.flashFontsKey(e, t) : this.jsFontsKey(e, t)
        },
        flashFontsKey: function (e, t) {
            return this.options.excludeFlashFonts ? ("undefined" == typeof NODEBUG && this.log("Skipping flash fonts detection per excludeFlashFonts configuration option"),
                t(e)) : this.hasSwfObjectLoaded() ? this.hasMinFlashInstalled() ? "undefined" == typeof this.options.swfPath ? ("undefined" == typeof NODEBUG && this.log("To use Flash fonts detection, you must pass a valid swfPath option, skipping Flash fonts enumeration"),
                    t(e)) : void this.loadSwfAndDetectFonts(function (n) {
                        e.push(n.join(";")),
                            t(e)
                    }) : ("undefined" == typeof NODEBUG && this.log("Flash is not installed, skipping Flash fonts enumeration"),
                        t(e)) : ("undefined" == typeof NODEBUG && this.log("Swfobject is not detected, Flash fonts enumeration is skipped"),
                            t(e))
        },
        jsFontsKey: function (e, t) {
            return setTimeout(function () {
                var n = ["monospace", "sans-serif", "serif"]
                    , i = "mmmmmmmmmmlli"
                    , o = "72px"
                    , r = document.getElementsByTagName("body")[0]
                    , a = document.createElement("span");
                a.style.fontSize = o,
                    a.innerHTML = i;
                var s = {}
                    , l = {};
                for (var c in n)
                    a.style.fontFamily = n[c],
                        r.appendChild(a),
                        s[n[c]] = a.offsetWidth,
                        l[n[c]] = a.offsetHeight,
                        r.removeChild(a);
                for (var u = function (e) {
                    var t = !1;
                    for (var i in n) {
                        a.style.fontFamily = e + "," + n[i],
                            r.appendChild(a);
                        var o = a.offsetWidth !== s[n[i]] || a.offsetHeight !== l[n[i]];
                        r.removeChild(a),
                            t = t || o
                    }
                    return t
                }, d = ["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andale Mono", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Bitstream Vera Sans Mono", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Calibri", "Californian FB", "Calisto MT", "Calligrapher", "Cambria", "Cambria Math", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Century", "Century Gothic", "Century Schoolbook", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Comic Sans", "Comic Sans MS", "Consolas", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Courier", "Courier New", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "Devanagari Sangam MN", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "Franklin Gothic", "Franklin Gothic Book", "Franklin Gothic Demi", "Franklin Gothic Demi Cond", "Franklin Gothic Heavy", "Franklin Gothic Medium", "Franklin Gothic Medium Cond", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Garamond", "Gautami", "Geeza Pro", "Geneva", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "Georgia", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Helvetica", "Helvetica Neue", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Impact", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Monaco", "Mongolian Baiti", "MONO", "Monotype Corsiva", "MoolBoran", "Mrs Eaves", "MS Gothic", "MS LineDraw", "MS Mincho", "MS Outlook", "MS PGothic", "MS PMincho", "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif", "MS Serif", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "MYRIAD", "MYRIAD PRO", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Palatino", "Palatino Linotype", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tahoma", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Times", "Times New Roman", "Times New Roman PS", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Trebuchet MS", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Verdana", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "Wingdings", "Wingdings 2", "Wingdings 3", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"], p = [], h = 0, f = d.length; f > h; h++)
                    u(d[h]) && p.push(d[h]);
                e.push(p.join(";")),
                    t(e)
            }, 1)
        },
        pluginsKey: function (e) {
            return e.push(this.isIE() ? this.getIEPluginsString() : this.getRegularPluginsString()),
                e
        },
        getRegularPluginsString: function () {
            return this.map(navigator.plugins, function (e) {
                var t = this.map(e, function (e) {
                    return [e.type, e.suffixes].join("~")
                }).join(",");
                return [e.name, e.description, t].join("::")
            }, this).join(";")
        },
        getIEPluginsString: function () {
            if (window.ActiveXObject) {
                var e = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"];
                return this.map(e, function (e) {
                    try {
                        return new ActiveXObject(e),
                            e
                    } catch (t) {
                        return null
                    }
                }).join(";")
            }
            return ""
        },
        hasSessionStorage: function () {
            try {
                return !!window.sessionStorage
            } catch (e) {
                return !0
            }
        },
        hasLocalStorage: function () {
            try {
                return !!window.localStorage
            } catch (e) {
                return !0
            }
        },
        hasIndexedDB: function () {
            return !!window.indexedDB
        },
        getNavigatorCpuClass: function () {
            return navigator.cpuClass ? "navigatorCpuClass: " + navigator.cpuClass : "navigatorCpuClass: unknown"
        },
        getNavigatorPlatform: function () {
            return navigator.platform ? "navigatorPlatform: " + navigator.platform : "navigatorPlatform: unknown"
        },
        getDoNotTrack: function () {
            return navigator.doNotTrack ? "doNotTrack: " + navigator.doNotTrack : "doNotTrack: unknown"
        },
        getCanvasFp: function () {
            var e = []
                , t = document.createElement("canvas");
            t.width = 2e3,
                t.height = 200;
            var n = t.getContext("2d");
            try {
                n.globalCompositeOperation = "screen"
            } catch (i) { }
            e.push("canvas blending:" + ("screen" === n.globalCompositeOperation ? "yes" : "no")),
                n.rect(0, 0, 10, 10),
                n.rect(2, 2, 6, 6),
                e.push("canvas winding:" + (n.isPointInPath(5, 5, "evenodd") === !1 ? "yes" : "no"));
            var o = "https://github.com/valve for PEACE in Ukraine!";
            return n.textBaseline = "top",
                n.font = "72px 'DamascusLight'",
                n.fillStyle = "#f60",
                n.fillRect(2, 0, 1e3, 70),
                n.fillStyle = "#069",
                n.fillText(o, 2, 0),
                n.font = "72px 'Roboto Condensed'",
                n.fillStyle = "rgba(102, 204, 0, 0.7)",
                n.fillText(o, 4, 2),
                n.strokeStyle = "rgba(202, 104, 0, 0.9)",
                n.font = "72px 'Menlo'",
                n.strokeText(o, 8, 4),
                n.globalCompositeOperation = "multiply",
                n.fillStyle = "rgb(255,0,255)",
                n.beginPath(),
                n.arc(50, 50, 50, 0, 2 * Math.PI, !0),
                n.closePath(),
                n.fill(),
                n.fillStyle = "rgb(0,255,255)",
                n.beginPath(),
                n.arc(100, 50, 50, 0, 2 * Math.PI, !0),
                n.closePath(),
                n.fill(),
                n.fillStyle = "rgb(255,255,0)",
                n.beginPath(),
                n.arc(75, 100, 50, 0, 2 * Math.PI, !0),
                n.closePath(),
                n.fill(),
                n.fillStyle = "rgb(255,0,255)",
                n.arc(75, 75, 75, 0, 2 * Math.PI, !0),
                n.arc(75, 75, 25, 0, 2 * Math.PI, !0),
                n.fill("evenodd"),
                e.push("canvas fp:" + t.toDataURL()),
                e.join("\xa7")
        },
        getWebglFp: function () {
            var e, t = function (t) {
                return e.clearColor(0, 0, 0, 1),
                    e.enable(e.DEPTH_TEST),
                    e.depthFunc(e.LEQUAL),
                    e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT),
                    "[" + t[0] + ", " + t[1] + "]"
            }, n = function (e) {
                var t, n = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic");
                return n ? (t = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT),
                    0 === t && (t = 2),
                    t) : null
            };
            if (e = this.getWebglCanvas(),
                !e)
                return null;
            var i = []
                , o = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
                , r = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
                , a = e.createBuffer();
            e.bindBuffer(e.ARRAY_BUFFER, a);
            var s = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
            e.bufferData(e.ARRAY_BUFFER, s, e.STATIC_DRAW),
                a.itemSize = 3,
                a.numItems = 3;
            var l = e.createProgram()
                , c = e.createShader(e.VERTEX_SHADER);
            e.shaderSource(c, o),
                e.compileShader(c);
            var u = e.createShader(e.FRAGMENT_SHADER);
            return e.shaderSource(u, r),
                e.compileShader(u),
                e.attachShader(l, c),
                e.attachShader(l, u),
                e.linkProgram(l),
                e.useProgram(l),
                l.vertexPosAttrib = e.getAttribLocation(l, "attrVertex"),
                l.offsetUniform = e.getUniformLocation(l, "uniformOffset"),
                e.enableVertexAttribArray(l.vertexPosArray),
                e.vertexAttribPointer(l.vertexPosAttrib, a.itemSize, e.FLOAT, !1, 0, 0),
                e.uniform2f(l.offsetUniform, 1, 1),
                e.drawArrays(e.TRIANGLE_STRIP, 0, a.numItems),
                null != e.canvas && i.push(e.canvas.toDataURL()),
                i.push("extensions:" + e.getSupportedExtensions().join(";")),
                i.push("webgl aliased line width range:" + t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))),
                i.push("webgl aliased point size range:" + t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))),
                i.push("webgl alpha bits:" + e.getParameter(e.ALPHA_BITS)),
                i.push("webgl antialiasing:" + (e.getContextAttributes().antialias ? "yes" : "no")),
                i.push("webgl blue bits:" + e.getParameter(e.BLUE_BITS)),
                i.push("webgl depth bits:" + e.getParameter(e.DEPTH_BITS)),
                i.push("webgl green bits:" + e.getParameter(e.GREEN_BITS)),
                i.push("webgl max anisotropy:" + n(e)),
                i.push("webgl max combined texture image units:" + e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
                i.push("webgl max cube map texture size:" + e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)),
                i.push("webgl max fragment uniform vectors:" + e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)),
                i.push("webgl max render buffer size:" + e.getParameter(e.MAX_RENDERBUFFER_SIZE)),
                i.push("webgl max texture image units:" + e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)),
                i.push("webgl max texture size:" + e.getParameter(e.MAX_TEXTURE_SIZE)),
                i.push("webgl max varying vectors:" + e.getParameter(e.MAX_VARYING_VECTORS)),
                i.push("webgl max vertex attribs:" + e.getParameter(e.MAX_VERTEX_ATTRIBS)),
                i.push("webgl max vertex texture image units:" + e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),
                i.push("webgl max vertex uniform vectors:" + e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)),
                i.push("webgl max viewport dims:" + t(e.getParameter(e.MAX_VIEWPORT_DIMS))),
                i.push("webgl red bits:" + e.getParameter(e.RED_BITS)),
                i.push("webgl renderer:" + e.getParameter(e.RENDERER)),
                i.push("webgl shading language version:" + e.getParameter(e.SHADING_LANGUAGE_VERSION)),
                i.push("webgl stencil bits:" + e.getParameter(e.STENCIL_BITS)),
                i.push("webgl vendor:" + e.getParameter(e.VENDOR)),
                i.push("webgl version:" + e.getParameter(e.VERSION)),
                i.push("webgl vertex shader high float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision),
                i.push("webgl vertex shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMin),
                i.push("webgl vertex shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).rangeMax),
                i.push("webgl vertex shader medium float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision),
                i.push("webgl vertex shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMin),
                i.push("webgl vertex shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).rangeMax),
                i.push("webgl vertex shader low float precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).precision),
                i.push("webgl vertex shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMin),
                i.push("webgl vertex shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_FLOAT).rangeMax),
                i.push("webgl fragment shader high float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision),
                i.push("webgl fragment shader high float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMin),
                i.push("webgl fragment shader high float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).rangeMax),
                i.push("webgl fragment shader medium float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision),
                i.push("webgl fragment shader medium float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMin),
                i.push("webgl fragment shader medium float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).rangeMax),
                i.push("webgl fragment shader low float precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).precision),
                i.push("webgl fragment shader low float precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMin),
                i.push("webgl fragment shader low float precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_FLOAT).rangeMax),
                i.push("webgl vertex shader high int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).precision),
                i.push("webgl vertex shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMin),
                i.push("webgl vertex shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_INT).rangeMax),
                i.push("webgl vertex shader medium int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).precision),
                i.push("webgl vertex shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMin),
                i.push("webgl vertex shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_INT).rangeMax),
                i.push("webgl vertex shader low int precision:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).precision),
                i.push("webgl vertex shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMin),
                i.push("webgl vertex shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.LOW_INT).rangeMax),
                i.push("webgl fragment shader high int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).precision),
                i.push("webgl fragment shader high int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMin),
                i.push("webgl fragment shader high int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_INT).rangeMax),
                i.push("webgl fragment shader medium int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).precision),
                i.push("webgl fragment shader medium int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMin),
                i.push("webgl fragment shader medium int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_INT).rangeMax),
                i.push("webgl fragment shader low int precision:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).precision),
                i.push("webgl fragment shader low int precision rangeMin:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMin),
                i.push("webgl fragment shader low int precision rangeMax:" + e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.LOW_INT).rangeMax),
                i.join("\xa7")
        },
        isCanvasSupported: function () {
            var e = document.createElement("canvas");
            return !(!e.getContext || !e.getContext("2d"))
        },
        isIE: function () {
            return "Microsoft Internet Explorer" === navigator.appName ? !0 : "Netscape" === navigator.appName && /Trident/.test(navigator.userAgent) ? !0 : !1
        },
        hasSwfObjectLoaded: function () {
            return "undefined" != typeof window.swfobject
        },
        hasMinFlashInstalled: function () {
            return swfobject.hasFlashPlayerVersion("9.0.0")
        },
        addFlashDivNode: function () {
            var e = document.createElement("div");
            e.setAttribute("id", this.options.swfContainerId),
                document.body.appendChild(e)
        },
        loadSwfAndDetectFonts: function (e) {
            var t = "___fp_swf_loaded";
            window[t] = function (t) {
                e(t)
            }
                ;
            var n = this.options.swfContainerId;
            this.addFlashDivNode();
            var i = {
                onReady: t
            }
                , o = {
                    allowScriptAccess: "always",
                    menu: "false"
                };
            swfobject.embedSWF(this.options.swfPath, n, "1", "1", "9.0.0", !1, i, o, {})
        },
        getWebglCanvas: function () {
            var e = document.createElement("canvas")
                , t = null;
            try {
                t = e.getContext("webgl") || e.getContext("experimental-webgl")
            } catch (n) { }
            return t || (t = null),
                t
        },
        each: function (e, t, n) {
            if (null !== e)
                if (this.nativeForEach && e.forEach === this.nativeForEach)
                    e.forEach(t, n);
                else if (e.length === +e.length) {
                    for (var i = 0, o = e.length; o > i; i++)
                        if (t.call(n, e[i], i, e) === {})
                            return
                } else
                    for (var r in e)
                        if (e.hasOwnProperty(r) && t.call(n, e[r], r, e) === {})
                            return
        },
        map: function (e, t, n) {
            var i = [];
            return null == e ? i : this.nativeMap && e.map === this.nativeMap ? e.map(t, n) : (this.each(e, function (e, o, r) {
                i[i.length] = t.call(n, e, o, r)
            }),
                i)
        },
        x64Add: function (e, t) {
            e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]],
                t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
            var n = [0, 0, 0, 0];
            return n[3] += e[3] + t[3],
                n[2] += n[3] >>> 16,
                n[3] &= 65535,
                n[2] += e[2] + t[2],
                n[1] += n[2] >>> 16,
                n[2] &= 65535,
                n[1] += e[1] + t[1],
                n[0] += n[1] >>> 16,
                n[1] &= 65535,
                n[0] += e[0] + t[0],
                n[0] &= 65535,
                [n[0] << 16 | n[1], n[2] << 16 | n[3]]
        },
        x64Multiply: function (e, t) {
            e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]],
                t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
            var n = [0, 0, 0, 0];
            return n[3] += e[3] * t[3],
                n[2] += n[3] >>> 16,
                n[3] &= 65535,
                n[2] += e[2] * t[3],
                n[1] += n[2] >>> 16,
                n[2] &= 65535,
                n[2] += e[3] * t[2],
                n[1] += n[2] >>> 16,
                n[2] &= 65535,
                n[1] += e[1] * t[3],
                n[0] += n[1] >>> 16,
                n[1] &= 65535,
                n[1] += e[2] * t[2],
                n[0] += n[1] >>> 16,
                n[1] &= 65535,
                n[1] += e[3] * t[1],
                n[0] += n[1] >>> 16,
                n[1] &= 65535,
                n[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0],
                n[0] &= 65535,
                [n[0] << 16 | n[1], n[2] << 16 | n[3]]
        },
        x64Rotl: function (e, t) {
            return t %= 64,
                32 === t ? [e[1], e[0]] : 32 > t ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32,
                    [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t])
        },
        x64LeftShift: function (e, t) {
            return t %= 64,
                0 === t ? e : 32 > t ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0]
        },
        x64Xor: function (e, t) {
            return [e[0] ^ t[0], e[1] ^ t[1]]
        },
        x64Fmix: function (e) {
            return e = this.x64Xor(e, [0, e[0] >>> 1]),
                e = this.x64Multiply(e, [4283543511, 3981806797]),
                e = this.x64Xor(e, [0, e[0] >>> 1]),
                e = this.x64Multiply(e, [3301882366, 444984403]),
                e = this.x64Xor(e, [0, e[0] >>> 1])
        },
        x64hash128: function (e, t) {
            e = e || "",
                t = t || 0;
            for (var n = e.length % 16, i = e.length - n, o = [0, t], r = [0, t], a = [0, 0], s = [0, 0], l = [2277735313, 289559509], c = [1291169091, 658871167], u = 0; i > u; u += 16)
                a = [255 & e.charCodeAt(u + 4) | (255 & e.charCodeAt(u + 5)) << 8 | (255 & e.charCodeAt(u + 6)) << 16 | (255 & e.charCodeAt(u + 7)) << 24, 255 & e.charCodeAt(u) | (255 & e.charCodeAt(u + 1)) << 8 | (255 & e.charCodeAt(u + 2)) << 16 | (255 & e.charCodeAt(u + 3)) << 24],
                    s = [255 & e.charCodeAt(u + 12) | (255 & e.charCodeAt(u + 13)) << 8 | (255 & e.charCodeAt(u + 14)) << 16 | (255 & e.charCodeAt(u + 15)) << 24, 255 & e.charCodeAt(u + 8) | (255 & e.charCodeAt(u + 9)) << 8 | (255 & e.charCodeAt(u + 10)) << 16 | (255 & e.charCodeAt(u + 11)) << 24],
                    a = this.x64Multiply(a, l),
                    a = this.x64Rotl(a, 31),
                    a = this.x64Multiply(a, c),
                    o = this.x64Xor(o, a),
                    o = this.x64Rotl(o, 27),
                    o = this.x64Add(o, r),
                    o = this.x64Add(this.x64Multiply(o, [0, 5]), [0, 1390208809]),
                    s = this.x64Multiply(s, c),
                    s = this.x64Rotl(s, 33),
                    s = this.x64Multiply(s, l),
                    r = this.x64Xor(r, s),
                    r = this.x64Rotl(r, 31),
                    r = this.x64Add(r, o),
                    r = this.x64Add(this.x64Multiply(r, [0, 5]), [0, 944331445]);
            switch (a = [0, 0],
            s = [0, 0],
            n) {
                case 15:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 14)], 48));
                case 14:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 13)], 40));
                case 13:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 12)], 32));
                case 12:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 11)], 24));
                case 11:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 10)], 16));
                case 10:
                    s = this.x64Xor(s, this.x64LeftShift([0, e.charCodeAt(u + 9)], 8));
                case 9:
                    s = this.x64Xor(s, [0, e.charCodeAt(u + 8)]),
                        s = this.x64Multiply(s, c),
                        s = this.x64Rotl(s, 33),
                        s = this.x64Multiply(s, l),
                        r = this.x64Xor(r, s);
                case 8:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 7)], 56));
                case 7:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 6)], 48));
                case 6:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 5)], 40));
                case 5:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 4)], 32));
                case 4:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 3)], 24));
                case 3:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 2)], 16));
                case 2:
                    a = this.x64Xor(a, this.x64LeftShift([0, e.charCodeAt(u + 1)], 8));
                case 1:
                    a = this.x64Xor(a, [0, e.charCodeAt(u)]),
                        a = this.x64Multiply(a, l),
                        a = this.x64Rotl(a, 31),
                        a = this.x64Multiply(a, c),
                        o = this.x64Xor(o, a)
            }
            return o = this.x64Xor(o, [0, e.length]),
                r = this.x64Xor(r, [0, e.length]),
                o = this.x64Add(o, r),
                r = this.x64Add(r, o),
                o = this.x64Fmix(o),
                r = this.x64Fmix(r),
                o = this.x64Add(o, r),
                r = this.x64Add(r, o),
                ("00000000" + (o[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (o[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (r[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (r[1] >>> 0).toString(16)).slice(-8)
        }
    },
        e
});
var sender_name = ["\u7cfb\u7d71\u8a0a\u606f", "\u6211", "\u964c\u751f\u4eba"], sender_device = ["", "\u884c\u52d5\u88dd\u7f6e", "App", "App"], sender_class = ["system", "me", "stranger"], is_mobilesafari = /iP(ad|hone|od)/.test(navigator.userAgent), hasiPhoneBug = /iP(hone|od)/.test(navigator.userAgent) && "standalone" in window.navigator && !window.navigator.standalone && /(iPhone|iPod|iPad).*AppleWebKit.*Safari/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent), haskbfocusbug = /Android.*Chrome/i.test(navigator.userAgent), is_reconnection = !1, is_leave = !0, attempts = 1, showing_kb = !1, kb_height = -1, clear_messages = !1, is_scrollToBottom = !1, dispatcher, watchdog = setInterval(function () {
    connect_watchdog()
}, 1500), updater = setInterval(function () {
    state_updater()
}, 1e3), activeUserUpdater = setInterval(function () {
    sendEvents()
}, 27e4), typing_end, new_msg_count = 0, org_title = document.title, windowFocused = !0, msg_count = 0, my_msg_count = 0, chatStarted = !1, audio = new Audio("/ding.mp3"), isbluring = !1, toEnterKeyMode = !1, toHelp = !1, messageHistory = {}, beLeave = !1, lastCheckStart = 0, userStatus = {}, recordingTimer = null;
window.mobilecheck = function () {
    var e = !1;
    return function (t) {
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
    }(navigator.userAgent || navigator.vendor || window.opera),
        e
}
    ,
    $.fn.animateRotate = function (e, t, n, i) {
        var o = $.speed(t, n, i)
            , r = o.step;
        return this.each(function (t, n) {
            o.step = function (e) {
                return $.style(n, "transform", "rotate(" + e + "deg)"),
                    r ? r.apply(this, arguments) : void 0
            }
                ,
                $({
                    deg: 0
                }).animate({
                    deg: e
                }, o)
        })
    }
    ,
    $(function () {
        $("#messageInput").keypress(function (e) {
            13 != e.keyCode || e.shiftKey ? send_typing() : "\u56de\u5831" != $("#sendButton>input").val() && $("#sendButton input").click()
        }),
            $("#messageInput").keyup(function () { }),
            $("#messageInput").keydown(function (e) {
                (0 == e.keyCode || 229 == e.keyCode) && send_typing()
            }),
            $("#keyInput").keypress(function (e) {
                13 != e.keyCode || e.shiftKey || ($("#keyInput").blur(),
                    $("#startButton").click())
            }),
            $(document).on("keyup change", "#keyInput", function () {
                key = $("#keyInput").val(),
                    url = "" == key ? "/" : "/key/" + encodeURIComponent($("#keyInput").val()),
                    window.history.replaceState({}, document.title, url),
                    ga("set", "page", url)
            })
    }),
    $(window).bind("pageshow", function () {
        checkStart()
    }),
    $(document).ready(function () {
        if ("/app" != window.location.pathname) {
            snapper = new Snap({
                element: document.getElementById("wrapper"),
                dragger: document.getElementById("menuButton"),
                disable: "right"
            }),
                snapper.on("animated", function () {
                    toEnterKeyMode && (toEnterKeyMode = !1,
                        enterKeyMode()),
                        toHelp && (toHelp = !1,
                            chatStarted ? showMessageBox("<p>\u8acb\u5148\u96e2\u958b\u76ee\u524d\u5c0d\u8a71<br>\u624d\u80fd\u958b\u555f\u8aaa\u660e\u5594!</p>", "\u958b\u555f\u8aaa\u660e") : start_help())
                }),
                snapper.on("open", function () {
                    ga("send", "event", "drawer", "open")
                });
            var e = document.getElementById("menuButton");
            if (e.addEventListener("click", function () {
                "left" == snapper.state().state ? snapper.close() : snapper.open("left")
            }),
                function (e, t, n) {
                    if (n in t && t[n]) {
                        var i, o = e.location, r = /^(a|html)$/i;
                        e.addEventListener("click", function (e) {
                            for (i = e.target; !r.test(i.nodeName);)
                                i = i.parentNode;
                            "href" in i && (i.href.indexOf("http") || ~i.href.indexOf(o.host)) && (e.preventDefault(),
                                o.href = i.href)
                        }, !1)
                    }
                }(document, window.navigator, "standalone"),
                !wssChecker())
                return void $("#usechrome").show();
            $(document).on("mousemove", "#keyInput", function (e) {
                this.offsetWidth - parseInt($(this).css("padding-right")) < e.clientX - this.getBoundingClientRect().left ? $(this).addClass("onX") : $(this).removeClass("onX")
            }).on("touchstart click", "#keyInput", function (e) {
                x = "undefined" != typeof event && "undefined" != typeof event.touches ? event.touches[0].clientX : e.clientX,
                    this.offsetWidth - parseInt($(this).css("padding-right")) < x - this.getBoundingClientRect().left && (e.preventDefault(),
                        exitKeyMode())
            }),
                $(".keyword").click(function () {
                    chatStarted || $("#keyInput").val($(this).val()).change()
                }),
                $(document).on("click", "#logoContent img", function (e) {
                    e.preventDefault(),
                        chatStarted || enterKeyMode()
                }),
                playAudio = "disable" != Cookie.get("_sound"),
                $("#checkbox-sound").prop("checked", playAudio),
                $(".sound-icon").html(playAudio ? "&#xE050;" : "&#xE04F;"),
                $("#checkbox-sound").change(function () {
                    playAudio = $(this).is(":checked"),
                        $(".sound-icon").html(playAudio ? "&#xE050;" : "&#xE04F;"),
                        Cookie.set("_sound", playAudio ? "enable" : "disable", 365),
                        ga("send", "event", "config", playAudio ? "enableSound" : "disableSound")
                }),
                is_mobilesafari && ($("#main").scrollTop(1),
                    $(".snap-drawer").scrollTop(1)),
                $("#main").scroll(function () {
                    $("#main").is(":animated") || (is_mobilesafari && 0 == $("#main").scrollTop() && $("#main").scrollTop(1),
                        is_mobilesafari && 0 == scrollBottomDistance() && scrollToMainBottom())
                }),
                $(".snap-drawer").scroll(function () {
                    $(".snap-drawer").is(":animated") || (is_mobilesafari && 0 == $(".snap-drawer").scrollTop() && $(".snap-drawer").scrollTop(1),
                        is_mobilesafari && 0 == scrollToBottomDistance($(".snap-drawer")) && scrollToBottom($(".snap-drawer")))
                }),
                $(window).on("beforeunload", function () {
                    msg_count > 0 && (ga("send", "event", "chat", "send", null, msg_count),
                        msg_count = 0),
                        ga("send", "event", "chat", "beforeunload")
                }),
                $(window).focus(function () {
                    windowFocused = !0,
                        new_msg_count = 0,
                        updateTitle()
                }),
                $(window).blur(function () {
                    windowFocused = !1
                }),
                $(window).scroll(function () {
                    if ($(window).scrollTop() != window.innerHeight,
                        scrollTop = $(window).scrollTop(),
                        $("input[type=text]#messageInput").is(":focus")) {
                        if (!hasiPhoneBug)
                            return void $(window).scrollTop(2 * window.innerHeight);
                        showing_kb && scrollTop != window.innerHeight && is_scrollToBottom ? (kb_height = scrollTop - 44,
                            showing_kb = !1,
                            is_scrollToBottom = !1,
                            console.log("window:", $(window).scrollTop(), window.innerHeight),
                            $(window).scrollTop(kb_height)) : showing_kb && scrollTop != window.innerHeight ? (console.log("window2:", $(window).scrollTop(), window.innerHeight),
                                setTimeout(function () {
                                    $(window).scrollTop(window.innerHeight)
                                }, 200),
                                is_scrollToBottom = !0) : 0 == $(window).scrollTop() || showing_kb || (console.log("window set:", $(window).scrollTop(), window.innerHeight),
                                    $(window).scrollTop(kb_height)),
                            console.log("window3:", $(window).scrollTop(), window.innerHeight)
                    }
                }),
                $("input[type=text]#messageInput").focus(function () {
                    0 == $(window).scrollTop() && (showing_kb = !0),
                        scrollBottomDistance() < 100 && window.mobilecheck() && haskbfocusbug && (check_start = Date.now(),
                            "undefined" != typeof bottom_check && clearTimeout(bottom_check),
                            bottom_check = setInterval(function () {
                                Date.now() - check_start > 1e3 && clearTimeout(bottom_check),
                                    scrollBottomDistance() >= 100 && (clearTimeout(bottom_check),
                                        scrollToMainBottom(0))
                            }, 100))
                }),
                $("input[type=text]#messageInput").blur(function () {
                    isbluring = !0,
                        setTimeout(function () {
                            isbluring = !1
                        }, 500)
                }),
                $("input[type=button]").blur(function () { }),
                $(".bg-image").height(window.innerHeight + 2),
                $(window).resize(function () {
                    window.innerHeight >= 450 && $(".bg-image").height(window.innerHeight + 2)
                });
            var t = /^\/key\/(.*)/.exec(window.location.pathname);
            t && ($("#keyInput").val(decodeURIComponent(t[1])),
                enterKeyMode()),
                console.log("Starting..."),
                checkStart(),
                setTimeout(function () {
                    if (!Cookie.get("_wfp") && !window.mobilecheck()) {
                        var e = new fp2;
                        e.get(function (e) {
                            Cookie.set("_wfp", e)
                        }),
                            console.log("FP Done.")
                    }
                }, 6e4),
                "voicePlayer" in window || (voicePlayer = new Audio,
                    voicePlayer.src = "/zero.mp3")
        }
    }),
    $(window).load(function () {
        $(".snap-drawers").css("opacity", "1")
    }),
    jQuery.easing.jswing = jQuery.easing.swing,
    jQuery.extend(jQuery.easing, {
        def: "easeOutQuad",
        swing: function (e, t, n, i, o) {
            return jQuery.easing[jQuery.easing.def](e, t, n, i, o)
        },
        easeInQuad: function (e, t, n, i, o) {
            return i * (t /= o) * t + n
        },
        easeOutQuad: function (e, t, n, i, o) {
            return -i * (t /= o) * (t - 2) + n
        },
        easeInOutQuad: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t + n : -i / 2 * (--t * (t - 2) - 1) + n
        },
        easeInCubic: function (e, t, n, i, o) {
            return i * (t /= o) * t * t + n
        },
        easeOutCubic: function (e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t + 1) + n
        },
        easeInOutCubic: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t + n : i / 2 * ((t -= 2) * t * t + 2) + n
        },
        easeInQuart: function (e, t, n, i, o) {
            return i * (t /= o) * t * t * t + n
        },
        easeOutQuart: function (e, t, n, i, o) {
            return -i * ((t = t / o - 1) * t * t * t - 1) + n
        },
        easeInOutQuart: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t + n : -i / 2 * ((t -= 2) * t * t * t - 2) + n
        },
        easeInQuint: function (e, t, n, i, o) {
            return i * (t /= o) * t * t * t * t + n
        },
        easeOutQuint: function (e, t, n, i, o) {
            return i * ((t = t / o - 1) * t * t * t * t + 1) + n
        },
        easeInOutQuint: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? i / 2 * t * t * t * t * t + n : i / 2 * ((t -= 2) * t * t * t * t + 2) + n
        },
        easeInSine: function (e, t, n, i, o) {
            return -i * Math.cos(t / o * (Math.PI / 2)) + i + n
        },
        easeOutSine: function (e, t, n, i, o) {
            return i * Math.sin(t / o * (Math.PI / 2)) + n
        },
        easeInOutSine: function (e, t, n, i, o) {
            return -i / 2 * (Math.cos(Math.PI * t / o) - 1) + n
        },
        easeInExpo: function (e, t, n, i, o) {
            return 0 == t ? n : i * Math.pow(2, 10 * (t / o - 1)) + n
        },
        easeOutExpo: function (e, t, n, i, o) {
            return t == o ? n + i : i * (-Math.pow(2, -10 * t / o) + 1) + n
        },
        easeInOutExpo: function (e, t, n, i, o) {
            return 0 == t ? n : t == o ? n + i : (t /= o / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + n : i / 2 * (-Math.pow(2, -10 * --t) + 2) + n
        },
        easeInCirc: function (e, t, n, i, o) {
            return -i * (Math.sqrt(1 - (t /= o) * t) - 1) + n
        },
        easeOutCirc: function (e, t, n, i, o) {
            return i * Math.sqrt(1 - (t = t / o - 1) * t) + n
        },
        easeInOutCirc: function (e, t, n, i, o) {
            return (t /= o / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + n : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n
        },
        easeInElastic: function (e, t, n, i, o) {
            var r = 1.70158
                , a = 0
                , s = i;
            if (0 == t)
                return n;
            if (1 == (t /= o))
                return n + i;
            if (a || (a = .3 * o),
                s < Math.abs(i)) {
                s = i;
                var r = a / 4
            } else
                var r = a / (2 * Math.PI) * Math.asin(i / s);
            return -(s * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a)) + n
        },
        easeOutElastic: function (e, t, n, i, o) {
            var r = 1.70158
                , a = 0
                , s = i;
            if (0 == t)
                return n;
            if (1 == (t /= o))
                return n + i;
            if (a || (a = .3 * o),
                s < Math.abs(i)) {
                s = i;
                var r = a / 4
            } else
                var r = a / (2 * Math.PI) * Math.asin(i / s);
            return s * Math.pow(2, -10 * t) * Math.sin(2 * (t * o - r) * Math.PI / a) + i + n
        },
        easeInOutElastic: function (e, t, n, i, o) {
            var r = 1.70158
                , a = 0
                , s = i;
            if (0 == t)
                return n;
            if (2 == (t /= o / 2))
                return n + i;
            if (a || (a = .3 * o * 1.5),
                s < Math.abs(i)) {
                s = i;
                var r = a / 4
            } else
                var r = a / (2 * Math.PI) * Math.asin(i / s);
            return 1 > t ? -.5 * s * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a) + n : s * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t * o - r) * Math.PI / a) * .5 + i + n
        },
        easeInBack: function (e, t, n, i, o, r) {
            return void 0 == r && (r = 1.70158),
                i * (t /= o) * t * ((r + 1) * t - r) + n
        },
        easeOutBack: function (e, t, n, i, o, r) {
            return void 0 == r && (r = 1.70158),
                i * ((t = t / o - 1) * t * ((r + 1) * t + r) + 1) + n
        },
        easeInOutBack: function (e, t, n, i, o, r) {
            return void 0 == r && (r = 1.70158),
                (t /= o / 2) < 1 ? i / 2 * t * t * (((r *= 1.525) + 1) * t - r) + n : i / 2 * ((t -= 2) * t * (((r *= 1.525) + 1) * t + r) + 2) + n
        },
        easeInBounce: function (e, t, n, i, o) {
            return i - jQuery.easing.easeOutBounce(e, o - t, 0, i, o) + n
        },
        easeOutBounce: function (e, t, n, i, o) {
            return (t /= o) < 1 / 2.75 ? 7.5625 * i * t * t + n : 2 / 2.75 > t ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : 2.5 / 2.75 > t ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
        },
        easeInOutBounce: function (e, t, n, i, o) {
            return o / 2 > t ? .5 * jQuery.easing.easeInBounce(e, 2 * t, 0, i, o) + n : .5 * jQuery.easing.easeOutBounce(e, 2 * t - o, 0, i, o) + .5 * i + n
        }
    }),
    function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
    }(function (e) {
        var t, n, i, o, r, a, s = "Close", l = "BeforeClose", c = "AfterClose", u = "BeforeAppend", d = "MarkupParse", p = "Open", h = "Change", f = "mfp", m = "." + f, g = "mfp-ready", v = "mfp-removing", y = "mfp-prevent-close", b = function () { }, w = !!window.jQuery, x = e(window), T = function (e, n) {
            t.ev.on(f + e + m, n)
        }, _ = function (t, n, i, o) {
            var r = document.createElement("div");
            return r.className = "mfp-" + t,
                i && (r.innerHTML = i),
                o ? n && n.appendChild(r) : (r = e(r),
                    n && r.appendTo(n)),
                r
        }, C = function (n, i) {
            t.ev.triggerHandler(f + n, i),
                t.st.callbacks && (n = n.charAt(0).toLowerCase() + n.slice(1),
                    t.st.callbacks[n] && t.st.callbacks[n].apply(t, e.isArray(i) ? i : [i]))
        }, S = function (n) {
            return n === a && t.currTemplate.closeBtn || (t.currTemplate.closeBtn = e(t.st.closeMarkup.replace("%title%", t.st.tClose)),
                a = n),
                t.currTemplate.closeBtn
        }, k = function () {
            e.magnificPopup.instance || (t = new b,
                t.init(),
                e.magnificPopup.instance = t)
        }, E = function () {
            var e = document.createElement("p").style
                , t = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== e.transition)
                return !0;
            for (; t.length;)
                if (t.pop() + "Transition" in e)
                    return !0;
            return !1
        };
        b.prototype = {
            constructor: b,
            init: function () {
                var n = navigator.appVersion;
                t.isIE7 = -1 !== n.indexOf("MSIE 7."),
                    t.isIE8 = -1 !== n.indexOf("MSIE 8."),
                    t.isLowIE = t.isIE7 || t.isIE8,
                    t.isAndroid = /android/gi.test(n),
                    t.isIOS = /iphone|ipad|ipod/gi.test(n),
                    t.supportsTransition = E(),
                    t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),
                    i = e(document),
                    t.popupsCache = {}
            },
            open: function (n) {
                var o;
                if (n.isObj === !1) {
                    t.items = n.items.toArray(),
                        t.index = 0;
                    var a, s = n.items;
                    for (o = 0; o < s.length; o++)
                        if (a = s[o],
                            a.parsed && (a = a.el[0]),
                            a === n.el[0]) {
                            t.index = o;
                            break
                        }
                } else
                    t.items = e.isArray(n.items) ? n.items : [n.items],
                        t.index = n.index || 0;
                if (t.isOpen)
                    return void t.updateItemHTML();
                t.types = [],
                    r = "",
                    t.ev = n.mainEl && n.mainEl.length ? n.mainEl.eq(0) : i,
                    n.key ? (t.popupsCache[n.key] || (t.popupsCache[n.key] = {}),
                        t.currTemplate = t.popupsCache[n.key]) : t.currTemplate = {},
                    t.st = e.extend(!0, {}, e.magnificPopup.defaults, n),
                    t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos,
                    t.st.modal && (t.st.closeOnContentClick = !1,
                        t.st.closeOnBgClick = !1,
                        t.st.showCloseBtn = !1,
                        t.st.enableEscapeKey = !1),
                    t.bgOverlay || (t.bgOverlay = _("bg").on("click" + m, function () {
                        t.close()
                    }),
                        t.wrap = _("wrap").attr("tabindex", -1).on("click" + m, function (e) {
                            t._checkIfClose(e.target) && t.close()
                        }),
                        t.container = _("container", t.wrap)),
                    t.contentContainer = _("content"),
                    t.st.preloader && (t.preloader = _("preloader", t.container, t.st.tLoading));
                var l = e.magnificPopup.modules;
                for (o = 0; o < l.length; o++) {
                    var c = l[o];
                    c = c.charAt(0).toUpperCase() + c.slice(1),
                        t["init" + c].call(t)
                }
                C("BeforeOpen"),
                    t.st.showCloseBtn && (t.st.closeBtnInside ? (T(d, function (e, t, n, i) {
                        n.close_replaceWith = S(i.type)
                    }),
                        r += " mfp-close-btn-in") : t.wrap.append(S())),
                    t.st.alignTop && (r += " mfp-align-top"),
                    t.wrap.css(t.fixedContentPos ? {
                        overflow: t.st.overflowY,
                        overflowX: "hidden",
                        overflowY: t.st.overflowY
                    } : {
                            top: x.scrollTop(),
                            position: "absolute"
                        }),
                    (t.st.fixedBgPos === !1 || "auto" === t.st.fixedBgPos && !t.fixedContentPos) && t.bgOverlay.css({
                        height: i.height(),
                        position: "absolute"
                    }),
                    t.st.enableEscapeKey && i.on("keyup" + m, function (e) {
                        27 === e.keyCode && t.close()
                    }),
                    x.on("resize" + m, function () {
                        t.updateSize()
                    }),
                    t.st.closeOnContentClick || (r += " mfp-auto-cursor"),
                    r && t.wrap.addClass(r);
                var u = t.wH = x.height()
                    , h = {};
                if (t.fixedContentPos && t._hasScrollBar(u)) {
                    var f = t._getScrollbarSize();
                    f && (h.marginRight = f)
                }
                t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : h.overflow = "hidden");
                var v = t.st.mainClass;
                return t.isIE7 && (v += " mfp-ie7"),
                    v && t._addClassToMFP(v),
                    t.updateItemHTML(),
                    C("BuildControls"),
                    e("html").css(h),
                    t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || e(document.body)),
                    t._lastFocusedEl = document.activeElement,
                    setTimeout(function () {
                        t.content ? (t._addClassToMFP(g),
                            t._setFocus()) : t.bgOverlay.addClass(g),
                            i.on("focusin" + m, t._onFocusIn)
                    }, 16),
                    t.isOpen = !0,
                    t.updateSize(u),
                    C(p),
                    n
            },
            close: function () {
                t.isOpen && (C(l),
                    t.isOpen = !1,
                    t.st.removalDelay && !t.isLowIE && t.supportsTransition ? (t._addClassToMFP(v),
                        setTimeout(function () {
                            t._close()
                        }, t.st.removalDelay)) : t._close())
            },
            _close: function () {
                C(s);
                var n = v + " " + g + " ";
                if (t.bgOverlay.detach(),
                    t.wrap.detach(),
                    t.container.empty(),
                    t.st.mainClass && (n += t.st.mainClass + " "),
                    t._removeClassFromMFP(n),
                    t.fixedContentPos) {
                    var o = {
                        marginRight: ""
                    };
                    t.isIE7 ? e("body, html").css("overflow", "") : o.overflow = "",
                        e("html").css(o)
                }
                i.off("keyup" + m + " focusin" + m),
                    t.ev.off(m),
                    t.wrap.attr("class", "mfp-wrap").removeAttr("style"),
                    t.bgOverlay.attr("class", "mfp-bg"),
                    t.container.attr("class", "mfp-container"),
                    !t.st.showCloseBtn || t.st.closeBtnInside && t.currTemplate[t.currItem.type] !== !0 || t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach(),
                    t._lastFocusedEl && e(t._lastFocusedEl).focus(),
                    t.currItem = null,
                    t.content = null,
                    t.currTemplate = null,
                    t.prevHeight = 0,
                    C(c)
            },
            updateSize: function (e) {
                if (t.isIOS) {
                    var n = document.documentElement.clientWidth / window.innerWidth
                        , i = window.innerHeight * n;
                    t.wrap.css("height", i),
                        t.wH = i
                } else
                    t.wH = e || x.height();
                t.fixedContentPos || t.wrap.css("height", t.wH),
                    C("Resize")
            },
            updateItemHTML: function () {
                var n = t.items[t.index];
                t.contentContainer.detach(),
                    t.content && t.content.detach(),
                    n.parsed || (n = t.parseEl(t.index));
                var i = n.type;
                if (C("BeforeChange", [t.currItem ? t.currItem.type : "", i]),
                    t.currItem = n,
                    !t.currTemplate[i]) {
                    var r = t.st[i] ? t.st[i].markup : !1;
                    C("FirstMarkupParse", r),
                        t.currTemplate[i] = r ? e(r) : !0
                }
                o && o !== n.type && t.container.removeClass("mfp-" + o + "-holder");
                var a = t["get" + i.charAt(0).toUpperCase() + i.slice(1)](n, t.currTemplate[i]);
                t.appendContent(a, i),
                    n.preloaded = !0,
                    C(h, n),
                    o = n.type,
                    t.container.prepend(t.contentContainer),
                    C("AfterChange")
            },
            appendContent: function (e, n) {
                t.content = e,
                    e ? t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[n] === !0 ? t.content.find(".mfp-close").length || t.content.append(S()) : t.content = e : t.content = "",
                    C(u),
                    t.container.addClass("mfp-" + n + "-holder"),
                    t.contentContainer.append(t.content)
            },
            parseEl: function (n) {
                var i, o = t.items[n];
                if (o.tagName ? o = {
                    el: e(o)
                } : (i = o.type,
                    o = {
                        data: o,
                        src: o.src
                    }),
                    o.el) {
                    for (var r = t.types, a = 0; a < r.length; a++)
                        if (o.el.hasClass("mfp-" + r[a])) {
                            i = r[a];
                            break
                        }
                    o.src = o.el.attr("data-mfp-src"),
                        o.src || (o.src = o.el.attr("href"))
                }
                return o.type = i || t.st.type || "inline",
                    o.index = n,
                    o.parsed = !0,
                    t.items[n] = o,
                    C("ElementParse", o),
                    t.items[n]
            },
            addGroup: function (e, n) {
                var i = function (i) {
                    i.mfpEl = this,
                        t._openClick(i, e, n)
                };
                n || (n = {});
                var o = "click.magnificPopup";
                n.mainEl = e,
                    n.items ? (n.isObj = !0,
                        e.off(o).on(o, i)) : (n.isObj = !1,
                            n.delegate ? e.off(o).on(o, n.delegate, i) : (n.items = e,
                                e.off(o).on(o, i)))
            },
            _openClick: function (n, i, o) {
                var r = void 0 !== o.midClick ? o.midClick : e.magnificPopup.defaults.midClick;
                if (r || 2 !== n.which && !n.ctrlKey && !n.metaKey) {
                    var a = void 0 !== o.disableOn ? o.disableOn : e.magnificPopup.defaults.disableOn;
                    if (a)
                        if (e.isFunction(a)) {
                            if (!a.call(t))
                                return !0
                        } else if (x.width() < a)
                            return !0;
                    n.type && (n.preventDefault(),
                        t.isOpen && n.stopPropagation()),
                        o.el = e(n.mfpEl),
                        o.delegate && (o.items = i.find(o.delegate)),
                        t.open(o)
                }
            },
            updateStatus: function (e, i) {
                if (t.preloader) {
                    n !== e && t.container.removeClass("mfp-s-" + n),
                        i || "loading" !== e || (i = t.st.tLoading);
                    var o = {
                        status: e,
                        text: i
                    };
                    C("UpdateStatus", o),
                        e = o.status,
                        i = o.text,
                        t.preloader.html(i),
                        t.preloader.find("a").on("click", function (e) {
                            e.stopImmediatePropagation()
                        }),
                        t.container.addClass("mfp-s-" + e),
                        n = e
                }
            },
            _checkIfClose: function (n) {
                if (!e(n).hasClass(y)) {
                    var i = t.st.closeOnContentClick
                        , o = t.st.closeOnBgClick;
                    if (i && o)
                        return !0;
                    if (!t.content || e(n).hasClass("mfp-close") || t.preloader && n === t.preloader[0])
                        return !0;
                    if (n === t.content[0] || e.contains(t.content[0], n)) {
                        if (i)
                            return !0
                    } else if (o && e.contains(document, n))
                        return !0;
                    return !1
                }
            },
            _addClassToMFP: function (e) {
                t.bgOverlay.addClass(e),
                    t.wrap.addClass(e)
            },
            _removeClassFromMFP: function (e) {
                this.bgOverlay.removeClass(e),
                    t.wrap.removeClass(e)
            },
            _hasScrollBar: function (e) {
                return (t.isIE7 ? i.height() : document.body.scrollHeight) > (e || x.height())
            },
            _setFocus: function () {
                (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus()
            },
            _onFocusIn: function (n) {
                return n.target === t.wrap[0] || e.contains(t.wrap[0], n.target) ? void 0 : (t._setFocus(),
                    !1)
            },
            _parseMarkup: function (t, n, i) {
                var o;
                i.data && (n = e.extend(i.data, n)),
                    C(d, [t, n, i]),
                    e.each(n, function (e, n) {
                        if (void 0 === n || n === !1)
                            return !0;
                        if (o = e.split("_"),
                            o.length > 1) {
                            var i = t.find(m + "-" + o[0]);
                            if (i.length > 0) {
                                var r = o[1];
                                "replaceWith" === r ? i[0] !== n[0] && i.replaceWith(n) : "img" === r ? i.is("img") ? i.attr("src", n) : i.replaceWith('<img src="' + n + '" class="' + i.attr("class") + '" />') : i.attr(o[1], n)
                            }
                        } else
                            t.find(m + "-" + e).html(n)
                    })
            },
            _getScrollbarSize: function () {
                if (void 0 === t.scrollbarSize) {
                    var e = document.createElement("div");
                    e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",
                        document.body.appendChild(e),
                        t.scrollbarSize = e.offsetWidth - e.clientWidth,
                        document.body.removeChild(e)
                }
                return t.scrollbarSize
            }
        },
            e.magnificPopup = {
                instance: null,
                proto: b.prototype,
                modules: [],
                open: function (t, n) {
                    return k(),
                        t = t ? e.extend(!0, {}, t) : {},
                        t.isObj = !0,
                        t.index = n || 0,
                        this.instance.open(t)
                },
                close: function () {
                    return e.magnificPopup.instance && e.magnificPopup.instance.close()
                },
                registerModule: function (t, n) {
                    n.options && (e.magnificPopup.defaults[t] = n.options),
                        e.extend(this.proto, n.proto),
                        this.modules.push(t)
                },
                defaults: {
                    disableOn: 0,
                    key: null,
                    midClick: !1,
                    mainClass: "",
                    preloader: !0,
                    focus: "",
                    closeOnContentClick: !1,
                    closeOnBgClick: !0,
                    closeBtnInside: !0,
                    showCloseBtn: !0,
                    enableEscapeKey: !0,
                    modal: !1,
                    alignTop: !1,
                    removalDelay: 0,
                    prependTo: null,
                    fixedContentPos: "auto",
                    fixedBgPos: "auto",
                    overflowY: "auto",
                    closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
                    tClose: "Close (Esc)",
                    tLoading: "Loading..."
                }
            },
            e.fn.magnificPopup = function (n) {
                k();
                var i = e(this);
                if ("string" == typeof n)
                    if ("open" === n) {
                        var o, r = w ? i.data("magnificPopup") : i[0].magnificPopup, a = parseInt(arguments[1], 10) || 0;
                        r.items ? o = r.items[a] : (o = i,
                            r.delegate && (o = o.find(r.delegate)),
                            o = o.eq(a)),
                            t._openClick({
                                mfpEl: o
                            }, i, r)
                    } else
                        t.isOpen && t[n].apply(t, Array.prototype.slice.call(arguments, 1));
                else
                    n = e.extend(!0, {}, n),
                        w ? i.data("magnificPopup", n) : i[0].magnificPopup = n,
                        t.addGroup(i, n);
                return i
            }
            ;
        var M, A, I, N = "inline", D = function () {
            I && (A.after(I.addClass(M)).detach(),
                I = null)
        };
        e.magnificPopup.registerModule(N, {
            options: {
                hiddenClass: "hide",
                markup: "",
                tNotFound: "Content not found"
            },
            proto: {
                initInline: function () {
                    t.types.push(N),
                        T(s + "." + N, function () {
                            D()
                        })
                },
                getInline: function (n, i) {
                    if (D(),
                        n.src) {
                        var o = t.st.inline
                            , r = e(n.src);
                        if (r.length) {
                            var a = r[0].parentNode;
                            a && a.tagName && (A || (M = o.hiddenClass,
                                A = _(M),
                                M = "mfp-" + M),
                                I = r.after(A).detach().removeClass(M)),
                                t.updateStatus("ready")
                        } else
                            t.updateStatus("error", o.tNotFound),
                                r = e("<div>");
                        return n.inlineElement = r,
                            r
                    }
                    return t.updateStatus("ready"),
                        t._parseMarkup(i, {}, n),
                        i
                }
            }
        });
        var P, B = "ajax", L = function () {
            P && e(document.body).removeClass(P)
        }, R = function () {
            L(),
                t.req && t.req.abort()
        };
        e.magnificPopup.registerModule(B, {
            options: {
                settings: null,
                cursor: "mfp-ajax-cur",
                tError: '<a href="%url%">The content</a> could not be loaded.'
            },
            proto: {
                initAjax: function () {
                    t.types.push(B),
                        P = t.st.ajax.cursor,
                        T(s + "." + B, R),
                        T("BeforeChange." + B, R)
                },
                getAjax: function (n) {
                    P && e(document.body).addClass(P),
                        t.updateStatus("loading");
                    var i = e.extend({
                        url: n.src,
                        success: function (i, o, r) {
                            var a = {
                                data: i,
                                xhr: r
                            };
                            C("ParseAjax", a),
                                t.appendContent(e(a.data), B),
                                n.finished = !0,
                                L(),
                                t._setFocus(),
                                setTimeout(function () {
                                    t.wrap.addClass(g)
                                }, 16),
                                t.updateStatus("ready"),
                                C("AjaxContentAdded")
                        },
                        error: function () {
                            L(),
                                n.finished = n.loadError = !0,
                                t.updateStatus("error", t.st.ajax.tError.replace("%url%", n.src))
                        }
                    }, t.st.ajax.settings);
                    return t.req = e.ajax(i),
                        ""
                }
            }
        });
        var F, O = function (n) {
            if (n.data && void 0 !== n.data.title)
                return n.data.title;
            var i = t.st.image.titleSrc;
            if (i) {
                if (e.isFunction(i))
                    return i.call(t, n);
                if (n.el)
                    return n.el.attr(i) || ""
            }
            return ""
        };
        e.magnificPopup.registerModule("image", {
            options: {
                markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
                cursor: "mfp-zoom-out-cur",
                titleSrc: "title",
                verticalFit: !0,
                tError: '<a href="%url%">The image</a> could not be loaded.'
            },
            proto: {
                initImage: function () {
                    var n = t.st.image
                        , i = ".image";
                    t.types.push("image"),
                        T(p + i, function () {
                            "image" === t.currItem.type && n.cursor && e(document.body).addClass(n.cursor)
                        }),
                        T(s + i, function () {
                            n.cursor && e(document.body).removeClass(n.cursor),
                                x.off("resize" + m)
                        }),
                        T("Resize" + i, t.resizeImage),
                        t.isLowIE && T("AfterChange", t.resizeImage)
                },
                resizeImage: function () {
                    var e = t.currItem;
                    if (e && e.img && t.st.image.verticalFit) {
                        var n = 0;
                        t.isLowIE && (n = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)),
                            e.img.css("max-height", t.wH - n)
                    }
                },
                _onImageHasSize: function (e) {
                    e.img && (e.hasSize = !0,
                        F && clearInterval(F),
                        e.isCheckingImgSize = !1,
                        C("ImageHasSize", e),
                        e.imgHidden && (t.content && t.content.removeClass("mfp-loading"),
                            e.imgHidden = !1))
                },
                findImageSize: function (e) {
                    var n = 0
                        , i = e.img[0]
                        , o = function (r) {
                            F && clearInterval(F),
                                F = setInterval(function () {
                                    return i.naturalWidth > 0 ? void t._onImageHasSize(e) : (n > 200 && clearInterval(F),
                                        n++ ,
                                        void (3 === n ? o(10) : 40 === n ? o(50) : 100 === n && o(500)))
                                }, r)
                        };
                    o(1)
                },
                getImage: function (n, i) {
                    var o = 0
                        , r = function () {
                            n && (n.img[0].complete ? (n.img.off(".mfploader"),
                                n === t.currItem && (t._onImageHasSize(n),
                                    t.updateStatus("ready")),
                                n.hasSize = !0,
                                n.loaded = !0,
                                C("ImageLoadComplete")) : (o++ ,
                                    200 > o ? setTimeout(r, 100) : a()))
                        }
                        , a = function () {
                            n && (n.img.off(".mfploader"),
                                n === t.currItem && (t._onImageHasSize(n),
                                    t.updateStatus("error", s.tError.replace("%url%", n.src))),
                                n.hasSize = !0,
                                n.loaded = !0,
                                n.loadError = !0)
                        }
                        , s = t.st.image
                        , l = i.find(".mfp-img");
                    if (l.length) {
                        var c = document.createElement("img");
                        c.className = "mfp-img",
                            n.el && n.el.find("img").length && (c.alt = n.el.find("img").attr("alt")),
                            n.img = e(c).on("load.mfploader", r).on("error.mfploader", a),
                            c.src = n.src,
                            l.is("img") && (n.img = n.img.clone()),
                            c = n.img[0],
                            c.naturalWidth > 0 ? n.hasSize = !0 : c.width || (n.hasSize = !1)
                    }
                    return t._parseMarkup(i, {
                        title: O(n),
                        img_replaceWith: n.img
                    }, n),
                        t.resizeImage(),
                        n.hasSize ? (F && clearInterval(F),
                            n.loadError ? (i.addClass("mfp-loading"),
                                t.updateStatus("error", s.tError.replace("%url%", n.src))) : (i.removeClass("mfp-loading"),
                                    t.updateStatus("ready")),
                            i) : (t.updateStatus("loading"),
                                n.loading = !0,
                                n.hasSize || (n.imgHidden = !0,
                                    i.addClass("mfp-loading"),
                                    t.findImageSize(n)),
                                i)
                }
            }
        });
        var H, $ = function () {
            return void 0 === H && (H = void 0 !== document.createElement("p").style.MozTransform),
                H
        };
        e.magnificPopup.registerModule("zoom", {
            options: {
                enabled: !1,
                easing: "ease-in-out",
                duration: 300,
                opener: function (e) {
                    return e.is("img") ? e : e.find("img")
                }
            },
            proto: {
                initZoom: function () {
                    var e, n = t.st.zoom, i = ".zoom";
                    if (n.enabled && t.supportsTransition) {
                        var o, r, a = n.duration, c = function (e) {
                            var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image")
                                , i = "all " + n.duration / 1e3 + "s " + n.easing
                                , o = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                }
                                , r = "transition";
                            return o["-webkit-" + r] = o["-moz-" + r] = o["-o-" + r] = o[r] = i,
                                t.css(o),
                                t
                        }, u = function () {
                            t.content.css("visibility", "visible")
                        };
                        T("BuildControls" + i, function () {
                            if (t._allowZoom()) {
                                if (clearTimeout(o),
                                    t.content.css("visibility", "hidden"),
                                    e = t._getItemToZoom(),
                                    !e)
                                    return void u();
                                r = c(e),
                                    r.css(t._getOffset()),
                                    t.wrap.append(r),
                                    o = setTimeout(function () {
                                        r.css(t._getOffset(!0)),
                                            o = setTimeout(function () {
                                                u(),
                                                    setTimeout(function () {
                                                        r.remove(),
                                                            e = r = null,
                                                            C("ZoomAnimationEnded")
                                                    }, 16)
                                            }, a)
                                    }, 16)
                            }
                        }),
                            T(l + i, function () {
                                if (t._allowZoom()) {
                                    if (clearTimeout(o),
                                        t.st.removalDelay = a,
                                        !e) {
                                        if (e = t._getItemToZoom(),
                                            !e)
                                            return;
                                        r = c(e)
                                    }
                                    r.css(t._getOffset(!0)),
                                        t.wrap.append(r),
                                        t.content.css("visibility", "hidden"),
                                        setTimeout(function () {
                                            r.css(t._getOffset())
                                        }, 16)
                                }
                            }),
                            T(s + i, function () {
                                t._allowZoom() && (u(),
                                    r && r.remove(),
                                    e = null)
                            })
                    }
                },
                _allowZoom: function () {
                    return "image" === t.currItem.type
                },
                _getItemToZoom: function () {
                    return t.currItem.hasSize ? t.currItem.img : !1
                },
                _getOffset: function (n) {
                    var i;
                    i = n ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem);
                    var o = i.offset()
                        , r = parseInt(i.css("padding-top"), 10)
                        , a = parseInt(i.css("padding-bottom"), 10);
                    o.top -= e(window).scrollTop() - r;
                    var s = {
                        width: i.width(),
                        height: (w ? i.innerHeight() : i[0].offsetHeight) - a - r
                    };
                    return $() ? s["-moz-transform"] = s.transform = "translate(" + o.left + "px," + o.top + "px)" : (s.left = o.left,
                        s.top = o.top),
                        s
                }
            }
        });
        var j = "iframe"
            , W = "//about:blank"
            , z = function (e) {
                if (t.currTemplate[j]) {
                    var n = t.currTemplate[j].find("iframe");
                    n.length && (e || (n[0].src = W),
                        t.isIE8 && n.css("display", e ? "block" : "none"))
                }
            };
        e.magnificPopup.registerModule(j, {
            options: {
                markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
                srcAction: "iframe_src",
                patterns: {
                    youtube: {
                        index: "youtube.com",
                        id: "v=",
                        src: "//www.youtube.com/embed/%id%?autoplay=1"
                    },
                    vimeo: {
                        index: "vimeo.com/",
                        id: "/",
                        src: "//player.vimeo.com/video/%id%?autoplay=1"
                    },
                    gmaps: {
                        index: "//maps.google.",
                        src: "%id%&output=embed"
                    }
                }
            },
            proto: {
                initIframe: function () {
                    t.types.push(j),
                        T("BeforeChange", function (e, t, n) {
                            t !== n && (t === j ? z() : n === j && z(!0))
                        }),
                        T(s + "." + j, function () {
                            z()
                        })
                },
                getIframe: function (n, i) {
                    var o = n.src
                        , r = t.st.iframe;
                    e.each(r.patterns, function () {
                        return o.indexOf(this.index) > -1 ? (this.id && (o = "string" == typeof this.id ? o.substr(o.lastIndexOf(this.id) + this.id.length, o.length) : this.id.call(this, o)),
                            o = this.src.replace("%id%", o),
                            !1) : void 0
                    });
                    var a = {};
                    return r.srcAction && (a[r.srcAction] = o),
                        t._parseMarkup(i, a, n),
                        t.updateStatus("ready"),
                        i
                }
            }
        });
        var q = function (e) {
            var n = t.items.length;
            return e > n - 1 ? e - n : 0 > e ? n + e : e
        }
            , G = function (e, t, n) {
                return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n)
            };
        e.magnificPopup.registerModule("gallery", {
            options: {
                enabled: !1,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                preload: [0, 2],
                navigateByImgClick: !0,
                arrows: !0,
                tPrev: "Previous (Left arrow key)",
                tNext: "Next (Right arrow key)",
                tCounter: "%curr% of %total%"
            },
            proto: {
                initGallery: function () {
                    var n = t.st.gallery
                        , o = ".mfp-gallery"
                        , a = Boolean(e.fn.mfpFastClick);
                    return t.direction = !0,
                        n && n.enabled ? (r += " mfp-gallery",
                            T(p + o, function () {
                                n.navigateByImgClick && t.wrap.on("click" + o, ".mfp-img", function () {
                                    return t.items.length > 1 ? (t.next(),
                                        !1) : void 0
                                }),
                                    i.on("keydown" + o, function (e) {
                                        37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next()
                                    })
                            }),
                            T("UpdateStatus" + o, function (e, n) {
                                n.text && (n.text = G(n.text, t.currItem.index, t.items.length))
                            }),
                            T(d + o, function (e, i, o, r) {
                                var a = t.items.length;
                                o.counter = a > 1 ? G(n.tCounter, r.index, a) : ""
                            }),
                            T("BuildControls" + o, function () {
                                if (t.items.length > 1 && n.arrows && !t.arrowLeft) {
                                    var i = n.arrowMarkup
                                        , o = t.arrowLeft = e(i.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, "left")).addClass(y)
                                        , r = t.arrowRight = e(i.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, "right")).addClass(y)
                                        , s = a ? "mfpFastClick" : "click";
                                    o[s](function () {
                                        t.prev()
                                    }),
                                        r[s](function () {
                                            t.next()
                                        }),
                                        t.isIE7 && (_("b", o[0], !1, !0),
                                            _("a", o[0], !1, !0),
                                            _("b", r[0], !1, !0),
                                            _("a", r[0], !1, !0)),
                                        t.container.append(o.add(r))
                                }
                            }),
                            T(h + o, function () {
                                t._preloadTimeout && clearTimeout(t._preloadTimeout),
                                    t._preloadTimeout = setTimeout(function () {
                                        t.preloadNearbyImages(),
                                            t._preloadTimeout = null
                                    }, 16)
                            }),
                            void T(s + o, function () {
                                i.off(o),
                                    t.wrap.off("click" + o),
                                    t.arrowLeft && a && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(),
                                    t.arrowRight = t.arrowLeft = null
                            })) : !1
                },
                next: function () {
                    t.direction = !0,
                        t.index = q(t.index + 1),
                        t.updateItemHTML()
                },
                prev: function () {
                    t.direction = !1,
                        t.index = q(t.index - 1),
                        t.updateItemHTML()
                },
                goTo: function (e) {
                    t.direction = e >= t.index,
                        t.index = e,
                        t.updateItemHTML()
                },
                preloadNearbyImages: function () {
                    var e, n = t.st.gallery.preload, i = Math.min(n[0], t.items.length), o = Math.min(n[1], t.items.length);
                    for (e = 1; e <= (t.direction ? o : i); e++)
                        t._preloadItem(t.index + e);
                    for (e = 1; e <= (t.direction ? i : o); e++)
                        t._preloadItem(t.index - e)
                },
                _preloadItem: function (n) {
                    if (n = q(n),
                        !t.items[n].preloaded) {
                        var i = t.items[n];
                        i.parsed || (i = t.parseEl(n)),
                            C("LazyLoad", i),
                            "image" === i.type && (i.img = e('<img class="mfp-img" />').on("load.mfploader", function () {
                                i.hasSize = !0
                            }).on("error.mfploader", function () {
                                i.hasSize = !0,
                                    i.loadError = !0,
                                    C("LazyLoadError", i)
                            }).attr("src", i.src)),
                            i.preloaded = !0
                    }
                }
            }
        });
        var X = "retina";
        e.magnificPopup.registerModule(X, {
            options: {
                replaceSrc: function (e) {
                    return e.src.replace(/\.\w+$/, function (e) {
                        return "@2x" + e
                    })
                },
                ratio: 1
            },
            proto: {
                initRetina: function () {
                    if (window.devicePixelRatio > 1) {
                        var e = t.st.retina
                            , n = e.ratio;
                        n = isNaN(n) ? n() : n,
                            n > 1 && (T("ImageHasSize." + X, function (e, t) {
                                t.img.css({
                                    "max-width": t.img[0].naturalWidth / n,
                                    width: "100%"
                                })
                            }),
                                T("ElementParse." + X, function (t, i) {
                                    i.src = e.replaceSrc(i, n)
                                }))
                    }
                }
            }
        }),
            function () {
                var t = 1e3
                    , n = "ontouchstart" in window
                    , i = function () {
                        x.off("touchmove" + r + " touchend" + r)
                    }
                    , o = "mfpFastClick"
                    , r = "." + o;
                e.fn.mfpFastClick = function (o) {
                    return e(this).each(function () {
                        var a, s = e(this);
                        if (n) {
                            var l, c, u, d, p, h;
                            s.on("touchstart" + r, function (e) {
                                d = !1,
                                    h = 1,
                                    p = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0],
                                    c = p.clientX,
                                    u = p.clientY,
                                    x.on("touchmove" + r, function (e) {
                                        p = e.originalEvent ? e.originalEvent.touches : e.touches,
                                            h = p.length,
                                            p = p[0],
                                            (Math.abs(p.clientX - c) > 10 || Math.abs(p.clientY - u) > 10) && (d = !0,
                                                i())
                                    }).on("touchend" + r, function (e) {
                                        i(),
                                            d || h > 1 || (a = !0,
                                                e.preventDefault(),
                                                clearTimeout(l),
                                                l = setTimeout(function () {
                                                    a = !1
                                                }, t),
                                                o())
                                    })
                            })
                        }
                        s.on("click" + r, function () {
                            a || o()
                        })
                    })
                }
                    ,
                    e.fn.destroyMfpFastClick = function () {
                        e(this).off("touchstart" + r + " click" + r),
                            n && x.off("touchmove" + r + " touchend" + r)
                    }
            }(),
            k()
    }),
    window.AudioContext = window.AudioContext || window.webkitAudioContext,
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var Recorder = function (e) {
    if (!Recorder.isRecordingSupported())
        throw "Recording is not supported in this browser";
    this.config = e = e || {},
        this.config.command = "init",
        this.config.bufferLength = e.bufferLength || 4096,
        this.config.monitorGain = e.monitorGain || 0,
        this.config.numberOfChannels = e.numberOfChannels || 1,
        this.config.originalSampleRate = this.audioContext.sampleRate,
        this.config.encoderSampleRate = e.encoderSampleRate || 48e3,
        this.config.encoderPath = e.encoderPath || "oggopusEncoder.js",
        this.config.stream = e.stream || !1,
        this.config.maxBuffersPerPage = e.maxBuffersPerPage || 40,
        this.config.encoderApplication = e.encoderApplication || 2049,
        this.config.encoderFrameSize = e.encoderFrameSize || 20,
        this.config.streamOptions = e.streamOptions || {
            optional: [],
            mandatory: {
                googEchoCancellation: !1,
                googAutoGainControl: !1,
                googNoiseSuppression: !1,
                googHighpassFilter: !1
            }
        },
        this.volume = 0,
        this.slow_volume = 0,
        this.maxVolume = 0,
        this.clip = 0,
        this.state = "inactive",
        this.eventTarget = document.createDocumentFragment(),
        this.createAudioNodes()
};
Recorder.isRecordingSupported = function () {
    return window.AudioContext && navigator.getUserMedia
}
    ,
    Recorder.prototype.addEventListener = function (e, t, n) {
        this.eventTarget.addEventListener(e, t, n)
    }
    ,
    window.AudioContext && (Recorder.prototype.audioContext = new window.AudioContext),
    Recorder.prototype.createAudioNodes = function () {
        var e = this;
        this.scriptProcessorNode = this.audioContext.createScriptProcessor(this.config.bufferLength, this.config.numberOfChannels, this.config.numberOfChannels),
            this.scriptProcessorNode.onaudioprocess = function (t) {
                e.encodeBuffers(t.inputBuffer);
                var n, i = event.inputBuffer.getChannelData(0), o = 0, r = 0;
                for (n = 0; n < i.length; ++n)
                    o += i[n] * i[n],
                        Math.abs(i[n]) > .99 && (r += 1);
                e.volume = Math.sqrt(o / i.length),
                    e.slow_volume = .5 * e.slow_volume + .5 * e.volume,
                    e.slow_volume > e.maxVolume && (e.maxVolume = e.slow_volume),
                    e.normalizedVolume = e.volume / e.slow_volume,
                    e.clip = r / i.length
            }
            ,
            this.monitorNode = this.audioContext.createGain(),
            this.setMonitorGain(this.config.monitorGain),
            this.config.sampleRate < this.audioContext.sampleRate && this.createButterworthFilter()
    }
    ,
    Recorder.prototype.createButterworthFilter = function () {
        this.filterNode = this.audioContext.createBiquadFilter(),
            this.filterNode2 = this.audioContext.createBiquadFilter(),
            this.filterNode3 = this.audioContext.createBiquadFilter(),
            this.filterNode.type = this.filterNode2.type = this.filterNode3.type = "lowpass";
        var e = this.config.sampleRate / 2;
        this.filterNode.frequency.value = this.filterNode2.frequency.value = this.filterNode3.frequency.value = e - e / 3.5355,
            this.filterNode.Q.value = .51764,
            this.filterNode2.Q.value = .70711,
            this.filterNode3.Q.value = 1.93184,
            this.filterNode.connect(this.filterNode2),
            this.filterNode2.connect(this.filterNode3),
            this.filterNode3.connect(this.scriptProcessorNode)
    }
    ,
    Recorder.prototype.encodeBuffers = function (e) {
        if ("recording" === this.state) {
            for (var t = [], n = 0; n < e.numberOfChannels; n++)
                t[n] = e.getChannelData(n);
            this.encoder.postMessage({
                command: "encode",
                buffers: t
            }),
                this.duration += e.duration,
                this.eventTarget.dispatchEvent(new CustomEvent("duration", {
                    detail: this.duration
                }))
        }
    }
    ,
    Recorder.prototype.initStream = function () {
        var e = this;
        navigator.getUserMedia({
            audio: this.config.streamOptions
        }, function (t) {
            e.stream = t,
                e.sourceNode = e.audioContext.createMediaStreamSource(t),
                e.sourceNode.connect(e.filterNode || e.scriptProcessorNode),
                e.sourceNode.connect(e.monitorNode),
                e.eventTarget.dispatchEvent(new Event("streamReady"))
        }, function (t) {
            e.eventTarget.dispatchEvent(new ErrorEvent("streamError", {
                error: t
            }))
        })
    }
    ,
    Recorder.prototype.onPageEncoded = function (e) {
        if (this.recordedPages.push(e),
            this.totalLength += e.length,
            4 & e[5]) {
            for (var t = new Uint8Array(this.totalLength), n = 0, i = 0; i < this.recordedPages.length; i++)
                t.set(this.recordedPages[i], n),
                    n += this.recordedPages[i].length;
            this.eventTarget.dispatchEvent(new CustomEvent("dataAvailable", {
                detail: new Blob([t], {
                    type: "audio/ogg"
                })
            })),
                this.recordedPages = [],
                this.eventTarget.dispatchEvent(new Event("stop"))
        }
    }
    ,
    Recorder.prototype.pause = function () {
        "recording" === this.state && (this.state = "paused",
            this.eventTarget.dispatchEvent(new Event("pause")))
    }
    ,
    Recorder.prototype.removeEventListener = function (e, t, n) {
        this.eventTarget.removeEventListener(e, t, n)
    }
    ,
    Recorder.prototype.resume = function () {
        "paused" === this.state && (this.state = "recording",
            this.eventTarget.dispatchEvent(new Event("resume")))
    }
    ,
    Recorder.prototype.setMonitorGain = function (e) {
        this.monitorNode.gain.value = e
    }
    ,
    Recorder.prototype.start = function () {
        if ("inactive" === this.state && this.stream) {
            this.recordedPages = [],
                this.totalLength = 0,
                this.duration = 0;
            var e = this;
            this.encoder = new Worker(this.config.encoderPath),
                this.encoder.addEventListener("message", function (t) {
                    e.onPageEncoded(t.data)
                }),
                this.encodeBuffers = function () {
                    delete this.encodeBuffers
                }
                ,
                this.state = "recording",
                this.monitorNode.connect(this.audioContext.destination),
                this.scriptProcessorNode.connect(this.audioContext.destination),
                this.eventTarget.dispatchEvent(new Event("start")),
                this.eventTarget.dispatchEvent(new CustomEvent("duration", {
                    detail: this.duration
                })),
                this.encoder.postMessage(this.config)
        }
    }
    ,
    Recorder.prototype.stop = function () {
        "inactive" !== this.state && (this.state = "inactive",
            this.monitorNode.disconnect(),
            this.scriptProcessorNode.disconnect(),
            this.stream.stop(),
            delete this.stream,
            this.encoder.postMessage({
                command: "done"
            }))
    }
    ,
    function (e, t) {
        "use strict";
        var n = n || function (n) {
            var i = {
                element: null,
                dragger: null,
                disable: "none",
                addBodyClasses: !0,
                hyperextensible: !0,
                resistance: .5,
                flickThreshold: 50,
                transitionSpeed: .3,
                easing: "ease",
                maxPosition: 266,
                minPosition: -266,
                tapToClose: !0,
                touchToDrag: !0,
                slideIntent: 40,
                minDragDistance: 5
            }
                , o = {
                    simpleStates: {
                        opening: null,
                        towards: null,
                        hyperExtending: null,
                        halfway: null,
                        flick: null,
                        translation: {
                            absolute: 0,
                            relative: 0,
                            sinceDirectionChange: 0,
                            percentage: 0
                        }
                    }
                }
                , r = {}
                , a = {
                    hasTouch: "ontouchstart" in t.documentElement || e.navigator.msPointerEnabled,
                    eventType: function (e) {
                        var t = {
                            down: a.hasTouch ? "touchstart" : "mousedown",
                            move: a.hasTouch ? "touchmove" : "mousemove",
                            up: a.hasTouch ? "touchend" : "mouseup",
                            out: a.hasTouch ? "touchcancel" : "mouseout"
                        };
                        return t[e]
                    },
                    page: function (e, t) {
                        return a.hasTouch && t.touches.length && t.touches[0] ? t.touches[0]["page" + e] : t["page" + e]
                    },
                    klass: {
                        has: function (e, t) {
                            return -1 !== e.className.indexOf(t)
                        },
                        add: function (e, t) {
                            !a.klass.has(e, t) && i.addBodyClasses && (e.className += " " + t)
                        },
                        remove: function (e, t) {
                            i.addBodyClasses && (e.className = e.className.replace(t, "").replace(/^\s+|\s+$/g, ""))
                        }
                    },
                    dispatchEvent: function (e) {
                        return "function" == typeof r[e] ? r[e].call() : void 0
                    },
                    vendor: function () {
                        var e, n = t.createElement("div"), i = "webkit Moz O ms".split(" ");
                        for (e in i)
                            if ("undefined" != typeof n.style[i[e] + "Transition"])
                                return i[e]
                    },
                    transitionCallback: function () {
                        return "Moz" === o.vendor || "ms" === o.vendor ? "transitionend" : o.vendor + "TransitionEnd"
                    },
                    canTransform: function () {
                        return "undefined" != typeof i.element.style[o.vendor + "Transform"]
                    },
                    deepExtend: function (e, t) {
                        var n;
                        for (n in t)
                            t[n] && t[n].constructor && t[n].constructor === Object ? (e[n] = e[n] || {},
                                a.deepExtend(e[n], t[n])) : e[n] = t[n];
                        return e
                    },
                    angleOfDrag: function (e, t) {
                        var n, i;
                        return i = Math.atan2(-(o.startDragY - t), o.startDragX - e),
                            0 > i && (i += 2 * Math.PI),
                            n = Math.floor(i * (180 / Math.PI) - 180),
                            0 > n && n > -180 && (n = 360 - Math.abs(n)),
                            Math.abs(n)
                    },
                    events: {
                        addEvent: function (e, t, n) {
                            return e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : void 0
                        },
                        removeEvent: function (e, t, n) {
                            return e.addEventListener ? e.removeEventListener(t, n, !1) : e.attachEvent ? e.detachEvent("on" + t, n) : void 0
                        },
                        prevent: function (e) {
                            e.preventDefault ? e.preventDefault() : e.returnValue = !1
                        }
                    },
                    parentUntil: function (e, t) {
                        for (var n = "string" == typeof t; e.parentNode;) {
                            if (n && e.getAttribute && e.getAttribute(t))
                                return e;
                            if (!n && e === t)
                                return e;
                            e = e.parentNode
                        }
                        return null
                    }
                }
                , s = {
                    translate: {
                        get: {
                            matrix: function (t) {
                                if (a.canTransform()) {
                                    var n = e.getComputedStyle(i.element)[o.vendor + "Transform"].match(/\((.*)\)/)
                                        , r = 8;
                                    return n ? (n = n[1].split(","),
                                        16 === n.length && (t += r),
                                        parseInt(n[t], 10)) : 0
                                }
                                return parseInt(i.element.style.left, 10)
                            }
                        },
                        easeCallback: function () {
                            i.element.style[o.vendor + "Transition"] = "",
                                o.translation = s.translate.get.matrix(4),
                                o.easing = !1,
                                clearInterval(o.animatingInterval),
                                0 === o.easingTo && (a.klass.remove(t.body, "snapjs-right"),
                                    a.klass.remove(t.body, "snapjs-left")),
                                a.dispatchEvent("animated"),
                                a.events.removeEvent(i.element, a.transitionCallback(), s.translate.easeCallback)
                        },
                        easeTo: function (e) {
                            a.canTransform() ? (o.easing = !0,
                                o.easingTo = e,
                                i.element.style[o.vendor + "Transition"] = "all " + i.transitionSpeed + "s " + i.easing,
                                o.animatingInterval = setInterval(function () {
                                    a.dispatchEvent("animating")
                                }, 1),
                                a.events.addEvent(i.element, a.transitionCallback(), s.translate.easeCallback),
                                s.translate.x(e)) : (o.translation = e,
                                    s.translate.x(e)),
                                0 === e && (i.element.style[o.vendor + "Transform"] = "")
                        },
                        x: function (n) {
                            if (!("left" === i.disable && n > 0 || "right" === i.disable && 0 > n))
                                if (i.hyperextensible || (n === i.maxPosition || n > i.maxPosition ? n = i.maxPosition : (n === i.minPosition || n < i.minPosition) && (n = i.minPosition)),
                                    n = parseInt(n, 10),
                                    isNaN(n) && (n = 0),
                                    a.canTransform()) {
                                    var r = "translate3d(" + n + "px, 0,0)";
                                    i.element.style[o.vendor + "Transform"] = r
                                } else
                                    i.element.style.width = (e.innerWidth || t.documentElement.clientWidth) + "px",
                                        i.element.style.left = n + "px",
                                        i.element.style.right = ""
                        }
                    },
                    drag: {
                        listen: function () {
                            o.translation = 0,
                                o.easing = !1,
                                a.events.addEvent(i.element, a.eventType("down"), s.drag.startDrag),
                                a.events.addEvent(i.element, a.eventType("move"), s.drag.dragging),
                                a.events.addEvent(i.element, a.eventType("up"), s.drag.endDrag)
                        },
                        stopListening: function () {
                            a.events.removeEvent(i.element, a.eventType("down"), s.drag.startDrag),
                                a.events.removeEvent(i.element, a.eventType("move"), s.drag.dragging),
                                a.events.removeEvent(i.element, a.eventType("up"), s.drag.endDrag)
                        },
                        startDrag: function (e) {
                            var t = e.target ? e.target : e.srcElement
                                , n = a.parentUntil(t, "data-snap-ignore");
                            if (n)
                                return void a.dispatchEvent("ignore");
                            if (i.dragger) {
                                var r = a.parentUntil(t, i.dragger);
                                if (!r && o.translation !== i.minPosition && o.translation !== i.maxPosition)
                                    return
                            }
                            a.dispatchEvent("start"),
                                i.element.style[o.vendor + "Transition"] = "",
                                o.isDragging = !0,
                                o.hasIntent = null,
                                o.intentChecked = !1,
                                o.startDragX = a.page("X", e),
                                o.startDragY = a.page("Y", e),
                                o.dragWatchers = {
                                    current: 0,
                                    last: 0,
                                    hold: 0,
                                    state: ""
                                },
                                o.simpleStates = {
                                    opening: null,
                                    towards: null,
                                    hyperExtending: null,
                                    halfway: null,
                                    flick: null,
                                    translation: {
                                        absolute: 0,
                                        relative: 0,
                                        sinceDirectionChange: 0,
                                        percentage: 0
                                    }
                                }
                        },
                        dragging: function (e) {
                            if (o.isDragging && i.touchToDrag) {
                                var n, r = a.page("X", e), l = a.page("Y", e), c = o.translation, u = s.translate.get.matrix(4), d = r - o.startDragX, p = u > 0, h = d;
                                if (o.intentChecked && !o.hasIntent)
                                    return;
                                if (i.addBodyClasses && (u > 0 ? (a.klass.add(t.body, "snapjs-left"),
                                    a.klass.remove(t.body, "snapjs-right")) : 0 > u && (a.klass.add(t.body, "snapjs-right"),
                                        a.klass.remove(t.body, "snapjs-left"))),
                                    o.hasIntent === !1 || null === o.hasIntent) {
                                    var f = a.angleOfDrag(r, l)
                                        , m = f >= 0 && f <= i.slideIntent || 360 >= f && f > 360 - i.slideIntent
                                        , g = f >= 180 && f <= 180 + i.slideIntent || 180 >= f && f >= 180 - i.slideIntent;
                                    o.hasIntent = g || m ? !0 : !1,
                                        o.intentChecked = !0
                                }
                                if (i.minDragDistance >= Math.abs(r - o.startDragX) || o.hasIntent === !1)
                                    return;
                                a.events.prevent(e),
                                    a.dispatchEvent("drag"),
                                    o.dragWatchers.current = r,
                                    o.dragWatchers.last > r ? ("left" !== o.dragWatchers.state && (o.dragWatchers.state = "left",
                                        o.dragWatchers.hold = r),
                                        o.dragWatchers.last = r) : o.dragWatchers.last < r && ("right" !== o.dragWatchers.state && (o.dragWatchers.state = "right",
                                            o.dragWatchers.hold = r),
                                            o.dragWatchers.last = r),
                                    p ? (i.maxPosition < u && (n = (u - i.maxPosition) * i.resistance,
                                        h = d - n),
                                        o.simpleStates = {
                                            opening: "left",
                                            towards: o.dragWatchers.state,
                                            hyperExtending: i.maxPosition < u,
                                            halfway: u > i.maxPosition / 2,
                                            flick: Math.abs(o.dragWatchers.current - o.dragWatchers.hold) > i.flickThreshold,
                                            translation: {
                                                absolute: u,
                                                relative: d,
                                                sinceDirectionChange: o.dragWatchers.current - o.dragWatchers.hold,
                                                percentage: u / i.maxPosition * 100
                                            }
                                        }) : (i.minPosition > u && (n = (u - i.minPosition) * i.resistance,
                                            h = d - n),
                                            o.simpleStates = {
                                                opening: "right",
                                                towards: o.dragWatchers.state,
                                                hyperExtending: i.minPosition > u,
                                                halfway: u < i.minPosition / 2,
                                                flick: Math.abs(o.dragWatchers.current - o.dragWatchers.hold) > i.flickThreshold,
                                                translation: {
                                                    absolute: u,
                                                    relative: d,
                                                    sinceDirectionChange: o.dragWatchers.current - o.dragWatchers.hold,
                                                    percentage: u / i.minPosition * 100
                                                }
                                            }),
                                    s.translate.x(h + c)
                            }
                        },
                        endDrag: function (e) {
                            if (o.isDragging) {
                                a.dispatchEvent("end");
                                var t = s.translate.get.matrix(4);
                                if (0 === o.dragWatchers.current && 0 !== t && i.tapToClose)
                                    return a.dispatchEvent("close"),
                                        a.events.prevent(e),
                                        s.translate.easeTo(0),
                                        o.isDragging = !1,
                                        void (o.startDragX = 0);
                                "left" === o.simpleStates.opening ? o.simpleStates.halfway || o.simpleStates.hyperExtending || o.simpleStates.flick ? o.simpleStates.flick && "left" === o.simpleStates.towards ? s.translate.easeTo(0) : (o.simpleStates.flick && "right" === o.simpleStates.towards || o.simpleStates.halfway || o.simpleStates.hyperExtending) && s.translate.easeTo(i.maxPosition) : s.translate.easeTo(0) : "right" === o.simpleStates.opening && (o.simpleStates.halfway || o.simpleStates.hyperExtending || o.simpleStates.flick ? o.simpleStates.flick && "right" === o.simpleStates.towards ? s.translate.easeTo(0) : (o.simpleStates.flick && "left" === o.simpleStates.towards || o.simpleStates.halfway || o.simpleStates.hyperExtending) && s.translate.easeTo(i.minPosition) : s.translate.easeTo(0)),
                                    o.isDragging = !1,
                                    o.startDragX = a.page("X", e)
                            }
                        }
                    }
                }
                , l = function (e) {
                    e.element && (a.deepExtend(i, e),
                        o.vendor = a.vendor(),
                        s.drag.listen())
                };
            this.open = function (e) {
                a.dispatchEvent("open"),
                    a.klass.remove(t.body, "snapjs-expand-left"),
                    a.klass.remove(t.body, "snapjs-expand-right"),
                    "left" === e ? (o.simpleStates.opening = "left",
                        o.simpleStates.towards = "right",
                        a.klass.add(t.body, "snapjs-left"),
                        a.klass.remove(t.body, "snapjs-right"),
                        s.translate.easeTo(i.maxPosition)) : "right" === e && (o.simpleStates.opening = "right",
                            o.simpleStates.towards = "left",
                            a.klass.remove(t.body, "snapjs-left"),
                            a.klass.add(t.body, "snapjs-right"),
                            s.translate.easeTo(i.minPosition))
            }
                ,
                this.close = function () {
                    a.dispatchEvent("close"),
                        s.translate.easeTo(0)
                }
                ,
                this.expand = function (n) {
                    var i = e.innerWidth || t.documentElement.clientWidth;
                    "left" === n ? (a.dispatchEvent("expandLeft"),
                        a.klass.add(t.body, "snapjs-expand-left"),
                        a.klass.remove(t.body, "snapjs-expand-right")) : (a.dispatchEvent("expandRight"),
                            a.klass.add(t.body, "snapjs-expand-right"),
                            a.klass.remove(t.body, "snapjs-expand-left"),
                            i *= -1),
                        s.translate.easeTo(i)
                }
                ,
                this.on = function (e, t) {
                    return r[e] = t,
                        this
                }
                ,
                this.off = function (e) {
                    r[e] && (r[e] = !1)
                }
                ,
                this.enable = function () {
                    a.dispatchEvent("enable"),
                        s.drag.listen()
                }
                ,
                this.disable = function () {
                    a.dispatchEvent("disable"),
                        s.drag.stopListening()
                }
                ,
                this.settings = function (e) {
                    a.deepExtend(i, e)
                }
                ,
                this.state = function () {
                    var e, t = s.translate.get.matrix(4);
                    return e = t === i.maxPosition ? "left" : t === i.minPosition ? "right" : "closed",
                        {
                            state: e,
                            info: o.simpleStates
                        }
                }
                ,
                l(n)
        }
            ;
        "undefined" != typeof module && module.exports && (module.exports = n),
            "undefined" == typeof ender && (this.Snap = n),
            "function" == typeof define && define.amd && define("snap", [], function () {
                return n
            })
    }
        .call(this, window, document),
    function () {
        var e;
        e = function () {
            function e(e, t) {
                this.startInterval = 6e4,
                    this.init(e, t)
            }
            return e.prototype.init = function (e, t) {
                return this.$element = $(e),
                    this.options = $.extend({}, $.fn.timeago.defaults, t),
                    this.updateTime(),
                    this.startTimer()
            }
                ,
                e.prototype.startTimer = function () {
                    var e;
                    return e = this,
                        this.interval = setInterval(function () {
                            return e.refresh()
                        }, this.startInterval)
                }
                ,
                e.prototype.stopTimer = function () {
                    return clearInterval(this.interval)
                }
                ,
                e.prototype.restartTimer = function () {
                    return this.stopTimer(),
                        this.startTimer()
                }
                ,
                e.prototype.refresh = function () {
                    return this.updateTime(),
                        this.updateInterval()
                }
                ,
                e.prototype.updateTime = function () {
                    var e;
                    return e = this,
                        this.$element.findAndSelf(this.options.selector).each(function () {
                            var t;
                            return t = e.timeAgoInWords($(this).attr(e.options.attr)),
                                $(this).html(t)
                        })
                }
                ,
                e.prototype.updateInterval = function () {
                    var e, t, n, i;
                    if (this.$element.findAndSelf(this.options.selector).length > 0) {
                        if ("up" === this.options.dir ? e = ":first" : "down" === this.options.dir && (e = ":last"),
                            i = this.$element.findAndSelf(this.options.selector).filter(e).attr(this.options.attr),
                            t = this.parse(i),
                            n = this.getTimeDistanceInMinutes(t),
                            n >= 0 && 44 >= n && 6e4 !== this.startInterval)
                            return this.startInterval = 6e4,
                                this.restartTimer();
                        if (n >= 45 && 89 >= n && 132e4 !== this.startInterval)
                            return this.startInterval = 132e4,
                                this.restartTimer();
                        if (n >= 90 && 2519 >= n && 18e5 !== this.startInterval)
                            return this.startInterval = 18e5,
                                this.restartTimer();
                        if (n >= 2520 && 432e5 !== this.startInterval)
                            return this.startInterval = 432e5,
                                this.restartTimer()
                    }
                }
                ,
                e.prototype.timeAgoInWords = function (e) {
                    var t;
                    return t = this.parse(e),
                        "" + this.options.lang.prefixes.ago + this.distanceOfTimeInWords(t) + this.options.lang.suffix
                }
                ,
                e.prototype.parse = function (e) {
                    var t;
                    return t = $.trim(e),
                        t = t.replace(/\.\d+/, ""),
                        t = t.replace(/-/, "/").replace(/-/, "/"),
                        t = t.replace(/T/, " ").replace(/Z/, " UTC"),
                        t = t.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"),
                        new Date(t)
                }
                ,
                e.prototype.getTimeDistanceInMinutes = function (e) {
                    var t;
                    return t = (new Date).getTime() - e.getTime(),
                        Math.round(t / 1e3 / 60)
                }
                ,
                e.prototype.distanceOfTimeInWords = function (e) {
                    var t, n, i;
                    return n = this.getTimeDistanceInMinutes(e),
                        isNaN(n) ? "" : 0 >= n ? "" + this.options.lang.prefixes.lt : 1 === n ? "1" + this.options.lang.units.minute : n >= 2 && 59 >= n ? "" + n + this.options.lang.units.minutes : (i = e.getMinutes() > 9 ? e.getMinutes() : "0" + e.getMinutes().toString(),
                            t = e.getHours() >= 12 ? "PM" : "AM",
                            "" + e.getHours() % 12 + ":" + i + " " + t)
                }
                ,
                e
        }(),
            $.fn.timeago = function (t) {
                return null == t && (t = {}),
                    this.each(function () {
                        var n, i;
                        return n = $(this),
                            i = n.data("timeago"),
                            i ? "string" == typeof t ? i[t]() : void 0 : n.data("timeago", new e(this, t))
                    })
            }
            ,
            $.fn.findAndSelf = function (e) {
                return this.find(e).add(this.filter(e))
            }
            ,
            $.fn.timeago.Constructor = e,
            $.fn.timeago.defaults = {
                selector: "time.timeago",
                attr: "datetime",
                dir: "up",
                lang: {
                    units: {
                        second: "second",
                        seconds: "seconds",
                        minute: "minute",
                        minutes: "minutes",
                        hour: "hour",
                        hours: "hours",
                        day: "day",
                        days: "days",
                        month: "month",
                        months: "months",
                        year: "year",
                        years: "years"
                    },
                    prefixes: {
                        lt: "less than a",
                        about: "about",
                        over: "over",
                        almost: "almost",
                        ago: ""
                    },
                    suffix: " ago"
                }
            }
    }
        .call(this),
    function () {
        $.fn.timeago.defaults.lang = {
            units: {
                second: "\u79d2",
                seconds: "\u79d2",
                minute: "\u5206\u524d",
                minutes: "\u5206\u524d",
                hour: "\u5c0f\u6642",
                hours: "\u5c0f\u6642",
                day: "\u5929",
                days: "\u5929",
                month: "\u500b\u6708",
                months: "\u500b\u6708",
                year: "\u5e74",
                years: "\u5e74"
            },
            prefixes: {
                lt: "\u525b\u525b",
                about: "\u5927\u7d04",
                over: "\u8d85\u904e",
                almost: "\u63a5\u8fd1",
                ago: ""
            },
            suffix: ""
        }
    }
        .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        this.WebSocketRails = function () {
            function t(t, n) {
                this.url = t,
                    this.use_websockets = null != n ? n : !0,
                    this.connection_stale = e(this.connection_stale, this),
                    this.pong = e(this.pong, this),
                    this.supports_websockets = e(this.supports_websockets, this),
                    this.dispatch_channel = e(this.dispatch_channel, this),
                    this.unsubscribe = e(this.unsubscribe, this),
                    this.subscribe_private = e(this.subscribe_private, this),
                    this.subscribe = e(this.subscribe, this),
                    this.dispatch = e(this.dispatch, this),
                    this.trigger_event = e(this.trigger_event, this),
                    this.trigger = e(this.trigger, this),
                    this.unbind = e(this.unbind, this),
                    this.bind = e(this.bind, this),
                    this.connection_established = e(this.connection_established, this),
                    this.new_message = e(this.new_message, this),
                    this.reconnect = e(this.reconnect, this),
                    this.callbacks = {},
                    this.channels = {},
                    this.queue = {},
                    this.connect()
            }
            return t.prototype.connect = function () {
                return this.state = "connecting",
                    this._conn = this.supports_websockets() && this.use_websockets ? new t.WebSocketConnection(this.url, this) : new t.HttpConnection(this.url, this),
                    this._conn.new_message = this.new_message
            }
                ,
                t.prototype.disconnect = function () {
                    return this._conn && (this._conn.close(),
                        delete this._conn._conn,
                        delete this._conn),
                        this.state = "disconnected"
                }
                ,
                t.prototype.reconnect = function () {
                    var e, t, n, i, o;
                    n = null != (i = this._conn) ? i.connection_id : void 0,
                        this.disconnect(),
                        this.connect(),
                        o = this.queue;
                    for (t in o)
                        e = o[t],
                            e.connection_id !== n || e.is_result() || this.trigger_event(e);
                    return this.reconnect_channels()
                }
                ,
                t.prototype.new_message = function (e) {
                    var n, i, o, r, a, s;
                    for (s = [],
                        o = 0,
                        r = e.length; r > o; o++)
                        i = e[o],
                            n = new t.Event(i),
                            n.is_result() ? (null != (a = this.queue[n.id]) && a.run_callbacks(n.success, n.data),
                                delete this.queue[n.id]) : n.is_channel() ? this.dispatch_channel(n) : n.is_ping() ? this.pong() : this.dispatch(n),
                            s.push("connecting" === this.state && "client_connected" === n.name ? this.connection_established(n.data) : void 0);
                    return s
                }
                ,
                t.prototype.connection_established = function (e) {
                    return this.state = "connected",
                        this._conn.setConnectionId(e.connection_id),
                        this._conn.flush_queue(),
                        null != this.on_open ? this.on_open(e) : void 0
                }
                ,
                t.prototype.bind = function (e, t) {
                    var n;
                    return null == (n = this.callbacks)[e] && (n[e] = []),
                        this.callbacks[e].push(t)
                }
                ,
                t.prototype.unbind = function (e) {
                    return delete this.callbacks[e]
                }
                ,
                t.prototype.trigger = function (e, n, i, o) {
                    var r, a;
                    return r = new t.Event([e, n, null != (a = this._conn) ? a.connection_id : void 0], i, o),
                        this.trigger_event(r)
                }
                ,
                t.prototype.trigger_event = function (e) {
                    var t, n;
                    return null == (t = this.queue)[n = e.id] && (t[n] = e),
                        this._conn && this._conn.trigger(e),
                        e
                }
                ,
                t.prototype.dispatch = function (e) {
                    var t, n, i, o, r;
                    if (null != this.callbacks[e.name]) {
                        for (o = this.callbacks[e.name],
                            r = [],
                            n = 0,
                            i = o.length; i > n; n++)
                            t = o[n],
                                r.push(t(e.data));
                        return r
                    }
                }
                ,
                t.prototype.subscribe = function (e, n, i) {
                    var o;
                    return null == this.channels[e] ? (o = new t.Channel(e, this, !1, n, i),
                        this.channels[e] = o,
                        o) : this.channels[e]
                }
                ,
                t.prototype.subscribe_private = function (e, n, i) {
                    var o;
                    return null == this.channels[e] ? (o = new t.Channel(e, this, !0, n, i),
                        this.channels[e] = o,
                        o) : this.channels[e]
                }
                ,
                t.prototype.unsubscribe = function (e) {
                    return null != this.channels[e] ? (this.channels[e].destroy(),
                        delete this.channels[e]) : void 0
                }
                ,
                t.prototype.dispatch_channel = function (e) {
                    return null != this.channels[e.channel] ? this.channels[e.channel].dispatch(e.name, e.data) : void 0
                }
                ,
                t.prototype.supports_websockets = function () {
                    return "function" == typeof WebSocket || "object" == typeof WebSocket
                }
                ,
                t.prototype.pong = function () {
                    var e, n;
                    return e = new t.Event(["websocket_rails.pong", {}, null != (n = this._conn) ? n.connection_id : void 0]),
                        this._conn.trigger(e)
                }
                ,
                t.prototype.connection_stale = function () {
                    return "connected" !== this.state
                }
                ,
                t.prototype.reconnect_channels = function () {
                    var e, t, n, i, o;
                    i = this.channels,
                        o = [];
                    for (n in i)
                        t = i[n],
                            e = t._callbacks,
                            t.destroy(),
                            delete this.channels[n],
                            t = t.is_private ? this.subscribe_private(n) : this.subscribe(n),
                            t._callbacks = e,
                            o.push(t);
                    return o
                }
                ,
                t
        }()
    }
        .call(this),
    function () {
        WebSocketRails.Event = function () {
            function e(e, t, n) {
                var i;
                this.success_callback = t,
                    this.failure_callback = n,
                    this.name = e[0],
                    i = e[1],
                    null != i && (this.id = null != i.id ? i.id : 65536 * (1 + Math.random()) | 0,
                        this.channel = null != i.channel ? i.channel : void 0,
                        this.data = null != i.data ? i.data : i,
                        this.token = null != i.token ? i.token : void 0,
                        this.connection_id = e[2],
                        null != i.success && (this.result = !0,
                            this.success = i.success))
            }
            return e.prototype.is_channel = function () {
                return null != this.channel
            }
                ,
                e.prototype.is_result = function () {
                    return "undefined" != typeof this.result
                }
                ,
                e.prototype.is_ping = function () {
                    return "websocket_rails.ping" === this.name
                }
                ,
                e.prototype.serialize = function () {
                    return JSON.stringify([this.name, this.attributes()])
                }
                ,
                e.prototype.attributes = function () {
                    return {
                        id: this.id,
                        channel: this.channel,
                        data: this.data,
                        token: this.token
                    }
                }
                ,
                e.prototype.run_callbacks = function (e, t) {
                    return this.success = e,
                        this.result = t,
                        this.success === !0 ? "function" == typeof this.success_callback ? this.success_callback(this.result) : void 0 : "function" == typeof this.failure_callback ? this.failure_callback(this.result) : void 0
                }
                ,
                e
        }()
    }
        .call(this),
    function () {
        WebSocketRails.AbstractConnection = function () {
            function e(e, t) {
                this.dispatcher = t,
                    this.message_queue = []
            }
            return e.prototype.close = function () { }
                ,
                e.prototype.trigger = function (e) {
                    return "connected" !== this.dispatcher.state ? this.message_queue.push(e) : this.send_event(e)
                }
                ,
                e.prototype.send_event = function (e) {
                    return null != this.connection_id ? e.connection_id = this.connection_id : void 0
                }
                ,
                e.prototype.on_close = function (e) {
                    var t;
                    return this.dispatcher && this.dispatcher._conn === this ? (t = new WebSocketRails.Event(["connection_closed", e]),
                        this.dispatcher.state = "disconnected",
                        this.dispatcher.dispatch(t)) : void 0
                }
                ,
                e.prototype.on_error = function (e) {
                    var t;
                    return this.dispatcher && this.dispatcher._conn === this ? (t = new WebSocketRails.Event(["connection_error", e]),
                        this.dispatcher.state = "disconnected",
                        this.dispatcher.dispatch(t)) : void 0
                }
                ,
                e.prototype.on_message = function (e) {
                    return this.dispatcher && this.dispatcher._conn === this ? this.dispatcher.new_message(e) : void 0
                }
                ,
                e.prototype.setConnectionId = function (e) {
                    this.connection_id = e
                }
                ,
                e.prototype.flush_queue = function () {
                    var e, t, n, i;
                    for (i = this.message_queue,
                        t = 0,
                        n = i.length; n > t; t++)
                        e = i[t],
                            this.trigger(e);
                    return this.message_queue = []
                }
                ,
                e
        }()
    }
        .call(this),
    function () {
        var e = {}.hasOwnProperty
            , t = function (t, n) {
                function i() {
                    this.constructor = t
                }
                for (var o in n)
                    e.call(n, o) && (t[o] = n[o]);
                return i.prototype = n.prototype,
                    t.prototype = new i,
                    t.__super__ = n.prototype,
                    t
            };
        WebSocketRails.HttpConnection = function (e) {
            function n(e, t) {
                var i;
                this.dispatcher = t,
                    n.__super__.constructor.apply(this, arguments),
                    this._url = "http://" + e,
                    this._conn = this._createXMLHttpObject(),
                    this.last_pos = 0;
                try {
                    this._conn.onreadystatechange = function (e) {
                        return function () {
                            return e._parse_stream()
                        }
                    }(this),
                        this._conn.addEventListener("load", this.on_close, !1)
                } catch (o) {
                    i = o,
                        this._conn.onprogress = function (e) {
                            return function () {
                                return e._parse_stream()
                            }
                        }(this),
                        this._conn.onload = this.on_close,
                        this._conn.readyState = 3
                }
                this._conn.open("GET", this._url, !0),
                    this._conn.send()
            }
            return t(n, e),
                n.prototype.connection_type = "http",
                n.prototype._httpFactories = function () {
                    return [function () {
                        return new XDomainRequest
                    }
                        , function () {
                            return new XMLHttpRequest
                        }
                        , function () {
                            return new ActiveXObject("Msxml2.XMLHTTP")
                        }
                        , function () {
                            return new ActiveXObject("Msxml3.XMLHTTP")
                        }
                        , function () {
                            return new ActiveXObject("Microsoft.XMLHTTP")
                        }
                    ]
                }
                ,
                n.prototype.close = function () {
                    return this._conn.abort()
                }
                ,
                n.prototype.send_event = function (e) {
                    return n.__super__.send_event.apply(this, arguments),
                        this._post_data(e.serialize())
                }
                ,
                n.prototype._post_data = function (e) {
                    return $.ajax(this._url, {
                        type: "POST",
                        data: {
                            client_id: this.connection_id,
                            data: e
                        },
                        success: function () { }
                    })
                }
                ,
                n.prototype._createXMLHttpObject = function () {
                    var e, t, n, i, o, r;
                    for (i = !1,
                        t = this._httpFactories(),
                        o = 0,
                        r = t.length; r > o; o++) {
                        n = t[o];
                        try {
                            i = n()
                        } catch (a) {
                            e = a;
                            continue
                        }
                        break
                    }
                    return i
                }
                ,
                n.prototype._parse_stream = function () {
                    var e, t, n;
                    if (3 === this._conn.readyState) {
                        e = this._conn.responseText.substring(this.last_pos),
                            this.last_pos = this._conn.responseText.length,
                            e = e.replace(/\]\]\[\[/g, "],[");
                        try {
                            return n = JSON.parse(e),
                                this.on_message(n)
                        } catch (i) {
                            t = i
                        }
                    }
                }
                ,
                n
        }(WebSocketRails.AbstractConnection)
    }
        .call(this),
    function () {
        var e = {}.hasOwnProperty
            , t = function (t, n) {
                function i() {
                    this.constructor = t
                }
                for (var o in n)
                    e.call(n, o) && (t[o] = n[o]);
                return i.prototype = n.prototype,
                    t.prototype = new i,
                    t.__super__ = n.prototype,
                    t
            };
        WebSocketRails.WebSocketConnection = function (e) {
            function n(e, t) {
                this.url = e,
                    this.dispatcher = t,
                    n.__super__.constructor.apply(this, arguments),
                    this.url.match(/^wss?:\/\//) ? console.log("WARNING: Using connection urls with protocol specified is depricated") : this.url = "https:" === window.location.protocol ? "wss://" + this.url : "ws://" + this.url,
                    this._conn = new WebSocket(this.url),
                    this._conn.onmessage = function (e) {
                        return function (t) {
                            var n;
                            return n = JSON.parse(t.data),
                                e.on_message(n)
                        }
                    }(this),
                    this._conn.onclose = function (e) {
                        return function (t) {
                            return e.on_close(t)
                        }
                    }(this),
                    this._conn.onerror = function (e) {
                        return function (t) {
                            return e.on_error(t)
                        }
                    }(this)
            }
            return t(n, e),
                n.prototype.connection_type = "websocket",
                n.prototype.close = function () {
                    return this._conn.close()
                }
                ,
                n.prototype.send_event = function (e) {
                    return n.__super__.send_event.apply(this, arguments),
                        this._conn.send(e.serialize())
                }
                ,
                n
        }(WebSocketRails.AbstractConnection)
    }
        .call(this),
    function () {
        var e = function (e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        };
        WebSocketRails.Channel = function () {
            function t(t, n, i, o, r) {
                var a, s, l;
                this.name = t,
                    this._dispatcher = n,
                    this.is_private = null != i ? i : !1,
                    this.on_success = o,
                    this.on_failure = r,
                    this._failure_launcher = e(this._failure_launcher, this),
                    this._success_launcher = e(this._success_launcher, this),
                    this._callbacks = {},
                    this._token = void 0,
                    this._queue = [],
                    s = this.is_private ? "websocket_rails.subscribe_private" : "websocket_rails.subscribe",
                    this.connection_id = null != (l = this._dispatcher._conn) ? l.connection_id : void 0,
                    a = new WebSocketRails.Event([s, {
                        data: {
                            channel: this.name
                        }
                    }, this.connection_id], this._success_launcher, this._failure_launcher),
                    this._dispatcher.trigger_event(a)
            }
            return t.prototype.destroy = function () {
                var e, t, n;
                return this.connection_id === (null != (n = this._dispatcher._conn) ? n.connection_id : void 0) && (t = "websocket_rails.unsubscribe",
                    e = new WebSocketRails.Event([t, {
                        data: {
                            channel: this.name
                        }
                    }, this.connection_id]),
                    this._dispatcher.trigger_event(e)),
                    this._callbacks = {}
            }
                ,
                t.prototype.bind = function (e, t) {
                    var n;
                    return null == (n = this._callbacks)[e] && (n[e] = []),
                        this._callbacks[e].push(t)
                }
                ,
                t.prototype.unbind = function (e) {
                    return delete this._callbacks[e]
                }
                ,
                t.prototype.trigger = function (e, t) {
                    var n;
                    return n = new WebSocketRails.Event([e, {
                        channel: this.name,
                        data: t,
                        token: this._token
                    }, this.connection_id]),
                        this._token ? this._dispatcher.trigger_event(n) : this._queue.push(n)
                }
                ,
                t.prototype.dispatch = function (e, t) {
                    var n, i, o, r, a, s;
                    if ("websocket_rails.channel_token" === e)
                        return this.connection_id = null != (r = this._dispatcher._conn) ? r.connection_id : void 0,
                            this._token = t.token,
                            this.flush_queue();
                    if (null != this._callbacks[e]) {
                        for (a = this._callbacks[e],
                            s = [],
                            i = 0,
                            o = a.length; o > i; i++)
                            n = a[i],
                                s.push(n(t));
                        return s
                    }
                }
                ,
                t.prototype._success_launcher = function (e) {
                    return null != this.on_success ? this.on_success(e) : void 0
                }
                ,
                t.prototype._failure_launcher = function (e) {
                    return null != this.on_failure ? this.on_failure(e) : void 0
                }
                ,
                t.prototype.flush_queue = function () {
                    var e, t, n, i;
                    for (i = this._queue,
                        t = 0,
                        n = i.length; n > t; t++)
                        e = i[t],
                            this._dispatcher.trigger_event(e);
                    return this._queue = []
                }
                ,
                t
        }()
    }
        .call(this);
