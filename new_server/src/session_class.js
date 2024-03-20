class Session{
    #player1;
    #player2;
    #round_clock;

    constructor(player1, player2){
        this.player1 = player1;
        this.player2 = player2;
        this.round_clock = 0;
    }

    // private methods

    #player_pass(player)
    {

    }

    #player_play_card(player,card_id)
    {

    }

    #resolve_round()
    {

    }

    // public methods

    get_round_clock()
    {
        return this.round_clock;
    }

}