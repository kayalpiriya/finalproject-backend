import express from "express";
import { createShipment, updateShipmentStatus, getShipments } from "../Controllers/shipmentController.js";
import { verifyToken, verifyAdmin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createShipment); // Admin creates shipment
router.put("/:id", verifyToken, verifyAdmin, updateShipmentStatus); // Admin updates shipment status
router.get("/", verifyToken, verifyAdmin, getShipments); // Admin views all shipments

export default router;
