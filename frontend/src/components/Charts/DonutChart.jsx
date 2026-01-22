import { Doughnut } from 'react-chartjs-2'

export default function DonutChart({ data }) {
    // если data ещё нет, используем пустой объект
    const chartData = data || {}

    const labels = Object.keys(chartData)
    const values = Object.values(chartData)
    const total = values.reduce((acc, val) => acc + val, 0)

    return (
        <div className="chart-area">
            <h1 className='sidebar__title'>
                Общее число жалоб: {total}
            </h1>
            <Doughnut
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Категории обращений',
                            data: values,
                            backgroundColor: [
                                '#EAF0FF',
                                '#C9D8FF',
                                '#A9C1FF',
                                '#87ABFE',
                                '#6F95F0',
                                '#4F75D6',
                                '#3760BF',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' } },
                }}
            />
        </div>
    )
}
