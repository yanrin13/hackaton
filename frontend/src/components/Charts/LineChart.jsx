import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'


export default function LineChart() {

    const [error, setError] = useState(null)
    const [isLoaded, setisLoaded] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
    fetch('http://localhost:8888/api/analitic/district')
        .then(res => res.json())
        .then(
            (result) => {
                setData(result)
            },
            (error) => {
                setisLoaded(true)
                setError(error)
            }
        )
    }, [])

    console.log(data)

    return (
        <>
            <div className="chart-area">
                <h1 className='sidebar__title'>Проблемы по районам</h1>
                <Line
                    data={{
                        labels: Object.keys(data),
                        datasets: [
                            {
                                label: 'Районы',
                                data: Object.values(data),
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
                        plugins: {
                            legend: {
                                display: true,
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            <div className='charts__description'>
                {/* <button className='btn'>button</button>
                <button className='btn'>button</button> */}
            </div>
        </>
    )
}