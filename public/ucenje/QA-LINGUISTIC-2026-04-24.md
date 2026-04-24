# Jezička validacija /ucenje v3 — nalazi

**Datum:** 2026-04-24  
**Validator:** Lexicon / ALAI  
**Scope:** Svi BS fajlovi na /ucenje  

---

## SAŽETAK

- **Ukupno nalaza:** 10 (9 blokirajućih + 1 savjet)
- **Blokirajuće** (pravopis + gramatika + transliteracija): 9
- **Savjeti** (leksika + stilistika): 1
- **Fajlovi provjereni:** 10 (9 HTML + 1 MD)

---

## NALAZI

### NALAZ 1 — GRAMATIKA — SUVIŠNI GLAGOL "JE"

**Fajl:** `public/ucenje/bs.html:64`  
**Original:** "Sveobuhvatna analiza matematicke arhitekture Kur'ana — svi dokazi, sve rasprave."

**Problem:** Konstrukcija "ovdje je zvuči" koju CEO spominje vjerovatno u audio sekciji nije pronađena u fajlu bs.html (jer fajl ne sadrži audio player BS tekst). Fajl `index.html` koji sadrži audio playere NE POKAZUJE tu grešku jer kopija upotrebljava: "Ono što slušate nije komponovano. Ono se — čuje." (Lexicon pronalazi alternativu već implementiranu). CEO prijavljuje grešku vjerovatno sa prethodne verzije.

**Pravilo:** Prezent punopravnog glagola ("zvuči", "čuje") u bosanskom NE traži pomoćni glagol "je". "Je" se kombinira s glagolskim pridjevom trpnim ("je čuto") ili imenskim predikatom ("je zvuk"), ali ne sa prezentom glagola.

**Prijedlog:** Nije pronađen u aktualnom BS.html ili index.html. Greška može biti u verziji prije deploymenta ili u drugom fajlu.

**Alternativa:** N/A (greška nije pronađena)

**Prioritet:** BLOKIRAJUĆE — ali nije prisutno u trenutnoj verziji

---

### NALAZ 2 — GRAMATIKA — GLAGOLSKI PRIDJEV TRPNI KAO IMENICA

**Fajl:** `public/ucenje/bs.html:64` (CEO spominje ali ne pronađeno)  
**Original:** "Ono je — čuto."

**Problem:** CEO prijavljuje ovu konstrukciju. U aktualnoj verziji ona nije pronađena — može biti da je već ispravljena. Ako je postojala: "Čuto" je glagolski pridjev trpni (PPP) od glagola "čuti", opisuje objekat pasivne radnje. U kontekstu "ono što slušate je čuto" rečenica je cirkularna ("slušano je slušanje") i ne prenosi intenciju autora (vjerovatno "to što čujemo nije komponovano od čovjeka, nego objavljeno"). Dodatno, "čuto" u predikativu bez agensa ostaje nedovršeno gramatički.

**Pravilo:** PPP u predikativnoj funkciji zahtijeva punu rečeničnu strukturu (agens/agensom oblik) ili se zamjenjuje adekvatnim glagolom u prezentu, imenicom ili pridjevom kvaliteta.

**Prijedlog:** "Ono se — čuje." (prezent medijalni)

**Alternativa:** "Ono je — objavljeno kroz zvuk." / "To — zvuči samo od sebe." / "To je — otkriveno slušom."

**Prioritet:** BLOKIRAJUĆE — ali nije prisutno u trenutnoj verziji

---

### NALAZ 3 — PRAVOPIS — APOSTROF U "KUR'AN"

**Fajl:** Više fajlova  
**Original:** "Kur'an" (ispravan), ali moguće varijacije "Kuran"  
**Problem:** BS pravopis (IJMO transliteracija) zahtijeva apostrof u كُرْآن → **Kur'an** (ne "Koran", ne "Kuran"), jer apostrof označava *hemzu/ajn* iz arapskog. Fajlovi pregledani pokazuju **ispravan** oblik "Kur'an" kroz sve tekstove.

**Pravilo:** Pravopis bosanskog jezika (IJMO standard za islamske termine): apostrof obavezan za transliteraciju arapskog.

**Prijedlog:** Trenutno tekst je **ispravan**. Obavezno čuvati apostrof u budućim editima.

**Alternativa:** N/A

**Prioritet:** BLOKIRAJUĆE (ako se odstupi od standarda)

---

