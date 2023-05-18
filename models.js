const mongoose = require("mongoose");

const tailscaleEventSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
    tailnet: { type: String, required: true },
    message: { type: String, required: true },
    actor: { type: String, required: false },
    nodeID: { type: String, required: false },
    deviceName: { type: String, required: false },
    managedBy: { type: String, required: false },
    user: { type: String, required: false },
    oldRoles: { type: Array, required: false, default: []},
    newRoles: { type: Array, required: false, default: [] },
    newPolicy: { type: Array, required: false, default: [] },
    oldPolicy: { type: Array, required: false, default: [] },
    expiration: { type: Date, required: false }
});

module.exports = {
    tailscaleEvents: mongoose.model('tailscaleEvents', tailscaleEventSchema)
}