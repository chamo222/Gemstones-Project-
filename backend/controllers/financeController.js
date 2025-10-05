import orderModel from "../models/orderModel.js";

// Finance Overview
export const getFinanceOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

    // All delivered orders
    const deliveredOrders = await orderModel.find({ status: "Delivered" });

    const walletBalance = deliveredOrders.reduce((sum, o) => sum + o.amount, 0);

    // Today's earnings
    const todaysOrders = deliveredOrders.filter(
      (o) => o.date >= startOfDay && o.date <= endOfDay
    );

    const todaysEarnings = todaysOrders.reduce((sum, o) => sum + o.amount, 0);

    // Last 3 settlements (daily totals of delivered orders)
    const settlementsMap = {};
    deliveredOrders.forEach((o) => {
      const day = new Date(o.date).toISOString().split("T")[0];
      settlementsMap[day] = (settlementsMap[day] || 0) + o.amount;
    });

    const settlements = Object.entries(settlementsMap)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 3)
      .map(([date, amount]) => ({ date, amount }));

    res.json({ walletBalance, todaysEarnings, settlements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching overview" });
  }
};

// Finance Transcripts
export const getFinanceTranscripts = async (req, res) => {
  try {
    const { orderId, category, startDate, endDate } = req.query;

    let filters = { status: "Delivered" };

    if (orderId) filters._id = orderId;
    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime(),
      };
    }

    const orders = await orderModel.find(filters).sort({ date: -1 });

    const transcripts = orders.map((o) => {
      const firstItemCategory = o.items[0]?.category || "Unknown";
      const orderTime = new Date(o.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        date: new Date(o.date).toISOString().split("T")[0],
        time: orderTime,
        orderId: o._id,
        category: firstItemCategory,
        amount: o.amount,
      };
    });

    res.json({ transcripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transcripts" });
  }
};