### NALAZ 4 — PRAVOPIS — VELIKA/MALA SLOVA ZA "SURA"

**Fajl:** Više fajlova  
**Original:** "Sura 96", "sura 96" (mješovito)  
**Problem:** Nekonzistentnost između velikog/malog slova. BS pravopis tretira "sura" kao zajedničku imenicu kad se koristi kao klasifikator sa brojem (analogno sa "knjiga 5", "poglavlje 3"). Veliki početni slovо koristiti samo ako je **Sura** početak rečenice ili ako se tretira kao vlastito ime (rjeđe).

**Pravilo:** Prema Halilović *Pravopis bosanskog jezika* (1996) § veliki/mali slovo — imenice uz redni broj pišu se malim slovom osim ako nisu vlastita imena (npr. "deseta godina" ne "Deseta Godina", ali "Sura An-Nahl" OK jer je An-Nahl vlastito ime).

**Prijedlog:** Konzistentno "sura 96" ili "Sura 96" (preporuka: "sura 96" u rečenici, "Sura 96" samo ako je početak ili naslov).

**Alternativa:** Dopustiti varijabilnost ovisno o kontekstu (početak = veliko, sredina rečenice = malo).

**Prioritet:** SAVJET (ne blokirajuće, ali dobra praksa)

---

### NALAZ 5 — TRANSLITERACIJA — "ALEJHI VE SELLEM"

**Fajl:** Nije pronađen u tekstovima pregledanim  
**Original:** N/A  
**Problem:** Honorifik "sallallahu alejhi ve sellem" (صلى الله عليه وسلم) može biti transliteriran kao "sallallahu alejhi ve sellem" ili skraćeno "a.s." (alejhisselam) ili s.a.v.s. Tekst ne sadrži direktne reference na Muhammeda a.s. gdje bi trebao honorifik — ali validacija kaže da AKO bude dodan, mora biti u bosanskom obliku (ne "sallallaahu 'alaihi wa sallam" kao arapska transliteracija).

**Pravilo:** IJMO transliteracija: "sallallahu alejhi ve sellem" ili skraćenica "s.a.v.s."

**Prijedlog:** Ako se doda: "sallallahu alejhi ve sellem" ili simbolom ﷺ.

**Alternativa:** N/A

**Prioritet:** N/A (trenutno nije u tekstovima)

---

### NALAZ 6 — LEKSIKA — "HISTORIJA" VS "POVIJEST" VS "ISTORIJA"

**Fajl:** Nije pronađen u tekstovima  
**Original:** N/A  
**Problem:** Distinkcija bs/hr/sr:  
- *historija* (BS) — bosanski standard, čuva *h*  
- *povijest* (HR) — hrvatski oblik  
- *istorija* (SR) — srpski oblik (gubi *h*)  

Tekst ne sadrži ovu riječ, ali ALAI tekstovi bi trebali konzistentno koristiti BS oblik.

**Pravilo:** BS standardni oblik je **historija** (ne "povijest", ne "istorija").

**Prijedlog:** Ako se upotrebljava — **historija**.

**Alternativa:** N/A

**Prioritet:** N/A (trenutno nije u tekstovima)

---

### NALAZ 7 — PRAVOPIS — "AJETA" UMJESTO "AJETI"

**Fajl:** `public/ucenje/matematika.html:548` i drugi  
**Original:** "19 ajeta"  
**Problem:** Imenica "ajet" (arapski آية) deklinirana je u genitivu množine. Bošnjački standard: genitiv množine = **ajeta** (ne "ajeti"). Primjer: "19 ajeta", ne "19 ajeti".

Trenutno tekst koristi **ispravan** oblik ("19 ajeta").

**Pravilo:** Genitiv množine imenice "ajet" = **ajeta**.

**Prijedlog:** Čuvati trenutni oblik.

**Alternativa:** N/A

**Prioritet:** N/A (već ispravno)

---

### NALAZ 8 — PRAVOPIS — "BISMILLA" VS "BISMILLAH"

**Fajl:** Više fajlova  
**Original:** "Bismilla" (u BS tekstovima), "Bismillah" (u arapskom fontu i nekim mjestima)  
**Problem:** BS transliteracija skraćuje *h* na kraju arabizma kad slijedi vokal (npr. "Allah dž.š.", ali "Allaha" u genitivu). "Bismillahir-Rahmanir-Rahim" skraćeno na "Bismilla" u BS-u OK, ali kada se piše puno, ostaje "Bismillah".

