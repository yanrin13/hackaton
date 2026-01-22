import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

export default function BarChart({ data }) {
    const ALL_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [keys, setKeys] = useState([]); // хранит YYYY-MM для фильтра

    useEffect(() => {
        if (!data) return;

        const monthly = {};
        Object.entries(data).forEach(([date, value]) => {
            const [year, month] = date.split("-");
            const key = `${year}-${month}`; // YYYY-MM
            monthly[key] = (monthly[key] || 0) + value;
        });

        const sortedKeys = Object.keys(monthly).sort();

        const newLabels = [];
        const newValues = [];
        sortedKeys.forEach(key => {
            const [year, month] = key.split("-");
            newLabels.push(`${ALL_MONTHS[Number(month) - 1]} ${year}`);
            newValues.push(monthly[key]);
        });

        setKeys(sortedKeys);
        setLabels(newLabels);
        setValues(newValues);
    }, [data]);

    // Фильтруем по выбранному диапазону YYYY-MM
    const filteredLabels = labels.filter((_, idx) => {
        if (!from || !to) return true;
        return keys[idx] >= from && keys[idx] <= to;
    });

    const filteredValues = values.filter((_, idx) => {
        if (!from || !to) return true;
        return keys[idx] >= from && keys[idx] <= to;
    });

    return (
        <>
            <div className="chart-area">
                <Bar
                    data={{
                        labels: filteredLabels,
                        datasets: [{
                            label: "Количество",
                            data: filteredValues,
                            backgroundColor: "#87ABFE"
                        }]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false
                    }}
                />
            </div>

            <div className="charts__description">
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
    );
}
