$(document).ready(function () {

  // Promenljive potrebne za igru

  let karticaOkrenuta = false;
  let kartica1;
  let kartica2;
  let brojPoteza = 0;

  let slikaPrednja = ["./slike/ajax.png", "./slike/angular.png", "./slike/html.png", "./slike/github.png", "./slike/java.png", "./slike/jquery.png", "./slike/js.png", "./slike/json.png", "./slike/mysql.png", "./slike/nodejs.png", "./slike/php.png", "./slike/python.png", "./slike/react.png", "./slike/sublime.png"];

  let dataId = ["ajax", "angular", "bootstrap", "github", "html", "java", "jquery", "js", "json", "mysql", "nodes", "php", "python", "react", "sublime"];

  // Sakrivaju se sekcije igre koje se ne prikazuju pre odabiranja elemenata table

  $(".igra").hide();
  $(".potez").hide();
  $(".naslov_igra").hide();
  $(".timer").hide();
  $(".uspesno").hide();

  // Ispituje se i preuzima vrednost radio dugmeta

  $(".form").on("submit", function () {

    let brojKartica = $('input:checked').val();

    event.preventDefault();

    switch (brojKartica) {

      case "12":
        pripremiIgru()
        kreirajTablu(700, 161, brojKartica);
        break;

      case "18":
        pripremiIgru()
        kreirajTablu(1050, 161, brojKartica);
        break;

      case "24":
        pripremiIgru()
        kreirajTablu(1340, 150, brojKartica);
        break;

      case "30":
        pripremiIgru()
        kreirajTablu(1540, 130, brojKartica);
        break;
    }

    // Funkcija koja sakriva i prikazuje sekcije

    function pripremiIgru() {
      $(".opis").hide();
      $(".naslov_index").hide();
      $(".potez").show();
      $(".naslov_igra").show();
      $(".timer").show();
      $(".igra").show();
    }

    // Funkcija koja kreira tablu sa karticama

    function kreirajTablu(igraSirina, karticaSirina, brojKartica) {

      // Postavljamo "css style width" u zavisnosti od izabranog broja kartica

      $(".igra").css("width", igraSirina + "px");

      // Kreira se broj kartica u odnosu na izabranu vrednost radio dugmeta

      for (let i = 0; i < brojKartica; i++) {

        $(".igra").append("<div class='kartica' data-id=''> <img class='prednja' src=''> <img class='zadnja' src='./slike/cz.svg'> </div>");

        $(".kartica").width(karticaSirina);
      }

      // Kreira se prednja strana kartice u odnosu na izabranu vrednost radio dugmeta

      for (let x = 0, y = 0; x < brojKartica, y < brojKartica; x += 2, y++) {

        // Postavlja se ista slika i data-id za 2 po 2 kartice

        $(".igra .kartica:eq(" + x + ")").attr("data-id", dataId[y]);
        $(".igra .kartica:eq(" + x + ") .prednja").attr("src", slikaPrednja[y]);

        $(".igra .kartica:eq(" + (x + 1) + ")").attr("data-id", dataId[y]);
        $(".igra .kartica:eq(" + (x + 1) + ") .prednja").attr("src", slikaPrednja[y]);
      }

      // Karticama se dodeljuju slučajno izabrani redni brojevi, raspoređuju se na tabli i čekaju akciju korisnika ("click")

      kartice = document.querySelectorAll(".kartica");

      kartice.forEach(kartica => { kartica.style.order = Math.floor(Math.random() * brojKartica); });

      kartice.forEach(kartica => $(kartica).on("click", okreniKarticu));
    }

    // Štoperica

    (function () {
      vreme = new Date().getTime();
      interval = setInterval(stoperica, 1000);
    })();

    function stoperica() {
      novoVreme = new Date().getTime();
      razlika = novoVreme - vreme;

      minut = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
      sekund = Math.floor((razlika % (1000 * 60)) / 1000);

      // Ako su minut i sekund jednocifrene vrednosti, dodajemo vodeću 0

      minut = (minut < 10) ? "0" + minut : minut;
      sekund = (sekund < 10) ? "0" + sekund : sekund;

      $(".min").html(minut);
      $(".sek").html(sekund);
    }

    // Funkcija koja okreće karticu

    function okreniKarticu() {

      this.classList.add("okreni");

      // Brojač poteza

      brojPoteza++;
      $(".broj_poteza").html(brojPoteza);

      if (!karticaOkrenuta) {
        karticaOkrenuta = true;
        kartica1 = this;
        return;
      }
      else {
        kartica2 = this;
      }

      // Proveravamo da li su okrenute kartice iste

      isteKartice = kartica1.dataset.id === kartica2.dataset.id;

      // Ako jesu, ostaju prikazane na ekranu

      isteKartice ? zakljucajKarticu() : vratiKarticu();

      if (isteKartice) {
        brojKartica = brojKartica - 2;
      }

      if (brojKartica == 0) {
        novaIgra();
      }
    }

    // Funkcija koja zaključava dve iste kartice

    function zakljucajKarticu() {

      $(kartica1).off("click", okreniKarticu);
      $(kartica2).off("click", okreniKarticu);

      karticaOkrenuta = false;
      kartica1 = kartica2 = null;
    }

    // Funkcija koja vraća okrenute kartice ako nisu iste

    function vratiKarticu() {

      setTimeout(timeout => {

        kartica1.classList.remove("okreni");
        kartica2.classList.remove("okreni");

        karticaOkrenuta = false;
        kartica1 = kartica2 = null;

      }, 1000);
    }

    // Funkcija koja prikazuje poruku o uspešnom završetku igre

    function novaIgra() {

      clearInterval(interval); // Zaustavljamo štopericu
      difference = 0;

      $(".igra").fadeOut(2000); // Sakriva stranicu sa naslovom, igrom, timerom i brojačem poteza
      $(".naslov_igra").fadeOut(2000);
      $(".potez").fadeOut(2000);
      $(".timer").fadeOut(2000);

      $(".uspesno").fadeIn(2000); // Prikazuje poruku o uspešnom završetku igre, broju odigranih poteza i utrošenom vremenu
      $(".minut").html(minut);
      $(".sekund").html(sekund);
      $(".pokusaj").html(brojPoteza);

    }
  });
});