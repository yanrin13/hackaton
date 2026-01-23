import BarChart from "./Charts/BarChart"
import DonutChart from "./Charts/DonutChart"
import LineChart from "./Charts/LineChart"

export default function Content({ categoriesData, districtData, periodData, selectedDistrict, setSelectedDistrict }) {

    return (
        <>
            <div className='charts wrapper'>
                <div className='charts__chart card-a'>
                    <BarChart data={periodData} />
                </div>
                <div className='charts__chart card-b'>
                    <DonutChart data={categoriesData} />
                    <div className="charts__description">
                        <select
                            className='charts__donut-btn'
                            style={{ maxWidth: '200px' }}
                            value={selectedDistrict}
                            onChange={e => setSelectedDistrict(e.target.value)}
                        >
                            <option value="1">Все районы</option>
                            <option value="Адмиралтейский">Адмиралтейский</option>
                            <option value="Василеостровский">Василеостровский</option>
                            <option value="Выборгский">Выборгский</option>
                            <option value="Калининский">Калининский</option>
                            <option value="Кировский">Кировский</option>
                            <option value="Колпинский">Колпинский</option>
                            <option value="Красногвардейский">Красногвардейский</option>
                            <option value="Красносельский">Красносельский</option>
                            <option value="Кронштадтский">Кронштадтский</option>
                            <option value="Курортный">Курортный</option>
                            <option value="Московский">Московский</option>
                            <option value="Невский">Невский</option>
                            <option value="Петроградский">Петроградский</option>
                            <option value="Петродворцовый">Петродворцовый</option>
                            <option value="Приморский">Приморский</option>
                            <option value="Пушкинский">Пушкинский</option>
                            <option value="Фрунзенский">Фрунзенский</option>
                            <option value="Центральный">Центральный</option>
                        </select>
                    </div>
                </div>
                <div className='charts__chart card-e'>
                    <LineChart data={districtData} />
                </div>
                <div className='charts__chart card-c'>
                    <div className="chart-area">
                        <h1 className="sidebar__title">Рекомендация</h1>
                        <p></p>
                    </div>
                </div>
                <div className='charts__chart card-d'>
                    <div className="chart-area">
                        <h1 className="sidebar__title">Рекомендация</h1>
                        <p></p>
                    </div>
                </div>
            </div>
        </>
    )
}