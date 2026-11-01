// A helyesírás-készlet (helyesiras.js) ellenőrzése az AkH 12 saját példáin, DOM nélkül.
// Használat: node tools/lessons/helyesiras-check.js   (kilépési kód: 0 = minden jó, 1 = van hiba)
const H = require("./helyesiras.js");
let bad = 0, n = 0;
const eq = (got, want, what) => { n++; if (JSON.stringify(got) !== JSON.stringify(want)){ bad++; console.log("HIBA", what, "→", JSON.stringify(got), "várt:", JSON.stringify(want)); } };

// Elválasztás: AkH 226–227. példái (egyszerű szavak; az összetetteket a szólistákban kézzel adjuk meg)
const HY = ["be-tű", "ko-sár", "ba-tyu", "ka-sza", "ró-zsa", "Gyu-la", "am-per", "ás-vány", "fosz-fát", "mor-zsa", "tarisz-nya",
  "ber-reg", "kom-mu-ná-lis", "ton-na", "meny-nyi", "ösz-sze", "pogy-gyász", "szity-tya", "hosz-szú", "cent-rum", "ost-rom",
  "temp-lom", "tink-tú-ra", "lajst-rom", "bo-dza", "ma-dzag", "pe-dzi", "bri-dzset", "brin-dza", "lán-dzsás", "edz-het",
  "ódz-ko-dik", "edz-dze", "edz-dzük", "bi-zott-ság", "hall-gat", "több-let", "könny-től", "rossz-kor", "bors-sal",
  "cso-port-tól", "kulcs-csal", "játsz-szál", "locs-csan", "asz-szony-nyal", "fi-ók", "vi-asz", "mo-za-ik", "di-a-dal",
  "hol-na-pig", "ma-ga-san", "né-gyet", "apá-mé", "ki-sebb", "ker-tig", "pén-zért", "töl-gyes", "ember-rel", "hal-lak",
  "job-ban", "víz-zé", "ágy-gyal", "fod-rász-szal", "galy-lyak", "köny-nyes", "adós-ság", "há-zunk", "házun-kat"];
// a teljes szótagolás: az „apá-mé”, „ember-rel” stb. az AkH-ban csak egy határt mutat; itt mindet kérjük
const FULL = { "apá-mé": "a-pá-mé", "ember-rel": "em-ber-rel", "házun-kat": "há-zun-kat", "adós-ság": "a-dós-ság", "fod-rász-szal": "fod-rász-szal", "tarisz-nya": "ta-risz-nya" };
HY.forEach(h => { const want = FULL[h] || h; eq(H.hyph(want.replace(/-/g, "")), want, "hyph " + want); });

// Betűk száma (AkH 7.: a dzs egy betű; 14. b: ssz = sz + sz)
[["gyöngy", 4], ["asszony", 5], ["dzsungel", 6], ["madzag", 5], ["hosszú", 5], ["poggyász", 6], ["kesztyű", 5], ["edző", 3], ["meggy", 4]]
  .forEach(([w, c]) => eq(H.letterCount(w), c, "betűszám " + w));

// Ábécérend: AkH 14. példái (a táblázat oszlopai)
const AB = [["ír", "Irak", "iram", "Irán", "írandó", "iránt", "író", "iroda", "irónia"],
  ["kas", "Kasmír", "Kassák", "kastély", "kasza", "kaszinó", "kassza", "kaszt"],
  ["mennek", "mennének", "menü", "menza", "meny", "Menyhért", "menny", "mennybolt", "mennyi"],
  ["nagy", "naggyá", "nagygyakorlat", "naggyal", "nagyít", "nagyobb", "nagyol", "nagyoll"],
  ["cudar", "cukor", "cuppant", "csalit", "csata", "Csepel"], ["Zoltán", "zongora", "zúdul", "zsalu", "zseni", "Zsigmond"],
  ["lom", "lomb", "lombik", "Lontay", "lovagol"], ["Eger", "egér", "kerek", "kerék"], ["jácint", "Jácint", "szűcs", "Szűcs"]];
AB.forEach(L => eq(H.sortAbc(L.slice().reverse()), L, "ábécé " + L[0]));
eq(H.sortAbc(["egy", "egyfelé", "egyféle"]), ["egy", "egyfelé", "egyféle"], "ábécé egyfelé");

// Hibatípusok
[["tanitó", "tanító", ["hossz"]], ["Tanito", "tanító", ["kis", "hossz"]], ["hoszú", "hosszú", ["kettoz"]], ["fojik", "folyik", ["jly"]],
 ["dzeki", "dzseki", ["tobbj"]], ["ot", "öt", ["ekezet"]], ["husz", "húsz", ["hossz"]], ["lessz", "lesz", ["kettoz"]],
 ["muszály", "muszáj", ["jly"]], ["kissebb", "kisebb", ["kettoz"]], ["jeggyűrű", "jegygyűrű", ["kettoz"]], ["sinte", "szinte", ["tobbj"]],
 ["alma", "körte", ["eliras"]], ["Kedden", "kedden", ["kis"]]]
  .forEach(([t, r, c]) => eq(H.classify(t, r), c, "classify " + t + "/" + r));

