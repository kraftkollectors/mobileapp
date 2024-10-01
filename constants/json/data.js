function WORK_TIME_LIST() {
  const arr = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  return arr;
}

function YEAR_ARRAY() {
  let yr = [];
  const d = new Date();
  const currYear = Number(d.getFullYear());
  const limitYear = 1950;

  //LOGIC TO GET OTHER YEARS
  for (x = currYear; x > limitYear; x--) {
    yr.push(x);
  }

  return yr;
}

function EDU_DEGREE_ARRAY() {
  let degrees = [
    "AA",
    "AS",
    "AAS",
    "AFA",
    "ABA",
    "BA",
    "BSc",
    "BFA",
    "BBA",
    "BEng",
    "BArch",
    "BM",
    "BN",
    "BSW",
    "LLB",
    "BEd",
    "BTech",
    "HND",
    "MA",
    "MS",
    "MFA",
    "MBA",
    "MPA",
    "MPH",
    "MSW",
    "MEd",
    "MEng",
    "MArch",
    "MM",
    "MN",
    "ND",
    "PhD",
    "MD",
    "DDS",
    "EdD",
    "DNP",
    "DrPH",
    "DBA",
    "DVM",
    "PharmD",
    "JD",
    "DPT",
    "OTD",
    "PsyD",
    "DMA",
    "DMin",
    "ThD",
  ];

  return degrees;
}

function SERVICE_CATEGORIES() {
  return [
    {
      category: "home services",
      sub: [
        "plumbing",
        "electrical work",
        "carpentry",
        "painting",
        "heating, ventilation, and air conditioning (hvac)",
        "appliance repair",
        "pest control",
        "landscaping",
        "interior design",
        "home security installation",
        "architecture services",
        "masonry",
        " welder/ iron work",
      ],
    },
    {
      category: "beauty and wellness",
      sub: [
        "hairdressing",
        "makeup artistry",
        "massage therapy",
        "personal training",
        "nutrition counseling",
        "spa services",
        "yoga instruction",
        "holistic healing",
      ],
    },
    {
      category: "automotive",
      sub: [
        "car detailing",
        "auto repair",
        "towing services",
        "car wash",
        "mobile mechanic",
      ],
    },
    {
      category: "technology",
      sub: [
        "computer repair",
        "mobile phone repair",
        "network installation",
        "home theater installation",
        "security system installation",
        "gadget technicians",
      ],
    },
    {
      category: "event planning",
      sub: [
        "wedding planning",
        "party planning",
        "catering",
        "photography and videography",
        "entertainment services",
        "dj services",
        "security services",
      ],
    },
    {
      category: "health and fitness",
      sub: [
        "physical therapy",
        "occupational therapy",
        "mental health counseling",
        "sports coaching",
        "nutrition counseling",
      ],
    },
    {
      category: "tutoring and education",
      sub: [
        "academic tutoring",
        "music lessons",
        "language instruction",
        "test preparation",
      ],
    },
    {
      category: "legal and financial services",
      sub: [
        "legal consultation",
        "accounting services",
        "tax preparation",
        "financial planning",
      ],
    },
    {
      category: "cleaning services",
      sub: [
        "residential cleaning",
        "commercial cleaning",
        "carpet cleaning",
        "window cleaning",
      ],
    },
    {
      category: "pet services",
      sub: [
        "dog walking",
        "pet sitting",
        "pet grooming",
        "veterinary services",
      ],
    },
    {
      category: "photography and videography",
      sub: [
        "portrait photography",
        "event photography",
        "videography",
        "drone photography",
      ],
    },
    {
      category: "business services",
      sub: [
        "graphic design",
        "website development",
        "marketing services",
        "virtual assistant services",
      ],
    },
    {
      category: "travel and leisure",
      sub: [
        "travel planning",
        "tour guiding",
        "event ticketing",
        "vacation rental services",
      ],
    },
    {
      category: "fashion and styling",
      sub: [
        "personal shopping",
        "wardrobe styling",
        "fashion design",
        "tailoring services",
        "cobbler services",
      ],
    },
    {
      category: "real estate services",
      sub: [
        "real estate photography",
        "property management",
        "home staging",
        "real estate consultation",
        "home automation installation",
        "solar panel installation",
        "interior decorating",
      ],
    },
    {
      category: "food and beverage services",
      sub: [
        "catering services",
        "food truck services",
        "bartending services",
        "meal delivery services",
        "personal chef services",
      ],
    },
    {
      category: "diy and home improvement services",
      sub: [
        "workshop rental",
        "tool rental",
        "diy classes",
        "home renovation services",
        "furniture restoration",
      ],
    },
    {
      category: "art and creative services",
      sub: [
        "custom artwork",
        "graphic design",
        "illustration services",
        "murals and street art",
        "art classes",
      ],
    },
    {
      category: "entertainment services",
      sub: [
        "event entertainment",
        "live music performances",
        "magician services",
        "stand-up comedy",
        "virtual reality experiences",
      ],
    },
    {
      category: "personal development services",
      sub: [
        "life coaching",
        "meditation classes",
        "career counseling",
        "goal setting workshops",
        "time management training",
      ],
    },
  ];
}

const FORBIDDEN_WORDS = [
  "fuck",
  "fucker",
  "fucking",
  "motherfucking",
  "mother-fucking",
  "bitch",
  "sex",
  "sexist",
  "nigga",
  "rape",
  "racism",
  "molest",
  "blowjob",
  "jerk off",
  "my dick",
  "cunt",
  "slut",
  "whore",
  "prostitute",
  "asshole",
  "kill you",
  "assault",
  "assualt",
  "riffle",
  "nude",
  "tobacco",
  "cocaine",
  "heroin",
];

export {
  WORK_TIME_LIST,
  YEAR_ARRAY,
  EDU_DEGREE_ARRAY,
  SERVICE_CATEGORIES,
  FORBIDDEN_WORDS,
};
