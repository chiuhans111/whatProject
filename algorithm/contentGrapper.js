


let contentBase = document.body.textContent

function countStringCJK(str) {

    str = str.replace(/\s|\n|\r/g, '')

    let lastcount = 0
    let lastword = ''
    for (var i = 0; i < str.length - 1; i++) {
        let count = 0
        let target = str.substr(i, 2)
        contentBase.replace(new RegExp(target, 'g'), function () {
            count++
        })


        if (count > lastcount && lastword.length > 0) {
            console.log(lastword, count)
            lastword = ''
        }
        lastword += str.substr(i, 1)
        if (count < lastcount) {
            console.log(lastword, count)
            lastword = ''
        }
        lastcount = count
    }
    console.log(lastword)
    lastword = ''
}


countStringCJK('有裝潢需求？新春8折專案最後2個月')






