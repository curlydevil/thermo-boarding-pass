class FlyUIABoardingPass {
    constructor(pkpass) {
        this.transformPass(pkpass);
    }

    transformPass(pkpass) {
        this.serviceClass = pkpass.boardingPass.headerFields.find(x => x.key === 'class-name').value;
        this.seatNumber = pkpass.boardingPass.headerFields.find(x => x.key === 'seat').value;
        let {
            label,
            value
        } = pkpass.boardingPass.primaryFields.find(x => x.key === 'origin');
        this.departureAirport = {
            city: label,
            airportCode: value
        };
        ({
            label,
            value
        } = pkpass.boardingPass.primaryFields.find(x => x.key === 'destination'));
        this.destinationAirport = {
            city: label,
            airportCode: value
        };
        this.flightNumber = pkpass.boardingPass.auxiliaryFields.find(x => x.key === 'flightnumber').value;
        this.departureTime = pkpass.boardingPass.auxiliaryFields.find(x => x.key === 'departuretime').value;
        this.departureDate = pkpass.boardingPass.auxiliaryFields.find(x => x.key === 'date').value;
        this.passenger = pkpass.boardingPass.secondaryFields.find(x => x.key === 'passengername').value;
        this.boardingStart = pkpass.boardingPass.secondaryFields.find(x => x.key === 'boardingtime').value;
        this.terminal = pkpass.boardingPass.secondaryFields.find(x => x.key === 'terminal').value;
        this.boardingEnd = pkpass.boardingPass.backFields.find(x => x.key === 'boardingtimeend').value;
        this.checkedBaggage = [pkpass.boardingPass.backFields.find(x => x.key === 'baggage').value];
        this.handLuggage = [pkpass.boardingPass.backFields.find(x => x.key === 'hand_luggage').value];
        this.barcodeData = pkpass.barcode.message;

        const qr = qrcode(4, 'M');
        qr.addData(pkpass.barcode.message);
        qr.make();
        this.qrCodeImage = qr.createDataURL(5, 0);

        const canvas = document.createElement('canvas');
        PDF417.draw(pkpass.barcode.message, canvas, 4, 1);
        this.barCodeImages = [canvas.toDataURL()];
    }
}

window.FlyUIABoardingPass = FlyUIABoardingPass;
