import Order from "../Models/Order.js";

export const getDashboardData = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalSales = orders.length;
    const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0);
    const totalViews = 1200; // example, you can store page views in DB later

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData = months.map((month, idx) => {
      const monthOrders = orders.filter(o => o.createdAt.getMonth() === idx);
      return {
        month,
        sales: monthOrders.length,
        earnings: monthOrders.reduce((sum, o) => sum + o.total, 0),
        views: Math.floor(Math.random() * 200 + 50)
      };
    });

    res.json({ totalSales, totalEarnings, totalViews, monthlyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get dashboard data" });
  }
};
