import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  caption: string;
  body: string;
  thumbnail: string | null;
  images: string[];
  detailBody: string | null;
  publishDate: Date;
  status: "published" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
    },
    thumbnail: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function (v: string[]) {
            return v.length <= 4;
          },
          message: "Maximum 4 gallery images allowed",
        },
      ],
    },
    detailBody: {
      type: String,
      default: null,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  { timestamps: true },
);

BlogSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
