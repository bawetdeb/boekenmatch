(async function(){
 const app=document.getElementById('app');
 const books=await bookRepository.getBooks();
 app.innerHTML=`<div class="shell"><div class="card"><h1>BoekenMatch</h1><p>Codex-startproject voor de persoonlijke boekenkeuze-app van csg Bogerman.</p><p class="note">Er staan nu ${books.length} voorbeeldboeken in deze startversie. Lees eerst <strong>CODEX_INSTRUCTIONS.md</strong>.</p><button class="primary" id="demoButton">Test eenvoudige match</button><div id="demoResult"></div></div></div>`;
 document.getElementById('demoButton').addEventListener('click',()=>{
  const profile={level:'kader',readingMotivation:2,interests:['sport','vriendschap'],themes:['spanning'],maxPages:250,avoidTopics:[]};
  const matches=matchingEngine.recommend(books,profile,5);
  document.getElementById('demoResult').innerHTML='<h3>Demo top 5</h3><ol>'+matches.map(b=>`<li>${b.title} – ${b.author} (${b.matchScore}%)</li>`).join('')+'</ol>';
 });
})();
