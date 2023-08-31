const { createServer } = require('http');
const TelegramBot = require('node-telegram-bot-api');

// Token do seu bot
const bot = new TelegramBot('6513097452:AAHpjg15mq9_g_hRKRqVqWG6wn5nNeGiUm4');

// Estados da conversa
const NOME = 1;
const MOTIVO = 2;

// Armazenamento temporário dos dados do usuário
const userState = {};

const grupoId = "-1001963857701"; // Substitua pelo ID do grupo real

// Comando /novopedido
bot.onText(/\/novopedido/, (msg) => {
  if (msg.chat.id !== grupoId) {
    const chatId = msg.chat.id;
    userState[chatId] = {};
    
    bot.sendMessage(chatId, `Olá ${msg.from.first_name}, digite o nome de quem você gostaria que recebesse oração.`);
    userState[chatId].state = NOME;
  }
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
    bot.sendMessage(grupoId, `#PedidoOração:\n\n*Por quem orar:* ${userState[chatId].nome}\n\n*Motivo:* ${userState[chatId].motivo}\n\n*Enviado por:* ${msg.from.first_name} ${msg.from.last_name}`, {parse_mode: 'Markdown'});
    
    // Limpar os dados do usuário
    delete userState[chatId];
  }
});

bot.setWebhook('https://bot-telegram-g4o4pwocd-fillima.vercel.app/webhook');

// Crie um servidor HTTP para receber as requisições
createServer((req, res) => {
  if (req.method === 'POST') {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      const update = JSON.parse(data);
      bot.processUpdate(update);
    });
  }

  res.end('OK');
}).listen(3000);

console.log("Bot está rodando...");

