/* BattleState is temporary; HP, currency and permanent deck live in RunState. */
B.Battle={
 begin(run,room){const boss=room.room_type==='boss',hp=boss?B.Config.boss_hp:B.Config.normal_hp+room.column*2;return {room_id:room.id,sprite:boss?'furnace_sentinel':'moss_slime',name:boss?'보스 · 용광로 파수꾼':'이끼 슬라임',enemy:{hp,max_hp:hp,attack:boss?B.Config.boss_attack:B.Config.enemy_attack,poison:0,weak:0,element:null},block:0,strength:0,energy:B.Config.max_cost,turn:1,piles:B.Deck.begin(run,room),busy:false,status:'active',log:['카드를 선택해 공격하거나 방어하세요.']};},
 log(b,message){b.log.push(message);if(b.log.length>8)b.log.shift();},
 resolveCard(run,b,def){const previous=b.enemy.element;let damage=0;const hit=amount=>{const value=Math.min(b.enemy.hp,Math.max(0,amount));b.enemy.hp-=value;damage+=value;};
  for(const e of def.effects){switch(e.type){
   case 'damage':for(let i=0;i<(e.hits||1);i++)hit(e.amount+b.strength);break;
   case 'conditional_damage':{const yes=e.condition==='block'?b.block>0:e.condition==='poison'?b.enemy.poison>0:previous===e.condition;if(yes){hit(e.amount);this.log(b,'연계 발동 · '+def.name+' +'+e.amount+' 피해');}break;}
   case 'block':b.block+=e.amount;break;
   case 'heal':B.Run.heal(run,e.amount);break;
   case 'draw':B.Deck.draw(b.piles,e.amount);break;
   case 'poison':b.enemy.poison+=e.amount;break;
   case 'weak':b.enemy.weak=Math.max(b.enemy.weak,e.amount);break;
   case 'strength':b.strength+=e.amount;break;
   case 'energy':b.energy=Math.min(6,b.energy+e.amount);break;
   case 'exhaust':break; // DeckManager already moved this instance to exhaust.
   default:throw Error('Unsupported card effect: '+e.type);
  }}
  // Only offensive/status cards tag the enemy. Buffs cannot replace a target's tag.
  if(def.effects.some(e=>['damage','poison','weak'].includes(e.type)))b.enemy.element=def.element;
  this.log(b,def.name+' · '+(damage?'피해 '+damage+' / ':'')+def.description);return damage;
 },
 poisonTick(b){const damage=Math.min(b.enemy.hp,b.enemy.poison);b.enemy.hp-=damage;if(b.enemy.poison)b.enemy.poison--;if(damage)this.log(b,'독 피해 '+damage);return damage;},
 enemyHit(run,b){const attack=Math.max(0,b.enemy.attack-(b.enemy.weak?3:0));const blocked=Math.min(b.block,attack),damage=attack-blocked;b.block-=blocked;run.player.hp=Math.max(0,run.player.hp-damage);if(b.enemy.weak)b.enemy.weak--;this.log(b,'적 공격 '+attack+' · 방어 '+blocked+' / HP 피해 '+damage);return damage;},
 play(instance_id){const f=B.Flow,b=f.battle,r=f.run;if(f.screen!=='battle'||!b||b.busy||b.status!=='active')return false;const instance=b.piles.hand.find(c=>c.instance_id===instance_id);if(!instance)return false;const def=B.CardById[instance.card_id];if(b.energy<def.cost)return false;
  b.busy=true;b.energy-=def.cost;B.Deck.use(b.piles,instance_id);B.Art.setMotion('hero',def.effects.some(e=>e.type==='damage')?'attack':'idle');B.Art.playEffect(def.element,def.effects.some(e=>e.type==='damage')?'attack':'guard');B.UI.renderBattle();
  f.later(330,()=>{const damage=this.resolveCard(r,b,def);B.UI.renderBattle();if(damage){B.Art.setMotion('enemy','hurt');B.UI.pop('-'+damage,'enemy');}});
  f.later(800,()=>{B.Art.clear();if(b.enemy.hp<=0){this.win();return;}b.busy=false;B.UI.renderBattle();});return true;
 },
 endTurn(){const f=B.Flow,b=f.battle,r=f.run;if(f.screen!=='battle'||!b||b.busy||b.status!=='active')return false;b.busy=true;B.Deck.endTurn(b.piles);const poison=this.poisonTick(b);B.UI.renderBattle();if(poison)B.UI.pop('-'+poison,'enemy');if(b.enemy.hp<=0){this.win();return true;}
  B.Art.setMotion('enemy','attack');f.later(400,()=>{const damage=this.enemyHit(r,b);B.Art.setMotion('hero',damage?'hurt':'idle');B.UI.renderBattle();B.UI.pop(damage?'-'+damage:'방어','hero');});
  f.later(900,()=>{if(r.player.hp<=0){b.status='lost';r.status='failed';B.Art.setMotion('hero','death');f.show('defeat');return;}b.block=0;b.energy=B.Config.max_cost;b.turn++;B.Deck.nextTurn(b.piles);b.busy=false;B.Art.clear();B.UI.renderBattle();});return true;
 },
 win(){const f=B.Flow,b=f.battle;if(!b||b.status!=='active')return;b.status='won';b.busy=true;B.Art.setMotion('enemy','death');B.UI.renderBattle();f.reward=B.Reward.create(f.run);f.later(650,()=>f.show('reward'));}
};
