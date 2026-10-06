/* Deterministic combat tempo comparison, not a claim of final player balance. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function load(before=false){const s={Date,Math,console};s.window=s;vm.createContext(s);const files=before?['js/cards.js','js/run-state.js','js/dungeon.js','js/deck.js','js/reward.js','js/battle.js']:['addon-manifest.js','js/balance.js','js/cards.js','js/run-state.js','js/dungeon.js','js/deck.js','js/reward.js','js/enemies.js','js/battle.js'];for(const file of files)vm.runInContext(before?cp.execFileSync('git',['show','d3238f0:'+file],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,file),'utf8'),s);return s.B;}
function simulate(B,hero,seed,{before=false,rank='normal',growth=false,policy='defensive'}={}){
 const r=B.Run.create(hero,seed);if(growth)B.Run.addCard(r,'earth_crush');const room=B.Dungeon.enter(r,'r1');room.encounter_type=rank;if(rank==='boss')room.room_type='boss';const b=B.Battle.begin(r,room);let plays=0,rounds=1;
 while(rounds<=30&&r.player.hp>0&&b.enemy.hp>0){for(let step=0;step<15&&b.enemy.hp>0;step++){
   const choices=b.piles.hand.map(i=>({i,c:B.CardById[i.card_id]})).filter(x=>x.c.cost<=b.energy);if(!choices.length)break;
   const forecast=before?b.enemy.attack:B.Enemy.preview(b).type==='attack'?B.Enemy.preview(b).amount*B.Enemy.preview(b).hits:0;
   let picked=choices.find(x=>x.c.cost===0);
   if(!picked&&policy==='defensive'&&b.block<forecast)picked=choices.find(x=>x.c.effects.some(e=>e.type==='block'));
   if(!picked&&policy==='defensive'&&r.player.max_hp-r.player.hp>=3)picked=choices.find(x=>x.c.effects.some(e=>e.type==='heal'));
   if(!picked)picked=choices.filter(x=>x.c.effects.some(e=>e.type==='damage')).sort((a,z)=>z.c.effects.filter(e=>e.type==='damage').reduce((n,e)=>n+e.amount*(e.hits||1),0)/Math.max(1,z.c.cost)-a.c.effects.filter(e=>e.type==='damage').reduce((n,e)=>n+e.amount*(e.hits||1),0)/Math.max(1,a.c.cost))[0];
   if(!picked)picked=choices[0];b.energy-=picked.c.cost;B.Deck.use(b.piles,picked.i.instance_id);B.Battle.resolveCard(r,b,picked.c);plays++;
  }
  if(b.enemy.hp<=0)break;B.Deck.endTurn(b.piles);B.Battle.poisonTick(b);if(b.enemy.hp<=0)break;if(before)B.Battle.enemyHit(r,b);else B.Enemy.execute(r,b,B.Enemy.preview(b));if(r.player.hp<=0)break;b.block=0;b.energy=B.Config.max_cost;B.Deck.nextTurn(b.piles);rounds++;if(!before)B.Enemy.decide(b);
 }
 return {win:b.enemy.hp<=0,turns:rounds,cards:plays,hp_lost:r.player.max_hp-r.player.hp};
}
const before=load(true),after=load(),results=[];
for(const hero of Object.keys(after.Heroes))for(const rank of ['normal','elite','boss'])for(const growth of [false,true]){
 let turns=0,cards=0,hp=0,wins=0;for(let seed=0;seed<200;seed++){const r=simulate(after,hero,seed,{rank,growth});turns+=r.turns;cards+=r.cards;hp+=r.hp_lost;wins+=Number(r.win);}
 results.push({version:'after',hero,rank,growth,seeds:200,win_rate:wins/200,mean_turns:turns/200,cards_per_turn:cards/turns,mean_hp_lost:hp/200});
}
for(const hero of Object.keys(before.Heroes)){let turns=0,cards=0;for(let seed=0;seed<200;seed++){const r=simulate(before,hero,seed,{before:true,policy:'aggressive'});turns+=r.turns;cards+=r.cards;}results.push({version:'before',hero,rank:'normal',mean_turns:turns/200,cards_per_turn:cards/turns});}
console.table(results);
for(const hero of Object.keys(after.Heroes)){const base=results.find(r=>r.version==='after'&&r.hero===hero&&r.rank==='normal'&&!r.growth),grown=results.find(r=>r.version==='after'&&r.hero===hero&&r.rank==='normal'&&r.growth);assert(base.win_rate===1,'Starter can finish normal '+hero);assert(base.mean_turns>=3&&base.mean_turns<=6,'Normal tempo '+hero);assert(grown.mean_turns<base.mean_turns,'Strong card helps '+hero);}
const first=after.Battle.begin(after.Run.create('warrior',1),{id:'r1',column:1,floor_index:1,room_type:'battle'});assert((after.CardById.earth_strike.effects[0].amount+after.CardById.wind_cut.effects[0].amount)/first.enemy.hp<1/3);
console.log(JSON.stringify({status:'PASS',policy:'zero-cost → defense against intent → heal when missing >=3 → damage/energy',results},null,2));
module.exports={load,simulate};
