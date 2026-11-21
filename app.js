const affirmations=[
["मी माझ्या शरीराची काळजी करते.","माझ्या प्रवासात मी पूर्णपणे पुरेशी आहे."],
["माझे शरीर माझ्यासाठी काम करत आहे.","मी शांतपणे पुढे वाटचाल करते."],
["छोट्या बदलांनाही अर्थ आहे.","मी माझ्या आरोग्याला प्रेमाने साथ देते."],
["माझ्या वाटेत मी मला जपते.","आज मी स्वतःवर विश्वास ठेवते."],
["मी माझ्या ऊर्जाचा आदर करते.","विश्रांती हीही प्रगतीचा भाग आहे."],
["मी पूर्णताची वाट पाहत नाही.","मी आजच्या क्षणात स्वतःशी प्रेमाने वागते."],
["माझा प्रवास माझा आहे.","इतरांच्या तुलनेत मी माझ्याच गतीने वाढते."],
["ताण माझी ओळख नाही.","मी माझे मन हलके आणि शांत करते."],
["प्रत्येक दिवस नवा संधी देतो.","मी त्या संधीचे स्वागत करते."],
["माझा शरीर मला साथ देत आहे.","मी त्याच्यावर विश्वास ठेवते."],
["मी आज स्वतःसाठी थोडा वेळ देते.","ही काळजी माझ्यासाठी शक्ती आहे."],
["मी अपूर्ण असलो तरी पूर्ण आहे.","माझी भावना माझ्यासाठी महत्त्वाची आहे."],
["आज माझ्यासाठी सौम्य बरे असूया.","मी धडपडीतही मृदु रहाते."],
["मी माझ्या आरोग्याचा नवा प्रवास सुरू करते.","प्रत्येक पाऊल चालायला लागल्यावर मी पुढे जाते."],
["माझे मन शांत होत आहे.","माझा श्वास मला सुरक्षितपणे ठेवीत आहे."],
["मी माझ्या इच्छांना आणि मर्यादांना ऐकते.","आपला आधार स्वतःला देणे ही माझी ताकद आहे."],
["माझ्या पायात शहाणपण आहे.","मी घाबरत नाही, मी शिकते आणि पुढे जाते."],
["आज मी ताणाला थोडा दूर ठेवते.","मी खूप मज़बूत आणि प्रेमळ आहे."],
["माझी प्रगती हळूहळू पण खरी आहे.","मी माझ्या बदलांशी नम्रपणे जुळते."],
["मी स्वतःला दोष देणे थांबवते.","मी स्वतःला साहाय्य आणि विश्वास देते."],
["शरीर बदलेल, भावनाही बदलेल.","मी त्याही बदलांत माझ्याशी टिकते."],
["आज मी धैर्याने स्वतःला धीर देते.","मी माझ्या प्रवासाची वाट शोधते."],
["मी शांत राहण्याची निवड करते.","काळजी होण्यापेक्षा आता विश्वास ठेवते."],
["मी माझ्या मनाला प्रेमाचा आवाज देते.","मी स्वतःला योग्य आराम देते."],
["माझी किंमत माझ्या आजाराने ठरत नाही.","मी माझ्याच ओळीने सुंदर आहे."],
["आज मी स्वतःच्या हक्कासाठी उभी राहते.","माझी आरोग्याची काळजी महत्त्वाची आहे."],
["मी आज थोडे हसते.","ही हास्यही माझ्या बरोबर प्रवास करत आहे."],
["मी शांतपणे वाचते आणि वाढते.","माझे मन आणि शरीर माझ्याशी प्रेमाने आहेत."],
["मी दिवसाच्या सुरुवातीला थोडा प्रेम देते.","तो प्रेम संपूर्ण दिवसभर माझ्याबरोबर राहील."],
["आज मी जगणे नव्याने निवडते.","मी स्वतःची जबाबदार, प्रेमळ काळजी घेते."]
];
const affirmationEl=document.getElementById("affirmation");
let affirmationIndex=0;

function localDayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function affirmationSeed(key){let hash=0;for(let i=0;i<key.length;i++)hash=(hash*31+key.charCodeAt(i))>>>0;return hash}
function setAffirmation(index,save=true){
  affirmationIndex=(index+affirmations.length)%affirmations.length;
  affirmationEl.style.opacity="0";
  setTimeout(()=>{
    affirmationEl.innerHTML=`“${affirmations[affirmationIndex][0]}<br />${affirmations[affirmationIndex][1]}”`;
    affirmationEl.style.opacity="1";
  },180);
  if(save)localStorage.setItem("tichyasathi-affirmation",JSON.stringify({date:localDayKey(),index:affirmationIndex}));
}
const affirmationSaved=JSON.parse(localStorage.getItem("tichyasathi-affirmation")||"{}");
if(affirmationSaved.date===localDayKey()&&Number.isInteger(affirmationSaved.index)){
  affirmationIndex=affirmationSaved.index;
}else{
  affirmationIndex=affirmationSeed(localDayKey())%affirmations.length;
}
setAffirmation(affirmationIndex,false);

