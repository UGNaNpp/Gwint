class Card
{
    constructor(name,picture,ability=NULL)
    {
        this.name = name;
        this.picture = picture;
        this.ability = ability;
    }
}

class Normal_Card extends Card
{
    constructor(name,picture,ability=NULL,strength,type=NULL,deck)
    {
        super(name,picture,ability);
        this.strength = strength;
        this.type = 
        this.deck = deck;
    }
}

class Commander extends Card
{

}
