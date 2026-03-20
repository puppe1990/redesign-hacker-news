# Hacker News Editorial Redesign

Extensão Chrome em Manifest V3 que injeta um redesign visual no DOM do Hacker News.

## O que faz

- substitui o header original por uma topbar fixa
- transforma a listagem de posts em cards editoriais mais legíveis
- melhora contraste, espaçamento e hierarquia tipográfica
- aplica o estilo também em páginas de discussão e comentários

## Estrutura

```text
manifest.json
src/content.js
```

## Como instalar no Chrome

1. Abra `chrome://extensions`
2. Ative `Developer mode`
3. Clique em `Load unpacked`
4. Selecione a pasta deste projeto:

```text
/Users/matheuspuppe/Desktop/Projetos/redesign-hacker-news
```

## Como funciona

O Chrome injeta `src/content.js` em `https://news.ycombinator.com/*`. O script usa o DOM existente do Hacker News como base e reaplica layout, cores e navegação sem depender de build step.