document.getElementById("nextAffirmation").addEventListener("click",()=>{
  let next;
  do{next=affirmationSeed(`${localDayKey()}-${Date.now()}-${affirmationIndex}`)%affirmations.length}while(next===affirmationIndex);
  setAffirmation(next);
});
let affirmationDateKey=localDayKey();
setInterval(()=>{
  if(localDayKey()!==affirmationDateKey){
    affirmationDateKey=localDayKey();
    setAffirmation(affirmationSeed(affirmationDateKey)%affirmations.length,true);
  }
},60000);
const mobileMenuButton=document.getElementById("mobileMenuButton");
const mobileNavTabs=document.querySelector(".nav-tabs");
if(mobileMenuButton&&mobileNavTabs){
  mobileMenuButton.addEventListener("click",()=>{
    const open=mobileNavTabs.classList.toggle("mobile-open");
    mobileMenuButton.classList.toggle("open",open);
    mobileMenuButton.setAttribute("aria-expanded",open?"true":"false");
  });
}
document.querySelectorAll(".nav-tab").forEach(tab=>tab.addEventListener("click",()=>{
  showSection(tab.dataset.section);
  if(mobileNavTabs){mobileNavTabs.classList.remove("mobile-open")}
  if(mobileMenuButton){mobileMenuButton.classList.remove("open");mobileMenuButton.setAttribute("aria-expanded","false")}
}));
document.querySelectorAll("[data-go]").forEach(card=>card.addEventListener("click",()=>showSection(card.dataset.go)));
function showSection(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelectorAll(".nav-tab").forEach(t=>t.classList.toggle("active",t.dataset.section===id));document.getElementById(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}

const messageModal=document.getElementById("messageModal");
document.getElementById("openMessage").addEventListener("click",()=>openModal(messageModal));
document.getElementById("closeMessage").addEventListener("click",()=>closeModal(messageModal));
document.getElementById("messageDone").addEventListener("click",()=>closeModal(messageModal));
function openModal(modal){modal.classList.add("open");modal.setAttribute("aria-hidden","false")}function closeModal(modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
document.querySelectorAll(".modal-backdrop").forEach(modal=>modal.addEventListener("click",e=>{if(e.target===modal)closeModal(modal)}));

const breathBall=document.getElementById("breathBall"),breathPhase=document.getElementById("breathPhase"),breathCount=document.getElementById("breathCount"),breathStart=document.getElementById("breathStart"),breathRound=document.getElementById("breathRound");let breathRunning=false,breathInterval=null,breathCycle=0;
breathStart.addEventListener("click",()=>{if(breathRunning){stopBreathing();return}breathRunning=true;breathCycle=0;breathStart.textContent="थांबवा";runBreathingPhase("inhale",4)});
function stopBreathing(){clearInterval(breathInterval);breathRunning=false;breathBall.className="breath-ball";breathPhase.textContent="तयार";breathCount.textContent="4";breathRound.textContent="चक्र ० / ४";breathStart.textContent="व्यायाम सुरू करा";document.querySelectorAll(".breath-panel li").forEach(li=>li.classList.remove("active"))}
function runBreathingPhase(phase,duration){if(!breathRunning)return;document.querySelectorAll(".breath-panel li").forEach(li=>li.classList.toggle("active",li.dataset.phase===phase));const labels={inhale:"श्वास घ्या",hold:"थांबा",exhale:"श्वास सोडा"};const classes={inhale:"breath-ball inhale",hold:"breath-ball hold",exhale:"breath-ball exhale"};breathBall.className=classes[phase];breathPhase.textContent=labels[phase];let remaining=duration;breathCount.textContent=remaining;breathRound.textContent=`चक्र ${toMarathiNumber(breathCycle+1)} / ४`;clearInterval(breathInterval);breathInterval=setInterval(()=>{remaining--;if(remaining>0){breathCount.textContent=remaining;return}clearInterval(breathInterval);if(phase==="inhale")runBreathingPhase("hold",7);else if(phase==="hold")runBreathingPhase("exhale",8);else{breathCycle++;if(breathCycle>=4){breathRunning=false;breathBall.className="breath-ball";breathPhase.textContent="खूप छान";breathCount.textContent="♡";breathRound.textContent="४ चक्र पूर्ण";breathStart.textContent="पुन्हा सुरू करा";document.querySelectorAll(".breath-panel li").forEach(li=>li.classList.remove("active"))}else runBreathingPhase("inhale",4)}},1000)}

const gameModal=document.getElementById("gameModal"),gameArea=document.getElementById("gameArea"),gameScore=document.getElementById("gameScore");let gameInterval,gameScoreValue=0;
document.getElementById("openGame").addEventListener("click",startGame);document.getElementById("closeGame").addEventListener("click",stopGame);
function startGame(){
  gameScoreValue=0;
  gameScore.textContent="० / १०";
  gameArea.innerHTML="";
  openModal(gameModal);
  clearInterval(gameInterval);
  spawnFlower();
  gameInterval=setInterval(spawnFlower,650);
}
function stopGame(){clearInterval(gameInterval);closeModal(gameModal)}
function spawnFlower(){
  if(!gameModal.classList.contains("open")||gameScoreValue>=10)return;
  const flower=document.createElement("button");
  flower.type="button";
  flower.className="game-flower";
  flower.textContent=["🌸","🌼","✿","🌷"][Math.floor(Math.random()*4)];
  flower.style.left=`${8+Math.random()*84}%`;
  flower.style.top=`${15+Math.random()*55}%`;
  flower.addEventListener("click",()=>{
    if(flower.dataset.counted==="yes"||gameScoreValue>=10)return;
    flower.dataset.counted="yes";
    gameScoreValue++;
    gameScore.textContent=`${toMarathiNumber(gameScoreValue)} / १०`;
    flower.classList.add("flower-picked");
    setTimeout(()=>flower.remove(),170);
    if(gameScoreValue>=10){
      clearInterval(gameInterval);
      setTimeout(showFlowerComplete,280);
    }
  });
  flower.addEventListener("animationend",()=>{if(!flower.dataset.counted)flower.remove()});
  gameArea.appendChild(flower);
}
function showFlowerComplete(){
  gameArea.innerHTML='<div class="game-complete"><span class="complete-heart">🌸 ♡</span><h2>सर्व १० फुलं टिपलीस!</h2><p>छान केलंस — आता तुझे हात हलके, मन शांत आणि आत्मविश्वास उंच झाला.</p><button class="primary-button complete-button" id="flowerReplay">पुन्हा खेळूया ♡</button></div>';
  document.getElementById("flowerReplay").addEventListener("click",startGame);
}
function toMarathiNumber(number){return String(number).replace(/\d/g,d=>"०१२३४५६७८९"[d])}

const hammerModal=document.getElementById("hammerModal"),hammerArea=document.getElementById("hammerArea"),hammerScore=document.getElementById("hammerScore");
const worryWords=["अति चिंता","ताण","फ्रस्ट्रेशन","अप्रभावी वाटणं","PCOD ची भीती","अस्वस्थता","अनियमितता","आत्मशंका"];
let smashedWords=new Set();
document.getElementById("openHammerGame").addEventListener("click",startHammerGame);
document.getElementById("closeHammerGame").addEventListener("click",()=>closeModal(hammerModal));
function startHammerGame(){
  smashedWords=new Set();
  hammerScore.textContent="० / ८";
  hammerArea.innerHTML="";
  openModal(hammerModal);
  worryWords.forEach((word,index)=>{
    const piece=document.createElement("button");
    piece.type="button";
    piece.className="worry-word";
    piece.dataset.word=word;
    piece.textContent=word;
    piece.style.left=`${5+(index%4)*23}%`;
    piece.style.top=`${12+Math.floor(index/4)*44+(index%2)*8}%`;
    piece.style.transform=`rotate(${(index%3-1)*4}deg)`;
    piece.addEventListener("click",event=>smashWorry(piece,event));
    hammerArea.appendChild(piece);
  });
}
function smashWorry(piece,event){
  if(piece.classList.contains("smashed"))return;
  piece.classList.add("smashed");
  smashedWords.add(piece.dataset.word);
  hammerScore.textContent=`${toMarathiNumber(smashedWords.size)} / ८`;
  const hammer=document.createElement("span");
  hammer.className="hammer-cursor";
  hammer.textContent="🔨";
  const rect=hammerArea.getBoundingClientRect();
  hammer.style.left=`${event.clientX-rect.left-18}px`;
  hammer.style.top=`${event.clientY-rect.top-24}px`;
  hammerArea.appendChild(hammer);
  setTimeout(()=>hammer.remove(),280);
  setTimeout(()=>piece.remove(),180);
  if(smashedWords.size>=worryWords.length)setTimeout(showHammerComplete,480);
}
function showHammerComplete(){
  hammerScore.textContent="८ / ८";
  hammerArea.innerHTML='<div class="game-complete hammer-complete"><span class="complete-heart">🔨 ♡</span><h2>सर्व भार फोडले!</h2><p>तू आता थोडी हलकी आणि शांत आहेस. हे काम तू स्वतःसाठी छान पूर्ण केलेस.</p><button class="primary-button complete-button" id="hammerReplay">पुन्हा खेळूया ♡</button></div>';
  document.getElementById("hammerReplay").addEventListener("click",startHammerGame);
}

const trackerDate=document.getElementById("trackerDate");
const trackerFields=["waterInput","breakfastInput","exerciseInput","lunchInput","dinnerInput","walkInput"];
const trackerStore=JSON.parse(localStorage.getItem("tichyasathi-daily-tracker")||"{}");
const trackerResetKey="tichyasathi-reset-2026-11-22";
if(!localStorage.getItem(trackerResetKey)){
  delete trackerStore["2026-11-22"];
  localStorage.setItem("tichyasathi-daily-tracker",JSON.stringify(trackerStore));
  localStorage.setItem(trackerResetKey,"done");
}
let calendarCursor=new Date();

function localDateKey(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");return `${y}-${m}-${d}`}
trackerDate.value=localDateKey();

function trackerProgress(entry){if(!entry)return 0;let score=0;if(Number(entry.water)>0)score++;if(entry.breakfast?.trim())score++;if(Number(entry.exercise)>0)score++;if(entry.lunch?.trim())score++;if(entry.dinner?.trim())score++;if(Number(entry.walk)>0)score++;return score}

function loadTrackerDate(){const key=trackerDate.value||localDateKey();const entry=trackerStore[key]||{};trackerFields.forEach(id=>{const input=document.getElementById(id);const dataKey=id.replace("Input","");input.value=entry[dataKey]??(id==="waterInput"||id==="exerciseInput"||id==="walkInput"?0:"")});updateTrackerDateLabel();renderCalendar();updateSaveStatus()}

function saveTrackerDate(){const key=trackerDate.value||localDateKey();const entry={submitted:Boolean(trackerStore[key]?.submitted)};trackerFields.forEach(id=>{const input=document.getElementById(id);entry[id.replace("Input","")]=input.type==="number"?Number(input.value||0):input.value.trim()});trackerStore[key]=entry;localStorage.setItem("tichyasathi-daily-tracker",JSON.stringify(trackerStore));updateSaveStatus();updateTrackerDateLabel();renderCalendar();const status=document.getElementById("saveStatus");status.textContent="• या उपकरणात जतन झाले";status.className="save-status saved"}

function updateSaveStatus(){const key=trackerDate.value||localDateKey();const filled=trackerProgress(trackerStore[key]);const submitted=Boolean(trackerStore[key]?.submitted);const status=document.getElementById("saveStatus");const count=document.getElementById("submitCount");const hint=document.getElementById("submitHint");const button=document.getElementById("submitTracker");trackerFields.forEach(id=>{document.getElementById(id).disabled=submitted});document.querySelectorAll("[data-step]").forEach(control=>control.disabled=submitted);status.className=`save-status${filled?" saved":""}`;status.textContent=`• ${toMarathiNumber(filled)} / ६ पूर्ण`;count.textContent=`${toMarathiNumber(filled)} / ६ पूर्ण`;button.classList.toggle("submitted",submitted);if(submitted){button.textContent="Submit पूर्ण झाले ✓";button.disabled=true;hint.textContent="आजची नोंद submit झाली"}else{button.textContent="आजचा दिवस Submit करा ✓";button.disabled=filled!==6;hint.textContent=filled===6?"आता आजचा दिवस submit करा":"आजच्या सर्व नोंदी पूर्ण झाल्यावर submit करा"}}

function updateTrackerDateLabel(){const date=new Date(`${trackerDate.value}T12:00:00`);const label=document.getElementById("trackerDateLabel");label.textContent=date.toLocaleDateString("mr-IN",{weekday:"long",day:"numeric",month:"long"})}

trackerFields.forEach(id=>{const input=document.getElementById(id);input.addEventListener("input",saveTrackerDate)});
document.querySelectorAll("[data-step]").forEach(button=>button.addEventListener("click",()=>{const input=document.getElementById(button.dataset.step);const next=Math.max(0,Math.min(10,Number(input.value||0)+Number(button.dataset.change)));input.value=next.toFixed(next%1?2:0).replace(/0+$/,"").replace(/\.$/,"");saveTrackerDate()}));
trackerDate.addEventListener("change",()=>{calendarCursor=new Date(`${trackerDate.value}T12:00:00`);loadTrackerDate()});

function renderCalendar(){const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();const monthName=calendarCursor.toLocaleDateString("mr-IN",{month:"long",year:"numeric"});document.getElementById("calendarTitle").textContent=monthName;const grid=document.getElementById("calendarGrid");grid.innerHTML="";const first=new Date(year,month,1).getDay();const days=new Date(year,month+1,0).getDate();for(let i=0;i<first;i++){const empty=document.createElement("button");empty.className="empty";empty.disabled=true;grid.appendChild(empty)}for(let day=1;day<=days;day++){const date=new Date(year,month,day),key=localDateKey(date),button=document.createElement("button");button.textContent=toMarathiNumber(day);button.className=key===trackerDate.value?"selected":"";if(key===localDateKey())button.classList.add("today");if(trackerStore[key]?.submitted)button.classList.add("saved");button.addEventListener("click",()=>{trackerDate.value=key;calendarCursor=new Date(`${key}T12:00:00`);loadTrackerDate()});grid.appendChild(button)}updateCalendarSummary()}

function updateCalendarSummary(){const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth(),prefix=`${year}-${String(month+1).padStart(2,"0")}-`;const keys=Object.keys(trackerStore).filter(key=>key.startsWith(prefix)&&trackerStore[key]?.submitted);const daysInMonth=new Date(year,month+1,0).getDate();document.getElementById("calendarFilled").textContent=`${toMarathiNumber(keys.length)} दिवस Submit झाले`;document.getElementById("trackerPercent").textContent=`${Math.round(keys.length/daysInMonth*100)}%`}

document.getElementById("calendarPrev").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()});
document.getElementById("calendarNext").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()});
document.getElementById("submitTracker").addEventListener("click",()=>{
  const key=trackerDate.value||localDateKey();
  const now=new Date();
  const entry={submitted:true,submittedDate:key,submittedAt:now.toISOString(),submittedTime:now.toLocaleString("mr-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})};
  trackerFields.forEach(id=>{const input=document.getElementById(id);entry[id.replace("Input","")]=input.type==="number"?Number(input.value||0):input.value.trim()});
  if(trackerProgress(entry)!==6){showSuccessToast("Submit करण्यासाठी सर्व ६ नोंदी पूर्ण करा.");return}
  trackerStore[key]=entry;
  localStorage.setItem("tichyasathi-daily-tracker",JSON.stringify(trackerStore));
  updateSaveStatus();renderCalendar();showSuccessToast("आजचा दिवस Submit झाला — सर्व नोंदी Excel fileमध्ये download होत आहेत.");
  downloadTrackerCsv(false,true);
});
loadTrackerDate();

function createXlsxBlob(rows){
  const encoder=new TextEncoder();
  const escapeXml=value=>String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const columnLetter=index=>{
    let value=index+1,name="";
    while(value>0){value--;name=String.fromCharCode(65+(value%26))+name;value=Math.floor(value/26)}
    return name;
  };
  const sheetRows=rows.map((row,rowIndex)=>{
    const cells=row.map((value,columnIndex)=>{
      const ref=`${columnLetter(columnIndex)}${rowIndex+1}`;
      if(typeof value==="number"){
        return `<c r="${ref}"><v>${value}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex+1}">${cells}</row>`;
  }).join("");
  const sheetXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`+
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;
  const workbookXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`+
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Daily Tracker" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const workbookRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`+
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;
  const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`+
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`+
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
  const files=[
    ["[Content_Types].xml",contentTypes],
    ["_rels/.rels",rootRels],
    ["xl/workbook.xml",workbookXml],
    ["xl/_rels/workbook.xml.rels",workbookRels],
    ["xl/worksheets/sheet1.xml",sheetXml]
  ];

  const crcTable=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);crcTable[n]=c>>>0}
  function crc32(bytes){let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=crcTable[(c^bytes[i])&255]^(c>>>8);return (c^0xffffffff)>>>0}
  const concat=(arrays)=>{
    const length=arrays.reduce((sum,array)=>sum+array.length,0);
    const result=new Uint8Array(length);let offset=0;
    arrays.forEach(array=>{result.set(array,offset);offset+=array.length});return result;
  };
  const writeUint16=(view,offset,value)=>view.setUint16(offset,value,true);
  const writeUint32=(view,offset,value)=>view.setUint32(offset,value,true);
  const localParts=[];const centralParts=[];let offset=0;
  files.forEach(([name,content])=>{
    const nameBytes=encoder.encode(name);const dataBytes=encoder.encode(content);const crc=crc32(dataBytes);
    const local=new Uint8Array(30+nameBytes.length);const lv=new DataView(local.buffer);
    writeUint32(lv,0,0x04034b50);writeUint16(lv,4,20);writeUint16(lv,6,0);writeUint16(lv,8,0);writeUint16(lv,10,0);writeUint16(lv,12,0);
    writeUint32(lv,14,crc);writeUint32(lv,18,dataBytes.length);writeUint32(lv,22,dataBytes.length);writeUint16(lv,26,nameBytes.length);writeUint16(lv,28,0);local.set(nameBytes,30);
    localParts.push(local,dataBytes);

    const central=new Uint8Array(46+nameBytes.length);const cv=new DataView(central.buffer);
    writeUint32(cv,0,0x02014b50);writeUint16(cv,4,20);writeUint16(cv,6,20);writeUint16(cv,8,0);writeUint16(cv,10,0);writeUint16(cv,12,0);writeUint16(cv,14,0);
    writeUint32(cv,16,crc);writeUint32(cv,20,dataBytes.length);writeUint32(cv,24,dataBytes.length);writeUint16(cv,28,nameBytes.length);writeUint16(cv,30,0);writeUint16(cv,32,0);writeUint16(cv,34,0);writeUint16(cv,36,0);writeUint32(cv,38,0);writeUint32(cv,42,offset);
    central.set(nameBytes,46);centralParts.push(central);
    offset+=local.length+dataBytes.length;
  });
  const centralDirectory=concat(centralParts);const endOffset=offset+centralDirectory.length;
  const end=new Uint8Array(22);const ev=new DataView(end.buffer);
  writeUint32(ev,0,0x06054b50);writeUint16(ev,4,0);writeUint16(ev,6,0);writeUint16(ev,8,files.length);writeUint16(ev,10,files.length);writeUint32(ev,12,centralDirectory.length);writeUint32(ev,16,offset);writeUint16(ev,20,0);
  return new Blob([concat([concat(localParts),centralDirectory,end])],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
}

function downloadTrackerCsv(showMessage=true,submittedOnly=false){
  const headers=["तारीख","Submit स्थिती","Submit तारीख","Submit वेळ","पाणी (लीटर)","नाश्ता","व्यायाम (मिनिटे)","लंच","डिनर","चालणे (Steps)"];
  const rows=[headers];
  Object.keys(trackerStore).sort().filter(date=>!submittedOnly||trackerStore[date]?.submitted).forEach(date=>{
    const entry=trackerStore[date];
    const submittedDate=entry.submittedDate||date;
    let submittedTime=entry.submittedTime||"";
    if(entry.submittedAt&&!submittedTime){
      submittedTime=new Date(entry.submittedAt).toLocaleString("mr-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    }
    rows.push([
      date,
      entry.submitted?"Submit झाले":"अपूर्ण",
      entry.submitted?submittedDate:"",
      entry.submitted?submittedTime:"",
      entry.water??0,
      entry.breakfast||"",
      entry.exercise??0,
      entry.lunch||"",
      entry.dinner||"",
      entry.walk??0
    ]);
  });
  const blob=createXlsxBlob(rows);
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=`daily-tracker-${localDateKey()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  if(showMessage)showSuccessToast("सर्व नोंदी Excel workbookमध्ये download झाल्या.");
}

document.getElementById("submitExport").addEventListener("click",()=>downloadTrackerCsv(true));

let toastTimer=null;
function showSuccessToast(message){
  const toast=document.getElementById("successToast");
  document.getElementById("successToastText").textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),3200);
}

const foods=[
  {id:"rice",category:"Grains",name:"साधा भात",icon:"🍚",serving:"150 g शिजलेला भात",qtyLabel:"बाऊल",step:0.5,calories:195,protein:4.3,carbs:42.2,fat:0.4,fiber:0.6},
  {id:"roti",category:"Grains",name:"गव्हाची पोळी",icon:"🫓",serving:"१ medium पोळी",qtyLabel:"पोळी",step:1,calories:120,protein:3.6,carbs:20,fat:3.5,fiber:2.1},
  {id:"oats",category:"Grains",name:"ओट्स",icon:"🥣",serving:"30 g dry ओट्स",qtyLabel:"कप",step:0.5,calories:114,protein:4.9,carbs:19.5,fat:2.3,fiber:3},
  {id:"brown-rice",category:"Grains",name:"ब्राउन राइस",icon:"🍚",serving:"150 g शिजलेला",qtyLabel:"बाऊल",step:0.5,calories:165,protein:3.8,carbs:34.4,fat:1.3,fiber:2.7},
  {id:"moong",category:"Protein",name:"मूग डाळ",icon:"🫘",serving:"200 g शिजलेली डाळ",qtyLabel:"कटोरी",step:0.5,calories:147,protein:12.5,carbs:25,fat:0.8,fiber:7},
  {id:"chana",category:"Protein",name:"चना",icon:"🫘",serving:"150 g boiled चना",qtyLabel:"कटोरी",step:0.5,calories:223,protein:12.3,carbs:36.8,fat:3.5,fiber:12},
  {id:"paneer",category:"Protein",name:"पनीर",icon:"🧀",serving:"50 g पनीर",qtyLabel:"क्यूब्स",step:1,calories:132,protein:11,carbs:3.5,fat:9.8,fiber:0},
  {id:"egg",category:"Protein",name:"अंडे",icon:"🥚",serving:"१ medium अंडे",qtyLabel:"अंडे",step:1,calories:70,protein:6.3,carbs:0.4,fat:5,fiber:0},
  {id:"chicken",category:"Protein",name:"चिकन कुक",icon:"🍗",serving:"100 g grilled चिकन",qtyLabel:"पीस",step:0.5,calories:165,protein:31,carbs:0,fat:3.6,fiber:0},
  {id:"yogurt",category:"Protein",name:"दही",icon:"🥛",serving:"100 g plain दही",qtyLabel:"वाटा",step:0.5,calories:61,protein:3.5,carbs:4.7,fat:3.2,fiber:0},
  {id:"apple",category:"Fruit",name:"सफरचंद",icon:"🍎",serving:"१ medium apple",qtyLabel:"apple",step:1,calories:95,protein:0.5,carbs:25.1,fat:0.3,fiber:4.4},
  {id:"banana",category:"Fruit",name:"केळी",icon:"🍌",serving:"१ medium केळी",qtyLabel:"केळी",step:1,calories:105,protein:1.3,carbs:27,fat:0.4,fiber:3.1},
  {id:"orange",category:"Fruit",name:"संत्रे",icon:"🍊",serving:"१ medium संत्रा",qtyLabel:"संत्रा",step:1,calories:62,protein:1.2,carbs:15.4,fat:0.2,fiber:3.1},
  {id:"berries",category:"Fruit",name:"बेरीज",icon:"🫐",serving:"100 g बेरीज",qtyLabel:"वाटी",step:0.5,calories:57,protein:0.7,carbs:14.4,fat:0.3,fiber:2.4},
  {id:"spinach",category:"Vegetables",name:"पालक",icon:"🥬",serving:"100 g पालक",qtyLabel:"वाटी",step:0.5,calories:23,protein:2.9,carbs:3.6,fat:0.4,fiber:2.2},
  {id:"bhindi",category:"Vegetables",name:"भेंडी",icon:"🌿",serving:"100 g भेंडी",qtyLabel:"वाटी",step:0.5,calories:33,protein:1.9,carbs:7.5,fat:0.2,fiber:3.4},
  {id:"mixed-veg",category:"Vegetables",name:"मिक्स भाज्या",icon:"🥦",serving:"150 g भाज्या",qtyLabel:"वाटी",step:0.5,calories:60,protein:3,carbs:12,fat:0.3,fiber:4.5},
  {id:"salad",category:"Vegetables",name:"काच्ची सॅलड",icon:"🥗",serving:"200 g सॅलड",qtyLabel:"वाटी",step:0.5,calories:45,protein:2,carbs:9,fat:0.3,fiber:3.5},
  {id:"oil",category:"Oil",name:"स्वयंपाक तेल",icon:"🫒",serving:"5 g तेल",qtyLabel:"टीस्पून",step:1,calories:45,protein:0,carbs:0,fat:5,fiber:0}
];

let dietCategory="सर्व";
const dietSelections=JSON.parse(localStorage.getItem("tichyasathi-diet-selections")||"{}");
const dietCategories=["सर्व","Grains","Protein","Fruit","Vegetables","Oil"];

function renderDietCategories(){
  const container=document.getElementById("dietCategories");
  container.innerHTML="";
  dietCategories.forEach(category=>{
    const button=document.createElement("button");
    button.type="button";button.className=`diet-category${dietCategory===category?" active":""}`;button.textContent=category;
    button.addEventListener("click",()=>{dietCategory=category;renderDietCategories();renderFoods()});
    container.appendChild(button);
  });
}

function renderFoods(){
  const grid=document.getElementById("foodGrid");grid.innerHTML="";
  foods.filter(food=>dietCategory==="सर्व"||food.category===dietCategory).forEach(food=>{
    const quantity=dietSelections[food.id]||0;
    const card=document.createElement("article");
    card.className=`food-card${quantity>0?" selected":""}`;
    card.innerHTML=`<div class="food-top"><div><div class="food-name">${food.icon} ${food.name}</div><div class="food-serving">${food.serving}</div></div></div><div class="food-macro"><span>${food.calories} kcal</span><span>P ${food.protein}g</span><span>C ${food.carbs}g</span><span>F ${food.fat}g</span></div><div class="quantity-control"><button type="button" data-diet-minus="${food.id}" ${quantity<=0?"disabled":""}>−</button><b>${quantity}${quantity>0?" "+food.qtyLabel:""}</b><button type="button" data-diet-plus="${food.id}">+</button></div>`;
    grid.appendChild(card);
  });
  document.querySelectorAll("[data-diet-plus]").forEach(button=>button.addEventListener("click",()=>{
    const food=foods.find(item=>item.id===button.dataset.dietPlus);
    dietSelections[food.id]=(dietSelections[food.id]||0)+food.step;
    saveDiet();
  }));
  document.querySelectorAll("[data-diet-minus]").forEach(button=>button.addEventListener("click",()=>{
    const food=foods.find(item=>item.id===button.dataset.dietMinus);
    dietSelections[food.id]=Math.max(0,(dietSelections[food.id]||0)-food.step);
    if(dietSelections[food.id]===0)delete dietSelections[food.id];
    saveDiet();
  }));
}

function saveDiet(){localStorage.setItem("tichyasathi-diet-selections",JSON.stringify(dietSelections));renderFoods();updateDietTotals()}
function updateDietTotals(){
  const totals={calories:0,protein:0,carbs:0,fat:0,fiber:0};
  foods.forEach(food=>{const quantity=dietSelections[food.id]||0;if(!quantity)return;totals.calories+=food.calories*quantity;totals.protein+=food.protein*quantity;totals.carbs+=food.carbs*quantity;totals.fat+=food.fat*quantity;totals.fiber+=food.fiber*quantity});
  document.getElementById("totalCalories").textContent=Math.round(totals.calories);
  document.getElementById("totalProtein").textContent=totals.protein.toFixed(1);
  document.getElementById("totalCarbs").textContent=totals.carbs.toFixed(1);
  document.getElementById("totalFat").textContent=totals.fat.toFixed(1);
  document.getElementById("totalFiber").textContent=totals.fiber.toFixed(1);
  const calorieGoal=Number(document.getElementById("dietCalorieGoal").value||1800);
  document.getElementById("calorieGoal").textContent=`${calorieGoal} kcal`;
  document.getElementById("proteinGoal").textContent=`${Math.round(calorieGoal*0.16/4)} g`;
  document.getElementById("fiberGoal").textContent=`${totals.calories>0?Math.max(25,Math.round(calorieGoal/1000*14)):"25"} g`;
  const remaining=calorieGoal-totals.calories;
  document.getElementById("plateTip").textContent=remaining>150
    ?`आज अजून सुमारे ${Math.round(remaining)} kcal निवडता येतात; plate मध्ये भाज्या आणि protein जास्त ठेवा.`
    :remaining>=-150?"आजचा calorie estimate लक्ष्याजवळ आहे — ताजा भाज्या आणि भरपूर पाणी घ्या.":"Calorie estimate लक्ष्यापेक्षा जास्त आहे — starch आणि oil portion थोडे कमी करा.";
}

document.getElementById("dietReset").addEventListener("click",()=>{Object.keys(dietSelections).forEach(key=>delete dietSelections[key]);saveDiet()});
document.getElementById("dietCalorieGoal").addEventListener("input",()=>{localStorage.setItem("tichyasathi-diet-goal",document.getElementById("dietCalorieGoal").value);updateDietTotals()});
const savedGoal=localStorage.getItem("tichyasathi-diet-goal");if(savedGoal)document.getElementById("dietCalorieGoal").value=savedGoal;
renderDietCategories();renderFoods();updateDietTotals();

document.querySelectorAll(".specialist-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".specialist-tab").forEach(item=>item.classList.remove("active"));
    document.querySelectorAll(".specialist-panel").forEach(panel=>panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.specialistTab==="report"?"reportPanel":"questionsPanel").classList.add("active");
  });
});

const specialistChat=document.getElementById("specialistChat");
const specialistInput=document.getElementById("specialistInput");

function addSpecialistMessage(text,type="bot"){
  const message=document.createElement("div");
  message.className=`specialist-message ${type}`;
  message.textContent=text;
  specialistChat.appendChild(message);
  specialistChat.scrollTop=specialistChat.scrollHeight;
}

function specialistAnswer(question){
  const text=question.toLowerCase();
  if(/मासिक|पाळी|period|cycle/.test(text)){
    return "PCOD मध्ये हार्मोनचे संतुलन बदलल्याने पाळी उशिरा येणे, कमी येणे किंवा काही महिन्यांनी येणे शक्य आहे. अचानक होणारी रक्तस्रावाची मात्रा वाढणे, तीन महिने पाळी न येणे किंवा तीव्र वेदना असल्यास त्वरित gynecologist/doctorला भेटणे महत्त्वाचे आहे. छोट्या पायऱ्या: नियमित झोप, fiber आणि protein-rich नाश्ता, चालणे किंवा हलका व्यायाम, आणि फक्त डॉक्टर सांगितलेल्या medicine scheduleनुसार.";
  }
  if(/वजन|weight|obesity/.test(text)){
    return "वजन कमी करण्याचा प्रयत्न करताना अन्नापासून दूर राहू नकोस; नियमित वेळ, प्रोटीनयुक्त नाश्ता, भाज्यांचे मोठे प्रमाण, refined sugar कमी आणि हलकी रोजची चालणे/व्यायाम योग्य आहेत. शरीराचे वजन हळूहळू कमी झाल्यास हार्मोन संतुलित राहण्यास मदत होते.";
  }
  if(/पिंपल|चेहरा|केस|hair|acne/.test(text)){
    return "PCOD मध्ये काही हार्मोन्स वाढल्याने चेहऱ्यावरील acne किंवा unwanted hair वाढू शकते. चेहऱ्यावर गरम किंवा strong product वापरण्याआधी सौम्य cleanser वापर; केसांचा मुद्दा कायम राहिल्यास clinical कारण शोधून doctor योग्य treatment देऊ शकतो.";
  }
  if(/मूड|emotion|थकवा|fatigue|stress/.test(text)){
    return "मूड बदलणे किंवा थकवा हा PCOD शी जोडलेला भावनिक अनुभव असू शकतो. झोप, नियमित व्यायाम, ताण कमी करणारा ब्रेक आणि balancing meal मधून फरक दिसू शकतो. अचानक किंवा खूप तीव्र hopelessness, किंवा स्वधोक्यातील विचार असतील तर लगेच जवळच्या व्यक्तीस सांग आणि तातडीने professional मदत घ्या.";
  }
  if(/amh|lh|fsh|insulin|thyroid|ultrasound|usg|sonography|रिपोर्ट|report|prescription/.test(text)){
    return "रिपोर्टमध्ये AMH/USG/LH-FSH/thyroid हे फक्त एकाच आधारावर PCOD ठरत नाहीत. Age, पाळीचा pattern, clinical symptoms आणि doctorकडून केलेली परीक्षा या सर्वांवर निदान आधारले जाते. फोटो किंवा PDF अपलोड करा आणि report चा स्पष्ट तपशील डॉक्टराशी चर्चा करणे योग्य राहील.";
  }
  return "तुझी चिंता समजते. PCOD वेगवेगळ्या व्यक्तींमध्ये वेगळी लक्षणे दाखवू शकते; मासिक पाळी, वजन, acne, केस किंवा fatigue यांमध्ये कोणती लक्षणे कधीपासून आहेत ते मला थोडक्यात सांगा. कठीण वेदना, खूप रक्तस्राव, घशाला त्रास किंवा गर्भधारणेसंबंधी चिंता असली तर योग्य doctorla जाऊन भेट.";
}

document.getElementById("specialistForm").addEventListener("submit",event=>{
  event.preventDefault();
  const text=specialistInput.value.trim();
  if(!text)return;
  addSpecialistMessage(text,"user");
  specialistInput.value="";
  setTimeout(()=>addSpecialistMessage(specialistAnswer(text)),350);
});
document.querySelectorAll("[data-question]").forEach(button=>{
  button.addEventListener("click",()=>addSpecialistMessage(specialistAnswer(button.dataset.question)));
});

const reportUpload=document.getElementById("reportUpload");
const uploadPreviews=document.getElementById("uploadPreviews");
const reportAnalyze=document.getElementById("reportAnalyze");
const reportResult=document.getElementById("reportResult");
const uploadZone=document.getElementById("uploadZone");
const reportFiles=[];

reportUpload.addEventListener("change",()=>addReportFiles(reportUpload.files));
["dragenter","dragover"].forEach(type=>uploadZone.addEventListener(type,event=>{event.preventEvent?.();event.preventDefault();uploadZone.classList.add("dragging")}));
["dragleave","drop"].forEach(type=>uploadZone.addEventListener(type,event=>{event.preventEvent?.();event.preventDefault();uploadZone.classList.remove("dragging")}));
uploadZone.addEventListener("drop",event=>addReportFiles(event.dataTransfer.files));

function addReportFiles(files){
  Array.from(files).slice(0,5-reportFiles.length).forEach(file=>{
    if(!file.type.startsWith("image/")&&!file.type.includes("pdf"))return;
    reportFiles.push(file);
  });
  renderReportPreviews();
}
function renderReportPreviews(){
  uploadPreviews.innerHTML="";
  reportFiles.forEach((file,index)=>{
    const preview=document.createElement("div");preview.className="upload-preview";
    if(file.type.startsWith("image/")){
      const image=document.createElement("img");image.alt=file.name;
      const reader=new FileReader();reader.onload=()=>image.src=reader.result;reader.readAsDataURL(file);preview.appendChild(image);
    }else{
      const pdf=document.createElement("div");pdf.className="pdf-preview";pdf.textContent="PDF\nरिपोर्ट";preview.appendChild(pdf);
    }
    const remove=document.createElement("button");remove.type="button";remove.textContent="×";remove.addEventListener("click",()=>{reportFiles.splice(index,1);renderReportPreviews()});preview.appendChild(remove);
    uploadPreviews.appendChild(preview);
  });
  reportAnalyze.disabled=reportFiles.length===0;
}
reportAnalyze.addEventListener("click",()=>{
  reportAnalyze.disabled=true;
  reportAnalyze.textContent="निर्देश तयार होत आहेत…";
  setTimeout(()=>{
    reportResult.innerHTML=`<b>रिपोर्टची दिशा</b><br><br><b>१. Simple सारांश</b><br>उपलोड केलेल्या फाइलमधील numbers/medicines तुमच्या वैद्यकीय physician च्या संदर्भात समजणे आवश्यक आहे. हे app नोंदीचा फोटो/फाइल ओळखून full diagnostic value सांगू शकत नाही.<br><br><b>२. Key findings</b><br>USG/AMH/LH/FSH/thyroid मधील एकच result PCOD सिद्ध करत नाही. पाळीचा pattern आणि symptoms एकत्र तपासणे गरजेचे आहे.<br><br><b>३. Medicines</b><br>गोळी किंवा syrupचे नाव/डोस आधीचा सल्ला बदलू नका. लेबल, पुरवठा आणि timing डॉक्टराने लिहिल्याप्रमाणेच वापरा.<br><br><b>४. पुढील उपाय</b><br>नियमित झोप, balanced plate, रोजची हलकी चाल/व्यायाम आणि stress कमी करण्यासाठी छोट्या आदती.<br><br><b>सुरक्षा:</b> ही माहिती फाइल वाचण्याकरिता मार्गदर्शक आहे. नवीन औषध सुरू किंवा बंद करण्याआधी उपचार देणाऱ्या डॉक्टरांचा सल्ला नक्की घ्या.`;
    reportResult.classList.add("show");
    reportAnalyze.textContent="दिशा पुन्हा पहा";
    reportAnalyze.disabled=false;
  },700);
});
