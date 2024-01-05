const ApiBerufe = "http://sandbox.gibm.ch/berufe.php"; //Example could look like http://sandbox.gibm.ch/berufe.php
const ApiKlassen = "http://sandbox.gibm.ch/klassen.php"; //Example could look like http://sandbox.gibm.ch/klassen.php?beruf_id=10
const ApiTafel = "http://sandbox.gibm.ch/tafel.php"; //Example could look like http://sandbox.gibm.ch/tafel.php?klasse_id=2887489
const Berufsgruppe = document.getElementById("Berufsgruppe");
console.log("Dies ist das Dropdown", Berufsgruppe);

StartseiteButton.addEventListener('mouseover', () => {
  // Change the button's background color
  StartseiteButton.style.color = 'lightgreen';
});

StartseiteButton.addEventListener('mouseout', () => {
  // Change the button's background color
  StartseiteButton.style.color = 'white';
});

let requestBerufe = new XMLHttpRequest();
requestBerufe.open("GET", ApiBerufe);
requestBerufe.send();

requestBerufe.onreadystatechange = function () {
  if (this.readyState == 4 && requestBerufe.status == 200) {
    // Parse JSON response
    const berufeData = JSON.parse(requestBerufe.responseText);




    // Add options from API response
    berufeData.forEach(function (beruf) {
      const option = document.createElement("option");
      option.value = beruf.beruf_id; //Gibt dem Option ELement den Wert der Beruf ID
      option.textContent = beruf.beruf_name; //Zeigt den Beruf im Dropdown an
      Berufsgruppe.appendChild(option); //Fügt das Element Option was bisschen oben erstellt wurde zu Berufsgruppe hinzu
    });
  }
};

Berufsgruppe.addEventListener("change", function () {
  let selectedValue = Berufsgruppe.value;
  console.log("Ausgewähltes Element", selectedValue);

  // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
  if (selectedValue < 1) return;

});