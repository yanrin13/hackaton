import { Doughnut } from 'react-chartjs-2'

export default function DonutChart({ data, theme }) {
    // если data ещё нет, используем пустой объект
    const chartData = data || {}

    const labels = Object.keys(chartData)
    const values = Object.values(chartData)
    const total = values.reduce((acc, val) => acc + val, 0)

    const colors = {
    light: ['#EAF0FF', '#C9D8FF', '#A9C1FF', '#87ABFE', '#6F95F0', '#4F75D6', '#3760BF'],
    dark: ['#BB86FC', '#9f59e0', '#843ec5', '#7226ba', '#5e13a4', '#4a0789', '#360366']
    }
    const currentColors = theme ? colors.dark : colors.light
    const textColor = theme ? '#E0E0E0' : '#000000'

    return (
        <div className="chart-area">
            <h1 className='sidebar__title' style={{marginBottom:'5px'}}>
                Общее число жалоб: {total}
            </h1>
            <Doughnut
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Категории обращений',
                            data: values,
                            backgroundColor: currentColors,
                            borderWidth: 1,
                            borderColor: theme ? '#1F1F1F' : '#FFFFFF', // граница адаптируется под тему
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right', labels: {
                                color: textColor
                            } } },
                }}
            />
        </div>
    )
}
