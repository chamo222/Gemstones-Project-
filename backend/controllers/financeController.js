import orderModel from "../models/orderModel.js";

// Finance Overview
export const getFinanceOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

    // All delivered orders
    const deliveredOrders = await orderModel.find({ status: "Delivered" });

    // Wallet balance = sum of all delivered orders
    const walletBalance = deliveredOrders.reduce((sum, o) => sum + o.amount, 0);

    // Today's earnings = sum of orders delivered today
    const todaysOrders = deliveredOrders.filter(
      (o) => {
        const orderTime = new Date(o.date).getTime();
        return orderTime >= startOfDay && orderTime <= endOfDay;
      }
    );
    const todaysEarnings = todaysOrders.reduce((sum, o) => sum + o.amount, 0);

    // Weekly settlements (last 7 days)
    const settlementsMap = {};
    const todayDate = new Date();
    const weekAgo = new Date(todayDate);
    weekAgo.setDate(todayDate.getDate() - 6);

    deliveredOrders.forEach((o) => {
      const orderDate = new Date(o.date);
      if (orderDate >= weekAgo && orderDate <= todayDate) {
        const day = orderDate.toISOString().split("T")[0];
        settlementsMap[day] = (settlementsMap[day] || 0) + o.amount;
      }
    });

    const settlements = Object.entries(settlementsMap)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
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
    const { orderId, name, startDate, endDate } = req.query;

    let filters = { status: "Delivered" };

    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime(),
      };
    }

    if (name) {
      filters["customer.name"] = { $regex: name, $options: "i" };
    }

    let orders = await orderModel.find(filters).sort({ date: -1 });

    // Filter by short order ID (last 6 characters)
    if (orderId) {
      orders = orders.filter(
        (o) => o._id.toString().slice(-6).toUpperCase() === orderId.toUpperCase()
      );
    }

    const transcripts = orders.map((o) => ({
      date: new Date(o.date).toISOString().split("T")[0],
      orderId: o._id,
      shortOrderId: o._id.toString().slice(-6).toUpperCase(),
      category: o.items?.[0]?.category || "N/A",
      amount: o.amount,
      paymentMethod: o.paymentMethod || "N/A",
      customerName: o.customer?.name || "Unknown", // Updated for nested customer
    }));

    res.json({ transcripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transcripts" });
  }
};