// ==UserScript==
// @name         Google AI Mode Ctrl+Enter (Universal)
// @namespace    http://tampermonkey.net
// @version      1.3
// @description  Блокирует отправку по Enter и разрешает по Ctrl+Enter в поиске Google
// @author       You
// @match        https://www.google.com/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

console.log("!!! ТЕСТ: Скрипт теперь УСПЕШНО запущен !!!");

(function() {
    'use strict';

    window.addEventListener('keydown', function(e) {
        const target = e.target;
        // Проверяем, что мы пишем в текстовом поле или блоке ИИ-чата
        const isInputField = target.tagName === 'TEXTAREA' &&
                             target.getAttribute('aria-label') === 'Ask anything';

        if (isInputField) {
            //console.log(2222);
            // 1. Обычный Enter -> блокируем отправку
            if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
                e.stopPropagation();
                if (target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
            }
            // 2. Ctrl + Enter -> программно отправляем
            else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                const enterEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13
                });
                target.dispatchEvent(enterEvent);
            }
        }
    }, true); // Перехватываем событие до того, как его обработает Google
})();
