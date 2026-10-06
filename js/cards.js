/* DataRepository: plain definitions map directly to CardDefinition/ScriptableObject. */
window.B={};
B.Config={max_hp:40,max_cost:3,hand_size:4,gold_reward:50,normal_hp:24,boss_hp:44,enemy_attack:5,boss_attack:7};
B.Elements={earth:'땅',stone:'바위',wind:'바람',water:'물',ice:'얼음',poison:'독',fire:'불',lightning:'번개',explosion:'폭발'};
const card=(id,name,cost,element,description,effects)=>({id,name,cost,element,description,effects});
B.Cards=[
 card('earth_strike','지반 강타',1,'earth','피해 8.',[{type:'damage',amount:8}]),
 card('stone_guard','바위 방벽',1,'stone','방어도 6.',[{type:'block',amount:6}]),
 card('wind_cut','돌풍 베기',1,'wind','피해 7.',[{type:'damage',amount:7}]),
 card('fire_bolt','화염탄',1,'fire','피해 8.',[{type:'damage',amount:8}]),
 card('ice_guard','빙결 장막',1,'ice','방어도 6.',[{type:'block',amount:6}]),
 card('lightning_strike','낙뢰',1,'lightning','피해 7.',[{type:'damage',amount:7}]),
 card('water_wave','정화의 파동',1,'water','피해 7. HP 2 회복.',[{type:'damage',amount:7},{type:'heal',amount:2}]),
 card('earth_blessing','대지의 가호',1,'earth','방어도 6.',[{type:'block',amount:6}]),
 card('wind_judgment','심판의 바람',1,'wind','피해 8.',[{type:'damage',amount:8}]),
 card('earth_crush','대지 분쇄',2,'earth','피해 16.',[{type:'damage',amount:16}]),
 card('stone_retaliation','반석의 반격',1,'stone','피해 5. 방어도가 있으면 추가 피해 5.',[{type:'damage',amount:5},{type:'conditional_damage',condition:'block',amount:5}]),
 card('wind_read','바람 읽기',0,'wind','카드 1장 드로우. 사용 후 이번 전투에서 소멸.',[{type:'draw',amount:1},{type:'exhaust'}]),
 card('water_stream','수맥의 흐름',1,'water','피해 4. 카드 1장 드로우.',[{type:'damage',amount:4},{type:'draw',amount:1}]),
 card('water_rest','치유의 물결',1,'water','HP 5 회복. 방어도 3.',[{type:'heal',amount:5},{type:'block',amount:3}]),
 card('ice_shard','얼음 파편',1,'ice','피해 6. 적 약화 2턴(공격 -3).',[{type:'damage',amount:6},{type:'weak',amount:2}]),
 card('ice_link','빙결 연계',1,'ice','피해 5. 적의 직전 속성이 물이면 추가 피해 7.',[{type:'damage',amount:5},{type:'conditional_damage',condition:'water',amount:7}]),
 card('poison_touch','독의 손길',1,'poison','피해 3. 독 4(적 턴 시작 시 피해, 이후 1 감소).',[{type:'damage',amount:3},{type:'poison',amount:4}]),
 card('poison_sting','맹독 찌르기',1,'poison','피해 6. 적에게 독이 있으면 추가 피해 6.',[{type:'damage',amount:6},{type:'conditional_damage',condition:'poison',amount:6}]),
 card('poison_mist','독안개',1,'poison','독 3. 적 약화 1턴.',[{type:'poison',amount:3},{type:'weak',amount:1}]),
 card('fire_inferno','열화 폭격',2,'fire','피해 17.',[{type:'damage',amount:17}]),
 card('fire_strength','화로의 힘',1,'fire','이번 전투 공격 피해 +2. 방어도 3.',[{type:'strength',amount:2},{type:'block',amount:3}]),
 card('lightning_chain','연쇄 번개',1,'lightning','피해 3을 2번. 타격마다 힘 적용.',[{type:'damage',amount:3,hits:2}]),
 card('lightning_charge','전하 축적',0,'lightning','행동력 +1(최대 6). 이번 전투에서 소멸.',[{type:'energy',amount:1},{type:'exhaust'}]),
 card('explosion_blast','폭발 일격',2,'explosion','피해 18.',[{type:'damage',amount:18}]),
 card('explosion_link','점화 연계',1,'explosion','피해 6. 적의 직전 속성이 불이면 추가 피해 8.',[{type:'damage',amount:6},{type:'conditional_damage',condition:'fire',amount:8}]),
 card('explosion_barrier','충격 방벽',1,'explosion','방어도 8. 적에게 피해 2.',[{type:'block',amount:8},{type:'damage',amount:2}]),
 card('stone_fortress','돌의 요새',2,'stone','방어도 14.',[{type:'block',amount:14}])
];
B.CardById=Object.fromEntries(B.Cards.map(c=>[c.id,c]));
B.Heroes={
 warrior:{name:'전사',desc:'땅·바위·바람 / 검과 방패',starter:['earth_strike','stone_guard','wind_cut','wind_read']},
 mage:{name:'마법사',desc:'불·얼음·번개 / 원소술',starter:['fire_bolt','ice_guard','lightning_strike','lightning_charge']},
 priest:{name:'사제',desc:'물·땅·바람 / 회복과 지원',starter:['water_wave','earth_blessing','wind_judgment','water_rest']}
};
