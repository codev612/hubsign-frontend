export const plans = [
  {
    id: "personal",
    name: "Personal",
    summary: "For individuals and sole proprietors",
    price: "$5/month",
    items: [
      "Up to 5 agreements for signature per month",
      "Single user",
      "Save up to 5 templates for recurring use",
      "Basic document tracking",
      "Email notifications",
    ],
    buttonTitle: "Buy Now",
    buttonLink: "/",
  },
  {
    id: "standard",
    name: "Standard",
    summary: "Small teams or growing businesses",
    price: "$15/month",
    items: [
      "Up to 50 agreements for signature per month",
      "Add multiple users(up to 50)",
      "Save up to 100 templates for recurring use",
      "Share your templates easily with your team members",
      "Multiple recipients",
    ],
    buttonTitle: "Buy Now",
    buttonLink: "/",
  },
  {
    id: "busipro",
    name: "Business Pro",
    summary: "Large organizations with custom needs",
    price: "Contact us for pricing",
    items: [
      "Send unlimited agreements",
      "Unlimited users",
      "Automated e-sign forms",
    ],
    buttonTitle: "Contact Us",
    buttonLink: "/",
  },
];

export const users = [
  {
    uid: 1,
    name: "doc1",
    status: "draft",
    recipients: [
      { name:'dmytro zaiets', email:'dmytrozaets66@gmail.com' },
      {name: 'michael joe', email: 'michaeljoe612@outlook.com'}
    ],
    sentAt: "3/07/2025",
    lastaction: "29",
  },
];

export const allowedUploadFile = {
  extention: ["application/pdf"],
  size: 1024 * 1024 * 10, //10mb
};

export const allowedSignatureFile = {
  extention: ["image/jpg", "image/jpeg", "image/png"],
  size: 1024 * 1024 * 10, //10mb
};
