/* All screen transitions go through GameFlow; epoch invalidates old battle timers. */
B.Flow={screen:'title',run:null,battle:null,reward:null,epoch:0,selected:'warrior',seed:Math.floor(Math.random()*1000000),feedback:null,
 show(screen){if(screen==='map'&&this.run?.active_room_id)return false;if(this.screen==='reward'&&screen!=='reward'&&!['select','title'].includes(screen)&&!this.reward?.resolved)return false;this.epoch++;this.screen=screen;B.UI.render();return true;},
 later(ms,action){const epoch=this.epoch;setTimeout(()=>{if(this.epoch===epoch)action();},ms);},
 start(character,seed){this.run=B.Run.create(character,seed);this.battle=null;this.reward=null;this.feedback=null;B.Art.clear();this.show('map');},
 newRun(){document.getElementById('deckDialog').close();this.run=null;this.battle=null;this.reward=null;this.feedback=null;B.Art.clear();this.show('select');},
 enter(id){if(this.screen!=='map')return false;const room=B.Dungeon.enter(this.run,id);if(!room)return false;this.reward=null;this.battle=null;B.Art.clear();if(['battle','boss'].includes(room.room_type)){this.battle=B.Battle.begin(this.run,room);this.show('battle');}else this.show(room.room_type);return true;},
 resolveReward(kind,id){if(this.screen!=='reward'||!B.Reward.resolve(this.run,this.reward,kind,id))return false;this.feedback=kind==='gold'?'+'+this.reward.gold+' Gold':kind==='card'?'카드 획득 · '+B.CardById[id].name:'보상을 건너뛰었습니다.';B.UI.hud();this.show(this.run.status==='complete'?'complete':'map');return true;},
 finishPuzzle(){if(this.screen!=='puzzle'||!this.run.active_room_id)return false;this.reward=B.Reward.create(this.run);this.show('reward');return true;},
 finishRoom(message){if(!['puzzle','event'].includes(this.screen)||!this.run?.active_room_id)return false;this.run.room_results[this.run.active_room_id]={content:this.screen};B.Dungeon.complete(this.run);this.feedback=message;this.show('map');return true;},
 eventChoice(kind){if(this.screen!=='event'||!this.run.active_room_id)return false;if(kind==='heal')B.Run.heal(this.run,8);else if(kind==='gold')B.Run.addGold(this.run,15);else return false;this.finishRoom(kind==='heal'?'HP +8 (최대 HP까지)':'+15 Gold');return true;}
};
document.getElementById('newRun').onclick=()=>B.Flow.newRun();
document.getElementById('deckBtn').onclick=()=>B.UI.deck();
document.getElementById('galleryBtn').onclick=()=>{if(B.Flow.screen==='gallery')B.Flow.show(B.Flow.galleryReturn||'title');else{B.Flow.galleryReturn=B.Flow.screen;B.Flow.show('gallery');}};
document.getElementById('record').onclick=()=>document.body.classList.toggle('recording');
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.body.classList.remove('recording');if(event.key.toLowerCase()==='f'&&!['INPUT','TEXTAREA'].includes(event.target.tagName)&&!document.getElementById('deckDialog').open)document.body.classList.toggle('recording');});
B.UI.render();
