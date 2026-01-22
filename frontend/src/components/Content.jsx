import SideBar from './SideBar'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";


export default function Content() {
    const ALL_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    const ALL_DATA1 = [40, 55, 90, 140, 220, 310, 420, 380, 260, 290, 360, 480];
    const ALL_DATA2 = [10, 18, 35, 60, 120, 210, 350, 300, 180, 230, 320, 520];

    const [months, setMonths] = useState(ALL_MONTHS);
    const [data1, setData1] = useState(ALL_DATA1);
    const [data2, setData2] = useState(ALL_DATA2);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");


    useEffect(() => {
        if (!from || !to) return;

        const fromIdx = Number(from.slice(5)) - 1;
        const toIdx = Number(to.slice(5)); // ⚠ slice до НЕ включительно

        setMonths(ALL_MONTHS.slice(fromIdx, toIdx));
        setData1(ALL_DATA1.slice(fromIdx, toIdx));
        setData2(ALL_DATA2.slice(fromIdx, toIdx));
    }, [from, to]);

    const navigate = useNavigate();


    return (
        <>
            <div className='charts wrapper'>
                <div className='charts__chart'>
                    <div className="chart-area">
                        <Bar
                            data={{
                                labels: months,
                                datasets: [{
                                    "label": "Пользователи",
                                    "data": data1
                                },
                                {
                                    "label": "Доход",
                                    "data": data2
                                }
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                    <div className='charts__description'>
                        <label>
                            С:
                            <input type="month" value={from} onChange={e => setFrom(e.target.value)} />
                        </label>

                        <label>
                            По:
                            <input type="month" value={to} onChange={e => setTo(e.target.value)} />
                        </label>

                        <button className='btn' onClick={() => {

                            navigate('/report', {
                                state: {
                                    months: months,
                                    data1: data1,
                                    data2: data2,
                                }
                            })
                        }}
                        >button</button>
                    </div>
                </div>
                <div className='charts__chart'>
                    <div className="chart-area">
                        <Doughnut
                            data={{
                                labels: ['a', 'b', 'c'],
                                datasets: [{
                                    label: 'revue',
                                    data: [200, 300, 400]
                                },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                    <div className='charts__description'>
                        <button className='btn'>button</button>
                        <button className='btn'>button</button>
                    </div>
                </div>
                <div className='charts__chart'>
                    <div className="chart-area">
                        <Line
                            data={{
                                labels: ['a', 'b', 'c'],
                                datasets: [{
                                    label: 'revue',
                                    data: [200, 300, 100]
                                },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                    <div className='charts__description'>
                        <button className='btn'>button</button>
                        <button className='btn'>button</button>
                    </div>
                </div>
                <div className='charts__chart'>
                    <div className="chart-area"></div>
                    <div className='charts__description'>
                        <button className='btn'>button</button>
                        <button className='btn'>button</button>
                    </div>
                </div>

                <div className='charts__chart'>
                    <div className="chart-area"></div>
                    <div className='charts__description'>
                        <button className='btn'>button</button>
                        <button className='btn'>button</button>
                    </div>
                </div>
                <input type="file"
                    accept='.json'
                />
            </div>
        </>
    )
}