let piano, pianoKeys, selectedKey, correctNote, noteInput, submitButton, correctNoteIndicator, statusIndicator;

const darkGreen = "#006400";
const darkRed = "#800000";
const pitches = [
    "C", ["C#", "Db"], "D", ["D#", "Eb"], "E", "F", ["F#", "Gb"], "G", ["G#", "Ab"], "A", ["A#", "Bb"], "B"
]

let amountCorrect = 0;
let wrongGuesses = 0;

function checkGuess(guess, note) {
    if (Array.isArray(note)) {
        return note.some(n => guess.toLowerCase() === n.toLowerCase());
    }
    return guess.toLowerCase() === note.toLowerCase();
}

function handleGuess(note) {
    noteInput.value = "";
    let correct = checkGuess(note, correctNote);
    if (correct) {
        amountCorrect++;
        let message = "Nice one!", displayedNote = "";
        if (amountCorrect === 1) {
            message += " Keep going to practice your skills.";
        }
        if (Array.isArray(correctNote)) {
            let alternateNote;
            // We do this check to get the original capitalization of the notes.
            if (note.toLowerCase() === correctNote[0].toLowerCase()) {
                displayedNote = correctNote[0]
                alternateNote = correctNote[1];
            } else {
                displayedNote = correctNote[1]
                alternateNote = correctNote[0]; 
            }
            console.log(note, displayedNote, alternateNote);
            message += " " + displayedNote + " is also known as " + alternateNote + ".";
        } else {
            displayedNote = correctNote;
        }
        correctNoteIndicator.style.color = darkGreen;
        correctNoteIndicator.innerHTML = displayedNote;
        statusIndicator.innerHTML = message;
    } else {
        wrongGuesses++;
        correctNoteIndicator.style.color = darkRed;
        correctNoteIndicator.innerHTML = "???";
        statusIndicator.innerHTML = (wrongGuesses === 4) ? "Let's move on so you don't get stuck." : "Not quite, try again. Look for patterns that can help you.";
    }
    if (correct || wrongGuesses === 4) {
        // We'll reset the key if they make four wrong guesses.
        wrongGuesses = 0;
        setTimeout(() => {
            // Pick a new key.
            let oldKey = selectedKey;
            while (selectedKey === oldKey) {
                // Ensure we pick a different key.
                [selectedKey, correctNote] = pickRandomKey();
            };
            toggleHighlight(oldKey);
            toggleHighlight(selectedKey);
        }, 500)
    }
}

function pickRandomKey() {
    /* Pick a random piano key element; returns [element, pitch]. */
    let idx = Math.floor(Math.random() * pianoKeys.length);
    return [pianoKeys[idx], pitches[idx % 12]];
}

function toggleHighlight(pianoKey) {
    /* Given a piano key element, toggle the highlight of the key. */
    function highlight(pianoKey) {
        pianoKey.classList.add("key-highlight");
        setTimeout(function() {
            pianoKey.classList.add("key-highlighted");
            pianoKey.classList.remove("key-highlight");
        }, 1000);
    }

    function unhighlight(pianoKey) {
        pianoKey.classList.remove("key-highlighted");
        pianoKey.classList.add("key-unhighlight");
        setTimeout(function() {
            pianoKey.classList.remove("key-unhighlight");
        }, 1000);
    }

    pianoKey.classList.contains("key-highlighted") ? unhighlight(pianoKey) : highlight(pianoKey);
}

document.addEventListener("DOMContentLoaded", event => {
    noteInput = document.getElementById("note-input");
    noteInput.addEventListener("keydown", e => {
        if (e.keyCode === 13) {
            // Handle enter key.
            noteInput.value && handleGuess(noteInput.value);
        } else if (!((65 <= e.keyCode && e.keyCode <= 71) || e.keyCode === 51 || e.keyCode == 8)) {
            // Disallow characters outside the range A-G and the sharp sign.
            e.preventDefault();
        }
    });
    submitButton = document.getElementById("note-submit-button");
    submitButton.addEventListener("click", e => {
        noteInput.value && handleGuess(noteInput.value);
    });
    correctNoteIndicator = document.getElementById("status-note");
    statusIndicator = document.getElementById("status-info");
    piano = document.getElementById("piano");
    pianoKeys = Array.from(document.querySelectorAll("[data-pitch]"));
    while (correctNote === undefined || Array.isArray(correctNote)) {
        // Start the player with a white key.
        [selectedKey, correctNote] = pickRandomKey();
    };
    console.log(selectedKey, correctNote);
    toggleHighlight(selectedKey);
});