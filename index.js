var app = new Vue({
    el: '#app',
    data: {
        airlineLogo: '',
        plugin: '',
        plugins: {
            flyUIA: 'FlyUIA / МАУ',
            wizzAir: 'WizzAir'
        },
        passData: undefined
    },
    methods: {
        parseFile: function ($event) {
            let parsePromise;
            switch (this.plugin) {
                case this.plugins.flyUIA:
                    parsePromise = parseFlyUIA($event.target.files[0]);
                    break;

                case this.plugins.wizzAir:
                    parsePromise = parseWizzAir($event.target.files[0]);
                    break;
            }

            if(parsePromise) {
                parsePromise.then(data => {
                    this.airlineLogo = data.airlineLogo;
                    this.passData = data.passData;
                });
            }
        }
    }
});

function parseFlyUIA(file) {
    return JSZip.loadAsync(file)
                .then((zip) => {
                    const p1 = zip.file("pass.json")
                        .async("string")
                        .then(content => {
                            return new FlyUIABoardingPass(JSON.parse(content));
                        });
                    const p2 = zip.file("logo.png")
                        .async('arraybuffer')
                        .then(data => {
                            var binary = '';
                            var bytes = new Uint8Array(data);
                            var len = bytes.byteLength;
                            for (var i = 0; i < len; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            return 'data:image/png;base64,' + window.btoa(binary);
                        });
                    return Promise.all([p1,p2]);
                })
                .then(data => {
                    return {
                        passData: data[0],
                        airlineLogo: data[1]
                    };
                });
}

function parseWizzAir(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = error => reject(error);
        reader.onload = event => resolve(event.target.result);
        reader.readAsText(file);
    })
    .then(fileContent => {
        return {
            passData: new WizzAirBoardingPass(fileContent),
            airlineLogo: 'https://ink-global.com/contentFiles/image/2018/06/wizzlogo.jpg'
        }
    });
}
