module.exports = {
    apps: [
      {
        name: 'Corretora',
        script: 'dist/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            DB_HOST    : "localhost",
            DB_PASSWORD: "root",
            DB_DATABASE: "frcorretora",
            DB_NAME    : "frcorretora",
            DB_PORT    : "5432",
            DB_USERNAME: "postgres",
            SECRET     : "Iss0Aqu1N@0EBr1ncad3ir4",
            PORT       : 8000
          },
      },
    ],
  };
  