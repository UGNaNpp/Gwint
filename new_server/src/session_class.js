import './player_class.js';

export class Session{
    #player1;
    #player2=null;
    #round_clock=0;
    #session_id;

    constructor(player1, session_id){
        this.player1 = player1;
        this.#session_id = session_id;
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

    join_player(player_id)
    {
        this.player2 = new Player(player_id);
    }

    session_timeout()
    {
        
    }

    toJSON() {
        const player2Info = this.#player2 === null ? null : this.#player2.toJSON();
        return {
            player1: this.#player1.toJSON(),
            player2: player2Info,
            round_clock: this.#round_clock
        }
    }
}