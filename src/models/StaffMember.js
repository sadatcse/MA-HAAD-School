import mongoose from 'mongoose';

export const STAFF_GROUPS = ['board-of-trustees', 'management', 'primary-teachers', 'junior-teachers', 'secondary-teachers'];

// People on the Administration pages — managed in Dashboard → Teachers & Staff
const StaffMemberSchema = new mongoose.Schema(
  {
    group: { type: String, enum: STAFF_GROUPS, required: true },
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    designation: { type: String, trim: true, default: '', maxlength: 120 },
    subject: { type: String, trim: true, default: '', maxlength: 120 },
    qualification: { type: String, trim: true, default: '', maxlength: 200 },
    photo: { type: String, trim: true, default: '', maxlength: 1000 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

StaffMemberSchema.index({ group: 1, order: 1, name: 1 });

export default mongoose.models.StaffMember || mongoose.model('StaffMember', StaffMemberSchema);
