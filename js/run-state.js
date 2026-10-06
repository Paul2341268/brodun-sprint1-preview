/* Run lifetime only. Battle creates temporary piles, never resets player/deck. */
B.Rng=function(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};};
B.Shuffle=function(items,rng){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
B.Run={
 create(character_id,seed){return {schema_version:1,run_id:'run-'+Date.now(),seed,status:'in_progress',character_id,area_index:1,floor_index:1,player:{hp:B.Config.max_hp,max_hp:B.Config.max_hp,gold:0},deck:B.Heroes[character_id].starter.map((id,i)=>({instance_id:'card-'+i,card_id:id,upgrade_level:0})),next_card_serial:4,acquired_cards:[],current_room_id:'start',completed_room_ids:[],resolved_reward_ids:[],active_room_id:null,map:B.Dungeon.generate(seed),room_results:{}};},
 addCard(run,id){if(!B.CardById[id])throw Error('Unknown card '+id);const instance={instance_id:'card-'+run.next_card_serial++,card_id:id,upgrade_level:0};run.deck.push(instance);run.acquired_cards.push(instance.instance_id);return instance;},
 addGold(run,amount){if(!Number.isInteger(amount)||amount<0)throw Error('Invalid gold');run.player.gold+=amount;},
 spendGold(run,amount){if(!Number.isInteger(amount)||amount<0||run.player.gold<amount)return false;run.player.gold-=amount;return true;},
 heal(run,amount){run.player.hp=Math.min(run.player.max_hp,run.player.hp+amount);}
};
