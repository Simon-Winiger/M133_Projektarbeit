// Funktion zur Ermittlung der Woche eines Datums
function getWeekNumber(date) {
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  let weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}
const ApiBerufe = "http://sandbox.gibm.ch/berufe.php"; //Example could look like http://sandbox.gibm.ch/berufe.php
const ApiKlassen = "http://sandbox.gibm.ch/klassen.php"; //Example could look like http://sandbox.gibm.ch/klassen.php?beruf_id=10
const ApiTafel = "http://sandbox.gibm.ch/tafel.php"; //Example could look like http://sandbox.gibm.ch/tafel.php?klasse_id=2887489
const Berufsgruppe = document.getElementById("Berufsgruppe");
const Klassenauswahl = document.getElementById("Klassenauswahl");
const StundenplanInfo = document.getElementById("StundenplanInfo");
console.log("Dies ist das Dropdown", Berufsgruppe);




//#StartseiteButton:hover so angepasst, dass es lightgreen wird;



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
      /** Wenn value = "" => alle Berufe */
      if (beruf.beruf_name.length == 0) {
        beruf.beruf_name = "Alle Klassen anzeigen";
      }

      const option = document.createElement("option");
      option.value = beruf.beruf_id; //Gibt dem Option ELement den Wert der Beruf ID
      option.textContent = beruf.beruf_name; //Zeigt den Beruf im Dropdown an
      Berufsgruppe.appendChild(option); //Fügt das Element Option was bisschen oben erstellt wurde zu Berufsgruppe hinzu
    });
  }
};

let selectedValue;

Berufsgruppe.addEventListener("change", function () {
  selectedValue = Berufsgruppe.value;
  console.log("Ausgewähltes Element", selectedValue);

  // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
  if (selectedValue < 1) return;



  // const klassenApiUrl = `${ApiKlassen}?beruf_id=${selectedValue}`;

  // requestKlassen.open("GET", klassenApiUrl);
  // requestKlassen.send();

  const klassenApiUrl = ApiKlassen + "?beruf_id=" + selectedValue;
  let requestKlassen = new XMLHttpRequest();
  requestKlassen.open("GET", klassenApiUrl);
  requestKlassen.send();

  requestKlassen.onreadystatechange = function () {
    if (this.readyState == 4 && requestKlassen.status == 200) {
      const KlassenData = JSON.parse(requestKlassen.responseText);  //JSON.parse wandelt den String in ein Objekt um

      // Lösche vorhandene Optionen, falls vorhanden
      Klassenauswahl.innerHTML = "";

      KlassenData.forEach(function (klasse) {
        const option = document.createElement("option");
        option.value = klasse.klasse_id; //Gibt dem Option ELement den Wert der Klasse ID
        option.textContent = klasse.klasse_longname; //Zeigt die Klasse im Dropdown an
        Klassenauswahl.appendChild(option); //Fügt das Element Option was bisschen oben erstellt wurde zu Berufsgruppe hinzu
      });
    }
  };
});


Klassenauswahl.addEventListener("change", function () {
  let selectedValue = Klassenauswahl.value;
  console.log("Ausgewähltes Element", selectedValue);

  // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
  if (selectedValue < 1) return;

//CHAT GPT bis "return weekNo"
let currentDate = new Date();

// Funktion, um eine führende Null hinzuzufügen, wenn die Zahl kleiner als 10 ist
function addLeadingZero(number) {
  return number < 10 ? '0' + number : number;
}

// Hole Woche und Jahr
let week = addLeadingZero(getWeekNumber(currentDate));
let year = currentDate.getFullYear();

// Formatier das Datum im gewünschten Format
let formattedDate = addLeadingZero(currentDate.getMonth() + 1) + '-' + year;

// Gib die Woche und das Jahr im gewünschten Format aus
console.log("Woche und Jahr im Format mm-yyyy:", formattedDate);




  const tafelApiUrl = ApiTafel + "?klasse_id=" + selectedValue + "&woche=" + formattedDate;
  let requestTafel = new XMLHttpRequest();
  requestTafel.open("GET", tafelApiUrl);
  requestTafel.send();

  requestTafel.onreadystatechange = function () {
    //let TafelData;
    if (this.readyState == 4 && requestTafel.status == 200) {
      const responseData = requestTafel.responseText;
  
      //Mit Bruder Chat GPT
      try {
        TafelData = JSON.parse(responseData);
        console.log(TafelData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        console.log("Response Text:", responseData);
      }

      TafelData.forEach(function (tafel) {
        const option = document.createElement("option");
        option.value = tafel.tafel_id;
        /* option.textContent = tafel.tafel_datum;
        option.textContent = tafel.tafel_wochentag;
        option.textContent = tafel.tafel_von;
        option.textContent = tafel.tafel_bis;
        option.textContent = tafel.tafel_lehrer;
        option.textContent = tafel.tafel_longfach;
        option.textContent = tafel.tafel_raum;
        option.textContent = tafel.tafel_kommentar; */
        option.textContent = `Datum: ${tafel.tafel_datum}, Wochentag: ${tafel.tafel_wochentag}, Von: ${tafel.tafel_von}, Bis: ${tafel.tafel_bis}, Lehrer: ${tafel.tafel_lehrer}, Fach: ${tafel.tafel_longfach}, Raum: ${tafel.tafel_raum}, Kommentar: ${tafel.tafel_kommentar}`;
        StundenplanInfo.appendChild(option);

        StundenplanInfo.addEventListener("change", function () {
          let selectedValue = StundenplanInfo.value;
          document.getElementById("StundenplanInfo").innerHTML = this.responseText;
          console.log("Ausgewähltes Element", selectedValue);
        
          // Request nur durchführen, wenn das Element nicht "0 - Bitte wählen" ist
          if (selectedValue < 1) return;
      });
    }
  
      );

  }};});
//Chat GPT
  let currentWeek = getWeekNumber(new Date()); // Startwoche
let currentYear = new Date().getFullYear(); // Startjahr

document.getElementById("VorherigeWocheButton").addEventListener("click", function () {
    if (currentWeek > 1) {
        currentWeek--;
    } else {
        // Wenn es die erste Woche ist, gehe zum vorherigen Jahr
        currentWeek = 52; // Annahme: Ein Jahr hat 52 Wochen
        currentYear--;
    }
    updateUrlWithWeekAndYear(currentWeek, currentYear);
});

document.getElementById("NächsteWocheButton").addEventListener("click", function () {
    if (currentWeek < 52) {
        currentWeek++;
    } else {
        // Wenn es die letzte Woche ist, gehe zum nächsten Jahr
        currentWeek = 1;
        currentYear++;
    }
    updateUrlWithWeekAndYear(currentWeek, currentYear);
});

function updateUrlWithWeekAndYear(week, year) {
    let selectedValue = Klassenauswahl.value;
    let currentUrl = new URL(window.location.href);

    // Parameter aktualisieren oder hinzufügen
    currentUrl.searchParams.set("klasse_id", selectedValue);
    currentUrl.searchParams.set("woche", getFormattedWeekAndYear(week, year));

    // Neue URL setzen
    window.location.href = currentUrl.toString();
}

function getFormattedWeekAndYear(week, year) {
    // Funktion zum Formatieren der Woche und des Jahres (z.B., 03-2024)
    let formattedWeek = week < 10 ? `0${week}` : week;
    return `${formattedWeek}-${year}`;
}