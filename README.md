## Projeto de chat na linha de comando

- Websockets usando modulos nativos do Node.js

- *Aula 01* - Criando interfaces em programs de linha de comando com o pacote Blessed
    - Design Pattern: Builder e Fluent Interface (chainning -> build);
    - npm blessed: pacote para estilizar o terminal;

- *Aula 02* - Trabalhando com sockets http e arquitetura orientada a eventos
    - Protocolo TCP: protoclo de comunicação principal da internet; orientado a conexões; o HTTP roda dentro do TCP/IP;
    - HTTP: segue o modelo request x response, corre-se o risco de um loop infinito e sobrecarga do sistema (HTTP Poli); 
    - Protocolo Websockets: veio para resolver o problema do HTTP; faz a transferencia de dados em uma única conexão sem sobrecarga do sistema;
        - roda nas portas 443 ou 80 do servidor; 
        - usa HTTP upgrade header: é o upgrade do HTTP;

- *Aula 03* - Atualização de dados em tempo real (dados de atividade, mensagens e usuários online)