import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),
  phone: yup
    .string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must be a valid Indian 10-digit number"
    )
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/\d/, "Password must contain at least one number")
    .required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

export const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .notOneOf(
      [yup.ref("currentPassword")],
      "New password must be different from current password"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export const addressSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  streetAddress: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("ZIP code is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone number is required"),
  isDefault: yup.boolean(),
});

export const productSchema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  mrp: yup
    .number()
    .typeError("MRP must be a number")
    .positive("MRP must be positive")
    .required("MRP is required"),
  purity: yup.string().when("material", {
    is: (material) =>
      ["gold", "silver", "platinum"].some((m) => m === material),
    then: (schema) =>
      schema.required("Purity is required for gold, silver, or platinum items"),
    otherwise: (schema) => schema.notRequired(),
  }),
  sellingPrice: yup
    .number()
    .typeError("Selling price must be a number")
    .positive("Selling price must be positive")
    .required("Selling price is required")
    .test(
      "is-less-than-mrp",
      "Selling price must be less than MRP",
      function (value) {
        return value < this.parent.mrp;
      }
    ),
  subcategory: yup
    .string()
    .required("Subcategory is required")
    .notOneOf([""], "Subcategory is required"),
  weight: yup
    .number()
    .typeError("Weight must be a number")
    .integer("Weight must be an integer")
    .min(1, "Weight must be at least 1")
    .max(5000, "Weight cannot be more than 5000")
    .required("Weight is required"),
  stock: yup
    .number()
    .typeError("Minimum quantity must be a number")
    .integer("Must be integer")
    .min(1, "Minimum stock quantity must be at least 1")
    .max(500, "Minimum stock quantity cannot be more than 500")
    .required("stock quantity is required"),    
  occasion: yup.string().required('Occasion is required'),
  warrantyInMonths: yup
    .number()
    .typeError("Warranty must be a number")
    .integer("Warranty must be an integer")
    .min(0, "Warranty cannot be negative")
    .max(12, "Warranty cannot exceed 12 months")
    .required("Warranty is required"),
  isReturnable: yup.boolean(),
  returnPolicyDays: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("isReturnable", ([isReturnable], schema) => {
      return isReturnable
        ? schema
            .typeError("Return days must be a number")
            .integer("Must be integer")
            .min(1, "Return days must be at least 1")
            .max(30, "Return days cannot be more than 30")
            .required("Return days is required when returnable")
        : schema.notRequired();
    }),
});

export const adminloginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must contain at least one uppercase, lowercase, number and special character"
    ),
});
