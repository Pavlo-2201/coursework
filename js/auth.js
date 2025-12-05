// auth.js - Обработка авторизации пользователя
document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('playerName');
    const startGameBtn = document.getElementById('startGameBtn');
    const viewRatingBtn = document.getElementById('viewRatingBtn');
    
    // ОЧИЩАЕМ ПОЛЕ ПРИ КАЖДОЙ ЗАГРУЗКЕ СТРАНИЦЫ
    playerNameInput.value = '';
    
    // Обработка начала игры
    startGameBtn.addEventListener('click', function() {
        const playerName = playerNameInput.value.trim();
        
        if (!playerName) {
            playerNameInput.style.animation = 'shake 0.5s ease';
            playerNameInput.focus();
            
            setTimeout(() => {
                playerNameInput.style.animation = '';
            }, 500);
            
            return;
        }
        
        // Сохраняем имя игрока
        localStorage.setItem('circuitPlayerName', playerName);
        
        // Перенаправляем на игровую страницу
        window.location.href = 'game.html';
    });
    
    // Просмотр рейтинга
    viewRatingBtn.addEventListener('click', function() {
        window.location.href = 'rating.html';
    });
    
    // Разрешаем нажать Enter для начала игры
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGameBtn.click();
        }
    });
    
    // Фокус на поле ввода при загрузке
    playerNameInput.focus();
});