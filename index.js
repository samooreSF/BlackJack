const { Deck } = require('./deck')

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const GREEN = "\x1b[32m"
const RED = "\x1b[31m"
const RESET = "\x1b[0m"

class BlackJack {
  constructor () {
    this.deck = new Deck()
    this.resetGame()
  }

  resetGame() {
    this.dealer = []
    this.player = []
    this.deck.shuffle()

    this.dealer.push(this.deck.cards.pop())

    this.player.push(this.deck.cards.pop())
    this.player.push(this.deck.cards.pop())
  }


  hasAceInHand(cardsOnHand) {
    let cnt = 0
    for (const card of cardsOnHand) {
      if (card.value === "A") {
        cnt++
      }
    }
    return cnt;
}

 countHandValue(cardsOnHand) {
    let sum = 0;
    let a1 = 0;
    for (const card of cardsOnHand) {
      const number = Number(card.value)
      if (number) {
        sum = sum + number;
      } else {
        if (card.value === 'A') {
          sum += 11
        } else {
          // J, K, Q
          sum += 10
        }
      }
      const totalA = this.hasAceInHand(cardsOnHand)
      if (sum > 21 && totalA > a1) {
        // Transfer Ace's face value from 11 to 1
        a1++
        sum -= 10; // - 11 + 1
      }
    }
    return sum;
}

  playerIsDead(player) {
    return this.countHandValue(player) > 21
  }

  getPlayerPoints (player) {
    return this.countHandValue(player)
  }
  
  playerHit (player) {
    player.push(this.deck.cards.pop())
  }

}


let money = 100

const newGame = async (credit) => {


  if (Number.isInteger(credit)) {

    if (credit > 0) {
      console.log(GREEN, `Added ${credit} to your bank.`, RESET);
    } else if (credit < 0){
      console.log(RED, `Discarded ${credit} from your bank.`, RESET);
    } else {
		 console.log('You got your money back.');
	}

    money += credit
    await snooze(2000)
  }

  const blackJack = new BlackJack()

  let stand = false

  const logCards = (cards) => {
    const emojis = {
      "spades": '♠️', 
      "diamonds": '💎',
      "clubs": '♣️',
      "hearts": '❤️'
    }
    cards.forEach(card => {
      console.log(emojis[card.suit] + '\t' + card.value)
    })
  }

  const logGame = () => {
    console.clear()
    console.log('\Dealer')
    logCards(blackJack.dealer)
    console.log(blackJack.getPlayerPoints(blackJack.dealer) + ' Points')

    console.log('\nYou')
    logCards(blackJack.player)
    console.log(blackJack.getPlayerPoints(blackJack.player) + ' Points')
    const color = money > 0 ? GREEN : RED
    console.log(color, `$${money},- 💵`, RESET)
  }

  logGame()

  const readHitOrStand = () => {

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    readline.question(`Hit or stand? (type: h/s)\n`, async (input) => {
      if (input === 'stand' || input === 's') {
        stand = true
      } else if (input === 'hit' || input === 'h'){
        blackJack.playerHit(blackJack.player)
      }

      readline.close()

      logGame()

      if (blackJack.playerIsDead(blackJack.player)) {
        console.log('Dead..')
        newGame(-20)
      } else if (stand) {
        while (!blackJack.playerIsDead(blackJack.dealer) && blackJack.getPlayerPoints(blackJack.dealer) < 17) {
          blackJack.playerHit(blackJack.dealer)
          await snooze(1000);
          logGame()
        }

        if (blackJack.playerIsDead(blackJack.dealer) || blackJack.getPlayerPoints(blackJack.dealer) < blackJack.getPlayerPoints(blackJack.player)) {
          console.log('You win!')
          newGame(20)
        } else {
          const dealerPoints = blackJack.getPlayerPoints(blackJack.dealer)
          const playerPoints = blackJack.getPlayerPoints(blackJack.player)
          if (dealerPoints === playerPoints) {
            console.log('Draw!')
            newGame(0)
          } else {
            console.log('Dealer wins!')
            newGame(-20)
          }
        }


      } else {
        readHitOrStand()
      }
    })
  }

  readHitOrStand()
}


newGame()
