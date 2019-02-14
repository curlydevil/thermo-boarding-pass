class WizzAirBoardingPass {
    constructor(htmlContent) {
        const el = document.createElement('html');
        el.innerHTML = htmlContent;
        this.transformPass(el);
    }

    /**
     *   @param {HTMLElement} domElement
     */
    transformPass(domElement) {
        this.serviceClass = domElement.querySelector('.boarding-pass__header__priority').textContent.trim();
        this.seatNumber = domElement.querySelectorAll('.boarding-pass__info-bubble__content')[3].textContent.trim();
        const airports = domElement.querySelectorAll('.boarding-pass__details-table__content')[3].textContent.split('-');
        this.departureAirport = {
            city: domElement.querySelector('.boarding-pass__departure__city__name').textContent.trim(),
            airportCode: airports[0].trim()
        };
        this.destinationAirport = {
            city: domElement.querySelector('.boarding-pass__arrival__city__name').textContent.trim(),
            airportCode: airports[1].trim()
        };
        this.flightNumber = domElement.querySelectorAll('.boarding-pass__info-bubble__content')[0].textContent.trim();
        this.departureTime = domElement.querySelectorAll('.boarding-pass__info-bubble__content')[2].textContent.trim();
        this.departureDate = domElement.querySelectorAll('.boarding-pass__details-table__content')[5].textContent.trim();
        this.passenger = domElement.querySelectorAll('.boarding-pass__details-table__content')[0].textContent.trim();
        this.boardingStart = domElement.querySelectorAll('.boarding-pass__timeline__event__time')[2].textContent.trim();
        this.terminal = domElement.querySelector('.boarding-pass__departure__city__terminal').textContent.trim();
        this.boardingEnd = domElement.querySelectorAll('.boarding-pass__info-bubble__content')[1].textContent.trim();
        const baggage = Array.from(domElement.querySelectorAll('.boarding-pass__bag__title')).map(x=> x.textContent.trim());
        this.handLuggage = baggage.slice(0, 2);
        this.checkedBaggage = baggage.slice(2);
        this.barCodeImages = [domElement.querySelector('.boarding-pass__basic-info__barcode__image').attributes.src.value];

        const barcodeMessageNode = domElement.querySelector('.boarding-pass__basic-info__flight-details');
        Array.from(barcodeMessageNode.children).forEach(x => x.remove());
        const barcodeMessage = barcodeMessageNode.textContent.trim();
        
        const qr = qrcode(4, 'M');
        qr.addData(barcodeMessage);
        qr.make();
        this.qrCodeImage = qr.createDataURL(5, 0);

        const canvas = document.createElement('canvas');
        PDF417.draw(barcodeMessage, canvas, 4, 1);
        this.barCodeImages.unshift(canvas.toDataURL());
    }
}

window.WizzAirBoardingPass = WizzAirBoardingPass;
