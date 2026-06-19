import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  caption: string;
  body: string;
  thumbnail: string | null;
  images: string[];
  detailBody: string | null;
  status: "published" | "draft";
  projectStatus: "awarded" | "in-progress" | "completed";
  category: string;
  location: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
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
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
    projectStatus: {
      type: String,
      enum: ["awarded", "in-progress", "completed"],
      default: "in-progress",
    },
    category: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

ProjectSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
