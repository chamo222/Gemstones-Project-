import orderModel from "../models/orderModel.js";

// Get sales data: daily, weekly, monthly
const getSalesData = async (req, res) => {
  const { type } = req.query; // daily, weekly, monthly
  try {
    const orders = await orderModel.find({ status: "Delivered" }); // only delivered orders

    const now = new Date();
    let sales = [];

    if (type === "daily") {
      // Group by day of current week
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      sales = days.map(day => {
        const total = orders
          .filter(o => new Date(o.date).getDay() === days.indexOf(day))
          .reduce((sum, curr) => sum + curr.amount, 0);
        return { label: day, amount: total };
      });
    } else if (type === "weekly") {
      // Last 4 weeks
      sales = Array.from({ length: 4 }).map((_, i) => {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);
        const total = orders
          .filter(o => new Date(o.date) >= start && new Date(o.date) < end)
          .reduce((sum, curr) => sum + curr.amount, 0);
        return { label: `Week ${4 - i}`, amount: total };
      });
    } else if (type === "monthly") {
      // Last 6 months
      sales = Array.from({ length: 6 }).map((_, i) => {
        const month = now.getMonth() - i;
        const total = orders
          .filter(o => new Date(o.date).getMonth() === month)
          .reduce((sum, curr) => sum + curr.amount, 0);
        return { label: now.toLocaleString("default", { month: "short" }) + `-${month}`, amount: total };
      }).reverse();
    }

    res.json({ success: true, sales });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getSalesData };