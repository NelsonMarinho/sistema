// Substituir gráfico de Total por Filial por um gráfico de pizza
new Chart(document.getElementById('totalPorFilialChart'), {
    type: 'pie',
    data: {
        labels: Object.keys(totalPorFilialMes),
        datasets: [{
            label: 'Total por Filial',
            data: Object.keys(totalPorFilialMes).map(filial => {
                return Object.values(totalPorFilialMes[filial]).reduce((acc, cur) => acc + cur, 0);
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
