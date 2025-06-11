// 룰렛 항목 정의
const items = [
    '막대사탕1개',
    '홈런볼1개',
    '당일 녹음숙제 면제권',
    '카프리선 1개',
    '엄마드릴 커피',
    '꽝, 다음기회에!'
];

// 캔버스 설정
const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('result');

// 캔버스 크기 설정
function resizeCanvas() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
}

// 섹터별 다양한 색상 배열
const sectorColors = [
    '#FFD700', // 노랑
    '#FF6F61', // 코랄
    '#6BCB77', // 연두
    '#4D96FF', // 파랑
    '#FFB72B', // 주황
    '#B983FF'  // 보라
];
// 텍스트별 다양한 색상 배열
const textColors = [
    '#C0392B', // 진빨강
    '#1A237E', // 남색
    '#00695C', // 청록
    '#D84315', // 오렌지브라운
    '#512DA8', // 보라
    '#00897B'  // 청록2
];

// 룰렛 그리기
function drawRoulette() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // 각 항목의 각도 계산
    const anglePerItem = (2 * Math.PI) / items.length;
    
    // 각 항목 그리기
    items.forEach((item, index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        
        // 섹터 그리기
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // 섹터 색상 설정 (섹터별 다양한 색상)
        ctx.fillStyle = sectorColors[index % sectorColors.length];
        ctx.fill();
        
        // 테두리 그리기
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 텍스트 그리기
        ctx.save();
        ctx.translate(centerX, centerY);
        // 섹터의 중심 각도에 맞춰 회전 (방사형)
        ctx.rotate(startAngle + anglePerItem / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColors[index % textColors.length];
        // 글씨를 적당한 크기로, 두껍게 (60%로 축소)
        ctx.font = `bold ${Math.floor(radius * 0.09)}px NEXONLv1Gothic`;
        // 텍스트 위치: 원의 바깥쪽 80% 지점에 배치
        const textRadius = radius * 0.8;
        ctx.fillText(item, textRadius, 0);
        ctx.restore();
    });
}

// 룰렛 회전 애니메이션
let isSpinning = false;
let currentRotation = 0;

function spinRoulette() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    resultDisplay.classList.remove('show');
    
    // 랜덤 각도 계산 (5바퀴 + 랜덤 각도)
    const spinAngle = 5 * 360 + Math.random() * 360;
    currentRotation += spinAngle;
    
    // 회전 애니메이션
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    // 5초 후 결과 표시
    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;
        
        // 당첨 항목 계산 (포인터가 12시 방향이므로 90도 보정)
        const normalizedRotation = (currentRotation + 90) % 360;
        const itemIndex = Math.floor(((360 - normalizedRotation) % 360) / (360 / items.length));
        const result = items[itemIndex];
        
        // 결과 표시
        resultDisplay.textContent = result;
        resultDisplay.classList.add('show');
        
        // 꽝이 아닌 경우 폭죽 효과
        if (result !== '꽝, 다음기회에!') {
            celebrate();
        }
    }, 5000);
}

// 폭죽 효과
function celebrate() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 폭죽 발사
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// 이벤트 리스너 설정
spinButton.addEventListener('click', spinRoulette);
window.addEventListener('resize', () => {
    resizeCanvas();
    drawRoulette();
});

// 초기화
resizeCanvas();
drawRoulette(); 