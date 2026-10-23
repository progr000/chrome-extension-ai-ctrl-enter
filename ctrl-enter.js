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
        let gemini = false;
        // Проверяем, что мы пишем в текстовом поле или блоке ИИ-чата
        let isInputField = target.tagName === 'TEXTAREA' &&
                             target.getAttribute('aria-label') === 'Ask anything';
        if (!isInputField) {
            isInputField = target.getAttribute('data-placeholder') === 'Ask Gemini';
            gemini = true;
        }
        if (isInputField) {
            //console.log(2222);
            // 1. Обычный Enter -> блокируем отправку
            if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
                e.stopPropagation();
                if (target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                }
                if (gemini) {
                    e.preventDefault();
                    e.stopPropagation();
                    //e.preventDefault();
                    // let el = document.createElement("p");
                    // target.appendChild(el);
                    // el.focus();

                    // 2. Получаем текущую позицию курсора (каретки)
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return;

                    const range = selection.getRangeAt(0);
                    range.deleteContents(); // Удаляем выделенный текст, если он есть

                    // 3. Создаем элемент переноса строки
                    // Для contenteditable в Chrome лучше всего работает комбинация текстового переноса и <br>
                    const textNode = document.createTextNode('\n\n');
                    const brNode = document.createElement('br');

                    // Вставляем элементы в место курсора
                    range.insertNode(brNode);
                    range.insertNode(textNode);

                    // 4. Сдвигаем курсор сразу после вставленного переноса
                    range.setStartAfter(brNode);
                    range.setEndAfter(brNode);

                    selection.removeAllRanges();
                    selection.addRange(range);

                    // 5. Триггерим событие ввода, чтобы веб-сайт (React/Angular)
                    // понял, что текст изменился, и обновил свой внутренний стейт
                    target.dispatchEvent(new Event('input', { bubbles: true }));
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
