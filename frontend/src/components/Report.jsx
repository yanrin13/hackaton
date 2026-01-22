import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function Report() {
    const { state } = useLocation();
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 2000);

        return () => clearTimeout(timer); // cleanup
    }, []);
    return (
        <div>
            <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>месяц</th>
                        <th>пользователи</th>
                        <th>доходы</th>
                    </tr>
                </thead>
                <tbody>
                    {state.months.map((month, i) => (
                        <tr key={i}>
                            <td>{month}</td>
                            <td>{state.data1[i]}</td>
                            <td>{state.data2[i]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}