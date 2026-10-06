/* DataRepository: plain definitions map directly to CardDefinition/ScriptableObject. */
window.B=window.B||{};
B.Elements={earth:'땅',stone:'바위',wind:'바람',water:'물',ice:'얼음',poison:'독',fire:'불',lightning:'번개',explosion:'폭발'};
B.describeEffects=effects=>effects.map(e=>{
 switch(e.type){
 case 'damage':return '피해 '+e.amount+(e.hits?' × '+e.hits+'회(타격마다 힘 적용)':'');
 case 'conditional_damage':return (e.condition==='block'?'방어도 보유':e.condition==='poison'?'적이 독 상태':'적의 직전 속성이 '+B.Elements[e.condition])+' 시 추가 피해 '+e.amount;
 case 'block':return '방어도 '+e.amount;
 case 'heal':return 'HP '+e.amount+' 회복';
 case 'draw':return e.amount+'장 드로우';
 case 'poison':return '독 '+e.amount+'(적 턴 피해 후 1 감소)';
 case 'weak':return '약화 '+e.amount+'턴(공격 -'+B.Config.weak_reduction+')';
 case 'strength':return '이번 전투 힘 +'+e.amount;
 case 'energy':return '행동력 +'+e.amount+'(최대 '+B.Config.energy_cap+')';
 case 'exhaust':return '이번 전투에서 소멸';
 default:throw Error('Unknown effect '+e.type);
 }
}).join('. ')+'.';
const card=(id,name,cost,element,effects)=>({id,name,cost,element,effects,description:B.describeEffects(effects)});
B.Cards=[
 card('earth_strike','지반 강타',1,'earth',[{"type":"damage","amount":5}]),
 card('stone_guard','바위 방벽',1,'stone',[{"type":"block","amount":5}]),
 card('wind_cut','돌풍 베기',1,'wind',[{"type":"damage","amount":4}]),
 card('fire_bolt','화염탄',1,'fire',[{"type":"damage","amount":5}]),
 card('ice_guard','빙결 장막',1,'ice',[{"type":"block","amount":5}]),
 card('lightning_strike','낙뢰',1,'lightning',[{"type":"damage","amount":5}]),
 card('water_wave','정화의 파동',1,'water',[{"type":"damage","amount":4},{"type":"heal","amount":1}]),
 card('earth_blessing','대지의 가호',1,'earth',[{"type":"block","amount":5}]),
 card('wind_judgment','심판의 바람',1,'wind',[{"type":"damage","amount":5}]),
 card('earth_crush','대지 분쇄',2,'earth',[{"type":"damage","amount":13}]),
 card('stone_retaliation','반석의 반격',1,'stone',[{"type":"damage","amount":4},{"type":"conditional_damage","condition":"block","amount":5}]),
 card('wind_read','바람 읽기',0,'wind',[{type:'draw',amount:1},{type:'exhaust'}]),
 card('water_stream','수맥의 흐름',1,'water',[{"type":"damage","amount":3},{"type":"draw","amount":1}]),
 card('water_rest','치유의 물결',0,'water',[{"type":"heal","amount":3},{"type":"block","amount":2},{"type":"exhaust"}]),
 card('ice_shard','얼음 파편',1,'ice',[{"type":"damage","amount":5},{"type":"weak","amount":2}]),
 card('ice_link','빙결 연계',1,'ice',[{"type":"damage","amount":4},{"type":"conditional_damage","condition":"water","amount":7}]),
 card('poison_touch','독의 손길',1,'poison',[{"type":"damage","amount":2},{"type":"poison","amount":3}]),
 card('poison_sting','맹독 찌르기',1,'poison',[{"type":"damage","amount":5},{"type":"conditional_damage","condition":"poison","amount":5}]),
 card('poison_mist','독안개',1,'poison',[{type:'poison',amount:3},{type:'weak',amount:1}]),
 card('fire_inferno','열화 폭격',2,'fire',[{"type":"damage","amount":14}]),
 card('fire_strength','화로의 힘',1,'fire',[{type:'strength',amount:2},{type:'block',amount:3}]),
 card('lightning_chain','연쇄 번개',1,'lightning',[{type:'damage',amount:3,hits:2}]),
 card('lightning_charge','전하 축적',0,'lightning',[{type:'energy',amount:1},{type:'exhaust'}]),
 card('explosion_blast','폭발 일격',2,'explosion',[{"type":"damage","amount":15}]),
 card('explosion_link','점화 연계',1,'explosion',[{"type":"damage","amount":5},{"type":"conditional_damage","condition":"fire","amount":8}]),
 card('explosion_barrier','충격 방벽',1,'explosion',[{"type":"block","amount":7},{"type":"damage","amount":2}]),
 card('stone_fortress','돌의 요새',2,'stone',[{"type":"block","amount":12}])
];
B.CardById=Object.fromEntries(B.Cards.map(c=>[c.id,c]));
B.Heroes={
 warrior:{name:'전사',desc:'땅·바위·바람 / 검과 방패',starter:['earth_strike','stone_guard','wind_cut','wind_read']},
 mage:{name:'마법사',desc:'불·얼음·번개 / 원소술',starter:['fire_bolt','ice_guard','lightning_strike','lightning_charge']},
 priest:{name:'사제',desc:'물·땅·바람 / 회복과 지원',starter:['water_wave','earth_blessing','wind_judgment','water_rest']}
};
