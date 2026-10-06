/* Prototype-only tuning. UI and combat read the same values. */
window.B=window.B||{};
B.Config={max_hp:60,max_cost:3,energy_cap:6,hand_size:4,gold_reward:50,weak_reduction:3,normal_hp_step:2,
 animation:{card_impact_ms:330,card_end_ms:800,enemy_impact_ms:400,enemy_end_ms:900,victory_ms:650},event:{heal:8,gold:15}};
B.EnemyTuning={
 normal:{hp:38,area_hp_step:4,patterns:[{type:'attack',amount:6,hits:1},{type:'attack',amount:8,hits:1},{type:'block',amount:5}]},
 elite:{hp:52,area_hp_step:6,patterns:[{type:'attack',amount:8,hits:1},{type:'attack',amount:5,hits:2},{type:'buff',amount:2},{type:'attack',amount:10,hits:1}]},
 boss:{hp:64,area_hp_step:8,patterns:[{type:'attack',amount:10,hits:1},{type:'block',amount:8},{type:'attack',amount:6,hits:2},{type:'buff',amount:2}]}
};
