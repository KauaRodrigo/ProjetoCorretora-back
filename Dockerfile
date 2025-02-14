# Use a imagem base do Node.js
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install --production

# Copie o restante dos arquivos da aplicação
COPY . .

# Compile o código TypeScript
RUN npm run build

# Exponha a porta que a aplicação usa
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["npm", "run", "start:prod"]
