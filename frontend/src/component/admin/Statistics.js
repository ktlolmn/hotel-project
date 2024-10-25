import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from '../../css/Statistics.module.css';
import AdminSidebar from '../Parial/AdminSidebar';
import { MdSystemUpdateAlt } from 'react-icons/md';
import ApiService from '../service/ApiService'; 
import Toast from '../service/Toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [data, setData] = useState(Array(12).fill(0)); 
  const [loading, setLoading] = useState(true);
  const [isToast, setIsToast] = useState(true);
  const [message, setMessage] = useState(true);

  const handleYearChange = (date) => {
    if (date !== null) {
      setSelectedYear(date);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getBookingByYear(selectedYear.getFullYear());
        if(response.status === 200){
          console.log(response.bookingList)
          const bookings = response.bookingList; 
          const revenueData = Array(12).fill(0);
          bookings.forEach(booking => {
            const checkInDate = new Date(booking.checkInDate); 
            const checkOutDate = new Date(booking.checkOutDate); 
            const daysRented = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24); 
            const roomPrice = booking.roomDTO.price; 
            const monthIndex = checkInDate.getMonth(); 
            revenueData[monthIndex] += daysRented * roomPrice;
          });
          setData(revenueData);
        }
      } catch (error) {
        setIsToast(true)
        setMessage("Error fetching data")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const dataChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: `Revenue for ${selectedYear.getFullYear()}`,
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const exportToExcel = () => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr, 0); 
    const notes = [
      { Month: "Revenue Statistics for the Year", Revenue: `${selectedYear.getFullYear()} (in USD)` },
      { Month: "Total Revenue", Revenue: totalRevenue }, 
      { Month: "Total Revenue for the Year", Revenue: totalRevenue }, 
    ];
    const worksheet = XLSX.utils.json_to_sheet(
      dataChart.labels.map((label, index) => ({
        Month: label,
        Revenue: data[index],
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_json(worksheet, notes, { skipHeader: true, origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue');
    XLSX.writeFile(workbook, `Revenue_${selectedYear.getFullYear()}.xlsx`);
    setIsToast(true);
    setMessage("Export data to excel success");
  };
  const totalRevenue = data.reduce((acc, value) => acc + value, 0);
  return (
    <>
      <AdminSidebar />
      <div className={styles.container}>
        <h2 className={styles.header}>Revenue Statistics for {selectedYear.getFullYear()}</h2>
        <h3 className={styles.total}>Total Revenue: ${loading ? 'Loading...' : totalRevenue}</h3>
        <div className={styles.controls}>
          <DatePicker
            selected={selectedYear}
            onChange={handleYearChange}
            showYearPicker
            dateFormat="yyyy"
            className={styles.yearPicker}
          />
          <button onClick={exportToExcel} className={styles.exportButton}>
            <MdSystemUpdateAlt /> <p><u>Export excel</u></p>
          </button>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <Bar
            data={dataChart}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Revenue ($)',
                  },
                  ticks: {
                    callback: function (value) {
                      return value;
                    },
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += '$' + context.parsed.y;
                      }
                      return label;
                    },
                  },
                },
              },
            }}
          />
        )}
        {
          isToast && (
            <Toast message={message} onClose={3000} />
          )
        }
      </div>
    </>
  );
};

export default Statistics;
