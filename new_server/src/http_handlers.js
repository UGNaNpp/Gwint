import './session_class.js'
import './player_class.js'


import { v4 as uuidv4 } from 'uuid';



export const handler_mm = (session_map,req,response) =>                 // endpoint /mm 
{
    // TODO authenticate

    // check if session_map has any session with one player if not create new session
    // if session has one player add the second player
    // console.log(req)
    const player_id = req.body.player_id;

    const session_to_join = session_map.values.find(session =>              //szukamy sesji z jednym graczem
    {
        if(session.session_waiting_for_other_player())
        {
            return true;
        }
    })

    const session_id = uuidv4();        // no niestety ale scoping w JS taki jest to tu tworze żeby mieć odniesienie poza intervalem

    if(session_to_join === undefined || session_to_join === null)   //spawrdzamy czy jest juz sesja z jednym graczem
    {                                                               
        const new_session = new Session(new Player(player_id));    //jeżeli nie to tworzymy nową
        session_map.set(session_id,new_session);                    //dodajemy do mapy
        response.sendStatus(102);                                   //zwracamy kod 102 że czekamy na drugiego gracza
        
        const interval = setInterval(()=>                           //sprawdzamy co sekundę czy drugi gracz dołączył
        {
            if(session_map.get(session_id).session_waiting_for_other_player() === false)    //jeżeli dołączył to kończymy
            {
                session_map.get(session_id).join_player(player_id);
                clearInterval(interval);
                response.sendStatus(200);                   //zwracamy kod 200 że wszystko ok i mozna rozpocząć grę
            }                          // moze dodać mozna funkcja ktora wysle rozpoczecie gry i losowanie ale to jako callback
        },1000)
        
        const timeout = setTimeout(()=>                     //jeżeli gracz nie dołączy w ciągu 6 minut to kończymy
        {
            clearInterval(interval);
            response.sendStatus(408);
        },360000)
    }
    else                //jeżeli jest to dodajemy gracza do istniejącej sesji
    {
        session_to_join.join_player(player_id);
        response.sendStatus(200);
    }

}

export const handler_session_id = (session_map,req,response) =>         // endpoint /session/:sessionID
{
    const session_id = req.params.sessionID;
    
    const session = session_map.get(session_id);
    


}

export const handler_session_id_move = (session_map,req,response) =>    // endpoint /session/:sessionID/move
{

}

export const handler_session_id_round = (session_map,req,response) =>   // endpoint /session/:sessionID/round
{   
    
}

