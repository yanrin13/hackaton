import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

export default function BarChart({ data }) {
    const ALL_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    const ALL_DATA1 = [40, 55, 90, 140, 220, 310, 420, 380, 260, 290, 360, 480];
    const ALL_DATA2 = [10, 18, 35, 60, 120, 210, 350, 300, 180, 230, 320, 520];

    const [months, setMonths] = useState(ALL_MONTHS);
    const [data1, setData1] = useState(ALL_DATA1);
    const [data2, setData2] = useState(ALL_DATA2);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const chartData = data || {}

    const labels = Object.keys(chartData)
    const values = Object.values(chartData)
    console.log(labels)
    console.log(values)

    useEffect(() => {
        if (!from || !to) return;

        const fromIdx = Number(from.slice(5)) - 1;
        const toIdx = Number(to.slice(5));

        setMonths(ALL_MONTHS.slice(fromIdx, toIdx));
        setData1(ALL_DATA1.slice(fromIdx, toIdx));
        setData2(ALL_DATA2.slice(fromIdx, toIdx));
    }, [from, to]);

    const navigate = useNavigate();

    return (
        <>
            <div className="chart-area">
                <Bar
                    data={{
                        labels: months,
                        datasets: [{
                            "label": "Проблемы",
                            "data": data1
                        },
                        {
                            "label": "Решения",
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
            </div>
        </>
    )
}