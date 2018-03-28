
/*global $, jquery, log, window, alert, confirm, setTimeout, clearTimeout, stopwatch, setInterval*/
/*jshint esversion: 6 */


const card = $('.card'), 
    cards = $('.card i').toArray(),
    restart = $('.restart'),
    moveCount = $('.moves'),
    stars = $('.stars li').toArray();

let count = 0,
    openCards = [],
    gameWinCount = 0, 
    numStars = 3;


    



//Shuffles the cards
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



//Function to take in an array and shuffle the contents
//  and append the contents to the board
function restartBoard(array) {
    "use strict";
    let newDeck = shuffle(array), i = 0;
    $('.card').each(function () {
        $(this).empty();
        $(this).append(newDeck[i]);
        $(this).removeClass('open showCard match animated wobble flipInY not-match');
        i += 1;
    });
    while (openCards.length > 0) {
        openCards.pop();
    }
    moveCount.empty();
    count = 0;
    gameWinCount = 0;
    moveCount.text(count);
    for (let index = 0; index < stars.length; index++) {
        $(stars[index]).css("color", "black");
        $(stars[index]).css("text-shadow", "");
    }
    stopwatch.reset();
    $('.timer').text("00:00:00");
}

//Brings up the alert that you won the game
//  restarts the board on OK click
function gameWon() {
    $('#gameWon').modal('show');
    let ti = $('.timer').text();
    $('.modal-body p').append('Time: ' + ti + '<br />Moves: ' + count + '<br />Stars: ' + numStars);
    $('#yesButton').on('click', function() {
        $('.deck').addClass("animated flipInY").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.deck').removeClass("animated flipInY");
        });
        restartBoard(cards);
    });
}

//Function to match cards and show them
function matchCards(openC) {
    "use strict";
    openC.forEach(function (cd) {
        cd.removeClass("showCard animated flipInY");
        cd.addClass("match animated wobble").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            cd.removeClass("animated wobble");
        });
    });
    
    while (openC.length > 0) {
        openC.pop();
    }
    moveCounter();
    gameWinCount += 2;
    if (gameWinCount === 16) {
        stopwatch.stop();
        gameWon();
    }
}

//Function to run when cards don't match
function nonMatch(openC) {
    "use strict";
    openC.forEach(function (cd) {
        cd.removeClass("open showCard animated flipInY");
        cd.addClass("not-match animated bounceIn").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            cd.removeClass("open showCard match not-match animated flipInY wobble bounceIn");
        });
    });
    openCards = [];
    moveCounter();
}

//Function that adds a card to the list that's been selected
function addToList(cd) {
    "use strict";
    openCards.push(cd);
    if (openCards.length === 2) {
        const first = openCards[0].contents('i').attr('class'), 
            second = openCards[1].contents('i').attr('class');
        if (first === second) {
            matchCards(openCards);
        } else {
            nonMatch(openCards);
        }
        openCards = [];   
    }
}

//Flips the card over to be displayed
function displayCard(cd) {
    "use strict";
    cd.addClass("open showCard animated flipInY").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            cd.removeClass("animated flipInY");
        });
    return cd;
}

//Runs every time a turn is passed
// takes away a star at 14, 20, and 30
function moveCounter() {
    count += 1;
    moveCount.empty();
    moveCount.text(count);
    if (count >= 14) {
        $(stars[2]).css('color', 'white');
        $(stars[2]).css('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
        numStars = 2;
    }
    if (count >= 20) {
        $(stars[1]).css('color', 'white');
        $(stars[1]).css('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
        numStars = 1;
    }
    if (count >= 30) {
        $(stars[0]).css('color', 'white');
        $(stars[0]).css('text-shadow', '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000');
        numStars = 0;
    }
}


//Makes sure the board is random on every single load
window.onload = function() {
    restartBoard(cards);
};



//Event listener for the restart button
restart.on('click', 'i', function () {
    "use strict";
    restartBoard(cards);
});

//Event listener for clicking a card
card.on('click', function () {
    "use strict";
    if($('.timer').text() === "00:00:00") {
        stopwatch.start();
    }
    
    if (!$(this).hasClass("open")) {
        displayCard($(this));
        addToList($(this));
    }
});




