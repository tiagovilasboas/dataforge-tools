import Papa from 'papaparse';

const csvData = `name,email,age,city,active
João Silva,joao@email.com,28,São Paulo,true
Maria Santos,maria@email.com,32,Rio de Janeiro,true
Pedro Costa,pedro@email.com,25,Belo Horizonte,false
Ana Oliveira,ana@email.com,29,Salvador,true
Carlos Ferreira,carlos@email.com,35,Recife,false
Lúcia Mendes,lucia@email.com,31,Fortaleza,true
Roberto Lima,roberto@email.com,27,Curitiba,false
Fernanda Costa,fernanda@email.com,33,Porto Alegre,true
Marcos Silva,marcos@email.com,26,Brasília,true
Juliana Santos,juliana@email.com,30,Manaus,false`;

const result = Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  transform: (value) => value.trim()
});

console.log('Errors:', result.errors);
console.log('Data length:', result.data.length);
console.log('Headers:', result.meta.fields);
console.log('First row:', result.data[0]); 