/* EnemyData and EnemyIntent: same rules for normal, elite and boss. */
B.AreaData=[
 {name:'잊혀진 회랑',background:'Backgrounds/area01_forgotten_corridor.png',floor_y:370,normal:'ruin_gargoyle',elite:'gale_warden',boss:'fallen_colossus',legacy:'moss_slime'},
 {name:'침잠의 수맥',background:'Backgrounds/area02_submerged_waterway.png',floor_y:292,normal:'venom_eel',elite:'frost_seer',boss:'abyssal_leviathan',legacy:'crystal_crawler'},
 {name:'소멸의 화로',background:'Backgrounds/area03_annihilation_furnace.png',floor_y:397,normal:'ember_gremlin',elite:'coil_golem',boss:'foundry_tyrant',legacy:'furnace_sentinel'}
];
const enemyNames={ruin_gargoyle:'폐허 가고일',gale_warden:'질풍 파수꾼',fallen_colossus:'몰락한 거신',venom_eel:'맹독 장어',frost_seer:'서리 예언자',abyssal_leviathan:'심연의 레비아탄',ember_gremlin:'불씨 그렘린',coil_golem:'코일 골렘',foundry_tyrant:'주조소 폭군',moss_slime:'이끼 슬라임',crystal_crawler:'수정 갑각충',furnace_sentinel:'화로 파수병'};
B.Enemies=Object.fromEntries(BRODUN_ADDON_ASSETS.assets.filter(a=>a.frames).map(a=>[a.id,{id:a.id,name:enemyNames[a.id],rank:a.rank,area_index:Number(a.area.slice(-2)),asset_id:a.id,display_height:{normal:180,elite:205,boss:230}[a.rank]}]));
for(const [i,area]of B.AreaData.entries())B.Enemies[area.legacy]={id:area.legacy,name:enemyNames[area.legacy],rank:'normal',area_index:i+1,asset_id:area.legacy,display_height:170};
B.EventKinds={shop:{name:'상점',background:'EventRooms/shop.png',icon:'UI/event_shop.png'},altar:{name:'제단',background:'EventRooms/altar.png',icon:'UI/event_altar.png'},rest_site:{name:'휴식처',background:'EventRooms/rest_site.png',icon:'UI/event_rest.png'}};
B.MapArt={states:{normal:'UI/map_choice_normal.png',hover:'UI/map_choice_hover.png',selected:'UI/map_choice_selected.png',locked:'UI/map_choice_locked.png'},icons:{battle:'UI/icon_battle.png',puzzle:'UI/icon_puzzle.png',event:'UI/icon_event.png',boss:'UI/icon_boss.png',gold:'UI/icon_gold.png'}};
B.IntentPresentation={attack:{label:'공격',icon:'UI/icon_battle.png'},block:{label:'방어',icon:'Frames/ui_icons/defense.png'},buff:{label:'힘 증가',symbol:'↑'}};
B.Enemy={
 definition(run,room){const area=B.AreaData[run.area_index-1],rank=room.room_type==='boss'?'boss':room.encounter_type||'normal';return B.Enemies[rank==='normal'&&room.id==='r8'?area.legacy:area[rank]];},
 create(def,room){const tuning=B.EnemyTuning[def.rank],hp=tuning.hp+(def.area_index-1)*tuning.area_hp_step+(def.rank==='boss'?0:(room.floor_index-1)*B.Config.normal_hp_step);return {definition_id:def.id,hp,max_hp:hp,block:0,strength:0,poison:0,weak:0,element:null,pattern_index:0,intent:null};},
 decide(b){const rank=B.Enemies[b.enemy.definition_id].rank,patterns=B.EnemyTuning[rank].patterns;b.enemy.intent={...patterns[b.enemy.pattern_index%patterns.length],pattern_index:b.enemy.pattern_index};return b.enemy.intent;},
 preview(b){const intent=b.enemy.intent;if(!intent)return null;return {...intent,amount:intent.type==='attack'?Math.max(0,intent.amount+b.enemy.strength-(b.enemy.weak?B.Config.weak_reduction:0)):intent.amount,hits:intent.hits||1};},
 describe(intent,block=0){if(intent.type==='attack'){const total=intent.amount*intent.hits;return `다음 행동: ${intent.amount} 피해${intent.hits>1?' × '+intent.hits+'회':''} (방어 전). 현재 방어도 ${block} 기준 예상 HP 피해 ${Math.max(0,total-block)}.`;}if(intent.type==='block')return `다음 행동: 적 방어도 ${intent.amount} 획득.`;return `다음 행동: 적 힘 +${intent.amount}. 이후 공격의 각 타격이 강해집니다.`;},
 execute(run,b,snapshot){const e=b.enemy,intent=snapshot||this.preview(b);e.block=0;let blocked=0,damage=0;if(intent.type==='attack'){for(let i=0;i<intent.hits;i++){const absorb=Math.min(b.block,intent.amount);b.block-=absorb;blocked+=absorb;const hit=Math.min(run.player.hp,intent.amount-absorb);run.player.hp-=hit;damage+=hit;}}else if(intent.type==='block')e.block=intent.amount;else if(intent.type==='buff')e.strength+=intent.amount;else throw Error('Unknown intent');if(e.weak)e.weak--;e.pattern_index++;b.last_enemy_action={...intent,blocked,hp_damage:damage};return b.last_enemy_action;}
};
