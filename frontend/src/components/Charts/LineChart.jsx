import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

export default function LineChart({ data }) {
    const chartData = data || {}

    const labels = Object.keys(chartData)
    const values = Object.values(chartData)
    const total = values.reduce((acc, val) => acc + val, 0)

    return (
        <div className="chart-area">
            <h1 className='sidebar__title'>Проблемы по районам</h1>
            <Line
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Районы',
                            data: values,
                            borderColor: '#3760BF',
                            backgroundColor: 'rgba(135, 171, 254, 0.3)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 5,
                            pointBackgroundColor: '#87ABFE',
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true } },
                }}
            />
        </div>
    )
}
