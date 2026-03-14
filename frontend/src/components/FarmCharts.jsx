import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  { day: "Mon", moisture: 40 },
  { day: "Tue", moisture: 55 },
  { day: "Wed", moisture: 50 },
  { day: "Thu", moisture: 70 },
  { day: "Fri", moisture: 65 }
];

const FarmCharts = () => {

  return (

    <LineChart width={400} height={250} data={data}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="day" />

      <YAxis />

      <Tooltip />

      <Line
        type="monotone"
        dataKey="moisture"
        stroke="#16a34a"
      />

    </LineChart>

  );
};

export default FarmCharts;