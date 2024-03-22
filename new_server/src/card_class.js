export const deck = {
    "No_deck": 0,
    "Monsters":1,
    "Scoiatel":2,
    "Nilfgaard":3,
    "Skellige":4,
    "Northern_Realms":5,
}

export class Card
{
    #name;
    #picture;
    #ability = NULL;

    constructor(name,picture,ability=NULL)
    {
        this.name = name;
        this.picture = picture;
        this.ability = ability;
    }
}

export class Normal_Card extends Card
{
    #strength = 0;
    #type = NULL;
    #deck;

    constructor(name,picture,ability=NULL,strength,type=NULL,deck)
    {
        super(name,picture,ability);
        this.strength = strength;
        this.type = type;
        this.deck = deck;
    }
}

export class Commander extends Card
{
    #deck;

}
