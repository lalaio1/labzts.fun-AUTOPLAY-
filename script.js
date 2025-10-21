(function() {
    'use strict';

    let isAutoplaying = false;
    let autoplayInterval = null;
    let delay = 2000;
    let showAnswers = true;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isResizing = false;
    let resizeStart = { x: 0, y: 0 };
    let startSize = { width: 0, height: 0 };

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'autoplayPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(245,245,245,0.98) 100%);
            color: #2c3e50;
            padding: 20px;
            border-radius: 15px;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            width: 320px;
            min-width: 300px;
            min-height: 350px;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.3);
            resize: both;
            overflow: hidden;
            cursor: default;
        `;

        panel.innerHTML = `
            <div id="windowControls" style="position: absolute; top: 12px; left: 15px; display: flex; gap: 8px; z-index: 10001;">
                <div class="window-btn close" style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: all 0.2s ease;"></div>
                <div class="window-btn minimize" style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: all 0.2s ease;"></div>
                <div class="window-btn maximize" style="width: 12px; height: 12px; border-radius: 50%; background: #28ca42; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: all 0.2s ease;"></div>
            </div>
            
            <div id="header" style="margin-top: 10px; margin-bottom: 15px; text-align: center; cursor: move; padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.5);">
                <h3 style="margin: 0; color: #2c3e50; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">🎮 Painel de Controle</h3>
            </div>
            
            <div id="backgroundContainer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; border-radius: 15px; overflow: hidden;">
                <img id="backgroundImage" src="https://wallpapers.com/images/hd/white-anime-7ibre312gioxdapx.jpg" 
                     style="width: 100%; height: 100%; object-fit: cover; opacity: 0.4; filter: brightness(1.1) saturate(1.2);">
            </div>
            
            <div style="position: relative; z-index: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 8px; backdrop-filter: blur(5px);">
                    <label for="delayInput" style="color: #34495e; font-weight: 500;">⏱️ Delay (ms):</label>
                    <input type="number" id="delayInput" value="${delay}" min="100" step="100" style="width: 80px; padding: 8px; border: 1px solid #bdc3c7; border-radius: 6px; background: rgba(255,255,255,0.9);">
                </div>
                
                <div style="margin-bottom: 15px; display: flex; align-items: center; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 8px; backdrop-filter: blur(5px);">
                    <input type="checkbox" id="showAnswersCheckbox" ${showAnswers ? 'checked' : ''} style="margin-right: 8px; transform: scale(1.2);">
                    <label for="showAnswersCheckbox" style="color: #34495e; font-weight: 500; margin: 0;">🔍 Mostrar Respostas</label>
                </div>
                
                <div style="margin-bottom: 15px; display: flex; gap: 8px;">
                    <button id="startBtn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; opacity: 0.9;">▶️ Iniciar</button>
                    <button id="stopBtn" style="flex: 1; padding: 12px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; opacity: 0.9;">⏹️ Parar</button>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <button id="restartGameBtn" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; opacity: 0.9;">🔄 Reiniciar Jogo</button>
                </div>
                
                <div id="statusDiv" style="text-align: center; padding: 10px; background: rgba(52, 73, 94, 0.1); border-radius: 8px; font-weight: 600; color: #2c3e50; transition: all 0.3s ease; backdrop-filter: blur(5px);">⏸️ Status: Parado</div>
            </div>
            
            <div id="resizeHandle" style="position: absolute; bottom: 5px; right: 5px; width: 15px; height: 15px; cursor: nw-resize; opacity: 0.7;">
                <div style="width: 100%; height: 100%; border-right: 2px solid #95a5a6; border-bottom: 2px solid #95a5a6; border-bottom-right-radius: 4px;"></div>
            </div>
        `;

        document.body.appendChild(panel);

        const windowButtons = panel.querySelectorAll('.window-btn');
        windowButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.opacity = '0.8';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            });
        });

        panel.querySelector('.window-btn.close').addEventListener('click', function() {
            panel.style.display = 'none';
        });

        panel.querySelector('.window-btn.minimize').addEventListener('click', function() {
            const content = panel.querySelector('#header').nextElementSibling;
            if (content.style.display !== 'none') {
                content.style.display = 'none';
                panel.style.height = '80px';
                panel.style.minHeight = '80px';
            } else {
                content.style.display = 'block';
                panel.style.height = '';
                panel.style.minHeight = '350px';
            }
        });

        panel.querySelector('.window-btn.maximize').addEventListener('click', function() {
            if (panel.style.width === '90vw' && panel.style.height === '90vh') {
                panel.style.width = '320px';
                panel.style.height = '';
                panel.style.top = '50px';
                panel.style.left = '50px';
            } else {
                panel.style.width = '90vw';
                panel.style.height = '90vh';
                panel.style.top = '5vh';
                panel.style.left = '5vw';
            }
        });

        const header = panel.querySelector('#header');
        header.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'LABEL') return;
            
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function onDrag(e) {
            if (!isDragging) return;
            
            panel.style.left = (e.clientX - dragOffset.x) + 'px';
            panel.style.top = (e.clientY - dragOffset.y) + 'px';
            panel.style.transform = 'none';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            panel.style.cursor = 'default';
        }

        const resizeHandle = panel.querySelector('#resizeHandle');
        resizeHandle.addEventListener('mousedown', startResize);

        function startResize(e) {
            isResizing = true;
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            startSize.width = panel.offsetWidth;
            startSize.height = panel.offsetHeight;
            
            document.addEventListener('mousemove', onResize);
            document.addEventListener('mouseup', stopResize);
            
            e.preventDefault();
        }

        function onResize(e) {
            if (!isResizing) return;
            
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            
            const newWidth = Math.max(300, startSize.width + deltaX);
            const newHeight = Math.max(350, startSize.height + deltaY);
            
            panel.style.width = newWidth + 'px';
            panel.style.height = newHeight + 'px';
            
            const bgImage = panel.querySelector('#backgroundImage');
            bgImage.style.width = '100%';
            bgImage.style.height = '100%';
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', onResize);
            document.removeEventListener('mouseup', stopResize);
        }

        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '0.9';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'translateY(0)';
            });
        });

        document.getElementById('delayInput').addEventListener('change', function() {
            delay = parseInt(this.value) || 2000;
        });

        document.getElementById('showAnswersCheckbox').addEventListener('change', function() {
            showAnswers = this.checked;
        });

        document.getElementById('startBtn').addEventListener('click', startAutoplay);
        document.getElementById('stopBtn').addEventListener('click', stopAutoplay);
        document.getElementById('restartGameBtn').addEventListener('click', function() {
            if (typeof restartGame === 'function') {
                stopAutoplay();
                restartGame();
            }
        });

        const bgImage = panel.querySelector('#backgroundImage');
        bgImage.onload = function() {
            this.style.objectFit = 'cover';
            this.style.width = '100%';
            this.style.height = '100%';
        };
        
        setTimeout(() => {
            bgImage.style.objectFit = 'cover';
            bgImage.style.width = '100%';
            bgImage.style.height = '100%';
        }, 100);
    }

    function highlightAnswers() {
        if (!showAnswers) return;

        const buttons = document.querySelectorAll('.alternative-btn');
        if (buttons.length === 0) return;

        buttons.forEach(btn => {
            if (!btn.classList.contains('correct') && !btn.classList.contains('wrong')) {
                btn.style.opacity = '0.8';
                btn.style.transform = 'scale(0.98)';
                btn.style.boxShadow = '0 0 15px rgba(52, 152, 219, 0.7)';
                btn.style.transition = 'all 0.3s ease';
            }
        });
    }

    function simulateAnswer() {
        if (!isAutoplaying) return;

        const buttons = document.querySelectorAll('.alternative-btn:not([disabled])');
        if (buttons.length > 0) {
            highlightAnswers();

            const currentWordObj = words[currentQuestionIndex];
            if (currentWordObj && currentWordObj.correct) {
                const correctText = currentWordObj.correct;
                let correctButton = null;
                buttons.forEach(btn => {
                    const btnText = btn.querySelector('.alternative-text').textContent;
                    if (btnText === correctText) {
                        correctButton = btn;
                    }
                });

                if (correctButton) {
                    correctButton.click();
                } else {
                    buttons[0].click();
                }
            } else {
                buttons[0].click();
            }
        } else {
            const nextButton = document.getElementById('nextBtn');
            if (nextButton && nextButton.style.display !== 'none') {
                nextButton.click();
            }
        }
    }

    function startAutoplay() {
        if (!isAutoplaying) {
            isAutoplaying = true;
            const statusDiv = document.getElementById('statusDiv');
            statusDiv.textContent = '🎯 Status: Autoplay Ativo';
            statusDiv.style.background = 'rgba(46, 204, 113, 0.2)';
            statusDiv.style.color = '#27ae60';
            autoplayInterval = setInterval(simulateAnswer, delay);
        }
    }

    function stopAutoplay() {
        if (isAutoplaying) {
            isAutoplaying = false;
            clearInterval(autoplayInterval);
            autoplayInterval = null;
            const statusDiv = document.getElementById('statusDiv');
            statusDiv.textContent = '⏸️ Status: Parado';
            statusDiv.style.background = 'rgba(52, 73, 94, 0.1)';
            statusDiv.style.color = '#2c3e50';

            const buttons = document.querySelectorAll('.alternative-btn');
            buttons.forEach(btn => {
                btn.style.opacity = '';
                btn.style.transform = '';
                btn.style.boxShadow = '';
                btn.style.transition = '';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }

})();
