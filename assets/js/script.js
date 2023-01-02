(() => {
    // 시간기능
    // 틀리면 시간감소
    // 아이템 생성
    // 스테이지마다 랜덤색상 출력 rgb로 출력
    // 다른 색상 표시(난이도에 따라 rgb 색상 조절);
    // 아이템 셔플
    // 다른 색상의 아이템의 자리 기억해서 그 자리 피해서 표시해주기
    // 스테이지마다 개수 증가
    const stage = document.querySelector('.stage');
    const stageWidth = stage.clientWidth;
    const stagePadding = window.getComputedStyle(stage).getPropertyValue('padding').split('px')[0];
    const stageSize = stageWidth - stagePadding * 2;
    const timeEl = document.querySelector('.time_val');
    const levelEl = document.querySelector('.level_val');
    const itemMargin = 2;
    const levelInfo = [
        {level: 1, step: 126, grid: 2},
        {level: 2, step: 120, grid: 2},
        {level: 3, step: 65, grid: 3},
        {level: 4, step: 65, grid: 3},
        {level: 5, step: 55, grid: 3},
        {level: 6, step: 55, grid: 4},
        {level: 7, step: 50, grid: 4},
        {level: 8, step: 50, grid: 4},
        {level: 9, step: 50, grid: 4},
        {level: 10, step: 45, grid: 4},
        {level: 11, step: 45, grid: 5},
        {level: 12, step: 42, grid: 5},
        {level: 13, step: 42, grid: 5},
        {level: 14, step: 40, grid: 5},
        {level: 15, step: 40, grid: 5},
        {level: 16, step: 38, grid: 6},
        {level: 17, step: 38, grid: 6},
        {level: 18, step: 35, grid: 6},
        {level: 19, step: 35, grid: 6},
        {level: 20, step: 35, grid: 6},
        {level: 21, step: 30, grid: 7},
        {level: 22, step: 30, grid: 7},
        {level: 23, step: 25, grid: 7},
        {level: 24, step: 25, grid: 7},
        {level: 25, step: 20, grid: 7},
        {level: 26, step: 20, grid: 8},
        {level: 27, step: 15, grid: 8},
        {level: 28, step: 10, grid: 8},
        {level: 29, step: 8, grid: 8},
        {level: 30, step: 5, grid: 8},
    ]
    let items;
    let gameTime = 15;
    let timeInterval;
    let level = 0;
    let otherIndex;
    let isStart = false;


    // flow
    // 메인 색상을 뽑는다.
    // 아이템의 정보를 grid * grid의 개수만큼 배열에 담는다
    // otherIndex를 출력해서 저장하고, 
    // 아이템을 그려준다
    // 아이템에 색상을 입혀준다

    // 1~30
    // 2 x 2
    // 3 x 3
    // 4 x 4
    // 

    init();
    
    function init() {
        isStart = true;
        setGame()
    }

    function setGame() {
        if(!isStart) return;

        const mainColor = getColor();
        const otherColor = getOtherColor(mainColor);
        const rgbValue = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        const otherRgbValue = `rgb(${otherColor[0]}, ${otherColor[1]}, ${otherColor[2]})`;
        otherIndex = Math.floor(Math.random() * (levelInfo[level].grid * levelInfo[level].grid));
        items = Array.from({length: levelInfo[level].grid * levelInfo[level].grid}).fill(rgbValue);
        items[otherIndex] = otherRgbValue;
        levelEl.innerHTML = level + 1;
        timeEl.innerHTML = gameTime;

        // 피스생성
        items.forEach(ele => { createItem(ele) });
    }

    function createItem(color) {
        const itemSize = (stageSize / levelInfo[level].grid) - itemMargin;;
        const el = document.createElement('span');
        el.classList.add('item');
        el.style.setProperty('--itemSize', itemSize + 'px');
        el.style.setProperty('--color', color);
        stage.appendChild(el);
    }

    function rgbRandom() {
        return Math.floor(Math.random() * (130));
    }

    function getColor() {
        const R = rgbRandom();
        const G = rgbRandom();
        const B = rgbRandom();
        return [ R, G, B ];
    }

    function getOtherColor(color) {
        let minusValue;
        let changeOtherColor = color.map(ele => ele + levelInfo[level].step);
        let minusFilter = changeOtherColor.findIndex(ele => ele > 255);

        if(minusFilter === -1) return changeOtherColor;

        minusValue = [...changeOtherColor].sort((a, b) => a - b)[0];
        return changeOtherColor.map(ele => ele + Math.abs(minusValue) + 2);
    }

    stage.addEventListener('click', function(e){
        if(!isStart) return;

        const ItemAll = Array.from(document.querySelectorAll('.item'));
        const selectItemIdx = ItemAll.findIndex(ele => ele == e.target.closest('.item'));
        
        if(timeInterval == undefined) timeStart();
        if(level == 29) {
            clearInterval(timeInterval);
            isStart = false;
            return;
        }

        // 정답 선택시
        if(selectItemIdx === otherIndex) {
            //타임 리셋, 레벨업, 
            stage.innerHTML = '';
            level++;
            gameTime = 15;
            setGame();
        } else {
            gameTime -= 3;
        }
    })

    function timeStart() {
        timeInterval = setInterval(function(){
            gameTime--;
            timeEl.innerHTML = (gameTime < 0) ? 0 : gameTime;

            if(gameTime <= 0) {
                clearInterval(timeInterval);
                isStart = false;
            }
        }, 1000);
    }


})()