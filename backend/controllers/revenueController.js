import orderModel from "../models/orderModel.js";

// Revenue stats for admin
const getRevenueStats = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    const totalOrders = orders.length;
    const orderPlaced = orders.filter(o => o.status === "Order Placed").length;
    const packingOrders = orders.filter(o => o.status === "Packing").length;
    const shippedOrders = orders.filter(o => o.status === "Shipped").length;
    const outForDeliveryOrders = orders.filter(o => o.status === "Out for Delivery").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length; // will implement later

    // Total sales only from delivered & paid orders
    const totalSales = orders
      .filter(o => o.status === "Delivered") // only delivered orders
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      stats: {
        totalOrders,
        orderPlaced,
        packingOrders,
        shippedOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        totalSales,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getRevenueStats };