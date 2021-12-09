const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

/**
 * THIS IS A DOER, YOU ARE THE THINKER
 * @param {Electron.BrowserWindowConstructorOptions} pref preferences
 */

function Doer(pref) {
    /**@type {Doer} */
    var me = this;

    this.did_finish_load;

    this.win = new BrowserWindow(Object.assign({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    }, pref))

    me.win.webContents.on("did-finish-load", function () {
        if (me.did_finish_load instanceof Function)
            me.did_finish_load()
    })

    this.loadURL = function (url) {
        me.win.loadURL(url)
        promise = new Promise(done => {
            me.did_finish_load = done
        })
        return promise
    }

    this.wait = function (callback) {
        return new Promise(done => {
            me.did_finish_load = done
        })
    }

    this.type = function (str) {
        for (var i of str) this.key(i)
    }

    this.key = function (keyCode, modifiers) {
        me.win.webContents.sendInputEvent({
            type: "keyDown",
            keyCode,
            modifiers,
        });

        me.win.webContents.sendInputEvent({
            type: "char",
            keyCode,
            modifiers,
        });

        me.win.webContents.sendInputEvent({
            type: "keyUp",
            keyCode,
            modifiers,
        });
    }

    this.exe = function (call, ...args) {
        var id = new Date().getTime() + "" + Math.random()
        var code = `(${call.toString()}).call(this,${args.join(',')})`
        me.win.webContents.send('exe', id, code)

        return new Promise(done => {
            ipcMain.once('done_' + id, function (arg, res) {
                done(res)
            })
        })
    }

    this.close = function () {
        me.win.close()
    }
}

exports.Doer = Doer
