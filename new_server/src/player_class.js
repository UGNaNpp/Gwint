export default class Player{
    #name = "";
    #cards = [];
    #cards_played = [];
    #cards_used = [];
    #round_points = 0;
    #rounds_lost = 0;

    constructor(name) 
    {
        this.name = name; // ? Traktujemy to jako ID??
    }
    play_card()
    {

    }
    end_round()
    {

    }
    round_result()
    {

    }
    get_rounds()
    {
        return this.rounds_lost;
    }
    get_name()
    {
        return this.name;
    }

    toJSON() {
        return {
            name: this.#name,
            cards: this.#cards,
            cards_played: this.#cards_played,
            cards_used: this.#cards_used,
            round_points: this.#round_points,
            rounds_lost: this.#rounds_lost
        }
    }


}