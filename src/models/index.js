import mongoose from 'mongoose';

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  bowlingHand: {
    type: String,
    required: true,
    enum: ['right', 'left'],
  },
  battingHand: {
    type: String,
    required: true,
    enum: ['right', 'left'],
  },
}, { 
  timestamps: true 
});

// Define Payment Schema
const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
}, { 
  timestamps: true 
});

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { 
  timestamps: true 
});

// Export models (with model existence check for Next.js hot reloading)
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);