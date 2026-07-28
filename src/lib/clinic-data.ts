export const clinicInfo = {
  name: "Panthi Dental Clinic",
  tagline: "Trusted Care for Every Generation",
  description:
    "At Panthi Dental Clinic, we combine modern technology with heartfelt service to deliver exceptional dental care. Our experienced team is dedicated to creating beautiful, healthy smiles for patients of all ages in a comfortable and welcoming environment.",
  story:
    "Established with a vision to provide world-class dental care in Ghorahi, Panthi Dental Clinic has been serving our community with dedication and compassion. Our journey began with a simple mission: to make quality dental care accessible, affordable, and comfortable for everyone.",
  address: "Hospital Line, Dang Ghorahi, Ghorahi, Nepal",
  phone: "984-7857569",
  email: "Panthidentalservice2064@gmail.com",
  hours: [
    { day: "Sunday - Friday", time: "8:00 AM - 6:00 PM" },
    { day: "Saturday", time: "Closed" },
  ],
  emergency: "984-7857569",
  social: {
    facebook: "https://www.facebook.com/p/Panthi-Dental-Clinic-Dang-Ghorahi-100057271586524/",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.5!2d82.5!3d28.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDAwJzAwLjAiTiA4MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2snp!4v1",
  founded: "2015",
  stats: [
    { label: "Happy Patients", value: "5000+" },
    { label: "Years Experience", value: "10+" },
    { label: "Procedures Done", value: "15000+" },
    { label: "Expert Doctors", value: "5+" },
  ],
};

export const services = [
  {
    id: "general",
    title: "General Dentistry",
    description:
      "Comprehensive checkups, cleanings, fillings, and preventive care to maintain optimal oral health for you and your family.",
    icon: "Stethoscope",
    features: ["Dental Checkups", "Professional Cleaning", "Fillings & Restorations", "Preventive Care"],
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    description:
      "Transform your smile with braces and aligners. Our orthodontic treatments correct misalignment for both aesthetic and functional benefits.",
    icon: "Smile",
    features: ["Metal Braces", "Ceramic Braces", "Retainers", "Early Intervention"],
  },
  {
    id: "implants",
    title: "Dental Implants",
    description:
      "Permanent tooth replacement solution that looks, feels, and functions like natural teeth. Restore your confident smile.",
    icon: "Award",
    features: ["Single Implants", "Multiple Implants", "All-on-4", "Implant Restoration"],
  },
  {
    id: "whitening",
    title: "Teeth Whitening",
    description:
      "Professional whitening treatments that safely and effectively brighten your smile, removing years of staining and discoloration.",
    icon: "Sparkles",
    features: ["Laser Whitening", "Take-home Kits", "Stain Removal", "Smile Makeover"],
  },
  {
    id: "root-canal",
    title: "Root Canal Treatment",
    description:
      "Pain-free root canal therapy to save infected teeth. Advanced techniques ensure comfort and successful outcomes.",
    icon: "Heart",
    features: ["Pain-free RCT", "Retreatment", "Apicoectomy", "Pulp Therapy"],
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    description:
      "Enhance your smile with veneers, bonding, and aesthetic treatments designed to give you the smile you have always dreamed of.",
    icon: "Gem",
    features: ["Veneers", "Dental Bonding", "Gum Contouring", "Smile Design"],
  },
  {
    id: "surgery",
    title: "Oral Surgery",
    description:
      "Expert surgical care including tooth extractions, wisdom teeth removal, and other oral surgical procedures with minimal discomfort.",
    icon: "Activity",
    features: ["Wisdom Teeth Removal", "Extractions", "Biopsy", "Frenectomy"],
  },
  {
    id: "pediatric",
    title: "Pediatric Dentistry",
    description:
      "Gentle, child-friendly dental care that makes kids excited about visiting the dentist. Building healthy habits from an early age.",
    icon: "Baby",
    features: ["Kids Checkups", "Fluoride Treatment", "Sealants", "Habit Counseling"],
  },
];

export const doctors = [
  {
    name: "Dr. Sagar Panthi",
    title: "Chief Dental Surgeon",
    description:
      "With over 10 years of experience, Dr. Panthi is dedicated to providing exceptional dental care with a gentle touch and modern techniques.",
    image: "/images/doctor-1.jpg",
    specialties: ["Implantology", "Cosmetic Dentistry", "Oral Surgery"],
  },
];

export const testimonials = [
  {
    name: "Ram Sharma",
    role: "Patient",
    content:
      "The team at Panthi Dental Clinic is absolutely wonderful! They made me feel comfortable throughout my treatment. Highly recommended!",
    rating: 5,
  },
  {
    name: "Sita Adhikari",
    role: "Patient",
    content:
      "I got my braces done here and the results are amazing. The doctors are very skilled and the staff is friendly. Best dental clinic in Ghorahi!",
    rating: 5,
  },
  {
    name: "Krishna Bhandari",
    role: "Patient",
    content:
      "Professional service with modern equipment. The root canal treatment was painless and the follow-up care was excellent. Thank you!",
    rating: 5,
  },
  {
    name: "Anita Poudel",
    role: "Patient",
    content:
      "My children love visiting this clinic! The pediatric care is outstanding. So grateful to have found Panthi Dental Clinic.",
    rating: 5,
  },
];

export const gallery = [
  { src: "/images/gallery-1.jpg", alt: "Clinic Interior" },
  { src: "/images/gallery-2.jpg", alt: "Treatment Room" },
  { src: "/images/gallery-3.jpg", alt: "Dental Equipment" },
  { src: "/images/gallery-4.jpg", alt: "Team Photo" },
  { src: "/images/gallery-5.jpg", alt: "Patient Care" },
  { src: "/images/gallery-6.jpg", alt: "Clinic Reception" },
];

export const faqs = [
  {
    q: "What should I expect during my first visit?",
    a: "Your first visit includes a comprehensive examination, digital X-rays if needed, professional cleaning, and a personalized treatment plan discussion.",
  },
  {
    q: "How often should I visit the dentist?",
    a: "We recommend visiting every six months for regular checkups and cleanings to maintain optimal oral health.",
  },
  {
    q: "Do you accept insurance?",
    a: "Yes, we accept most major insurance plans. Please contact us to verify your coverage.",
  },
  {
    q: "Is the treatment painful?",
    a: "We use modern anaesthesia techniques to ensure your comfort. Most procedures are pain-free, and we offer sedation options for anxious patients.",
  },
  {
    q: "How do I book an appointment?",
    a: "You can book online through our website, call us directly, or visit the clinic. We offer flexible scheduling to accommodate your needs.",
  },
];