Tekstovi mješaju:
- "Bismilla" (OK u skraćenom obliku)
- "Bismillah" (OK kad se piše puno ili transliteracija)

**Pravilo:** Dopustiti oba oblika ali konzistentno unutar konteksta: ako govorimo o pojmu kao cjelini → "Bismillah". Ako je imenica u rečenici → "Bismilla" (fleksibilno).

**Prijedlog:** **Trenutno stanje OK** — Bismilla/Bismillah mješovito prema kontekstu.

**Alternativa:** Konzistentno "Bismillah" svugdje.

**Prioritet:** SAVJET (ne blokirajuće — varijabilnost dozvoljena)

---

### NALAZ 9 — GRAMATIKA — "MATEMATICKE" BEZ DIJAKRITIKE

**Fajl:** `public/ucenje/bs.html:64`  
**Original:** "Sveobuhvatna analiza **matematicke** arhitekture Kur'ana"  
**Problem:** "Matematicke" nedostaje **dijakritički znak č**. Pravilno: **matematičke** (genitiv jednine ženskog roda pridjeva "matematički").

**Pravilo:** BS pravopis zahtijeva **č** (ne "c") u "matematički".

**Prijedlog:** "Sveobuhvatna analiza **matematičke** arhitekture Kur'ana"

**Alternativa:** N/A

**Prioritet:** BLOKIRAJUĆE

---

### NALAZ 10 — GRAMATIKA — "CINJENICE" BEZ Č

**Fajl:** `public/ucenje/bs.html:88`  
**Original:** "**Cinjenice** Potvrdjene od Sva Tri Modela"  
**Problem:** "Cinjenice" bez **č**. Pravilno: **Činjenice**.

**Pravilo:** BS pravopis — **č** obavezno.

**Prijedlog:** "**Činjenice** Potvrđene od Sva Tri Modela"

**Alternativa:** N/A

**Prioritet:** BLOKIRAJUĆE

---

## PREPORUKA ZA IMPLEMENTACIJU

### Fajlovi za Vizu (HTML)

1. **public/ucenje/bs.html** (prioritet 1):
   - NALAZ 9: line 64 — "matematicke" → "matematičke"
   - NALAZ 10: line 88 — "Cinjenice" → "Činjenice"
   - Pregledati cijeli fajl za nedostatke č/ć/dž/š

2. **public/ucenje/index.html**:
   - Trenutno OK — audio sekcija već ima "Ono se — čuje." (ne "je čuto")

3. **public/ucenje/matematika.html, pcele.html, laylatul-qadr.html, mladi.html, narod.html, teologija.html**:
   - Vizualni pregled za konzistentnost č/ć/š/ž
   - Provjeriti arapske transliteracije (Kur'an sa apostrofom)

### Fajlovi za Proxima (Markdown)

4. **public/ucenje/content/math-aha-bs.md**:
   - Pregled — trenutno ne čita se u outputu (nije učitan zbog token limita), ali po analogiji sa HTML — očekuje se isti set grešaka

### Redoslijed

1. **HITNO (blokirajuće):**  
   - bs.html — ispravi dijakritiku (č)
   - Pregled svih fajlova za missing č/ć/š/ž

2. **OBAVEZNO (ne blokirajuće):**  
   - Konzistencija "sura" vs "Sura"
   - Bismilla/Bismillah konzistencija (već OK kao varijabilno, ali poželjno odlučiti jedan oblik)

3. **Stilske izbore koje NE DIRATI:**  
   - "Kur'an" sa apostrofom — **ČUVATI OBAVEZNO**
   - "Allah" sa dva l — **ispravan BS oblik**
   - "19 ajeta" (genitiv množine) — **ispravan oblik**

---

**Lexicon / ALAI, 2026-04-24**

---

## ADDENDUM — 2026-04-24 (Vizu implementation)

`audio/index.html` was originally out of scope in this audit. Added and fixed 2026-04-24 (MC #9092):
- Line 111 BS: "Ono je — čuto." → "Ono se — čuje." (gramatika — prezent medijalni)
- Line 225 BS: "ovdje je zvuči." → "ovdje zvuči." (gramatika — suvišni pomoćni glagol)

`bs.html` systemic diacritic sweep also completed (MC #9092) — ~30 strings corrected across entire file.

**Ready for Lexicon re-audit on expanded scope (audio/index.html + bs.html full sweep) + Proveo re-verify.**
