export class Session{
    #player1;
    #player2=null;
    #round_clock=0;

    constructor(player1){
        this.player1 = player1;
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

    session_waiting_for_other_player()
    {
        return this.player2 === null;
    }

    get_round_clock()
    {
        return this.round_clock;
    }

    join_player(player)
    {
        this.player2 = player;
    }

    session_timeout()
    {

    }
}