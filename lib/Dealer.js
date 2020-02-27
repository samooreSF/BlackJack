//Create Game Logic


    let numbers = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];
    let suits = ['Spades','Diamonds','Clubs','Hearts'];
    let BlackJack_Score = 0;
    let players = [];

    function Deck() {
    let deck = [];
    for ( let i=0;i < suits.length;i++) {
      for (let j = 0; j < numbers.length;j++) {
        let card_value = parseInt(numbers[j]);
        if(numbers[j]=== 'J'|| numbers[j]=== 'Q' || numbers[j]=== 'K' ) {
          card_value = 10;
        }
        if(numbers[j]=== "A") {
          card_value = 11;
        }
        let card = { Suit: suits[i], cardType: numbers[j], CardValue: card_value};
        deck.push(card);

      }

    }
    return deck;

  }
  function shuffleDeck(deck) {

    //let shuffle = [];
    for (var i = 0; i < 200; i++)
        {
            let card1 = Math.floor((Math.random() * deck.length));
            let card2 = Math.floor((Math.random() * deck.length));
            let swap= deck[card1];

            deck[card1] = deck[card2];
            deck[card2] = swap;
        }
        return deck;
  }



  function CreatePlayer(members) {

  for ( let i =1; i<=members;i++) {
    let hand = [];
    let player = {name: 'Player '+i, ID: i, Score: 0, Hand: hand};
    players.push(player);

  }
}

function beginGame(player, deck) {

  for (let i=0; i < 2; i++) {
    let card = Math.floor((Math.random() * deck.length));
    player.Hand.push(deck[card]);



  }
}
console.log(CreatePlayer(2));
console.log(Deck());
console.log(shuffleDeck(Deck()));
console.log(beginGame(CreatePlayer(1),Deck()));
