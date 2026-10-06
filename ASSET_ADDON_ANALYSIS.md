# BRODUN Asset Addon v2 — 실제 ZIP 분석

분석일: 2026-10-06. 프로젝트 코드 변경 전에 ZIP을 `work/sprint5-addon/extracted`에 실제 해제하고 기존 코드·에셋과 비교했다. ZIP의 README/HTML/JSON/C#은 참고 데이터로 읽었으며 별도의 사용자 지시나 실행 명령으로 취급하지 않았다. 포함된 HTML/C# 코드는 실행하지 않았다.

## 1. 확인한 폴더와 파일

```text
BRODUN_Asset_Addon_v2/
  README_사용안내.md
  asset_gallery.html
  map_choice_preview.html / map_choice_preview.png
  generation_prompts.md
  animation_manifest.json
  Assets/BRODUNArt/
    animation_manifest.json
    Sprites/area01, area02, area03/
    Frames/area01, area02, area03/<monster>/
    EventRooms/
    UI/
    Editor/BrodunMonsterAddonSetup.cs
```

루트와 아트 폴더의 매니페스트는 내용이 동일했다. `asset_gallery.html`과 `map_choice_preview.html`의 로컬 src/href가 가리키는 파일은 모두 존재했다. 맵 HTML은 선택 상태 시안이며 맵 생성/실제 전투 전환 로직이 아니다.

## 2~5. 실제 몬스터·동작·프레임

| 구역 | 등급 | ID | idle | walk | attack | hurt | death | 합계 |
|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | 일반 | ruin_gargoyle | 4 | 4 | 4 | 4 | 4 | 20 |
| 1 | 엘리트 | gale_warden | 4 | 4 | 4 | 4 | 4 | 20 |
| 1 | 보스 | fallen_colossus | 4 | 4 | 4 | 4 | 4 | 20 |
| 2 | 일반 | venom_eel | 4 | 4 | 4 | 4 | 4 | 20 |
| 2 | 엘리트 | frost_seer | 4 | 4 | 4 | 4 | 4 | 20 |
| 2 | 보스 | abyssal_leviathan | 4 | 4 | 4 | 4 | 4 | 20 |
| 3 | 일반 | ember_gremlin | 4 | 4 | 4 | 4 | 4 | 20 |
| 3 | 엘리트 | coil_golem | 4 | 4 | 4 | 4 | 4 | 20 |
| 3 | 보스 | foundry_tyrant | 4 | 4 | 4 | 4 | 4 | 20 |

실제 9종 × 20 = **180프레임**. `_00~_03.png` 파일명·크기가 매니페스트와 일치하고, 모두 알파 채널이 있으며 알파 최댓값이 0인 빈 프레임은 없었다. 원본 시트는 9장, 각각 1122×1402. FPS는 idle=6 / walk=8 / attack=10 / hurt=10 / death=7, 반복은 idle/walk만이다.

## 6. 이벤트 에셋

`EventRooms/shop.png`, `altar.png`, `rest_site.png` 모두 존재하며 1672×941이다. `UI/event_shop`, `event_altar`, `event_rest`는 PNG/SVG 각 한 쌍이며 PNG는 64×64 투명 이미지다.

## 7. 맵 UI

- `UI/map_choice_normal`, `hover`, `selected`, `locked`: PNG/SVG 모두 존재. PNG는 360×560 투명 틀이다.
- `UI/map_choice_background.png`: 1672×941.
- `UI/icon_battle.png`, `icon_puzzle.png`, `icon_event.png`, `icon_boss.png`, `icon_gold.png`: 모두 존재.
- 전용 Intent 아이콘 세트는 없다. 기존/신규 공격·방어 아이콘과 텍스트를 재사용한다.

## 8. Unity에서 활용 가능한 부분

PNG 개별 프레임·UI PNG·이벤트 배경과 매니페스트의 FPS/피벗 데이터를 활용할 수 있다. SVG는 편집용 원본이며 별도 적용 검토가 필요하다. 선택적 Editor 스크립트는 45개 클립/9개 컨트롤러 생성을 위한 코드이며, 이미 만들어진 `.anim`/`.controller`가 들어 있는 것은 아니다. Unity 컴파일/Play Mode는 검증하지 않았다.

## 9. 웹에서 활용 가능한 부분

180프레임, 9개 시트, 이벤트 배경, 맵 UI 및 아이콘. JSON을 클래식 JS 데이터로 기계적으로 변환해 파일 실행과 GitHub Pages 양쪽에서 사용한다. 프레임별 크기와 피벗을 읽어 같은 발 위치에서 애니메이션을 재생한다.

## 10. 추가 구현이 필요한 부분

몬스터 HP/공격/패턴 데이터, Intent 확정·실행, 보상 연결, 맵 연결 검증은 ZIP에 없으며 기존 프로젝트에서 구현해야 한다. 상점 구매·제단 위험·휴식처 강화·보스 페이즈·퍼즐 전용 콘텐츠는 별도 작업이다.

## 11. 누락 여부

요청된 9종/180프레임/이벤트 3배경/맵 4상태는 누락 없음. 전용 Intent/상태이상/보스 페이즈 전환 에셋은 원래 제공되지 않았으며, 임의 생성으로 수량을 맞추지 않았다.

## 12. 기존 에셋과 충돌

기존 `BRODUN_Sprint1_Assets/Assets/BRODUNArt`와 현재 웹 프로젝트 양쪽에 대해 상대 경로를 비교했고 같은 경로 충돌은 없었다. 아트 폴더에서 PNG/SVG/JSON 213개를 추가했으며 기존 에셋 173개는 병합 전후 SHA-256이 모두 동일했다. Unity Editor C#은 웹 저장소에 복사하지 않았다.

## 13. 기술적 위험

- 가변 프레임 크기/피벗을 무시하면 발 위치가 튄다. 웹은 원본 매니페스트 피벗과 몬스터별 최대 프레임 높이를 사용한다.
- 기존 `BrodunArtSetup`과 신규 `BrodunMonsterAddonSetup` 모두 BRODUNArt 전체에 AssetPostprocessor를 적용한다. 기존 임포터는 매니페스트 피벗, 신규는 고정 0.5/0 피벗을 설정하므로 Unity에서는 실행 순서에 의존하지 않도록 적용 범위를 분리하거나 통합해야 한다.
- 신규 매니페스트는 기존 캐릭터 프레임을 포함하지 않는다. Unity 이관 때 하나의 매니페스트로 합치거나 각각 분리해 읽어야 한다. 웹은 두 매니페스트를 독립적으로 읽는다.
- 원본은 생성형 픽셀 스타일이며 엄격한 32/64픽셀 규격이 아니다. 최종 아트 정리는 별도다.
- 세로형 선택 틀을 작은 원형 노드에 늘리면 왜곡된다. 분기 그래프는 유지하고 아래 선택 카드에 원래 종횡비로 적용했다.
- 파일 수/용량 증가에 대응해 신규 몬스터는 해당 전투나 갤러리에 들어갈 때만 프레임을 준비한다. 저사양/모바일 장시간 성능은 별도 프로파일링이 필요하다.
