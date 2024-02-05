export default class Card {
    constructor(power, cardClass, name) {
        if (power < 0 || power > 10) {
            throw new Error('Power must be between 0 and 10');
        }

        const validClasses = ['melee', 'ranged', 'ballista'];
        if (!validClasses.includes(cardClass)) {
            throw new Error('Invalid card class. Must be melee, ranged, or ballista');
        }

        this.power = power;
        this.cardClass = cardClass;
        this.name = name;
    }

    static createFromJSObject(inputData) {
        if (("power" in inputData && "cardClass" in inputData && "name" in inputData)) {
            return new Card(inputData.power, inputData.cardClass, inputData.name)
        } else {
            throw new Error("Ivalid input object")
        }
    }
}