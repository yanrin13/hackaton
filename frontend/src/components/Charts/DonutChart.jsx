import { Chart as ChartJS } from 'chart.js/auto'
import { Doughnut } from 'react-chartjs-2'
import { useState, useEffect } from 'react'

export default function Donut() {
    const [error, setError] = useState(null)
    const [isLoaded, setisLoaded] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
    fetch('http://localhost:8888/api/analitic/categories')
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


    return (
        <>
            <div className="chart-area">
                <h1 className='sidebar__title'>Категории за все время</h1>
                <Doughnut
                    data={{
                        labels: Object.keys(data),
                        datasets: [
                            {
                                label: 'Категории обращений',
                                data: Object.values(data),
                                backgroundColor: [
                                    '#EAF0FF', // очень светлый голубой
                                    '#C9D8FF', // светло-голубой
                                    '#A9C1FF', // мягкий голубой
                                    '#87ABFE', // основной цвет палитры
                                    '#6F95F0', // насыщенный голубой
                                    '#4F75D6', // синий
                                    '#3760BF', // тёмно-синий (основной)
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                        },
                    }}
                />
            </div>

            {/* <div className='charts__description'>
                <button className='btn' onClick={() => {

                    navigate('/report', {
                        state: {
                            data1: Object.keys(data),
                            data2: Object.values(data),
                        }
                    })
                }}
                >Отчет</button>
            </div> */}
        </>
    )
}