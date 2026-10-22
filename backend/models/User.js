import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['citizen', 'officer'],
      default: 'citizen',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      enum: [
        'PWD',
        'Electrical Department',
        'Municipal Sanitation',
        'Water Department',
        'Drainage Department',
        'Electricity Board',
        'Garden Department',
        'Building Authority',
        'Municipal Corporation',
        'General Administration',
        ''
      ],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
