COMANDOS PARA O PRISMA NA BD:

//Gerar o Schema
npx prisma generate

//Carregar o Schema e criar tabelas
npx prisma migrate dev --name init

//Seed
node seed.js


//Advanced

//Criar nova migration
//Criar uma nova migração: Quando você faz mudanças no schema, você precisa gerar uma nova migração para refletir essas alterações no banco de dados. O Prisma gera migrações para que o banco de dados fique sincronizado com o seu schema.
//Execute o seguinte comando:
npx prisma migrate dev --name nome_da_migracao

//Sincronizar prisma na base de dados
//Se você remover ou adicionar tabelas diretamente, você pode usar o comando prisma db push para forçar o Prisma a sincronizar seu schema com o banco de dados:
npx prisma db push

//Limpar base de dados de forma controlada
//Se você deseja "limpar" o banco de dados e aplicar todas as migrações novamente, você pode executar:
npx prisma migrate reset