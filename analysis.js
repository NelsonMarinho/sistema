document.addEventListener('DOMContentLoaded', () => {
    fetch('/carregamentos')
        .then(response => response.json())
        .then(carregamentos => {
            const totalPorMes = {};
            const totalVagoesPorMes = {};
            const totalPorDestino = {};
            const totalPorFilial = {};
            const quantidadePorMes = {};

            carregamentos.forEach(c => {
                const mes = c.data.substring(0, 7);

                if (!totalPorMes[mes]) totalPorMes[mes] = 0;
                if (!totalVagoesPorMes[mes]) totalVagoesPorMes[mes] = 0;
                if (!totalPorDestino[c.destino]) totalPorDestino[c.destino] = 0;
                if (!quantidadePorMes[mes]) quantidadePorMes[mes] = 0;
                if (!totalPorFilial[c.filial]) totalPorFilial[c.filial] = 0;

                totalPorMes[mes] += parseFloat(c.volume);
                totalVagoesPorMes[mes] += parseInt(c.vagoes);
                totalPorDestino[c.destino] += parseFloat(c.volume);
                totalPorFilial[c.filial] += parseFloat(c.volume);
                quantidadePorMes[mes] += 1; // Incrementa a quantidade de carregamentos no mês
            });

            // Cores baseadas no Bootstrap
            const bootstrapColors = [
                'rgba(0, 123, 255, 0.7)',  // Primary
                'rgba(40, 167, 69, 0.7)',  // Success
                'rgba(255, 193, 7, 0.7)',  // Warning
                'rgba(220, 53, 69, 0.7)',  // Danger
                'rgba(23, 162, 184, 0.7)', // Info
                'rgba(108, 117, 125, 0.7)',// Secondary
                'rgba(52, 58, 64, 0.7)',   // Dark
                'rgba(255, 255, 255, 0.7)' // Light
            ];

            function getBootstrapColor(index) {
                return bootstrapColors[index % bootstrapColors.length];
            }

            // Função para criar o gráfico de barras com rótulos
            function createBarChart(ctx, label, labels, data, unit = '') {
                return new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: label,
                            data: data,
                            backgroundColor: labels.map((_, index) => getBootstrapColor(index)),
                            borderColor: labels.map((_, index) => getBootstrapColor(index).replace('0.7', '1')),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: true,
                                    color: 'rgba(200, 200, 200, 0.3)'
                                },
                                ticks: {
                                    color: '#333',
                                    callback: function(value) {
                                        return value + unit;
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: '#333'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    color: '#333',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                }
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                color: '#333',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: function(value) {
                                    return value + unit;
                                }
                            }
                        }
                    }
                });
            }

            // Função para criar gráficos de pizza e rosca
            function createPieChart(ctx, label, labels, data, unit = '') {
                return new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: label,
                            data: data,
                            backgroundColor: labels.map((_, index) => getBootstrapColor(index)),
                            borderColor: labels.map((_, index) => getBootstrapColor(index).replace('0.7', '1')),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    color: '#333',
                                    font: {
                                        size: 14,
                                        weight: 'bold'
                                    }
                                }
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                color: '#333',
                                font: {
                                    weight: 'bold'
                                },
                                formatter: function(value) {
                                    return value + unit;
                                }
                            }
                        }
                    }
                });
            }

            // Gráfico de Total Carregado no Mês
            createBarChart(document.getElementById('totalCarregadoChart'), 'Total Carregado no Mês', Object.keys(totalPorMes), Object.values(totalPorMes), ' kg');

            // Gráfico de Total de Vagões no Mês
            createBarChart(document.getElementById('totalVagoesChart'), 'Total de Vagões no Mês', Object.keys(totalVagoesPorMes), Object.values(totalVagoesPorMes));

            // Gráfico de Total por Destino
            createPieChart(document.getElementById('totalPorDestinoChart'), 'Total por Destino', Object.keys(totalPorDestino), Object.values(totalPorDestino), ' kg');

            // Gráfico de Quantidade de Carregamentos por Mês
            createBarChart(document.getElementById('quantidadeCarregamentosChart'), 'Quantidade de Carregamentos por Mês', Object.keys(quantidadePorMes), Object.values(quantidadePorMes));

            // Gráfico de Total por Filial
            createBarChart(document.getElementById('totalPorFilialChart'), 'Total por Filial', Object.keys(totalPorFilial), Object.values(totalPorFilial), ' kg');
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
        });
});
