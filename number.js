var text = "MMMMMMMMN0xl;'..        ..';ld0NWMMMMMMM\n\
MMMMMW0o,.                    .'lONMMMMM\n\
MMMW0c.                          .;kNMMM\n\
MMXo.              ..              .cKMM\n\
M0;          .;oxO0000Oxl;.          ,0W\n\
K;         .l0WMMMMMMMMMMN0l.         ;K\n\
l         ,OWMMMMMMMMMMMMMMWO,         l\n\
.        'OWMMMMMMMMMMMMMMMMWO'        .\n\
         lNMMMMMMMMMMMMMMMMMMNl         \n\
        .xWMMMMMMMMMMMMMMMMMMWx.        \n\
        .xWMMMMMMMMMMMMMMMMMMWx.        \n\
         cNMMMMMMMMMMMMMMMMMMNl        .\n\
.        .kWMMMMMMMMMMMMMMMMWk.        ,\n\
l         'kWMMMMMMMMMMMMMMNk'        .d\n\
K;         .cONMMMMMMMMMWXk:.         cX\n\
WK:          .':odxxxxdl:.           ;KM\n\
MMXo.                               'OMM\n\
MMMW0l.                            'OWMM\n\
MMMMMWKx:.                        .kWMMM\n\
MMMMMMMMWXOdlc:;,,;;;:c,         .kWMMMM\n\
MMMMMMMMMMMMMMMWWWWWWWO'        .kWMMMMM\n\
MMMMMMMMMMMMMMMMMMMWWO'        .kWMMMMMM\n\
MMMMMMMMMMMMMMMMMMWOl'        .xWMMMMMMM\n\
MMMMMMMMMMMMMMMMMWO'         .xWMMMMMMMM\n\
MMMMMMMMMMMMMMMMWO'         .xWMMMMMMMMM\n\
MMMMMMMMMMMMMMMWO'         .xWMMMMMMMMMM\n\
MMMMMMMMMMMMMMWO'         .xWMMMMMMMMMMM\n\
MMMMMMMMMMMMMWO'         .xWMMMMMMMMMMMM\n\
MMMMMMMMMMMMWO'         .dNMMMMMMMMMMMMM\n\
MMMMMMMMMMMWO'         .dWMMMMMMMMMMMMMM\n\
MMMMMMMMMMWO'         .dNMMMMMMMMMMMMMMM\n\
MMMMMMMMMWO'         .dNMMMMMMMMMMMMMMMM\n\
MMMMMMMMWO'        .,dNMMMMMMMMMMMMMMMMM\n\
MMMMMMMMK;         cKNMMMMMMMMMMMMMMMMMM";

var text2 = [...Array(text.length)].fill(' ');
function update() {

    for (var i in text) {
        if (Math.random() < 0.5 || text[i] == '\n') {
            text2[i] = text[i];
        }
        if (text2[i] != text[i] && Math.random() < 0.9) {
            text2[i] = String.fromCharCode(Math.floor(Math.random() * 128 + 32))
            if (Math.random() < 0.3) break;
        }
    }
    console.log('\n'.repeat(5))
    console.log(text2.join(''))
    setTimeout(() => {
        update();
    }, 100);
}
update();