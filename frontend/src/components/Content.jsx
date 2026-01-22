import BarChart from "./Charts/BarChart"
import DonutChart from "./Charts/DonutChart"
import LineChart from "./Charts/LineChart"

export default function Content({ categoriesData, districtData, periodData }) {

    return (
        <>
            <div className='charts wrapper'>
                <div className='charts__chart card-a'>
                    <BarChart data={periodData} />
                </div>
                <div className='charts__chart card-b'>
                    <DonutChart data={categoriesData} />
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
                {/* <input type="file"
                    accept='.json'
                /> */}
            </div>
        </>
    )
}