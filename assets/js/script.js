(() => {
    // 시간기능
    // 틀리면 시간감소
    // 아이템 생성
    // 스테이지마다 랜덤색상 출력 rgb로 출력
    // 다른 색상 표시(난이도에 따라 rgb 색상 조절);
    // 아이템 셔플
    // 스테이지마다 개수 증가
    const wrap = document.getElementById('wrap');
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
        {level: 3, step: 95, grid: 3},
        {level: 4, step: 75, grid: 3},
        {level: 5, step: 65, grid: 3},
        {level: 6, step: 50, grid: 4},
        {level: 7, step: 50, grid: 4},
        {level: 8, step: 38, grid: 4},
        {level: 9, step: 38, grid: 4},
        {level: 10, step: 38, grid: 4},
        {level: 11, step: 30, grid: 5},
        {level: 12, step: 30, grid: 5},
        {level: 13, step: 30, grid: 5},
        {level: 14, step: 25, grid: 5},
        {level: 15, step: 25, grid: 5},
        {level: 16, step: 20, grid: 6},
        {level: 17, step: 20, grid: 6},
        {level: 18, step: 19, grid: 6},
        {level: 19, step: 19, grid: 6},
        {level: 20, step: 19, grid: 6},
        {level: 21, step: 17, grid: 7},
        {level: 22, step: 17, grid: 7},
        {level: 23, step: 16, grid: 7},
        {level: 24, step: 15, grid: 7},
        {level: 25, step: 15, grid: 7},
        {level: 26, step: 13, grid: 8},
        {level: 27, step: 13, grid: 8},
        {level: 28, step: 13, grid: 8},
        {level: 29, step: 13, grid: 8},
        {level: 30, step: 13, grid: 8},
        {level: 31, step: 10, grid: 8},
        {level: 32, step: 10, grid: 8},
        {level: 33, step: 10, grid: 8},
        {level: 34, step: 10, grid: 8},
        {level: 35, step: 10, grid: 8},
        {level: 36, step: 9, grid: 8},
        {level: 37, step: 9, grid: 8},
        {level: 38, step: 9, grid: 8},
        {level: 39, step: 9, grid: 8},
        {level: 40, step: 9, grid: 8},
        {level: 41, step: 7, grid: 9},
        {level: 42, step: 7, grid: 9},
        {level: 43, step: 7, grid: 9},
        {level: 44, step: 7, grid: 9},
        {level: 45, step: 7, grid: 9},
        {level: 46, step: 6, grid: 9},
        {level: 47, step: 5, grid: 9},
        {level: 48, step: 4, grid: 9},
        {level: 49, step: 3, grid: 9},
        {level: 50, step: 3, grid: 9},
    ]
    let items;
    let gameTime = 15;
    let timeInterval;
    let level = 0;
    let otherIndex;
    let isStart = false;

    init();
    
    function init() {
        isStart = true;
        setGame();
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
        timeEl.parentNode.style.color = 'black'

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
    
    function timeStart() {
        timeInterval = setInterval(function(){

            gameTime--;
            timeEl.innerHTML = (gameTime < 0) ? 0 : gameTime;

            timeEl.parentNode.style.color = (gameTime > 5) ? 'black' : 'red';

            // 5초 남았을때 5초 남았다는 애니메이션 추가
            if(gameTime <= 5) {
                timeEl.parentNode.classList.add('bounce');
                setTimeout(function(){
                    timeEl.parentNode.classList.remove('bounce');
                }, 400);
            }

            // 제한시간 종료시 게임종료
            if(gameTime <= 0) {
                gameEnd('game end');
            }
        }, 1000);
    }

    function gameEnd(txt) {

        const endEl = document.createElement('div');
        endEl.classList.add('game_end');
        endEl.innerHTML = gameTxt(txt);

        clearInterval(timeInterval);
        isStart = false;

        wrap.appendChild(endEl);

        new Promise((resolve) => {
            setTimeout(function(){
                resolve();
            }, 3000);
        }).then(() => {
            endEl.remove();
            createReset();
        })

    }

    function gameTxt(txt) {
        let txtInTag = '';

        Array.from(txt).forEach(ele => {
            txtInTag += `<span>${ele}</span>`;
        })
        return txtInTag;
    }
    

    function createReset() {
        const resetEl = document.createElement('div');
        const resetFirstBtn = document.createElement('button');
        const resetCurrentBtn = document.createElement('button');
        
        resetEl.classList.add('end_util');
        resetFirstBtn.classList.add('reset_btn');
        resetCurrentBtn.classList.add('reset_btn');
        resetFirstBtn.dataset.resetType = 'first';
        resetCurrentBtn.dataset.resetType = 'current';
        resetFirstBtn.innerHTML = '<strong>처음</strong>부터 다시 시작';
        resetCurrentBtn.innerHTML = '<strong>현재 레벨</strong>부터 다시 시작';

        resetEl.style.top = stage.getBoundingClientRect().bottom + 10 + 'px';
        
        wrap.appendChild(resetEl);
        resetEl.appendChild(resetFirstBtn);
        resetEl.appendChild(resetCurrentBtn);

        resetFirstBtn.addEventListener('click', gameReset);
        resetCurrentBtn.addEventListener('click', gameReset);
    }

    function gameReset() {

        if(this.dataset.resetType == 'first') {
            level = 0;
        }
        gameTime = 15;
        isStart = true;
        this.closest('.end_util').remove();
        stage.innerHTML = '';
        setGame();
        timeStart();
    }

    // 아이템 클릭
    stage.addEventListener('click', function(e){
        const target = e.target;
        if(!isStart) return;

        const ItemAll = Array.from(document.querySelectorAll('.item'));
        const selectItemIdx = ItemAll.findIndex(ele => ele === target.closest('.item'));
        
        if(timeInterval === undefined) timeStart();

        // 정답 선택시
        if(selectItemIdx === otherIndex) {
            if(level === levelInfo.length - 1) { // 마지막 라운드 게임 종료
                gameEnd('clear!');
                return;
            } else {
                //타임 리셋, 레벨업, 
                clearInterval(timeInterval);
                stage.innerHTML = '';
                level++;
                gameTime = 15;
                setGame();
                timeStart();
            }
        } else {
            gameTime -= 3;
        }
    })

    // 통계 -> 몽고DB(웹호스팅을 따로 써야 서버를 구축할 수 있음. - 고민해보기)

})()