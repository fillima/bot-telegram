# Use uma imagem base que já tenha o Node.js instalado
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o resto dos arquivos do projeto para o diretório de trabalho
COPY . .

# Defina o comando para iniciar a aplicação
CMD ["node", "index.js"]
