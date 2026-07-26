import mongoose from "mongoose";
const { Schema } = mongoose;

const MasterDressSchema = new Schema(
  {
    masterDressId: { type: String, immutable: true, unique: true },
    dressName: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, trim: true, unique: true },

    brand: { type: String, trim: true },

    listingIds: [{ type: String, required: true }],
    lenderIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],

    sizes: [{ type: String }],
    colors: [{ type: String }],
    occasions: [{ type: String }],
    categories: [{ type: String }],

    content: {
      description: { type: String },
      fabric: { type: String },
    },

    media: [{ type: String, required: true }],

    thumbnail: { type: String },

    shippingDetails: {
      isLocalPickup: { type: Boolean, default: false },
      isShippingAvailable: { type: Boolean, default: true },
    },
    insuranceFee: { type: Number },

    basePrice: { type: Number },
    rrpPrice: { type: Number },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate slug and masterDressId before saving
MasterDressSchema.pre("save", async function (next) {
  // Generate slug if missing or dressName was modified
  if (!this.slug || this.isModified("dressName")) {
    let baseSlug = this.dressName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    // We will ensure it is unique by checking if it already exists, if so append a random string
    // This is a basic mitigation. For robust handling, one would use a plugin or more complex logic.
    const existing = await mongoose.model("MasterDress").findOne({ slug: baseSlug });
    if (existing && existing._id.toString() !== this._id.toString()) {
       this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 8)}`;
    } else {
       this.slug = baseSlug;
    }
  }

  // Generate masterDressId if missing
  if (!this.masterDressId) {
    const last = await mongoose.model("MasterDress").findOne().sort({ createdAt: -1 });
    let newId = "Muse-0001";
    if (last?.masterDressId) {
      const lastNum = Number.parseInt(last.masterDressId.split("-")[1]);
      newId = `Muse-${String(lastNum + 1).padStart(4, "0")}`;
    }
    this.masterDressId = newId;
  }

  // If no thumbnail, use first media URL
  if (!this.thumbnail && this.media && this.media.length > 0) {
    this.thumbnail = this.media[0];
  }

  next();
});
MasterDressSchema.index({ dressName: 'text', slug: 'text' });
MasterDressSchema.index({ lenderIds: 1 });

const MasterDress = mongoose.model("MasterDress", MasterDressSchema);
export default MasterDress;
