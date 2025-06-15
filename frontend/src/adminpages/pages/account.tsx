import { useEffect, useState } from 'react';

export default function SiteAccountPage() {
  const [entries, setEntries] = useState([]);
  const [month, setMonth] = useState(4); // April
  const [year, setYear] = useState(2025);
  const [siteName, setSiteName] = useState('ARJUNPUR');
  const [openingBalance, setOpeningBalance] = useState(67015);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(
          `/api/account?month=${month}&year=${year}&siteName=${siteName}`
        );
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error('Error fetching entries:', err);
      }
    };
    fetchEntries();
  }, [month, year, siteName]);

  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const remainingBalance = openingBalance - totalAmount;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{siteName} - April {year}</h1>

      <table className="w-full border border-black text-sm">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-black px-2 py-1">DATE</th>
            <th className="border border-black px-2 py-1">AMOUNT</th>
            <th className="border border-black px-2 py-1">DATE</th>
            <th className="border border-black px-2 py-1">PARTICULAR</th>
            <th className="border border-black px-2 py-1">AMOUNT</th>
            <th className="border border-black px-2 py-1">WHO GIVE</th>
            <th className="border border-black px-2 py-1">P MODE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-bold">OPENING BALANCE</td>
            <td className="border border-black px-2 py-1 font-bold">{openingBalance.toLocaleString()}</td>
            <td colSpan={5} className="border border-black px-2 py-1"></td>
          </tr>

          {entries.map((entry, idx) => (
            <tr key={idx}>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1"></td>
              <td className="border border-black px-2 py-1">{new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
              <td className="border border-black px-2 py-1">{entry.category}</td>
              <td className="border border-black px-2 py-1">{entry.amount}</td>
              <td className="border border-black px-2 py-1">{entry.whoGive || ''}</td>
              <td className="border border-black px-2 py-1">{entry.paymentMode || ''}</td>
            </tr>
          ))}

          <tr className="bg-gray-100 font-bold">
            <td colSpan={4} className="border border-black px-2 py-1 text-right">TOTAL AMOUNT</td>
            <td className="border border-black px-2 py-1">{totalAmount}</td>
            <td colSpan={2} className="border border-black px-2 py-1"></td>
          </tr>

          <tr className="bg-gray-200 font-bold">
            <td colSpan={1} className="border border-black px-2 py-1">REMAINING BALANCE</td>
            <td className="border border-black px-2 py-1">{remainingBalance}</td>
            <td colSpan={5} className="border border-black px-2 py-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}