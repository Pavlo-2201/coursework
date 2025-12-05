// rating.js - Работа с таблицей рейтинга

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка и отображение рейтинга
    loadRating();
    
    // Настройка обработчиков событий
    setupRatingEventListeners();
});

// Загрузка рейтинга
function loadRating() {
    const results = JSON.parse(localStorage.getItem('circuitGameResults') || '[]');
    
    // Обновление статистики
    updateStats(results);
    
    // Отображение результатов
    displayRating(results);
    
    // Обновление времени последнего обновления
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('ru-RU');
}

// Обновление статистики
function updateStats(results) {
    if (results.length === 0) {
        document.getElementById('totalPlayers').textContent = '0';
        document.getElementById('averageScore').textContent = '0';
        document.getElementById('bestScore').textContent = '0';
        document.getElementById('bestPlayer').textContent = '-';
        document.getElementById('totalGames').textContent = '0';
        return;
    }
    
    // Уникальные игроки
    const uniquePlayers = [...new Set(results.map(r => r.playerName))];
    document.getElementById('totalPlayers').textContent = uniquePlayers.length;
    
    // Средний счет
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round(totalScore / results.length);
    document.getElementById('averageScore').textContent = averageScore;
    
    // Лучший результат
    const bestResult = results.reduce((best, r) => r.score > best.score ? r : best, results[0]);
    document.getElementById('bestScore').textContent = bestResult.score;
    document.getElementById('bestPlayer').textContent = bestResult.playerName;
    
    // Всего игр
    document.getElementById('totalGames').textContent = results.length;
}

// Отображение рейтинга в таблице
function displayRating(results) {
    const tableBody = document.getElementById('ratingTableBody');
    tableBody.innerHTML = '';
    
    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-trophy" style="font-size: 3rem; opacity: 0.3; margin-bottom: 15px; display: block;"></i>
                    <p>Рейтинг пуст. Сыграйте в игру, чтобы появились результаты!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Сортируем по убыванию очков
    results.sort((a, b) => b.score - a.score);
    
    // Отображаем все результаты
    results.forEach((result, index) => {
        const row = document.createElement('tr');
        
        // Форматирование даты
        const date = new Date(result.date);
        const formattedDate = date.toLocaleDateString('ru-RU');
        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        // Вычисляем итоговый счет (очки минус штраф)
        const finalScore = result.score - (result.penalty || 0);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user"></i>
                    </div>
                    <strong>${result.playerName}</strong>
                </div>
            </td>
            <td>
                <span class="score-badge">${finalScore}</span>
                ${result.penalty ? `<br><small style="color: var(--danger-color);">Штраф: ${result.penalty}</small>` : ''}
            </td>
            <td>${result.tasksCompleted || 0}</td>
            <td>${result.time || '00:00'}</td>
            <td>
                <div>${formattedDate}</div>
                <small>${formattedTime}</small>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Настройка обработчиков событий
function setupRatingEventListeners() {
    // Экспорт рейтинга
    document.getElementById('exportRatingBtn').addEventListener('click', exportRating);
    
    // Очистка рейтинга
    document.getElementById('clearRatingBtn').addEventListener('click', clearRating);
}

// Экспорт рейтинга в JSON
function exportRating() {
    const results = JSON.parse(localStorage.getItem('circuitGameResults') || '[]');
    
    if (results.length === 0) {
        alert('Нет данных для экспорта!');
        return;
    }
    
    // Создание JSON файла
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Создание ссылки для скачивания
    const exportFileDefaultName = `circuit_master_rating_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.href = URL.createObjectURL(dataBlob);
    linkElement.download = exportFileDefaultName;
    
    // Имитация клика для скачивания
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    // Показать сообщение
    showExportMessage(`Рейтинг экспортирован! Файл: ${exportFileDefaultName}`);
}

// Очистка всего рейтинга
function clearRating() {
    if (!confirm('Вы уверены, что хотите удалить ВЕСЬ рейтинг? Это действие нельзя отменить.')) {
        return;
    }
    
    localStorage.removeItem('circuitGameResults');
    
    // Показать сообщение
    showExportMessage('Рейтинг полностью очищен!');
    
    // Перезагрузка рейтинга
    loadRating();
}

// Показать сообщение об экспорте
function showExportMessage(text) {
    const message = document.createElement('div');
    message.className = 'export-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 500);
    }, 3000);
}

// Добавление стилей для рейтинга
const style = document.createElement('style');
style.textContent = `
    .score-badge {
        background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
        font-size: 1.1rem;
        display: inline-block;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .export-message {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);