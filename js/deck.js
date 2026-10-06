/* Instances move exactly once between draw, hand, discard and exhaust. */
B.Deck={
 begin(run,room){const rng=B.Rng(run.seed+run.completed_room_ids.length*211+room.column);const piles={draw:B.Shuffle(run.deck,rng),hand:[],discard:[],exhaust:[],rng};this.draw(piles,B.Config.hand_size);return piles;},
 draw(piles,count){for(let i=0;i<count;i++){if(!piles.draw.length&&piles.discard.length){piles.draw=B.Shuffle(piles.discard,piles.rng);piles.discard=[];}if(!piles.draw.length)break;piles.hand.push(piles.draw.shift());}},
 use(piles,instance_id){const i=piles.hand.findIndex(c=>c.instance_id===instance_id);if(i<0)return null;const instance=piles.hand.splice(i,1)[0],def=B.CardById[instance.card_id];piles[def.effects.some(e=>e.type==='exhaust')?'exhaust':'discard'].push(instance);return def;},
 endTurn(piles){piles.discard.push(...piles.hand);piles.hand=[];},
 nextTurn(piles){this.draw(piles,B.Config.hand_size);}
};
