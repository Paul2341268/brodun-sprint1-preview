/* BattleState is temporary; HP, currency and permanent deck live in RunState. */
B.Battle={
 begin(run,room){const def=B.Enemy.definition(run,room),b={room_id:room.id,sprite:def.asset_id,name:def.name,rank:def.rank,enemy:B.Enemy.create(def,room),block:0,strength:0,energy:B.Config.max_cost,max_energy:B.Config.max_cost,phase:'player',turn:1,piles:B.Deck.begin(run,room),busy:false,status:'active',log:['적의 예고를 확인하고 공격/방어를 선택하세요.']};B.Enemy.decide(b);return b;},
 log(b,message){b.log.push(message);if(b.log.length>8)b.log.shift();},
 resolveCard(run,b,def){const previous=b.enemy.element;let damage=0,blocked=0;const hit=amount=>{const raw=Math.max(0,amount),absorb=Math.min(b.enemy.block,raw);b.enemy.block-=absorb;blocked+=absorb;const value=Math.min(b.enemy.hp,raw-absorb);b.enemy.hp-=value;damage+=value;};
  for(const e of def.effects){switch(e.type){
   case 'damage':for(let i=0;i<(e.hits||1);i++)hit(e.amount+b.strength);break;
   case 'conditional_damage':{const yes=e.condition==='block'?b.block>0:e.condition==='poison'?b.enemy.poison>0:previous===e.condition;if(yes){hit(e.amount);this.log(b,'연계 발동 · '+def.name+' +'+e.amount+' 피해');}break;}
   case 'block':b.block+=e.amount;break;
   case 'heal':B.Run.heal(run,e.amount);break;
   case 'draw':B.Deck.draw(b.piles,e.amount);break;
   case 'poison':b.enemy.poison+=e.amount;break;
   case 'weak':b.enemy.weak=Math.max(b.enemy.weak,e.amount);break;
   case 'strength':b.strength+=e.amount;break;
   case 'energy':b.energy=Math.min(B.Config.energy_cap,b.energy+e.amount);break;
   case 'exhaust':break; // DeckManager already moved this instance to exhaust.
   default:throw Error('Unsupported card effect: '+e.type);
  }}
  // Only offensive/status cards tag the enemy. Buffs cannot replace a target's tag.
  if(def.effects.some(e=>['damage','poison','weak'].includes(e.type)))b.enemy.element=def.element;
  b.last_card_result={card_id:def.id,damage,blocked};this.log(b,def.name+' · HP 피해 '+damage+(blocked?' / 적 방어 '+blocked:'')+' · '+def.description);return damage;
 },
 poisonTick(b){const damage=Math.min(b.enemy.hp,b.enemy.poison);b.enemy.hp-=damage;if(b.enemy.poison)b.enemy.poison--;if(damage)this.log(b,'독 피해 '+damage);return damage;},
 enemyHit(run,b){const result=B.Enemy.execute(run,b,b.executing_intent);this.log(b,result.type==='attack'?`예고 공격 ${result.amount} × ${result.hits} · 방어 ${result.blocked} / HP 피해 ${result.hp_damage}`:result.type==='block'?`적 방어도 +${result.amount}`:`적 힘 +${result.amount}`);return result.hp_damage;},
 play(instance_id){const f=B.Flow,b=f.battle,r=f.run;if(f.screen!=='battle'||!b||b.busy||b.status!=='active')return false;const instance=b.piles.hand.find(c=>c.instance_id===instance_id);if(!instance)return false;const def=B.CardById[instance.card_id];if(b.energy<def.cost)return false;
  b.busy=true;b.energy-=def.cost;B.Deck.use(b.piles,instance_id);B.Art.setMotion('hero',def.effects.some(e=>e.type==='damage')?'attack':'idle');B.Art.playEffect(def.element,def.effects.some(e=>e.type==='damage')?'attack':'guard');B.UI.renderBattle();
  f.later(B.Config.animation.card_impact_ms,()=>{const damage=this.resolveCard(r,b,def);B.UI.renderBattle();if(damage){B.Art.setMotion('enemy','hurt');B.UI.pop('-'+damage,'enemy');}else if(b.last_card_result.blocked)B.UI.pop('방어 '+b.last_card_result.blocked,'enemy');});
  f.later(B.Config.animation.card_end_ms,()=>{B.Art.clear();if(b.enemy.hp<=0){this.win();return;}b.busy=false;B.UI.renderBattle();});return true;
 },
 endTurn(){const f=B.Flow,b=f.battle,r=f.run;if(f.screen!=='battle'||!b||b.busy||b.status!=='active')return false;b.busy=true;b.phase='enemy';b.executing_intent=B.Enemy.preview(b);b.executing_block=b.block;B.Deck.endTurn(b.piles);const poison=this.poisonTick(b);B.UI.renderBattle();if(poison)B.UI.pop('-'+poison,'enemy');if(b.enemy.hp<=0){this.win();return true;}
  B.Art.setMotion('enemy',b.executing_intent.type==='attack'?'attack':'idle');f.later(B.Config.animation.enemy_impact_ms,()=>{const damage=this.enemyHit(r,b);B.Art.setMotion('hero',damage?'hurt':'idle');B.UI.renderBattle();if(b.executing_intent.type==='attack')B.UI.pop(damage?'-'+damage:'방어','hero');else B.UI.pop((b.executing_intent.type==='block'?'방어 +':'힘 +')+b.executing_intent.amount,'enemy');});
  f.later(B.Config.animation.enemy_end_ms,()=>{if(r.player.hp<=0){b.status='lost';r.status='failed';B.Art.setMotion('hero','death');f.show('defeat');return;}b.block=0;b.energy=b.max_energy;b.turn++;B.Deck.nextTurn(b.piles);b.busy=false;b.phase='player';b.executing_intent=null;B.Enemy.decide(b);B.Art.clear();B.UI.renderBattle();});return true;
 },
 win(){const f=B.Flow,b=f.battle;if(!b||b.status!=='active')return;b.status='won';b.busy=true;B.Art.setMotion('enemy','death');B.UI.renderBattle();f.reward=B.Reward.create(f.run);f.later(B.Config.animation.victory_ms,()=>f.show('reward'));}
};
