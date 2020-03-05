//init SpeechSynth API
const synth = window.speechSynthesis;

//Grab all DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Initialize voices array
//Fetch voices using API
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  voices.forEach(voice => {
    //Create option element
    const option = document.createElement('option');

    //Fill option with a voice and language
    option.textContent = voice.name + ' (' + voice.lang + ')';

    //Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);

    //Append each voice to the voiceSelect
    voiceSelect.appendChild(option);

  });
};

//Leaving getVoices() here because onVoicesChanged might not be supported in other browsers
getVoices();

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Speech
const speak = () => {
  //Check if already speaking
  if (synth.speaking) {
    console.error('Already speaking');
    return;
  }

  //Check box actually has something in it
  if (textInput.value !== '') {
    //Add animation in the background
    body.style.background = '#b0c4de url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    //Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //Runs when done speaking
    speakText.onend = e => {
      console.log('Done speaking');
      body.style.background = 'LIGHTSTEELBLUE';
    }

    //Handle speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    }

    //Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //Speak
    synth.speak(speakText);

  }
};

//Event Listeners

//Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

//Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value);

//Pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

//Voice select change
voiceSelect.addEventListener('change', e => speak());

