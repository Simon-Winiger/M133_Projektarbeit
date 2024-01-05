const ApiBerufe = "http://sandbox.gibm.ch/berufe.php"; //Example could look like http://sandbox.gibm.ch/berufe.php
const ApiKlassen = "http://sandbox.gibm.ch/klassen.php"; //Example could look like http://sandbox.gibm.ch/klassen.php?beruf_id=10
const ApiTafel = "http://sandbox.gibm.ch/tafel.php"; //Example could look like http://sandbox.gibm.ch/tafel.php?klasse_id=2887489

StartseiteButton.addEventListener('mouseover', () => {
    // Change the button's background color
    StartseiteButton.style.color = 'lightgreen';
  });

  StartseiteButton.addEventListener('mouseout', () => {
    // Change the button's background color
    StartseiteButton.style.color = 'white';
  });