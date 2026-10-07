window.MATCH_WEIGHTS={level:.25,interests:.25,themes:.25,readingStyle:.10,length:.05,mood:.10};
window.matchingEngine={
 scoreBook(book,profile){
  let score=0,max=0;
  max+=25;if(book.levels?.includes(profile.level))score+=25;
  const interests=profile.interests||[];max+=Math.max(1,interests.length)*10;for(const i of interests){if(book.interests?.includes(i))score+=10}
  const themes=profile.themes||[];max+=Math.max(1,themes.length)*10;for(const t of themes){if((book.themes?.[t]||0)>=3)score+=10}
  max+=10;if(profile.readingMotivation<=2&&book.readingSpeed>=4)score+=10;else if(profile.readingMotivation>=3)score+=8;
  max+=5;if(!profile.maxPages||book.pages<=profile.maxPages)score+=5;
  max+=10;if(profile.avoidTopics?.some(t=>book.sensitiveTopics?.includes(t)))score-=20;else score+=10;
  return Math.max(0,Math.min(100,Math.round((score/Math.max(max,1))*100)));
 },
 recommend(books,profile,limit=5){
  const ranked=books.filter(b=>b.available!==false).map(book=>({...book,matchScore:this.scoreBook(book,profile)})).sort((a,b)=>b.matchScore-a.matchScore);
  const result=[],usedAuthors=new Set();
  for(const book of ranked){if(usedAuthors.has(book.author)&&result.length<limit-1)continue;result.push(book);usedAuthors.add(book.author);if(result.length===limit)break}
  return result;
 }
};
