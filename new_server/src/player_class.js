export class Player{
    #name = "";
    #cards = [];
    #cards_played = [];
    #cards_used = [];
    #round_points = 0;
    #rounds_lost = 0;

    constructor(name) 
    {
        this.name = name;
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


}