# 🎮 Palavras - Autoplay Panel

![Versão](https://raw.githubusercontent.com/lalaio1/labzts.fun-AUTOPLAY-/refs/heads/main/img/1.png)
---

url: https://labzts.fun/words/

Um script de usuário para automação e controle do jogo Palavras, oferecendo uma interface intuitiva estilo macOS com funcionalidades avançadas de autoplay.

## ✨ Características

### 🎯 Funcionalidades Principais
- **Autoplay Automático**: Responde automaticamente às perguntas do jogo
- **Destaque de Respostas**: Destaca visualmente as alternativas corretas
- **Controle de Velocidade**: Ajuste personalizado do delay entre ações
- **Reinício Rápido**: Botão para reiniciar o jogo instantaneamente

### 🖥️ Interface Avançada
- **Janela Flutuante**: Interface arrastável e redimensionável
- **Background Personalizável**: Imagem de fundo com ajuste automático
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela

### ⚡ Controles Inteligentes
- ▶️ **Iniciar Autoplay**: Inicia a automação do jogo
- ⏹️ **Parar Autoplay**: Interrompe a automação
- 🔄 **Reiniciar Jogo**: Reinicia a sessão atual
- ⏱️ **Ajuste de Delay**: Controla a velocidade das respostas
- 🔍 **Mostrar Respostas**: Ativa/desativa o destaque das alternativas

## 🎮 Como Usar

### Configuração Básica
1. **Abra o console do navegador** ( geralmente apertando f12 )
2. cole o script e aperte enter:
```js
fetch('https://raw.githubusercontent.com/lalaio1/labzts.fun-AUTOPLAY-/refs/heads/main/script.js')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Falha ao carregar o script: ${response.status}`);
    }
    return response.text();
  })
  .then(scriptText => {
    console.log("Script baixado com sucesso. Executando...");
    eval(scriptText); 
  })
  .catch(error => {
    console.error("Erro ao carregar ou executar o script:", error);
  });
```

### Controles da Janela
- **🔴 Fechar**: Oculta a janela (use F12 → Console para restaurar)
- **🟡 Minimizar**: Alterna entre modo compacto e completo
- **🟢 Maximizar**: Alterna entre tamanho normal e tela cheia
- **Arrastar**: Clique e arraste o cabeçalho para mover
- **Redimensionar**: Use a alça no canto inferior direito

![Tampermonkey](https://raw.githubusercontent.com/lalaio1/labzts.fun-AUTOPLAY-/refs/heads/main/img/2.png)

### Personalização
```javascript
// No código, você pode personalizar:
let delay = 2000; // Velocidade padrão
let showAnswers = true; // Destaque de respostas
```


## 🔧 Configuração Técnica

### Variáveis de Configuração
```javascript
let isAutoplaying = false;    // Estado do autoplay
let autoplayInterval = null;  // Referência do intervalo
let delay = 2000;            // Delay entre ações (ms)
let showAnswers = true;      // Mostrar destaque de respostas
```


## 🐛 Solução de Problemas

### Problemas Comuns
1. **Autoplay não funciona**
   - Verifique se está na página correta do jogo
   - Confirme que os elementos do jogo estão carregados

2. **Erro de imagem de fundo**
   - A imagem usa URL externa, verifique conexão internet
   - Ou substitua por URL local no código

### Comandos de Debug
```javascript
// No console do navegador:
console.log('Autoplay status:', isAutoplaying);
console.log('Current delay:', delay);
```

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🏆 Créditos

Desenvolvido com ❤️ para a comunidade de jogos educativos.

**Autor**: lalaio1  
**Versão**: 1.1  
**Última Atualização**: ${new Date().toLocaleDateString('pt-BR')}

---

⭐ **Se este projeto te ajudou, considere dar uma estrela no repositório!**
