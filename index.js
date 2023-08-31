const TelegramBot = require('node-telegram-bot-api');

// Token do seu bot
const bot = new TelegramBot('6513097452:AAHpjg15mq9_g_hRKRqVqWG6wn5nNeGiUm4', { polling: true });

// Estados da conversa
const NOME = 1;
const MOTIVO = 2;

// Armazenamento temporário dos dados do usuário
const userState = {};

// Comando /iniciar
bot.onText(/\/novopedido/, (msg) => {
  const chatId = msg.chat.id;
  userState[chatId] = {};
  
  bot.sendMessage(chatId, `Olá ${msg.from.first_name}, digite o nome de quem você gostaria que recebesse oração.`);
  userState[chatId].state = NOME;
});

// Função para receber o título
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if (!userState[chatId]) {
    userState[chatId] = {};
  }
  
  if (userState[chatId].state === NOME) {
    userState[chatId].nome = msg.text;
    bot.sendMessage(chatId, "Ótimo! Agora envie o motivo de oração.");
    userState[chatId].state = MOTIVO;
  } else if (userState[chatId].state === MOTIVO) {
    userState[chatId].motivo = msg.text;
    bot.sendMessage(chatId, `Pedido de oração concluído:\n\n*Por quem vamos orar:* ${userState[chatId].nome}\n\n*Motivo:* ${userState[chatId].motivo}\n\nEnviaremos sua mensagem para o grupo *Todos IPUS*, para que possamos orar juntos`, {parse_mode: 'Markdown'});

    // Enviar os dados para um grupo específico
    const grupoId = "-1001963857701"; // Substitua pelo ID do grupo real
    bot.sendMessage(grupoId, `#PedidoOração:\n\n*Por quem orar:* ${userState[chatId].nome}\n\n*Motivo:* ${userState[chatId].motivo}\n\n*Enviado por:* ${msg.from.first_name} ${msg.from.last_name}`, {parse_mode: 'Markdown'});
    
    // Limpar os dados do usuário
    delete userState[chatId];
  }
});

console.log("Bot está rodando...");

