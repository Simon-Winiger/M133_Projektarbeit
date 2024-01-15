const API_BERUF = "http://sandbox.gibm.ch/berufe.php"; //Example could look like http://sandbox.gibm.ch/berufe.php
const API_KLASSE = "http://sandbox.gibm.ch/klassen.php"; //Example could look like http://sandbox.gibm.ch/klassen.php?beruf_id=10
const API_TAFEL = "http://sandbox.gibm.ch/tafel.php"; //Example could look like http://sandbox.gibm.ch/tafel.php?klasse_id=2887489

const SELECT_BERUF = document.getElementById("select_beruf");
const SELECT_KLASSE = document.getElementById("select_klasse");
const OUTPUT_TAFEL = document.getElementById("output_tafel");

let current_date = new Date();
let klasse_id;


/**
 * API FUNKTIONEN
 */

/**
 * BERUFE LADEN
 */
function getBerufe() {
  let requestBerufe = new XMLHttpRequest();
  requestBerufe.open("GET", API_BERUF);
  requestBerufe.send();

  requestBerufe.onreadystatechange = function () {
    if (this.readyState == 4 && requestBerufe.status == 200) {
      // Parse JSON response
      const dataBerufe = JSON.parse(requestBerufe.responseText);

      // Add options from API response
      dataBerufe.forEach(function (beruf) {
        /** Wenn value = "" => alle Berufe */
        if (beruf.beruf_name.length == 0) {
          beruf.beruf_name = "Diverse Klassen anzeigen";
        }

        const option = document.createElement("option");
        option.value = beruf.beruf_id; //Gibt dem Option ELement den Wert der Beruf ID
        option.textContent = beruf.beruf_name; //Zeigt den Beruf im Dropdown an
        SELECT_BERUF.appendChild(option); //Fügt das Element Option was bisschen oben erstellt wurde zu Berufsgruppe hinzu
      });

      if (localStorage.getItem('beruf_id')) {
        let id = localStorage.getItem('beruf_id')
        SELECT_BERUF.value = id;
        getKlassen(id);
      }
    }
  };
}

/**
 * Klassen laden
 */
function getKlassen(beruf_id) {

  const klassenApiUrl = API_KLASSE + "?beruf_id=" + beruf_id;
  let requestKlassen = new XMLHttpRequest();
  requestKlassen.open("GET", klassenApiUrl);
  requestKlassen.send();

  requestKlassen.onreadystatechange = function () {
    if (this.readyState == 4 && requestKlassen.status == 200) {
      const dataKlasse = JSON.parse(requestKlassen.responseText);  //JSON.parse wandelt den String in ein Objekt um

      // Lösche vorhandene Optionen, falls vorhanden
      SELECT_KLASSE.innerHTML = '<option value="0">Bitte Klasse wählen</option>';

      let localstorage_id;
      if (localStorage.getItem('klasse_id')) {
        console.log("LocalStorage klasse exsts")
        localstorage_id = localStorage.getItem('klasse_id');
        getTafel(localstorage_id);
      }

      dataKlasse.forEach(function (klasse) {
        const option = document.createElement("option");
        option.value = klasse.klasse_id; //Gibt dem Option ELement den Wert der Klasse ID
        option.textContent = klasse.klasse_longname; //Zeigt die Klasse im Dropdown an

        SELECT_KLASSE.appendChild(option); //Fügt das Element Option was bisschen oben erstellt wurde zu Berufsgruppe hinzu

        if (klasse.klasse_id = localstorage_id) {
          SELECT_KLASSE.value = klasse.klasse_id;
        }
      });

    }
  };
}

/**
 * Tafel laden
 */
function getTafel(klasse_id) {

  let formattedDate = getFormattedWeekAndYear(current_date);

  const tafelApiUrl = API_TAFEL + "?klasse_id=" + klasse_id + "&woche=" + formattedDate;
  let requestTafel = new XMLHttpRequest();
  requestTafel.open("GET", tafelApiUrl);
  requestTafel.send();

  requestTafel.onreadystatechange = function () {
    if (this.readyState == 4 && requestTafel.status == 200) {
      const responseData = requestTafel.responseText;

      const TafelData = JSON.parse(responseData);

      updateDatumfeld();

      // Stundenplan leeren
      OUTPUT_TAFEL.innerHTML = '';

      TafelData.forEach(tafel => {
        OUTPUT_TAFEL.innerHTML +=
          `<tr>
           <th>${tafel.tafel_datum}</td>
           <td>${tafel.tafel_wochentag}</td>
           <td>${tafel.tafel_von}</td>
           <td>${tafel.tafel_bis}</td>
           <td>${tafel.tafel_lehrer}</td>
           <td>${tafel.tafel_longfach}</td>
           <td>${tafel.tafel_raum}</td>
           <td>${tafel.tafel_kommentar}</td>
       </tr>`;
      });
    }
  };
}

/**
 * INITIALER AUFRUF BERUFE
 */

getBerufe();



/**
 * Eventlistener
 */

SELECT_BERUF.addEventListener("change", function () {
  let beruf_id = SELECT_BERUF.value;


  console.log("Ausgewähltes Element", beruf_id);

  // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
  if (beruf_id < 1) return;

  localStorage.setItem('beruf_id', beruf_id);
  localStorage.removeItem('klasse_id');
  getKlassen(beruf_id);

  OUTPUT_TAFEL.innerHTML = '';
});


SELECT_KLASSE.addEventListener("change", function () {
  let selectedValue = SELECT_KLASSE.value;
  console.log("Ausgewähltes Element", selectedValue);

  // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
  if (selectedValue < 1) return;

  localStorage.setItem('klasse_id', selectedValue);
  klasse_id = selectedValue;

  // Hole Woche und Jahr
  getTafel(klasse_id);
});


document.getElementById("previous_week").addEventListener("click", function () {
  current_date.setDate(current_date.getDate() - 7);
  getTafel(klasse_id);
  updateDatumfeld();
});

document.getElementById("next_week").addEventListener("click", function () {
  current_date.setDate(current_date.getDate() + 7);
  getTafel(klasse_id);
  updateDatumfeld()
});

function updateDatumfeld() {
  // Formatier das Datum im gewünschten Format
  let formattedDate = getFormattedWeekAndYear(current_date);
  document.getElementById('Datumfeld').innerHTML = formattedDate;
}

function getFormattedWeekAndYear(date) {
  // Funktion zum Formatieren der Woche und des Jahres (z.B., 03-2024)
  let week = getWeekNumber(date);
  let year = date.getFullYear();

  if (week < 10) {
    week = '0' + week;
  }

  return `${week}-${year}`;
}

// Funktion zur Ermittlung der Woche eines Datums
function getWeekNumber(date) {
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  let weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}