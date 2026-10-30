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