// j/ly (4. lecke): a [j] hang írásmódjai (AkH 88., 51., 56–57., 92–93.)
[["hüje", "hülye", ["jly"]], ["ojan", "olyan", ["jly"]], ["Mijen", "milyen", ["kis", "jly"]], ["kiráj", "király", ["jly"]], ["tanujj", "tanulj", ["jly"]],
 ["tanuly", "tanulj", ["jly"]], ["ájj", "állj", ["kettoz", "jly"]], ["osztájjal", "osztállyal", ["jly"]], ["osztályal", "osztállyal", ["kettoz"]], ["fojjon", "folyjon", ["jly"]],
 ["telyes", "teljes", ["jly"]], ["juk", "lyuk", ["jly"]], ["bajal", "bajjal", ["kettoz"]], ["tavaj", "tavaly", ["jly"]]]
  .forEach(([t, r, c]) => eq(H.classify(t, r), c, "classify " + t + "/" + r));
// az ly egy betű; a hosszú lly elválasztáskor két teljes ly (AkH 226. f)
[["go-lyó"], ["ki-rály"], ["he-lyes"], ["fo-lyo-só"], ["gó-lya"], ["süly-lyed"], ["osz-tály-lyal"], ["hely-lyel"], ["ki-rály-lyal"], ["mo-soly-lyal"]]
  .flat().forEach(h => eq(H.hyph(h.replace(/-/g, "")), h, "hyph " + h));
eq(H.letterCount("gally"), 4, "betűszám gally"); eq(H.letterCount("osztállyal"), 8, "betűszám osztállyal");

// hasonulás (5. lecke): AkH 50–52., 57–58., 60., 82–83., 90.
[["nébdal", "népdal"], ["ablagban", "ablakban"], ["azomban", "azonban"], ["külömben", "különben"], ["egésség", "egészség"], ["kösség", "község"],
 ["baráccság", "barátság"], ["szabaccság", "szabadság"], ["eccer", "egyszer"], ["minnyájan", "mindnyájan"], ["teccik", "tetszik"], ["jáccik", "játszik"],
 ["mingyárt", "mindjárt"], ["röktön", "rögtön"], ["házval", "házzal"], ["ezben", "ebben"], ["azkor", "akkor"], ["aggya", "adja"], ["víszszint", "vízszint"]]
  .forEach(([t, r]) => eq(H.classify(t, r), ["hason"], "classify " + t + "/" + r));
eq(H.classify("Eccer", "egyszer"), ["kis", "hason"], "classify Eccer/egyszer");
eq(H.classify("házal", "házzal"), ["kettoz"], "classify házal/házzal");

// felszólító mód (6. lecke): AkH 76–80.
[["futsatok", "fussatok"], ["sietsen", "siessen"], ["választsunk", "válasszunk"], ["festsen", "fessen"], ["olvasjon", "olvasson"], ["nézjen", "nézzen"], ["látson", "lásson"]]
  .forEach(([t, r]) => eq(H.classify(t, r), ["felsz"], "classify " + t + "/" + r));
eq(H.classify("játszunk", "játsszunk"), ["kettoz"], "classify játszunk/játsszunk");

// Szövegösszevetés
const sum = (t, r) => H.align(t, r).filter(p => p.op !== "ok").map(p => p.op + ":" + p.t + ">" + p.r + ":" + p.cats.join("+"));
eq(sum("Megcsinálom a leckét.", "Megcsinálom a leckét."), [], "align azonos");
eq(sum("meg csinálom a leckét", "Megcsinálom a leckét."), ["egybe:meg csinálom>Megcsinálom:egybe+kis", "del:>.:irasjel"], "align egybe");
eq(sum("A tanitó néni jött", "A tanító néni is jött."), ["sub:tanitó>tanító:hossz", "del:>is:hiany", "del:>.:irasjel"], "align hiány");
eq(sum("Gyuri a kapuban állt és kivédte.", "Gyuri a kapuban állt, és kivédte."), ["del:>,:irasjel"], "align vessző");
eq(sum("Ez nagyon nagyon jó.", "Ez nagyon jó."), ["ins:nagyon>:tobblet"], "align többlet");
eq(sum("Mindenki át ment.", "Mindenki átment."), ["egybe:át ment>átment:egybe"], "align egybe 2");

// A tollbamondás-szövegek formája: nagybetűvel kezdődik, írásjellel végződik, nincs dupla szóköz, egyenes idézőjel
Object.keys(H.TEXTS).forEach(g => H.TEXTS[g].forEach(x => x.s.forEach(s => {
  n++;
  if (!/^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(s) || !/[.!?]$/.test(s) || /\s\s|\s[,.]|"/.test(s)){ bad++; console.log("HIBA mondatforma", x.id, s); }
  const c = H.chunks(s); n++;
  if (c.join(" ") !== s){ bad++; console.log("HIBA darabolás", x.id, c); }
})));

console.log(bad ? bad + " hiba / " + n : "minden jó (" + n + " ellenőrzés)");
process.exit(bad ? 1 : 0);
