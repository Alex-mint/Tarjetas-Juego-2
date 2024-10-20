const emojis = ['🐨', '🐼', '🐸', '🦄', '🐔', '🐽', '🦎', '🐬', '🦞', '🦢', '🦜', '🦋', '🐤', '🪲', '🎃', '🎁', '💋', '🎖️', '🪆', '🧲', '💡', '📖', '💰', '⏰', '🍕', '🍗', '🍼', '🍺', '🍉', '🌺', '🚗', '✈️', '🚀', '🚁', '🌎', '🏠', '🌤️', '🌛', '⭐', '⚡', '🔥', '❤️'];
let numberOfCard = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function startGame() {
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    if (isOutOfRange(width, 4, 11)) {
        alert('Ancho tiene que ser de 4 a 11');
        return;
    }
    if (isOutOfRange(height, 3, 6)) {
        alert('Alto tiene que ser de 3 a 6');
        return;
    }

    reset();    
    setupBoard(width, height);

    // Показать все карточки на 2 секунды
    revealAllCards();
}

function setupBoard(width, height) {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 100px)`;
    board.style.gridTemplateRows = `repeat(${height}, 100px)`;

    numberOfCard = width * height;
    if (numberOfCard / 2 > emojis.length) {
        alert('Not enough emojis for this board size');
        return;
    }

    const selectedEmojis = shuffleArray(emojis).slice(0, numberOfCard / 2);
    const doubleEmojis = [...selectedEmojis, ...selectedEmojis];

    const gameEmojis = shuffleArray(doubleEmojis);

    gameEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        emojiElement.style.visibility = 'hidden';
        card.appendChild(emojiElement);

        card.addEventListener('click', () => flipCard(card, emojiElement));

        board.appendChild(card);
    });
}

function revealAllCards() {
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(card => {
        card.classList.add('flipped');
        card.firstChild.style.visibility = 'visible';
    });

    // Через 2 секунды все карточки будут скрыты
    setTimeout(() => {
        allCards.forEach(card => {
            card.classList.remove('flipped');
            card.firstChild.style.visibility = 'hidden';
        });
    }, 2000);
}

function flipCard(card, emojiElement) {
    if (lockBoard || card === firstCard || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    emojiElement.style.visibility = 'visible';

    if (firstCard === null) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

function reset() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function isOutOfRange(val, minVal, maxVal) {
    return val < minVal || val > maxVal;
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    if (document.querySelectorAll('.card.matched').length === numberOfCard) {
        setTimeout(() => {
            alert('Eres el mejor. Has ganado');
        }, 500);
    }

    reset();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        firstCard.firstChild.style.visibility = 'hidden';
        secondCard.firstChild.style.visibility = 'hidden';

        reset();
    }, 1000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('btn-start').addEventListener('click', startGame);
