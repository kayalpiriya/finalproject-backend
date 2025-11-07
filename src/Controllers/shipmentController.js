import Shipment from "../Models/Shipment.js";

export const createShipment = async (req, res) => {
  try {
    const { orderId, userId, address } = req.body;
    const shipment = new Shipment({ orderId, userId, address });
    await shipment.save();
    res.status(201).json({ message: "Shipment created", shipment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, shippedDate, deliveryDate } = req.body;

    const updated = await Shipment.findByIdAndUpdate(
      id,
      { status, trackingNumber, shippedDate, deliveryDate },
      { new: true }
    );
    res.status(200).json({ message: "Shipment updated", updated });
  } catch (err) {
    
    res.status(500).json({ message: err.message });
  }
};

export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("orderId userId");
    res.status(200).json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
